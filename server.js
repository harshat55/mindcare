/**
 * MindCare — Production & Development Server (Render / Railway / Local)
 * Express + Socket.io Server listening on dynamic environment port (process.env.PORT || 3000).
 */
const express = require('express');
const http = require('http');
const { Server: SocketIO } = require('socket.io');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express & HTTP Server with Socket.io
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

// Dynamic Environment Port (Render / Railway default is process.env.PORT, fallback to 3000)
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI (Optional / Empathetic Companion Fallback)
const { GoogleGenerativeAI } = require('@google/generative-ai');
const geminiApiKey = process.env.GEMINI_API_KEY;
const isGeminiKeyValid = geminiApiKey &&
    geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE' &&
    !geminiApiKey.includes('PASTE_YOUR_API_KEY');

let genAI = null;
let geminiModel = null;

const MINDCARE_SYSTEM_PROMPT = `You are MindCare, a gentle, compassionate, and reassuring AI voice companion for an elderly person who may experience memory loss, confusion, or dementia.

Core Personality & Voice Guidelines:
1. Warm & Calm: Speak like a loving family companion. Use simple, comforting words.
2. Short & Concise: Answer in only 1 to 3 short sentences. Your words are read aloud to the user through text-to-speech, so keep sentences brief and natural. No bullet points, asterisks, or markdown symbols.
3. Dementia Safety Anchors:
   - If the user feels confused, lost, or scared: reassure them softly ("Take a slow breath. You are completely safe in your warm home, and your daughter Sarah is just a phone call away.").
   - If asked about medications: morning medicine was taken; evening supplements are scheduled for 8:00 PM tonight.
   - If asked about family: Maya is their beloved granddaughter who graduated with honors and loves baking apple bread with them.
4. Non-Clinical: Never provide medical diagnosis or arguments. Offer dignity, peace, and quiet confidence.`;

if (isGeminiKeyValid) {
    try {
        genAI = new GoogleGenerativeAI(geminiApiKey);
        geminiModel = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: MINDCARE_SYSTEM_PROMPT
        });
        console.log('[Gemini AI] Initialized Google Gemini 1.5 Flash successfully.');
    } catch (e) {
        console.warn('[Gemini AI] Initialization notice, using local empathetic fallback:', e.message);
    }
} else {
    console.log('[Gemini AI] Note: GEMINI_API_KEY not set. Using MindCare empathetic companion engine.');
}

// Routes
const routinesRouter = require('./backend/routes/routines');
const memoriesRouter = require('./backend/routes/memories');
const assessmentsRouter = require('./backend/routes/assessments');
const caregiverRouter = require('./backend/routes/caregiver');

app.use('/api/routines', routinesRouter);
app.use('/api/memories', memoriesRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/caregiver', caregiverRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'MindCare API Server',
        timestamp: new Date().toISOString(),
        geminiConfigured: !!geminiModel,
        port: PORT
    });
});

