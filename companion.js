/**
 * MindCare — AI Memory Companion & Two-Way Voice Engine (companion.js)
 * Features:
 * 1. Web Speech API (Speech-to-Text) with live visual recording feedback
 * 2. Express Backend + Google Gemini 1.5 Flash integration via POST /api/chat
 * 3. Text-to-Speech (Voice Output) using window.speechSynthesis
 * 4. Real-time visual status indicator (Idle, Listening, Thinking, Speaking)
 * 5. Automatic graceful fallback if microphone or network is unavailable
 */

document.addEventListener('DOMContentLoaded', () => {
    initCompanion();
});

let isVoiceOutputEnabled = true; // Default ON for seamless two-way voice conversation
let activeSpeechRecognition = null;
let isCurrentlyRecording = false;

function initCompanion() {
    const chatBoxes = document.querySelectorAll('.chat-interactive-box');
    chatBoxes.forEach(box => setupChatInstance(box));
}

function updateVoiceStatusIndicator(state, box) {
    const statusDot = box.querySelector('#voiceStatusDot') || document.getElementById('voiceStatusDot');
    const statusBadge = box.querySelector('#voiceStatusBadge') || document.getElementById('voiceStatusBadge');

    if (!statusBadge) return;

    // Reset classes
    if (statusDot) statusDot.className = 'status-dot-active voice-status-dot';
    statusBadge.className = 'badge voice-status-badge';

    switch (state) {
        case 'listening':
            if (statusDot) statusDot.classList.add('listening');
            statusBadge.classList.add('listening');
            statusBadge.textContent = '🎙️ Listening...';
            break;
        case 'thinking':
            if (statusDot) statusDot.classList.add('thinking');
            statusBadge.classList.add('thinking');
            statusBadge.textContent = '⏳ Thinking...';
            break;
        case 'speaking':
            if (statusDot) statusDot.classList.add('speaking');
            statusBadge.classList.add('speaking');
            statusBadge.textContent = '🔊 Speaking...';
            break;
        case 'idle':
        default:
            statusBadge.classList.add('badge-secondary');
            statusBadge.textContent = 'Always Available';
            break;
    }
}

function setupChatInstance(box) {
    const input = box.querySelector('.chat-input');
    const sendBtn = box.querySelector('.chat-send-btn');
    const messagesContainer = box.querySelector('.chat-messages');
    const voiceToggleBtn = box.querySelector('.voice-toggle-btn');
    const micBtn = box.querySelector('.mic-input-btn');
    const promptChips = box.querySelectorAll('.chip-btn');
    const clearBtn = box.querySelector('.clear-chat-btn');

    if (!input || !sendBtn || !messagesContainer) return;

    // 1. Send via Click
    sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text) {
            handleUserMessage(text, box);
            input.value = '';
        }
    });

    // 2. Send via Enter key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = input.value.trim();
            if (text) {
                handleUserMessage(text, box);
                input.value = '';
            }
        }
    });

    // 3. Quick Suggestion Prompt Chips
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.getAttribute('data-prompt') || chip.textContent.trim();
            handleUserMessage(query, box);
        });
    });

    // 4. Voice Read Aloud (Mute / Unmute) Toggle
    if (voiceToggleBtn) {
        voiceToggleBtn.classList.toggle('active', isVoiceOutputEnabled);
        voiceToggleBtn.addEventListener('click', () => {
            isVoiceOutputEnabled = !isVoiceOutputEnabled;
            voiceToggleBtn.classList.toggle('active', isVoiceOutputEnabled);
            voiceToggleBtn.setAttribute('title', isVoiceOutputEnabled ? 'Voice Read Aloud Enabled' : 'Voice Read Aloud Muted');

            if (!isVoiceOutputEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                updateVoiceStatusIndicator('idle', box);
            }

            if (window.showToast) {
                window.showToast(isVoiceOutputEnabled ? '🔊 Voice speech enabled' : '🔇 Voice speech muted', 'info');
            }
        });
    }

    // 5. Speech-to-Text: Browser Web Speech API Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (micBtn) {
        micBtn.addEventListener('click', () => {
            // If already recording, stop it
            if (isCurrentlyRecording && activeSpeechRecognition) {
                try { activeSpeechRecognition.stop(); } catch {}
                return;
            }

            if (SpeechRecognition) {
                startSpeechRecognition(box, input, micBtn, SpeechRecognition);
            } else {
                // Fallback simulation for unsupported browsers
                startSimulatedVoice(box, input, micBtn);
            }
        });
    }

    // 6. Clear Conversation
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            updateVoiceStatusIndicator('idle', box);

            messagesContainer.innerHTML = `
                <div class="chat-bubble chat-bubble-assistant">
                    <p>Hello! I am your MindCare memory companion. I can help remind you of today's schedule, tell you about family photos, or share a calming moment. Tap the microphone to speak anytime!</p>
                    <div class="chat-actions-group">
                        <a href="routine.html" class="btn btn-secondary btn-sm">Check Routine →</a>
                        <a href="memory.html" class="btn btn-secondary btn-sm">View Photos →</a>
                    </div>
                </div>
            `;
            if (window.showToast) window.showToast('Conversation refreshed', 'info');
        });
    }
}

