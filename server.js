/**
 * MindCare — Production & Development Server (Render / Railway / Local)
 * Express + Socket.io Server listening on dynamic environment port.
 */
const express = require('express');
const http = require('http');
const { Server: SocketIO } = require('socket.io');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const routinesRouter = require('./backend/routes/routines');
const memoriesRouter = require('./backend/routes/memories');
const assessmentsRouter = require('./backend/routes/assessments');
const caregiverRouter = require('./backend/routes/caregiver');

app.use('/api/routines', routinesRouter);
app.use('/api/memories', memoriesRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/caregiver', caregiverRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'MindCare API Server',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// AI Chat Handler
async function handleChat(req, res) {
    const userMessage = (req.body && (req.body.message || req.body.prompt || '')).trim();
    if (!userMessage) return res.status(400).json({ error: 'Message is required' });

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

    res.json({ reply, source: 'mindcare-companion', timestamp: new Date().toISOString() });
}

app.post('/api/chat', handleChat);
app.post('/api/companion/chat', handleChat);

// Socket.io Real-time
let connectedPatients = 0;
let connectedCaregivers = 0;

io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('register_role', (data) => {
        const role = data && data.role;
        if (role === 'patient') {
            socket.join('patients');
            connectedPatients++;
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
        }
        socket.mindcareRole = role;
        socket.mindcareName = data && data.name;
    });

    function handlePatientEvent(payload) {
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
        } else if (socket.mindcareRole === 'caregiver') {
            connectedCaregivers = Math.max(0, connectedCaregivers - 1);
        }
    });
});

// STATIC ASSETS SERVING (Frontend & Subfolders)
app.use(express.static(path.join(__dirname)));
app.use('/js', express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Default root redirect to login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Start Server
httpServer.listen(PORT, () => {
    console.log(`MindCare Deployment Server running on port ${PORT}`);
});
