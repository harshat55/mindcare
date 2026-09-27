const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. GET /api/routines — Fetch all daily reminders
router.get('/', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT id, title, time, category, details, completed, priority, created_at
            FROM routines
            ORDER BY id ASC
        `).all();

        // Convert SQLite integer (0/1) to boolean for friendly JSON
        const routines = rows.map(r => ({
            ...r,
            completed: Boolean(r.completed)
        }));

        res.json(routines);
    } catch (err) {
        console.error('[GET /api/routines] Error:', err);
        res.status(500).json({ error: 'Failed to fetch routines' });
    }
});

// 2. POST /api/routines — Create a new reminder
router.post('/', (req, res) => {
    try {
        const { title, time, category = 'routine', details = '', priority = 'medium' } = req.body;

        if (!title || !time) {
            return res.status(400).json({ error: 'Title and time are required fields.' });
        }

        const insert = db.prepare(`
            INSERT INTO routines (title, time, category, details, completed, priority)
            VALUES (?, ?, ?, ?, 0, ?)
        `);

        const result = insert.run(title.trim(), time.trim(), category.trim(), details.trim(), priority.trim());

        const newRoutine = db.prepare(`
            SELECT id, title, time, category, details, completed, priority, created_at
            FROM routines WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json({
            ...newRoutine,
            completed: Boolean(newRoutine.completed)
        });
    } catch (err) {
        console.error('[POST /api/routines] Error:', err);
        res.status(500).json({ error: 'Failed to create routine' });
    }
});

// 3. PATCH /api/routines/:id/toggle — Toggle completion status (pending <-> completed)
router.patch('/:id/toggle', (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = parseInt(String(id).replace(/^rt-/, ''), 10) || id;

        const current = db.prepare('SELECT * FROM routines WHERE id = ?').get(cleanId);
        if (!current) {
            return res.status(404).json({ error: `Routine with ID ${id} not found.` });
        }

        const newStatus = current.completed ? 0 : 1;
        db.prepare('UPDATE routines SET completed = ? WHERE id = ?').run(newStatus, cleanId);

        const updated = db.prepare('SELECT * FROM routines WHERE id = ?').get(cleanId);

        res.json({
            ...updated,
            completed: Boolean(updated.completed)
        });
    } catch (err) {
        console.error('[PATCH /api/routines/:id/toggle] Error:', err);
        res.status(500).json({ error: 'Failed to toggle routine' });
    }
});

// 4. DELETE /api/routines/:id — Delete a routine
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = parseInt(String(id).replace(/^rt-/, ''), 10) || id;
        const result = db.prepare('DELETE FROM routines WHERE id = ?').run(cleanId);

        if (result.changes === 0) {
            return res.status(404).json({ error: `Routine with ID ${id} not found.` });
        }

        res.json({ success: true, message: `Routine ${id} deleted successfully.` });
    } catch (err) {
        console.error('[DELETE /api/routines/:id] Error:', err);
        res.status(500).json({ error: 'Failed to delete routine' });
    }
});

module.exports = router;
