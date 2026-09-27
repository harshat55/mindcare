/**
 * MindCare — Core Data Service & State Management
 * Provides local storage abstraction, seed data for routines, memories, assessment questions,
 * and conversational companion knowledge base.
 */

const STORAGE_KEYS = {
    THEME: 'mindcare_theme',
    A11Y: 'mindcare_a11y_settings',
    ROUTINES: 'mindcare_routines_v1',
    MEMORIES: 'mindcare_memories_v1',
    ASSESSMENT_RESULTS: 'mindcare_assessment_latest_v1',
    CAREGIVER_STATS: 'mindcare_caregiver_stats_v1',
    CHAT_HISTORY: 'mindcare_chat_history_v1'
};

// Default seed routines
const DEFAULT_ROUTINES = [
    {
        id: 'rt-1',
        time: '08:00 AM',
        title: 'Morning Medicine',
        details: 'Blood pressure medication with water & light breakfast',
        category: 'medication',
        completed: true,
        priority: 'high'
    },
    {
        id: 'rt-2',
        time: '09:30 AM',
        title: 'Gentle Garden Walk',
        details: '15-minute peaceful stroll in the courtyard garden',
        category: 'activity',
        completed: true,
        priority: 'medium'
    },
    {
        id: 'rt-3',
        time: '10:30 AM',
        title: 'MindCare Memory Check-in',
        details: '5-minute cognitive check-in and object recall activity',
        category: 'cognitive',
        completed: true,
        priority: 'medium'
    },
    {
        id: 'rt-4',
        time: '01:00 PM',
        title: 'Balanced Lunch & Hydration',
        details: 'Warm vegetable soup, sourdough toast, and herbal tea',
        category: 'meal',
        completed: true,
        priority: 'high'
    },
    {
        id: 'rt-5',
        time: '03:30 PM',
        title: 'Video Call with Maya',
        details: 'Weekly family catch-up via tablet in the sunroom',
        category: 'social',
        completed: false,
        priority: 'medium'
    },
    {
        id: 'rt-6',
        time: '05:00 PM',
        title: 'Evening Relaxing Stretch',
        details: 'Seated calming breathing and shoulder mobility',
        category: 'activity',
        completed: false,
        priority: 'low'
    },
    {
        id: 'rt-7',
        time: '08:00 PM',
        title: 'Evening Supplements',
        details: 'Calcium and evening prescribed wellness tablet',
        category: 'medication',
        completed: false,
        priority: 'high'
    },
    {
        id: 'rt-8',
        time: '09:30 PM',
        title: 'Wind-down & Calming Music',
        details: 'Acoustic piano playlist and warm chamomile tea',
        category: 'routine',
        completed: false,
        priority: 'low'
    }
];

// Default seed memories
const DEFAULT_MEMORIES = [
    {
        id: 'mem-1',
        title: "Maya's Sunny Graduation Day",
        category: 'Family',
        date: 'June 14, 2022',
        location: 'Stanford Campus',
        person: 'Granddaughter Maya & Family',
        description: 'Maya was beaming in her navy cap and gown. We took photos under the giant oak trees, and she gave me the sweetest hug saying, "Grandma, your encouragement got me here."',
        tags: ['Family', 'Milestone', 'Pride'],
        themeColor: '#0EA5E9',
        icon: 'graduation-cap',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'mem-2',
        title: 'Our 45th Anniversary Rose Garden',
        category: 'Special Moments',
        date: 'August 22, 2020',
        location: 'Home Backyard',
        person: 'Arthur & Loved Ones',
        description: 'Arthur surprised me with 45 blooming white and yellow garden roses. The children strung fairy lights along the porch, and we danced slowly to vintage jazz under the twilight.',
        tags: ['Love', 'Celebration', 'Roses'],
        themeColor: '#EC4899',
        icon: 'heart',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'mem-3',
        title: 'Peaceful Summer Cabin in Maine',
        category: 'Important Places',
        date: 'July 2018',
        location: 'Moosehead Lake, Maine',
        person: 'Family & Friends',
        description: 'The cool morning mist rising off the still lake water. Fresh blueberry pancakes on the pine dining table, reading mystery novels on the screened-in porch with the sound of loons.',
        tags: ['Nature', 'Peace', 'Travel'],
        themeColor: '#10B981',
        icon: 'map-pin',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'mem-4',
        title: 'Golden Gate Bridge with Arthur',
        category: 'Important Places',
        date: 'October 12, 2015',
        location: 'San Francisco, CA',
        person: 'Arthur',
        description: 'A breezy, sun-drenched walk half-way across the bridge. The bay was full of white sailboats and we shared warm sourdough clam chowder at Fisherman\'s Wharf.',
        tags: ['Travel', 'Adventure', 'Arthur'],
        themeColor: '#F59E0B',
        icon: 'compass',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'mem-5',
        title: 'Family Thanksgiving Gathering',
        category: 'Family',
        date: 'November 2021',
        location: 'Our Dining Room',
        person: 'Whole Family',
        description: 'Three generations gathered around our long wooden table. Everyone sharing what they were grateful for, laughing over burnt apple pie, and playing card games until midnight.',
        tags: ['Family', 'Gratitude', 'Tradition'],
        themeColor: '#8B5CF6',
        icon: 'users',
        image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'mem-6',
        title: 'Baking Heritage Apple Cinnamon Bread',
        category: 'Special Moments',
        date: 'Autumn Tradition',
        location: 'Kitchen',
        person: 'Maya & Mom',
        description: 'The sweet scent of warm cinnamon, nutmeg, and freshly peeled Honeycrisp apples filling every corner of the house. We always dust the crust with powdered sugar together.',
        tags: ['Kitchen', 'Comfort', 'Home'],
        themeColor: '#14B8A6',
        icon: 'coffee',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
    }
];

