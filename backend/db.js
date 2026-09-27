const path = require('path');
const fs = require('fs');

// Attempt to load native node:sqlite (available in Node.js >= 22.5.0)
let DatabaseSync = null;
try {
    const sqliteModule = require('node:sqlite');
    DatabaseSync = sqliteModule.DatabaseSync;
} catch (e) {
    DatabaseSync = null;
}

// --------------------------------------------------------------------------
// 1. DEFAULT SEED DATA
// --------------------------------------------------------------------------
const DEFAULT_ROUTINES = [
    {
        time: '08:00 AM',
        title: 'Morning Medicine',
        details: 'Blood pressure medication with water & light breakfast',
        category: 'medication',
        completed: 1,
        priority: 'high'
    },
    {
        time: '09:30 AM',
        title: 'Gentle Garden Walk',
        details: '15-minute peaceful stroll in the courtyard garden',
        category: 'activity',
        completed: 1,
        priority: 'medium'
    },
    {
        time: '10:30 AM',
        title: 'MindCare Memory Check-in',
        details: '5-minute cognitive check-in and object recall activity',
        category: 'cognitive',
        completed: 1,
        priority: 'medium'
    },
    {
        time: '01:00 PM',
        title: 'Balanced Lunch & Hydration',
        details: 'Warm vegetable soup, sourdough toast, and herbal tea',
        category: 'meal',
        completed: 1,
        priority: 'high'
    },
    {
        time: '03:30 PM',
        title: 'Video Call with Maya',
        details: 'Weekly family catch-up via tablet in the sunroom',
        category: 'social',
        completed: 0,
        priority: 'medium'
    },
    {
        time: '05:00 PM',
        title: 'Evening Relaxing Stretch',
        details: 'Seated calming breathing and shoulder mobility',
        category: 'activity',
        completed: 0,
        priority: 'low'
    },
    {
        time: '08:00 PM',
        title: 'Evening Supplements',
        details: 'Calcium and evening prescribed wellness tablet',
        category: 'medication',
        completed: 0,
        priority: 'high'
    },
    {
        time: '09:30 PM',
        title: 'Wind-down & Calming Music',
        details: 'Acoustic piano playlist and warm chamomile tea',
        category: 'routine',
        completed: 0,
        priority: 'low'
    }
];

const DEFAULT_MEMORIES = [
    {
        title: "Maya's Sunny Graduation Day",
        category: 'Family',
        date: 'June 14, 2022',
        location: 'Stanford Campus',
        person: 'Granddaughter Maya & Family',
        description: 'Maya was beaming in her navy cap and gown. We took photos under the giant oak trees, and she gave me the sweetest hug saying, "Grandma, your encouragement got me here."',
        tags: JSON.stringify(['Family', 'Milestone', 'Pride']),
        themeColor: '#0EA5E9',
        icon: 'graduation-cap',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
    },
    {
        title: 'Our 45th Anniversary Rose Garden',
        category: 'Special Moments',
        date: 'August 22, 2020',
        location: 'Home Backyard',
        person: 'Arthur & Loved Ones',
        description: 'Arthur surprised me with 45 blooming white and yellow garden roses. The children strung fairy lights along the porch, and we danced slowly to vintage jazz under the twilight.',
        tags: JSON.stringify(['Love', 'Celebration', 'Roses']),
        themeColor: '#EC4899',
        icon: 'heart',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    },
    {
        title: 'Peaceful Summer Cabin in Maine',
        category: 'Important Places',
        date: 'July 2018',
        location: 'Moosehead Lake, Maine',
        person: 'Family & Friends',
        description: 'The cool morning mist rising off the still lake water. Fresh blueberry pancakes on the pine dining table, reading mystery novels on the screened-in porch with the sound of loons.',
        tags: JSON.stringify(['Nature', 'Peace', 'Travel']),
        themeColor: '#10B981',
        icon: 'map-pin',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
    },
    {
        title: 'Golden Gate Bridge with Arthur',
        category: 'Important Places',
        date: 'October 12, 2015',
        location: 'San Francisco, CA',
        person: 'Arthur',
        description: "A breezy, sun-drenched walk half-way across the bridge. The bay was full of white sailboats and we shared warm sourdough clam chowder at Fisherman's Wharf.",
        tags: JSON.stringify(['Travel', 'Adventure', 'Arthur']),
        themeColor: '#F59E0B',
        icon: 'compass',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80'
    },
    {
        title: 'Family Thanksgiving Gathering',
        category: 'Family',
        date: 'November 2021',
        location: 'Our Dining Room',
        person: 'Whole Family',
        description: 'Three generations gathered around our long wooden table. Everyone sharing what they were grateful for, laughing over burnt apple pie, and playing card games until midnight.',
        tags: JSON.stringify(['Family', 'Gratitude', 'Tradition']),
        themeColor: '#8B5CF6',
        icon: 'users',
        image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80'
    },
    {
        title: 'Baking Heritage Apple Cinnamon Bread',
        category: 'Special Moments',
        date: 'Autumn Tradition',
        location: 'Kitchen',
        person: 'Maya & Mom',
        description: 'The sweet scent of warm cinnamon, nutmeg, and freshly peeled Honeycrisp apples filling every corner of the house. We always dust the crust with powdered sugar together.',
        tags: JSON.stringify(['Kitchen', 'Comfort', 'Home']),
        themeColor: '#14B8A6',
        icon: 'coffee',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
    }
];

