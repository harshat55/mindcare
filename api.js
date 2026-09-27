/**
 * MindCare — API Client & Backend Sync Bridge (js/api.js)
 * Connects the frontend on http://localhost:5173 to the Node.js/Express backend on http://localhost:3001.
 * Supports: /api/health, /api/chat, /api/routines, /api/memories, /api/assessments, /api/caregiver.
 * Provides resilient error handling, loading states, and transparent synchronization with localStorage.
 */

const API_BASE_URL = 'http://localhost:3001/api';

const MindCareAPI = {
    baseUrl: API_BASE_URL,
    isOnline: false,
    lastHealthData: null,

    // Internal robust fetch wrapper with timeout, JSON parsing, and error formatting
    async request(endpoint, options = {}, timeoutMs = 6000) {
        const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const defaultHeaders = {
                'Accept': 'application/json'
            };
            if (options.body && typeof options.body === 'string') {
                defaultHeaders['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {})
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            let data;
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                try { data = JSON.parse(text); } catch { data = { text }; }
            }

            if (!response.ok) {
                const errorMsg = (data && data.error) || `HTTP error ${response.status}: ${response.statusText}`;
                const err = new Error(errorMsg);
                err.status = response.status;
                err.data = data;
                throw err;
            }

            this.isOnline = true;
            return data;
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                const timeoutErr = new Error(`Request timed out after ${timeoutMs}ms for ${endpoint}`);
                timeoutErr.status = 408;
                throw timeoutErr;
            }
            throw err;
        }
    },

    // 1. Health Check: GET /api/health
    async checkHealth() {
        try {
            const data = await this.request('/health', { method: 'GET' }, 3000);
            this.isOnline = (data && data.status === 'ok');
            this.lastHealthData = data;
            window.dispatchEvent(new CustomEvent('mindcare:health', { detail: { online: true, data } }));
            return true;
        } catch (err) {
            this.isOnline = false;
            this.lastHealthData = null;
            window.dispatchEvent(new CustomEvent('mindcare:health', { detail: { online: false, error: err.message } }));
            return false;
        }
    },

    // 2. Daily Routines: GET, POST /api/routines, PATCH /api/routines/:id/toggle, DELETE /api/routines/:id
    async fetchRoutines() {
        return await this.request('/routines', { method: 'GET' });
    },

    async createRoutine(routine) {
        return await this.request('/routines', {
            method: 'POST',
            body: JSON.stringify(routine)
        });
    },

    async toggleRoutine(id) {
        return await this.request(`/routines/${id}/toggle`, {
            method: 'PATCH'
        });
    },

    async deleteRoutine(id) {
        return await this.request(`/routines/${id}`, {
            method: 'DELETE'
        });
    },

    // 3. Memories Journal: GET, POST /api/memories, GET /api/memories/:id
    async fetchMemories(category = null) {
        const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
        return await this.request(`/memories${query}`, { method: 'GET' });
    },

    async createMemory(memory) {
        return await this.request('/memories', {
            method: 'POST',
            body: JSON.stringify(memory)
        });
    },

    async fetchMemoryById(id) {
        return await this.request(`/memories/${id}`, { method: 'GET' });
    },

    // 4. Cognitive Assessments: GET, POST /api/assessments, GET /api/assessments/latest
    async fetchAssessments() {
        return await this.request('/assessments', { method: 'GET' });
    },

    async fetchLatestAssessment() {
        return await this.request('/assessments/latest', { method: 'GET' });
    },

    async createAssessment(assessment) {
        // Normalize payload for backend: accepts score, answers, status, formatted_date
        const payload = {
            score: assessment.score,
            answers: assessment.answers || {},
            status: assessment.status || 'Completed',
            formatted_date: assessment.formatted_date || assessment.formattedDate || assessment.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
        return await this.request('/assessments', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    // 5. Caregiver Statistics: GET /api/caregiver (with fallback to /api/caregiver/stats) and POST /api/caregiver/alert
    async fetchCaregiver() {
        try {
            return await this.request('/caregiver', { method: 'GET' });
        } catch {
            return await this.request('/caregiver/stats', { method: 'GET' });
        }
    },

    async fetchCaregiverStats() {
        return await this.fetchCaregiver();
    },

    async sendCaregiverAlert(payload = {}) {
        return await this.request('/caregiver/alert', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    // 6. AI Companion Chat: POST /api/chat
    async sendCompanionChat(message) {
        try {
            return await this.request('/chat', {
                method: 'POST',
                body: JSON.stringify({ message })
            });
        } catch (err) {
            // Fallback to /companion/chat endpoint if needed
            return await this.request('/companion/chat', {
                method: 'POST',
                body: JSON.stringify({ message })
            });
        }
    },

    // Loading state helper
    setLoading(key, isLoading) {
        window.dispatchEvent(new CustomEvent('mindcare:loading', { detail: { key, isLoading } }));
    },

    // 7. Background Synchronization Bridge:
    // When the backend is online, mirrors local storage changes into the backend SQLite database
    // and seeds local storage with verified records from the server.
    async initSyncBridge() {
        if (!window.MindCareStorage) return;

        const online = await this.checkHealth();
        if (!online) {
            console.info('[MindCare API] Backend server offline at http://localhost:3001. Using offline localStorage fallback.');
            return;
        }

        console.info('[MindCare API] Connected to MindCare backend on http://localhost:3001.');

        // 1. Sync routines from backend
        try {
            const serverRoutines = await this.fetchRoutines();
            if (Array.isArray(serverRoutines) && serverRoutines.length > 0) {
                window.MindCareStorage.saveRoutines(serverRoutines);
                window.dispatchEvent(new CustomEvent('mindcare:synced', { detail: { type: 'routines', data: serverRoutines } }));
            }
        } catch (e) {
            console.warn('[MindCare API] Routine initial sync notice:', e.message);
        }

        // 2. Sync memories from backend
        try {
            const serverMemories = await this.fetchMemories();
            if (Array.isArray(serverMemories) && serverMemories.length > 0) {
                window.MindCareStorage.saveMemories(serverMemories);
                window.dispatchEvent(new CustomEvent('mindcare:synced', { detail: { type: 'memories', data: serverMemories } }));
            }
        } catch (e) {
            console.warn('[MindCare API] Memories initial sync notice:', e.message);
        }

        // 3. Sync latest assessment from backend
        try {
            const serverAssessment = await this.fetchLatestAssessment();
            if (serverAssessment) {
                window.MindCareStorage.set('mindcare_assessment_latest_v1', serverAssessment);
                window.dispatchEvent(new CustomEvent('mindcare:synced', { detail: { type: 'assessment', data: serverAssessment } }));
            }
        } catch (e) {
            console.warn('[MindCare API] Assessment initial sync notice:', e.message);
        }

        // 4. Hook MindCareStorage methods so local modifications automatically persist to backend
        const originalToggleRoutine = window.MindCareStorage.toggleRoutine.bind(window.MindCareStorage);
        window.MindCareStorage.toggleRoutine = function(id) {
            const localResult = originalToggleRoutine(id);
            MindCareAPI.toggleRoutine(id).catch(err => {
                console.warn('[MindCare API] Background routine toggle sync notice:', err.message);
            });
            return localResult;
        };

        const originalAddRoutine = window.MindCareStorage.addRoutine.bind(window.MindCareStorage);
        window.MindCareStorage.addRoutine = function(routine) {
            const localResult = originalAddRoutine(routine);
            MindCareAPI.createRoutine(routine).then(serverItem => {
                if (serverItem && serverItem.id) {
                    localResult.id = serverItem.id;
                }
            }).catch(err => {
                console.warn('[MindCare API] Background routine create sync notice:', err.message);
            });
            return localResult;
        };

        const originalAddMemory = window.MindCareStorage.addMemory.bind(window.MindCareStorage);
        window.MindCareStorage.addMemory = function(memory) {
            const localResult = originalAddMemory(memory);
            MindCareAPI.createMemory(memory).then(serverItem => {
                if (serverItem && serverItem.id) {
                    localResult.id = serverItem.id;
                }
            }).catch(err => {
                console.warn('[MindCare API] Background memory create sync notice:', err.message);
            });
            return localResult;
        };

        const originalSaveAssessment = window.MindCareStorage.saveAssessmentResult.bind(window.MindCareStorage);
        window.MindCareStorage.saveAssessmentResult = function(result) {
            const localResult = originalSaveAssessment(result);
            MindCareAPI.createAssessment(result).catch(err => {
                console.warn('[MindCare API] Background assessment create sync notice:', err.message);
            });
            return localResult;
        };
    }
};

// Global export
window.MindCareAPI = MindCareAPI;

// Auto-initialize sync bridge on document ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MindCareAPI.initSyncBridge());
} else {
    MindCareAPI.initSyncBridge();
}