// Cognitive Assessment Questions
const ASSESSMENT_QUESTIONS = [
    {
        id: 1,
        title: 'Memory Recall Challenge',
        category: 'Memory & Attention',
        instruction: 'Carefully study these 4 familiar items. You will be asked to identify them in a moment.',
        type: 'study-and-recall',
        memorizeItems: [
            { id: 'apple', label: 'Crisp Apple', icon: '🍎', desc: 'Fresh fruit' },
            { id: 'key', label: 'Silver Key', icon: '🔑', desc: 'Front door' },
            { id: 'book', label: 'Blue Book', icon: '📘', desc: 'Favorite story' },
            { id: 'star', label: 'Golden Star', icon: '⭐', desc: 'Night sky' }
        ],
        recallQuestion: 'Which of the following 4 items were you asked to remember?',
        options: [
            { id: 'apple', label: 'Crisp Apple', icon: '🍎', correct: true },
            { id: 'clock', label: 'Wall Clock', icon: '⏰', correct: false },
            { id: 'key', label: 'Silver Key', icon: '🔑', correct: true },
            { id: 'book', label: 'Blue Book', icon: '📘', correct: true },
            { id: 'coffee', label: 'Warm Coffee', icon: '☕', correct: false },
            { id: 'star', label: 'Golden Star', icon: '⭐', correct: true },
            { id: 'flower', label: 'Garden Rose', icon: '🌹', correct: false },
            { id: 'hat', label: 'Sun Hat', icon: '👒', correct: false }
        ],
        requiredMatches: 4
    },
    {
        id: 2,
        title: 'Pattern & Sequence Logic',
        category: 'Visual & Logic',
        instruction: 'Look at the sequence below. Choose the symbol that naturally completes the repeating pattern.',
        type: 'pattern',
        sequence: ['🔵 Circle', '🔺 Triangle', '🟩 Square', '🔵 Circle', '🔺 Triangle', '❓'],
        question: 'What shape comes next in this sequence?',
        options: [
            { id: 'opt-circle', label: '🔵 Circle', correct: false },
            { id: 'opt-square', label: '🟩 Square', correct: true },
            { id: 'opt-star', label: '⭐ Star', correct: false },
            { id: 'opt-diamond', label: '🔶 Diamond', correct: false }
        ]
    },
    {
        id: 3,
        title: 'Focused Visual Attention',
        category: 'Focus & Concentration',
        instruction: 'Count how many glowing Blue Shield symbols 🛡️ appear in the grid below.',
        type: 'attention-grid',
        targetSymbol: '🛡️',
        targetName: 'Blue Shield',
        gridItems: [
            '🛡️', '🌟', '🛡️', '🔔',
            '🍃', '🛡️', '🌟', '🛡️',
            '🔔', '🛡️', '🍃', '🌟'
        ],
        correctCount: 5,
        question: 'How many Blue Shields did you count?',
        options: [
            { id: 'cnt-3', label: '3 Shields', correct: false },
            { id: 'cnt-4', label: '4 Shields', correct: false },
            { id: 'cnt-5', label: '5 Shields', correct: true },
            { id: 'cnt-6', label: '6 Shields', correct: false }
        ]
    },
    {
        id: 4,
        title: 'Everyday Category Association',
        category: 'Verbal & Association',
        instruction: 'Select the item that belongs to the category: "Healthy Evening Relaxation Routines".',
        type: 'multiple-choice',
        question: 'Which of the following promotes calm and restful sleep before bedtime?',
        options: [
            { id: 'opt-tea', label: 'Drinking warm herbal chamomile tea & gentle reading', correct: true },
            { id: 'opt-screen', label: 'Browsing bright loud phone screens in the dark', correct: false },
            { id: 'opt-coffee', label: 'Drinking strong black espresso coffee at 10 PM', correct: false },
            { id: 'opt-stress', label: 'Reviewing complicated financial tax documents', correct: false }
        ]
    },
    {
        id: 5,
        title: 'Time & Orientation Awareness',
        category: 'Temporal Orientation',
        instruction: 'Orientation helps us feel grounded in our day and peaceful about our schedule.',
        type: 'orientation',
        question: 'If your morning medicine is taken at 8:00 AM and lunch is at 1:00 PM, what is the best description for the time period in between?',
        options: [
            { id: 'opt-morning', label: 'Late Morning (great for light walk or memory check)', correct: true },
            { id: 'opt-midnight', label: 'Middle of the Night', correct: false },
            { id: 'opt-sunset', label: 'Sunset / Evening dusk', correct: false },
            { id: 'opt-dawn', label: 'Pre-dawn before sunrise', correct: false }
        ]
    }
];