let dbInstance;

if (DatabaseSync) {
    // --------------------------------------------------------------------------
    // 2. NATIVE SQLITE INITIALIZATION (Node.js >= 22.5.0)
    // --------------------------------------------------------------------------
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'mindcare.db');
    const sqliteDb = new DatabaseSync(dbPath);

    sqliteDb.exec('PRAGMA journal_mode = WAL;');

    sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS routines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            time TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'routine',
            details TEXT,
            completed INTEGER NOT NULL DEFAULT 0,
            priority TEXT NOT NULL DEFAULT 'medium',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT,
            location TEXT,
            person TEXT,
            description TEXT NOT NULL,
            tags TEXT,
            themeColor TEXT DEFAULT '#0EA5E9',
            icon TEXT DEFAULT 'heart',
            image TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            score INTEGER NOT NULL,
            answers TEXT,
            status TEXT DEFAULT 'Completed',
            formatted_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Seed routines if table is empty
    const routineRow = sqliteDb.prepare('SELECT COUNT(*) AS count FROM routines').get();
    if (routineRow.count === 0) {
        const insertRoutine = sqliteDb.prepare(`
            INSERT INTO routines (title, time, category, details, completed, priority)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        sqliteDb.exec('BEGIN TRANSACTION;');
        for (const item of DEFAULT_ROUTINES) {
            insertRoutine.run(item.title, item.time, item.category, item.details, item.completed, item.priority);
        }
        sqliteDb.exec('COMMIT;');
        console.log(`[Database] Seeded ${DEFAULT_ROUTINES.length} default routines into SQLite.`);
    }

    // Seed memories if table is empty
    const memoryRow = sqliteDb.prepare('SELECT COUNT(*) AS count FROM memories').get();
    if (memoryRow.count === 0) {
        const insertMemory = sqliteDb.prepare(`
            INSERT INTO memories (title, category, date, location, person, description, tags, themeColor, icon, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        sqliteDb.exec('BEGIN TRANSACTION;');
        for (const mem of DEFAULT_MEMORIES) {
            insertMemory.run(mem.title, mem.category, mem.date, mem.location, mem.person, mem.description, mem.tags, mem.themeColor, mem.icon, mem.image);
        }
        sqliteDb.exec('COMMIT;');
        console.log(`[Database] Seeded ${DEFAULT_MEMORIES.length} default memories into SQLite.`);
    }

    // Seed baseline assessment if table is empty
    const assessmentRow = sqliteDb.prepare('SELECT COUNT(*) AS count FROM assessments').get();
    if (assessmentRow.count === 0) {
        const insertAssessment = sqliteDb.prepare(`
            INSERT INTO assessments (score, answers, status, formatted_date)
            VALUES (?, ?, ?, ?)
        `);
        insertAssessment.run(
            92,
            JSON.stringify({ note: 'Baseline cognitive wellness check-in' }),
            'Completed',
            new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        );
        console.log('[Database] Seeded baseline caregiver assessment into SQLite.');
    }

    dbInstance = sqliteDb;
    console.log('[Database] Connected to SQLite database with WAL mode.');
} else {
    // --------------------------------------------------------------------------
    // 3. ZERO-DEPENDENCY COMPATIBLE FALLBACK (for Node.js < 22 on Render/Railway)
    // --------------------------------------------------------------------------
    console.log('[Database] Notice: Native node:sqlite not present (Node < 22). Using resilient MindCare data store.');

    class CompatibleDataStore {
        constructor() {
            this.routines = DEFAULT_ROUTINES.map((r, idx) => ({
                id: idx + 1,
                ...r,
                created_at: new Date().toISOString()
            }));
            this.memories = DEFAULT_MEMORIES.map((m, idx) => ({
                id: idx + 1,
                ...m,
                created_at: new Date().toISOString()
            }));
            this.assessments = [
                {
                    id: 1,
                    score: 92,
                    answers: JSON.stringify({ note: 'Baseline cognitive wellness check-in' }),
                    status: 'Completed',
                    formatted_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    created_at: new Date().toISOString()
                }
            ];
            this.nextRoutineId = this.routines.length + 1;
            this.nextMemoryId = this.memories.length + 1;
            this.nextAssessmentId = 2;
        }

        exec() {}

        prepare(sql) {
            const s = sql.trim();
            const self = this;

            return {
                all(...args) {
                    if (s.includes('FROM routines')) {
                        if (s.includes('category, completed')) {
                            return self.routines.map(r => ({ category: r.category, completed: r.completed }));
                        }
                        return [...self.routines];
                    }
                    if (s.includes('FROM memories')) {
                        if (s.includes('WHERE category = ?')) {
                            const cat = args[0];
                            return self.memories.filter(m => m.category === cat);
                        }
                        return [...self.memories];
                    }
                    if (s.includes('FROM assessments')) {
                        return [...self.assessments].sort((a, b) => b.id - a.id);
                    }
                    return [];
                },

                get(...args) {
                    if (s.includes('COUNT(*) AS count FROM routines')) {
                        return { count: self.routines.length };
                    }
                    if (s.includes('COUNT(*) AS count FROM memories')) {
                        return { count: self.memories.length };
                    }
                    if (s.includes('COUNT(*) AS count FROM assessments')) {
                        return { count: self.assessments.length };
                    }
                    if (s.includes('FROM routines WHERE id = ?')) {
                        const id = Number(args[0]);
                        return self.routines.find(r => r.id === id) || null;
                    }
                    if (s.includes('FROM memories WHERE id = ?')) {
                        const id = Number(args[0]);
                        return self.memories.find(m => m.id === id) || null;
                    }
                    if (s.includes('FROM assessments') && s.includes('LIMIT 1')) {
                        return self.assessments.length > 0 ? self.assessments[self.assessments.length - 1] : null;
                    }
                    return null;
                },

                run(...args) {
                    if (s.includes('INSERT INTO routines')) {
                        const [title, time, category, details, completed, priority] = args;
                        const id = self.nextRoutineId++;
                        const item = {
                            id,
                            title,
                            time,
                            category: category || 'routine',
                            details: details || '',
                            completed: completed ? 1 : 0,
                            priority: priority || 'medium',
                            created_at: new Date().toISOString()
                        };
                        self.routines.push(item);
                        return { lastInsertRowid: id, changes: 1 };
                    }

                    if (s.includes('UPDATE routines SET completed = ? WHERE id = ?')) {
                        const [completed, id] = args;
                        const r = self.routines.find(item => item.id === Number(id));
                        if (r) {
                            r.completed = completed ? 1 : 0;
                            return { changes: 1 };
                        }
                        return { changes: 0 };
                    }

                    if (s.includes('DELETE FROM routines WHERE id = ?')) {
                        const id = Number(args[0]);
                        const idx = self.routines.findIndex(r => r.id === id);
                        if (idx !== -1) {
                            self.routines.splice(idx, 1);
                            return { changes: 1 };
                        }
                        return { changes: 0 };
                    }

                    if (s.includes('INSERT INTO memories')) {
                        const [title, category, date, location, person, description, tags, themeColor, icon, image] = args;
                        const id = self.nextMemoryId++;
                        const item = {
                            id,
                            title,
                            category: category || 'Special Moments',
                            date: date || new Date().toLocaleDateString('en-US'),
                            location: location || '',
                            person: person || '',
                            description: description || '',
                            tags: tags || '[]',
                            themeColor: themeColor || '#0EA5E9',
                            icon: icon || 'heart',
                            image: image || '',
                            created_at: new Date().toISOString()
                        };
                        self.memories.unshift(item);
                        return { lastInsertRowid: id, changes: 1 };
                    }

                    if (s.includes('DELETE FROM memories WHERE id = ?')) {
                        const id = Number(args[0]);
                        const idx = self.memories.findIndex(m => m.id === id);
                        if (idx !== -1) {
                            self.memories.splice(idx, 1);
                            return { changes: 1 };
                        }
                        return { changes: 0 };
                    }

                    if (s.includes('INSERT INTO assessments')) {
                        const [score, answers, status, formatted_date] = args;
                        const id = self.nextAssessmentId++;
                        const item = {
                            id,
                            score: Number(score),
                            answers: answers || '{}',
                            status: status || 'Completed',
                            formatted_date: formatted_date || new Date().toLocaleDateString('en-US'),
                            created_at: new Date().toISOString()
                        };
                        self.assessments.push(item);
                        return { lastInsertRowid: id, changes: 1 };
                    }

                    return { lastInsertRowid: 0, changes: 0 };
                }
            };
        }
    }

    dbInstance = new CompatibleDataStore();
}

module.exports = dbInstance;
