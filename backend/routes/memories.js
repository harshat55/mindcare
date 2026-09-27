const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. GET /api/memories — Fetch memories (optional ?category= filter)
router.get('/', (req, res) => {
    try {
        const { category } = req.query;

        let rows;
        if (category && category !== 'all') {
            rows = db.prepare(`
                SELECT * FROM memories
                WHERE category = ?
                ORDER BY id DESC
            `).all(category);
        } else {
            rows = db.prepare(`
                SELECT * FROM memories
                ORDER BY id DESC
            `).all();
        }

        // Parse JSON tags for each memory
        const memories = rows.map(m => ({
            ...m,
            tags: m.tags ? (() => { try { return JSON.parse(m.tags); } catch { return []; } })() : []
        }));

        res.json(memories);
    } catch (err) {
        console.error('[GET /api/memories] Error:', err);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

// 2. GET /api/memories/:id — Fetch a single memory by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = parseInt(String(id).replace(/^mem-/, ''), 10) || id;
        const memory = db.prepare('SELECT * FROM memories WHERE id = ?').get(cleanId);

        if (!memory) {
            return res.status(404).json({ error: `Memory with ID ${id} not found.` });
        }

        res.json({
            ...memory,
            tags: memory.tags ? (() => { try { return JSON.parse(memory.tags); } catch { return []; } })() : []
        });
    } catch (err) {
        console.error('[GET /api/memories/:id] Error:', err);
        res.status(500).json({ error: 'Failed to fetch memory detail' });
    }
});

// 3. POST /api/memories — Create a new memory card
router.post('/', (req, res) => {
    try {
        const {
            title,
            category = 'Special Moments',
            date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            location = '',
            person = '',
            description,
            image = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
            themeColor = '#0EA5E9',
            icon = 'heart',
            tags = ['Personal', 'Favorite']
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required fields.' });
        }

        const tagsString = typeof tags === 'string' ? tags : JSON.stringify(tags);

        const insert = db.prepare(`
            INSERT INTO memories (title, category, date, location, person, description, tags, themeColor, icon, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = insert.run(
            title.trim(),
            category.trim(),
            date.trim(),
            location.trim(),
            person.trim(),
            description.trim(),
            tagsString,
            themeColor.trim(),
            icon.trim(),
            image.trim()
        );

        const newMemory = db.prepare('SELECT * FROM memories WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            ...newMemory,
            tags: newMemory.tags ? (() => { try { return JSON.parse(newMemory.tags); } catch { return []; } })() : []
        });
    } catch (err) {
        console.error('[POST /api/memories] Error:', err);
        res.status(500).json({ error: 'Failed to create memory' });
    }
});

// 4. DELETE /api/memories/:id — Delete a memory
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = parseInt(String(id).replace(/^mem-/, ''), 10) || id;
        const result = db.prepare('DELETE FROM memories WHERE id = ?').run(cleanId);

        if (result.changes === 0) {
            return res.status(404).json({ error: `Memory with ID ${id} not found.` });
        }

        res.json({ success: true, message: `Memory ${id} deleted successfully.` });
    } catch (err) {
        console.error('[DELETE /api/memories/:id] Error:', err);
        res.status(500).json({ error: 'Failed to delete memory' });
    }
});

module.exports = router;
