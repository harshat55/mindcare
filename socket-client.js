/**
 * MindCare — Socket.io Client Bridge (js/socket-client.js)
 * Shared module that connects to the MindCare backend Socket.io server.
 * Provides helpers for both Patient and Caregiver sides.
 *
 * Usage:
 *   <script src="/socket.io/socket.io.js"></script>
 *   <script src="js/socket-client.js"></script>
 *
 * Then call:
 *   MindCareSocket.init({ role: 'patient', name: 'Margaret' });
 *   MindCareSocket.emitAlert({ type: 'sos', title: 'SOS Pressed', ... });
 */

const MindCareSocket = (function () {
    'use strict';

    let socket = null;
    let isConnected = false;
    let role = null;
    let userName = null;

    // Listeners registered by page-specific code
    const listeners = {};

    /**
     * Initialize socket connection and register role with the server.
     * @param {{ role: 'patient'|'caregiver', name?: string }} opts
     */
    function init(opts) {
        if (!opts || !opts.role) {
            console.warn('[MindCareSocket] init() requires { role }');
            return;
        }

        role = opts.role;
        userName = opts.name || localStorage.getItem('mindcare_user_name') || 'User';

        // Connect to the same origin that served the page (works for both dev & prod)
        const serverUrl = window.location.origin;

        if (typeof io === 'undefined') {
            console.warn('[MindCareSocket] socket.io client library not loaded. Include /socket.io/socket.io.js');
            return;
        }

        socket = io(serverUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000
        });

        socket.on('connect', () => {
            isConnected = true;
            console.log(`[MindCareSocket] Connected as ${role}: ${socket.id}`);

            // Tell the server who we are
            socket.emit('register_role', { role, name: userName });

            fire('connected', { id: socket.id });
        });

        socket.on('disconnect', (reason) => {
            isConnected = false;
            console.log(`[MindCareSocket] Disconnected: ${reason}`);
            fire('disconnected', { reason });
        });

        socket.on('connect_error', (err) => {
            console.warn(`[MindCareSocket] Connection error: ${err.message}`);
        });

        // Caregiver/Caretaker listens for notifications
        const handleIncomingNotification = (data) => {
            console.log('[MindCareSocket] Notification received:', data);
            fire('caretaker_notification', data);
            fire('caregiver_notification', data);
        };

        socket.on('caretaker_notification', handleIncomingNotification);
        socket.on('caregiver_notification', handleIncomingNotification);
    }

    /**
     * Emit a patient_event / patient_alert event to the server.
     * @param {{ type?: string, title: string, message?: string, category?: string, time?: string, data?: object }} payload
     */
    function emitEvent(payload) {
        if (!socket || !isConnected) {
            console.warn('[MindCareSocket] Cannot emit — not connected. Re-queueing or checking connection...');
        }
        const fullPayload = {
            title: payload.title || 'Patient Action',
            message: payload.message || payload.title || '',
            time: payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: payload.type || 'general',
            category: payload.category || 'info',
            patientName: userName,
            timestamp: new Date().toISOString(),
            data: payload.data || {}
        };

        if (socket) {
            socket.emit('patient_event', fullPayload);
            socket.emit('patient_alert', fullPayload);
            console.log('[MindCareSocket] Emitted patient_event:', fullPayload.title);
        }
    }

    /**
     * Alias for backward compatibility
     */
    function emitAlert(payload) {
        emitEvent(payload);
    }

    /**
     * Register a callback for a named event.
     * Events: 'connected', 'disconnected', 'caretaker_notification', 'caregiver_notification'
     */
    function on(event, callback) {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    }

    /**
     * Remove a callback.
     */
    function off(event, callback) {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter(fn => fn !== callback);
    }

    /** Fire all registered listeners for an event. */
    function fire(event, data) {
        if (!listeners[event]) return;
        listeners[event].forEach(fn => {
            try { fn(data); } catch (e) { console.error('[MindCareSocket] listener error:', e); }
        });
    }

    function getStatus() {
        return { connected: isConnected, role, userName, socketId: socket ? socket.id : null, rawSocket: socket };
    }

    function getRawSocket() {
        return socket;
    }

    return {
        init,
        emitEvent,
        emitAlert,
        on,
        off,
        getStatus,
        getRawSocket
    };
})();
