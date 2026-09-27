const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. GET /api/assessments/latest — Fetch the most recent cognitive check
router.get('/latest', (req, res) => {
    try {
        const row = db.prepare(`
            SELECT * FROM assessments
            ORDER BY id DESC
            LIMIT 1
        `).get();

        if (!row) {
            return res.json(null);
        }

        res.json({
            ...row,
            answers: row.answers ? (() => { try { return JSON.parse(row.answers); } catch { return row.answers; } })() : null
        });
    } catch (err) {
        console.error('[GET /api/assessments/latest] Error:', err);
        res.status(500).json({ error: 'Failed to fetch latest assessment' });
    }
});

// 2. GET /api/assessments — Fetch all assessment history
router.get('/', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT * FROM assessments
            ORDER BY id DESC
        `).all();

        const assessments = rows.map(r => ({
            ...r,
            answers: r.answers ? (() => { try { return JSON.parse(r.answers); } catch { return r.answers; } })() : null
        }));

        res.json(assessments);
    } catch (err) {
        console.error('[GET /api/assessments] Error:', err);
        res.status(500).json({ error: 'Failed to fetch assessment history' });
    }
});

// 3. POST /api/assessments — Record a completed cognitive check
router.post('/', (req, res) => {
    try {
        const {
            score,
            answers = {},
            status = 'Completed',
            formatted_date = new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } = req.body;

        if (score === undefined || score === null) {
            return res.status(400).json({ error: 'Score is required.' });
        }

        const answersString = typeof answers === 'string' ? answers : JSON.stringify(answers);

        const insert = db.prepare(`
            INSERT INTO assessments (score, answers, status, formatted_date)
            VALUES (?, ?, ?, ?)
        `);

        const result = insert.run(Number(score), answersString, status, formatted_date);

        const newAssessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(result.lastInsertRowid);

        res.status(201).json({
            ...newAssessment,
            answers: newAssessment.answers ? (() => { try { return JSON.parse(newAssessment.answers); } catch { return newAssessment.answers; } })() : null
        });
    } catch (err) {
        console.error('[POST /api/assessments] Error:', err);
        res.status(500).json({ error: 'Failed to save assessment' });
    }
});

module.exports = router;
