const express = require('express');
const router = express.Router();
const db = require('../db');

// Handler for caregiver metrics
function getCaregiverStats(req, res) {
    try {
        // Routine statistics
        const routines = db.prepare('SELECT category, completed FROM routines').all();
        const totalRoutines = routines.length;
        const routinesCompleted = routines.filter(r => r.completed === 1).length;
        const routineCompletionPercent = totalRoutines > 0 ? Math.round((routinesCompleted / totalRoutines) * 100) : 100;

        // Medication-specific statistics
        const meds = routines.filter(r => r.category === 'medication');
        const totalMedications = meds.length;
        const medicationsCompleted = meds.filter(r => r.completed === 1).length;
        const medicationAdherencePercent = totalMedications > 0 ? Math.round((medicationsCompleted / totalMedications) * 100) : 100;

        // Latest cognitive assessment
        const latestAssessment = db.prepare(`
            SELECT score, formatted_date, created_at
            FROM assessments
            ORDER BY id DESC
            LIMIT 1
        `).get();

        res.json({
            adherence_rate: medicationAdherencePercent,
            adherenceRate: medicationAdherencePercent,
            completion_rate: routineCompletionPercent,
            completionRate: routineCompletionPercent,
            medicationAdherencePercent,
            medicationsCompleted,
            totalMedications,
            routineCompletionPercent,
            routinesCompleted,
            totalRoutines,
            latestCognitiveScore: latestAssessment ? latestAssessment.score : null,
            latestAssessmentDate: latestAssessment ? (latestAssessment.formatted_date || latestAssessment.created_at) : null,
            primaryCaregiver: {
                name: 'Sarah M.',
                relationship: 'Daughter & Primary Caregiver',
                phone: '+1 (555) 234-5678',
                status: 'Connected & Receiving Daily Alerts'
            },
            safeZoneStatus: 'Home Safe Zone Active'
        });
    } catch (err) {
        console.error('[GET /api/caregiver] Error:', err);
        res.status(500).json({ error: 'Failed to compute caregiver statistics' });
    }
}

// 1. GET /api/caregiver and GET /api/caregiver/stats
router.get('/', getCaregiverStats);
router.get('/stats', getCaregiverStats);

// 2. POST /api/caregiver/alert — Trigger simulated caregiver SMS/Push notification
router.post('/alert', (req, res) => {
    try {
        const { type = 'test', message = 'Caregiver alert triggered from MindCare system.' } = req.body;

        res.json({
            success: true,
            alertSent: true,
            recipient: 'Sarah M. (+1 555-234-5678)',
            type,
            message,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('[POST /api/caregiver/alert] Error:', err);
        res.status(500).json({ error: 'Failed to dispatch caregiver alert' });
    }
});

module.exports = router;