// Companion Knowledge Base & Canned Simulated Intelligence
const COMPANION_KNOWLEDGE = [
    {
        triggers: ['medicine', 'medication', 'pill', 'dose', 'tablets'],
        response: "You're right on track with your medications today! Your 8:00 AM morning medicine was checked off. Your next scheduled reminder is for your Evening Supplements at 8:00 PM tonight. Would you like me to note anything for your caregiver?",
        actions: [
            { label: "View Today's Routine", url: 'routine.html' },
            { label: 'Set a Reminder Note', action: 'note_reminder' }
        ]
    },
    {
        triggers: ['appointment', 'doctor', 'visit', 'schedule', 'today'],
        response: "Looking at your schedule for today: You had a peaceful morning walk, completed your lunch, and have a video catch-up with Maya scheduled for 3:30 PM. No clinic visits today—your next health check is scheduled for next Tuesday.",
        actions: [
            { label: 'Open Full Routine', url: 'routine.html' }
        ]
    },
    {
        triggers: ['maya', 'family', 'daughter', 'granddaughter', 'david', 'arthur'],
        response: "Maya is your granddaughter! She recently graduated with honors and loves when you bake cinnamon bread together. You have a warm video call scheduled with her at 3:30 PM today.",
        actions: [
            { label: "View Maya's Graduation Photo", url: 'memory.html' },
            { label: 'Open Memory Journal', url: 'memory.html' }
        ]
    },
    {
        triggers: ['confused', 'lost', 'where am i', 'scared', 'help me', 'anxious', 'worried'],
        response: "Take a gentle, deep breath in... and slowly let it out. You are safe in your comfortable home. I am MindCare, your companion. Today is going well, and your caregiver Sarah is always just a quick tap away. You are completely safe.",
        actions: [
            { label: 'View Emergency & Caregiver Status', url: 'caregiver.html' },
            { label: 'Play Calming Wind-Down', action: 'play_calm' }
        ]
    },
    {
        triggers: ['memory', 'journal', 'photos', 'pictures', 'remember'],
        response: "Your Memory Journal holds 6 cherished moments, including your 45th Rose Garden Anniversary and the Maine Cabin trip. Which memory would you like to reflect on today?",
        actions: [
            { label: 'Open Memory Album', url: 'memory.html' }
        ]
    },
    {
        triggers: ['exercise', 'activity', 'game', 'brain', 'assessment', 'quiz'],
        response: "Doing light mental activities helps keep pathways engaged and brings clarity to your day. You can take a gentle 5-minute Cognitive Check anytime you like.",
        actions: [
            { label: 'Start Cognitive Check', url: 'assessment.html' }
        ]
    },
    {
        triggers: ['hello', 'hi', 'good morning', 'good evening', 'hey'],
        response: "Hello there! It is wonderful to connect with you. I am here to help you remember your day, check on your routines, or just have a peaceful conversation. How are you feeling right now?",
        actions: [
            { label: "Check Today's Routine", url: 'routine.html' },
            { label: 'Look at Family Memories', url: 'memory.html' }
        ]
    }
];