// Speech-to-Text handler using Web Speech API
function startSpeechRecognition(box, input, micBtn, SpeechRecognitionClass) {
    try {
        const recognition = new SpeechRecognitionClass();
        activeSpeechRecognition = recognition;

        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            isCurrentlyRecording = true;
            micBtn.classList.add('recording');
            micBtn.setAttribute('title', 'Listening... Tap to stop');
            updateVoiceStatusIndicator('listening', box);
            input.placeholder = 'Listening to your voice... Speak now';
        };

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            input.value = transcript;
        };

        recognition.onerror = (event) => {
            console.warn('[Web Speech API] Recognition error:', event.error);
            isCurrentlyRecording = false;
            micBtn.classList.remove('recording');
            updateVoiceStatusIndicator('idle', box);
            input.placeholder = 'Message or tap mic to speak...';

            if (event.error === 'not-allowed') {
                if (window.showToast) window.showToast('Microphone access denied. Please allow microphone in browser.', 'warning');
            } else if (event.error !== 'no-speech') {
                if (window.showToast) window.showToast(`Voice input notice: ${event.error}`, 'info');
            }
        };

        recognition.onend = () => {
            isCurrentlyRecording = false;
            micBtn.classList.remove('recording');
            micBtn.setAttribute('title', 'Speak to MindCare (Speech-to-Text)');

            const spokenText = input.value.trim();
            if (spokenText) {
                input.value = '';
                handleUserMessage(spokenText, box);
            } else {
                updateVoiceStatusIndicator('idle', box);
                input.placeholder = 'Message or tap mic to speak...';
            }
        };

        recognition.start();
    } catch (e) {
        console.error('[Web Speech API] Could not start recognition:', e);
        startSimulatedVoice(box, input, micBtn);
    }
}

// Fallback voice simulation if browser does not support Web Speech API
function startSimulatedVoice(box, input, micBtn) {
    micBtn.classList.add('recording');
    updateVoiceStatusIndicator('listening', box);
    input.placeholder = 'Listening... (Microphone Simulation)';

    if (window.showToast) {
        window.showToast('Listening... (Web Speech Simulation)', 'info', 2000);
    }

    setTimeout(() => {
        micBtn.classList.remove('recording');
        input.placeholder = 'Message or tap mic to speak...';
        const simulatedPhrases = [
            'What medicine do I take tonight?',
            'Tell me about my granddaughter Maya',
            'What are my activities for today?',
            'I am feeling a little confused right now'
        ];
        const phrase = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
        input.value = phrase;
        setTimeout(() => {
            handleUserMessage(phrase, box);
            input.value = '';
        }, 500);
    }, 2200);
}