// AI Chat Handler
async function handleChat(req, res) {
    const userMessage = (req.body && (req.body.message || req.body.prompt || '')).trim();
    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    if (geminiModel) {
        try {
            const chat = geminiModel.startChat({ history: [] });
            const result = await chat.sendMessage(userMessage);
            const responseText = result.response.text();
            return res.json({
                reply: responseText,
                source: 'gemini-1.5-flash',
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.warn('[Gemini API] Request notice, using empathetic fallback:', err.message);
        }
    }

    // Local empathetic response engine
    const msg = userMessage.toLowerCase();
    let reply = "I am right here with you. Everything is calm and peaceful.";
    if (msg.includes('medicine') || msg.includes('pill') || msg.includes('dose')) {
        reply = "Your morning medicines were taken. Your evening blood pressure tablet is scheduled for 8:00 PM.";
    } else if (msg.includes('maya') || msg.includes('granddaughter') || msg.includes('daughter')) {
        reply = "Maya is your sweet granddaughter. She loves making apple bread with you and is doing wonderful.";
    } else if (msg.includes('today') || msg.includes('schedule') || msg.includes('routine')) {
        reply = "Today is going nicely. You have a quiet afternoon and a video call with family at 3:30 PM.";
    } else if (msg.includes('confused') || msg.includes('lost') || msg.includes('worried') || msg.includes('scared') || msg.includes('where')) {
        reply = "Take a slow, gentle breath. You are safe in your warm home, and everyone who loves you is near.";
    } else if (msg.includes('water') || msg.includes('thirsty') || msg.includes('drink')) {
        reply = "Having a glass of fresh water is a wonderful idea. I will note it for your routine.";
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        reply = "Hello there! It is wonderful to speak with you today. How are you feeling?";
    }

    res.json({
        reply,
        source: 'mindcare-companion',
        timestamp: new Date().toISOString()
    });
}

app.post('/api/chat', handleChat);
app.post('/api/companion/chat', handleChat);

// --------------------------------------------------------------------------
//    SOCKET.IO REAL-TIME COMMUNICATION
// --------------------------------------------------------------------------
let connectedPatients = 0;
let connectedCaregivers = 0;

io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('register_role', (data) => {
        const role = data && data.role;
        if (role === 'patient') {
            socket.join('patients');
            connectedPatients++;
            console.log(`[Socket.io] Patient registered: ${socket.id} (total: ${connectedPatients})`);
            
            const onlineNotif = {
                type: 'patient_online',
                title: '🟢 Patient Connected',
                message: `${data.name || 'Patient'} is now online.`,
                patientName: data.name || 'Patient',
                category: 'success',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date().toISOString()
            };
            io.emit('caretaker_notification', onlineNotif);
            io.emit('caregiver_notification', onlineNotif);
        } else if (role === 'caregiver') {
            socket.join('caregivers');
            connectedCaregivers++;
            console.log(`[Socket.io] Caregiver registered: ${socket.id} (total: ${connectedCaregivers})`);
        }
        socket.mindcareRole = role;
        socket.mindcareName = data && data.name;
    });

    function handlePatientEvent(payload) {
        console.log(`[Socket.io] patient_event from ${socket.id}:`, payload);
        const notification = {
            type: payload.type || 'general',
            title: payload.title || 'Patient Notification',
            message: payload.message || payload.title || '',
            patientName: payload.patientName || socket.mindcareName || 'Patient',
            category: payload.category || (payload.type === 'sos' ? 'danger' : 'info'),
            time: payload.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: payload.timestamp || new Date().toISOString(),
            data: payload.data || {}
        };
        io.emit('caretaker_notification', notification);
        io.emit('caregiver_notification', notification);
    }

    socket.on('patient_event', handlePatientEvent);
    socket.on('patient_alert', handlePatientEvent);

    socket.on('disconnect', () => {
        if (socket.mindcareRole === 'patient') {
            connectedPatients = Math.max(0, connectedPatients - 1);
            const offlineNotif = {
                type: 'patient_offline',
                title: '⚪ Patient Disconnected',
                message: `${socket.mindcareName || 'Patient'} went offline.`,
                patientName: socket.mindcareName || 'Patient',
                category: 'warning',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date().toISOString()
            };
            io.emit('caretaker_notification', offlineNotif);
            io.emit('caregiver_notification', offlineNotif);
        } else if (socket.mindcareRole === 'caregiver') {
            connectedCaregivers = Math.max(0, connectedCaregivers - 1);
        }
        console.log(`[Socket.io] Client disconnected: ${socket.id} (patients: ${connectedPatients}, caregivers: ${connectedCaregivers})`);
    });
});

// Serve static frontend files from project root
app.use(express.static(__dirname));

// Start HTTP + WebSocket Server
httpServer.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` MindCare Deployment Server running!`);
    console.log(` - Port:            ${PORT}`);
    console.log(` - Base URL:        http://localhost:${PORT}`);
    console.log(` - Frontend:        http://localhost:${PORT}/login.html`);
    console.log(` - Socket.io:       ws://localhost:${PORT}`);
    console.log(` - Gemini Status:   ${geminiModel ? 'Google Gemini 1.5 Flash ACTIVE' : 'Local Empathetic Engine'}`);
    console.log(`=========================================`);
});