// Fallback responses when no trigger words match
const COMPANION_FALLBACKS = [
    "Thank you for sharing that with me. I have noted this in your daily wellness reflection. Is there a particular routine, memory, or medication you would like me to bring up?",
    "I understand. Keeping everyday moments organized and calm is what I am here for. You can always ask me about your schedule, family memories, or how your day is progressing.",
    "That is so thoughtful. I am right here with you. Would you like to review your evening reminders or look at your family photo album together?"
];

// Storage Engine Implementation
const MindCareStorage = {
    get(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : defaultValue;
        } catch (e) {
            console.warn(`[MindCare Storage] Error reading key ${key}:`, e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn(`[MindCare Storage] Error writing key ${key}:`, e);
            return false;
        }
    },

    // Theme Management
    getTheme() {
        return this.get(STORAGE_KEYS.THEME, 'light');
    },
    setTheme(theme) {
        return this.set(STORAGE_KEYS.THEME, theme);
    },

    // Accessibility Settings Management
    getA11y() {
        return this.get(STORAGE_KEYS.A11Y, {
            fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
            highContrast: false,
            reducedMotion: false
        });
    },
    setA11y(settings) {
        return this.set(STORAGE_KEYS.A11Y, settings);
    },

    // Routines Management
    getRoutines() {
        const stored = this.get(STORAGE_KEYS.ROUTINES);
        if (!stored || !Array.isArray(stored) || stored.length === 0) {
            this.set(STORAGE_KEYS.ROUTINES, DEFAULT_ROUTINES);
            return DEFAULT_ROUTINES;
        }
        return stored;
    },
    saveRoutines(routines) {
        return this.set(STORAGE_KEYS.ROUTINES, routines);
    },
    toggleRoutine(id) {
        const routines = this.getRoutines();
        const item = routines.find(r => r.id === id);
        if (item) {
            item.completed = !item.completed;
            this.saveRoutines(routines);
            return item;
        }
        return null;
    },
    addRoutine(routine) {
        const routines = this.getRoutines();
        const newRoutine = {
            id: 'rt-' + Date.now(),
            completed: false,
            priority: 'medium',
            ...routine
        };
        routines.push(newRoutine);
        this.saveRoutines(routines);
        return newRoutine;
    },

    // Memories Management
    getMemories() {
        const stored = this.get(STORAGE_KEYS.MEMORIES);
        if (!stored || !Array.isArray(stored) || stored.length === 0) {
            this.set(STORAGE_KEYS.MEMORIES, DEFAULT_MEMORIES);
            return DEFAULT_MEMORIES;
        }
        return stored;
    },
    saveMemories(memories) {
        return this.set(STORAGE_KEYS.MEMORIES, memories);
    },
    addMemory(memory) {
        const memories = this.getMemories();
        const newMem = {
            id: 'mem-' + Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            themeColor: '#0EA5E9',
            icon: 'heart',
            tags: ['Personal', 'Favorite'],
            image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
            ...memory
        };
        memories.unshift(newMem);
        this.saveMemories(memories);
        return newMem;
    },

    // Assessment Results
    getLatestAssessment() {
        return this.get(STORAGE_KEYS.ASSESSMENT_RESULTS, null);
    },
    saveAssessmentResult(result) {
        return this.set(STORAGE_KEYS.ASSESSMENT_RESULTS, {
            ...result,
            timestamp: new Date().toISOString(),
            formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        });
    }
};

// Global export
window.MindCareStorage = MindCareStorage;
window.ASSESSMENT_QUESTIONS = ASSESSMENT_QUESTIONS;
window.COMPANION_KNOWLEDGE = COMPANION_KNOWLEDGE;
window.COMPANION_FALLBACKS = COMPANION_FALLBACKS;