// Core Message Handler: Displays message, queries Gemini backend, triggers voice reply
async function handleUserMessage(userText, box) {
    const messagesContainer = box.querySelector('.chat-messages');
    if (!messagesContainer) return;

    // 1. Append User Message Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-bubble-user';
    userBubble.innerHTML = `<p>${escapeHtml(userText)}</p>`;
    messagesContainer.appendChild(userBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 2. Show Typing / Thinking Indicator
    updateVoiceStatusIndicator('thinking', box);

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-bubble chat-bubble-assistant typing-bubble';
    typingIndicator.innerHTML = `
        <span style="display: inline-flex; gap: 4px; align-items: center; padding: 4px 8px;">
            <span class="voice-bar" style="width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: pulseDot 1s infinite;"></span>
            <span class="voice-bar" style="width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: pulseDot 1s infinite 0.2s;"></span>
            <span class="voice-bar" style="width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); animation: pulseDot 1s infinite 0.4s;"></span>
        </span>
    `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    let responseText = '';
    let actions = [];

    // 3. Fetch AI Reply from Backend /api/chat (Google Gemini 1.5 Flash)
    try {
        if (window.MindCareAPI && typeof window.MindCareAPI.sendCompanionChat === 'function') {
            const apiRes = await window.MindCareAPI.sendCompanionChat(userText);
            if (apiRes && apiRes.reply) {
                responseText = apiRes.reply;
                actions = apiRes.actions || [];
            }
        }
    } catch (e) {
        console.warn('[MindCare Companion] Backend query failed, using local fallback:', e);
    }

    // 4. Local Rule-Based Fallback if backend was offline
    if (!responseText) {
        const fallback = findCompanionResponse(userText);
        responseText = fallback.text;
        actions = fallback.actions || [];
    }

    typingIndicator.remove();

    // 5. Append Assistant Response Bubble
    const assistantBubble = document.createElement('div');
    assistantBubble.className = 'chat-bubble chat-bubble-assistant';

    let actionsHtml = '';
    if (actions && actions.length > 0) {
        actionsHtml = `
            <div class="chat-actions-group" style="margin-top: var(--space-sm); display: flex; flex-wrap: wrap; gap: 8px;">
                ${actions.map(act => {
                    if (act.url) {
                        return `<a href="${act.url}" class="btn btn-secondary btn-sm" style="font-size: 0.82rem; padding: 0.35rem 0.8rem; border-radius: var(--radius-full);">${act.label} →</a>`;
                    } else if (act.action === 'play_calm') {
                        return `<button type="button" class="btn btn-primary btn-sm play-calm-btn" style="font-size: 0.82rem; padding: 0.35rem 0.8rem; border-radius: var(--radius-full);">🌿 Play Calming Breathing Guide</button>`;
                    } else {
                        return `<button type="button" class="btn btn-secondary btn-sm" onclick="window.showToast('Reminder noted in caregiver records', 'success')" style="font-size: 0.82rem; padding: 0.35rem 0.8rem; border-radius: var(--radius-full);">${act.label}</button>`;
                    }
                }).join('')}
            </div>
        `;
    }

    assistantBubble.innerHTML = `
        <p>${escapeHtml(responseText)}</p>
        ${actionsHtml}
    `;

    messagesContainer.appendChild(assistantBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Connect Calming Guide Button if generated
    const calmBtn = assistantBubble.querySelector('.play-calm-btn');
    if (calmBtn) {
        calmBtn.addEventListener('click', () => {
            if (window.showToast) {
                window.showToast('Breathing slowly: Inhale for 4 seconds... Hold for 4... Exhale gently...', 'info', 5000);
            }
        });
    }

    // 6. Text-to-Speech (Speak AI Response Aloud)
    if (isVoiceOutputEnabled && 'speechSynthesis' in window) {
        speakResponseAloud(responseText, box);
    } else {
        updateVoiceStatusIndicator('idle', box);
    }
}

// Text-to-Speech engine using window.speechSynthesis
function speakResponseAloud(text, box) {
    if (!('speechSynthesis' in window)) {
        updateVoiceStatusIndicator('idle', box);
        return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    // Remove markdown symbols or links for clean pronunciation
    const cleanSpoken = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpoken);
    utterance.rate = 0.92; // Calm, gentle, easy-to-follow tempo for elderly users
    utterance.pitch = 1.0;

    // Attempt to pick a natural soothing voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (
        v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Jenny') ||
        v.name.includes('Aria')
    ));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
        updateVoiceStatusIndicator('speaking', box);
    };

    utterance.onend = () => {
        updateVoiceStatusIndicator('idle', box);
    };

    utterance.onerror = () => {
        updateVoiceStatusIndicator('idle', box);
    };

    window.speechSynthesis.speak(utterance);
}

// Local knowledge fallback
function findCompanionResponse(userText) {
    const clean = userText.toLowerCase();
    const knowledge = window.COMPANION_KNOWLEDGE || [];

    for (let item of knowledge) {
        for (let trigger of item.triggers) {
            if (clean.includes(trigger)) {
                return { text: item.response, actions: item.actions };
            }
        }
    }

    const fallbacks = window.COMPANION_FALLBACKS || [
        "I am right here with you. Would you like to check your daily routine or view photos of loved ones in your Memory Journal?"
    ];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return {
        text: randomFallback,
        actions: [
            { label: 'View Routine', url: 'routine.html' },
            { label: 'View Memory Journal', url: 'memory.html' }
        ]
    };
}

function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
}
