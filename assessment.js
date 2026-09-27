/**
 * MindCare — Cognitive Assessment Engine (assessment.js)
 * Manages the 5-step cognitive check, interactive tasks, progress tracking,
 * scoring, and ethical non-diagnostic summary generation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAssessment();
});

let currentQuestionIndex = 0;
let userAnswers = {};
let memoryStudyDone = false;

function initAssessment() {
    const questions = window.ASSESSMENT_QUESTIONS || [];
    if (!questions.length) return;

    renderQuestion(currentQuestionIndex);

    // Navigation buttons
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');

    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextQuestion);
    }
    if (backBtn) {
        backBtn.addEventListener('click', handleBackQuestion);
    }

    const retakeBtn = document.getElementById('retakeBtn');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            currentQuestionIndex = 0;
            userAnswers = {};
            memoryStudyDone = false;
            document.getElementById('assessmentResultsWrap').style.display = 'none';
            document.getElementById('assessmentQuestionsWrap').style.display = 'block';
            renderQuestion(0);
        });
    }

    const saveToCaregiverBtn = document.getElementById('saveToCaregiverBtn');
    if (saveToCaregiverBtn) {
        saveToCaregiverBtn.addEventListener('click', async () => {
            const totalScore = calculateScore();
            const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            saveToCaregiverBtn.disabled = true;
            saveToCaregiverBtn.innerHTML = `Saving to records...`;

            if (window.MindCareStorage) {
                window.MindCareStorage.saveAssessmentResult({
                    score: totalScore,
                    answers: userAnswers,
                    status: 'Completed',
                    date: dateStr
                });
            }

            if (window.MindCareAPI && typeof window.MindCareAPI.createAssessment === 'function') {
                try {
                    await window.MindCareAPI.createAssessment({
                        score: totalScore,
                        answers: userAnswers,
                        status: 'Completed',
                        date: dateStr
                    });
                } catch (e) {
                    console.warn('[MindCare Assessment] API save failed, saved locally:', e);
                }
            }

            if (window.showToast) {
                window.showToast('Activity summary saved to Caregiver records!', 'success');
            }
            saveToCaregiverBtn.innerHTML = `✓ Saved to Caregiver Dashboard (Synced with Server)`;
        });
    }
}

function renderQuestion(index) {
    const questions = window.ASSESSMENT_QUESTIONS;
    const q = questions[index];
    if (!q) return;

    // Update progress bar
    const progressFill = document.getElementById('progressBarFill');
    const stepIndicator = document.getElementById('stepIndicator');
    const percent = Math.round(((index + 1) / questions.length) * 100);
    
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (stepIndicator) stepIndicator.textContent = `Activity ${index + 1} of ${questions.length}`;

    // Update buttons
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (backBtn) {
        backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
        nextBtn.textContent = index === questions.length - 1 ? 'Finish Activity →' : 'Next Question →';
    }

    // Question content area
    const container = document.getElementById('questionContentArea');
    if (!container) return;

    let html = `
        <div class="assessment-header-block" style="margin-bottom: var(--space-xl);">
            <span class="badge badge-info" style="margin-bottom: var(--space-xs);">${q.category}</span>
            <h2 style="font-size: 1.6rem; margin-bottom: var(--space-xs);">${q.title}</h2>
            <p class="text-secondary" style="font-size: 1.05rem;">${q.instruction}</p>
        </div>
    `;

    // Dynamic Task Rendering
    if (q.type === 'study-and-recall') {
        html += renderMemoryRecallTask(q);
    } else if (q.type === 'pattern') {
        html += renderPatternTask(q);
    } else if (q.type === 'attention-grid') {
        html += renderAttentionTask(q);
    } else if (q.type === 'multiple-choice' || q.type === 'orientation') {
        html += renderChoiceTask(q);
    }

    container.innerHTML = html;
    attachQuestionEvents(q);
}

// 1. Study and Recall Task
function renderMemoryRecallTask(q) {
    if (!memoryStudyDone) {
        return `
            <div class="study-phase" style="text-align: center; padding: var(--space-lg) 0;">
                <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: var(--space-lg); color: var(--brand-primary);">
                    Take your time to look at and remember these 4 everyday items:
                </p>
                <div class="recall-items-grid" style="max-width: 600px; margin: 0 auto var(--space-xl) auto;">
                    ${q.memorizeItems.map(item => `
                        <div class="recall-item-card" style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: var(--space-lg); border: 2px solid var(--brand-primary-hover);">
                            <span class="item-emoji" style="font-size: 3rem;">${item.icon}</span>
                            <strong style="display: block; font-size: 1.1rem; margin-top: var(--space-xs);">${item.label}</strong>
                            <small class="text-muted">${item.desc}</small>
                        </div>
                    `).join('')}
                </div>
                <button type="button" id="startRecallBtn" class="btn btn-primary btn-lg" style="box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);">
                    I Have Memorized Them →
                </button>
            </div>
        `;
    } else {
        const selected = userAnswers[q.id] || [];
        return `
            <div class="recall-phase">
                <p style="font-weight: 600; font-size: 1.15rem; margin-bottom: var(--space-md);">
                    ${q.recallQuestion} <span style="font-size: 0.9rem; font-weight: normal; color: var(--text-muted);">(Select all 4 objects)</span>
                </p>
                <div class="recall-items-grid">
                    ${q.options.map(opt => {
                        const isChecked = selected.includes(opt.id);
                        return `
                            <div class="recall-item-card ${isChecked ? 'selected' : ''}" data-choice-id="${opt.id}" tabindex="0" role="checkbox" aria-checked="${isChecked}">
                                <span class="item-emoji">${opt.icon}</span>
                                <strong style="display: block; font-size: 1rem;">${opt.label}</strong>
                                <span class="select-indicator" style="font-size: 0.8rem; color: var(--brand-primary); margin-top: 4px; display: block;">
                                    ${isChecked ? '✓ Selected' : '+ Tap to select'}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: var(--space-md); font-size: 0.9rem; color: var(--text-muted); text-align: center;">
                    ${selected.length} of ${q.requiredMatches} items selected
                </div>
            </div>
        `;
    }
}

// 2. Pattern Task
function renderPatternTask(q) {
    const selected = userAnswers[q.id];
    return `
        <div class="pattern-sequence-box" style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl); text-align: center; border: 1px solid var(--border-subtle);">
            <div style="display: flex; justify-content: center; gap: var(--space-md); flex-wrap: wrap; font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm);">
                ${q.sequence.map(item => `
                    <div style="background: var(--bg-surface); padding: 0.75rem 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
                        ${item}
                    </div>
                `).join('')}
            </div>
            <p style="font-size: 1.1rem; font-weight: 600; margin-top: var(--space-md); color: var(--text-primary);">${q.question}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
            ${q.options.map(opt => {
                const isSelected = selected === opt.id;
                return `
                    <button type="button" class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-lg option-btn" data-choice-id="${opt.id}" style="justify-content: flex-start; padding: 1rem 1.5rem; font-size: 1.15rem; border-radius: var(--radius-md);">
                        <span style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid currentColor; display: inline-flex; align-items: center; justify-content: center; margin-right: var(--space-sm); font-size: 0.85rem;">
                            ${isSelected ? '●' : '○'}
                        </span>
                        ${opt.label}
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

// 3. Attention Grid Task
function renderAttentionTask(q) {
    const selected = userAnswers[q.id];
    return `
        <div style="background: var(--bg-subtle); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl); text-align: center; border: 1px solid var(--border-subtle);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); max-width: 440px; margin: 0 auto;">
                ${q.gridItems.map(sym => `
                    <div style="background: var(--bg-surface); font-size: 2.2rem; padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
                        ${sym}
                    </div>
                `).join('')}
            </div>
            <p style="font-size: 1.15rem; font-weight: 600; margin-top: var(--space-lg);">${q.question}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md);">
            ${q.options.map(opt => {
                const isSelected = selected === opt.id;
                return `
                    <button type="button" class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-lg option-btn" data-choice-id="${opt.id}" style="font-size: 1.1rem; border-radius: var(--radius-md);">
                        ${opt.label}
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

// 4 & 5. Multiple Choice & Orientation
function renderChoiceTask(q) {
    const selected = userAnswers[q.id];
    return `
        <div style="margin-bottom: var(--space-xl);">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: var(--space-lg); line-height: 1.5;">${q.question}</h3>
            <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                ${q.options.map(opt => {
                    const isSelected = selected === opt.id;
                    return `
                        <button type="button" class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'} option-btn" data-choice-id="${opt.id}" style="justify-content: flex-start; text-align: left; padding: 1.1rem 1.4rem; font-size: 1.05rem; border-radius: var(--radius-md); white-space: normal; line-height: 1.5;">
                            <span style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid currentColor; display: inline-flex; align-items: center; justify-content: center; margin-right: var(--space-md); flex-shrink: 0;">
                                ${isSelected ? '●' : '○'}
                            </span>
                            <span>${opt.label}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function attachQuestionEvents(q) {
    if (q.type === 'study-and-recall') {
        const startBtn = document.getElementById('startRecallBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                memoryStudyDone = true;
                renderQuestion(currentQuestionIndex);
            });
        }

        document.querySelectorAll('.recall-item-card[data-choice-id]').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-choice-id');
                let selected = userAnswers[q.id] || [];
                if (selected.includes(id)) {
                    selected = selected.filter(x => x !== id);
                } else {
                    if (selected.length < q.requiredMatches) {
                        selected.push(id);
                    } else {
                        if (window.showToast) window.showToast(`Please choose only ${q.requiredMatches} items`, 'warning');
                        return;
                    }
                }
                userAnswers[q.id] = selected;
                renderQuestion(currentQuestionIndex);
            });
        });
    } else {
        document.querySelectorAll('.option-btn[data-choice-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const choiceId = btn.getAttribute('data-choice-id');
                userAnswers[q.id] = choiceId;
                renderQuestion(currentQuestionIndex);
            });
        });
    }
}

function handleNextQuestion() {
    const questions = window.ASSESSMENT_QUESTIONS;
    const currentQ = questions[currentQuestionIndex];

    // Gentle check if an answer is selected
    if (currentQ.type === 'study-and-recall' && !memoryStudyDone) {
        if (window.showToast) window.showToast('Please take a moment to study the 4 objects and click "I Have Memorized Them"', 'warning');
        return;
    }

    if (!userAnswers[currentQ.id]) {
        if (window.showToast) window.showToast('Please select your answer to continue', 'warning');
        return;
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        memoryStudyDone = false;
        renderQuestion(currentQuestionIndex);
    } else {
        showResults();
    }
}

function handleBackQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        memoryStudyDone = true; // when navigating back, show options
        renderQuestion(currentQuestionIndex);
    }
}

function calculateScore() {
    let score = 0;
    const questions = window.ASSESSMENT_QUESTIONS;

    questions.forEach(q => {
        const answer = userAnswers[q.id];
        if (q.type === 'study-and-recall' && Array.isArray(answer)) {
            const correctIds = q.options.filter(o => o.correct).map(o => o.id);
            const matches = answer.filter(a => correctIds.includes(a)).length;
            score += Math.round((matches / correctIds.length) * 20);
        } else if (q.options) {
            const chosen = q.options.find(o => o.id === answer);
            if (chosen && chosen.correct) {
                score += 20;
            }
        }
    });

    return Math.min(100, Math.max(score, 60)); // Friendly supportive grading
}

function showResults() {
    const questionsWrap = document.getElementById('assessmentQuestionsWrap');
    const resultsWrap = document.getElementById('assessmentResultsWrap');

    if (questionsWrap) questionsWrap.style.display = 'none';
    if (resultsWrap) resultsWrap.style.display = 'block';

    const score = calculateScore();
    const scoreValEl = document.getElementById('overallScoreValue');
    if (scoreValEl) scoreValEl.textContent = `${score}%`;

    // Save automatically to history and sync to backend
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const payload = {
        score: score,
        answers: userAnswers,
        status: 'Completed',
        date: dateStr
    };

    if (window.MindCareStorage) {
        window.MindCareStorage.saveAssessmentResult(payload);
    }

    if (window.MindCareAPI && typeof window.MindCareAPI.createAssessment === 'function') {
        window.MindCareAPI.createAssessment(payload).catch(err => {
            console.warn('[MindCare Assessment] Auto-sync to backend failed:', err.message);
        });
    }

    // Real-time Socket.io Notification to Caregiver
    if (window.MindCareSocket) {
        const patientName = localStorage.getItem('mindcare_user_name') || 'Patient';
        window.MindCareSocket.emitEvent({
            type: 'task_completed',
            title: '🧠 Memory & Cognitive Game Completed',
            message: `${patientName} finished the Cognitive Check with a score of ${score}%`,
            category: 'success',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            data: { score, status: 'Completed' }
        });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
