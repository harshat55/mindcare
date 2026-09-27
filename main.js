/**
 * MindCare — Core Frontend Controller (main.js)
 * "The Memory Garden" Edition
 * Manages global themes, accessibility preferences, navigation drawer,
 * Memory Orbit, "A Day with MindCare" Story, 30-Second Guided Demo,
 * Landing Cognitive Mini-Game, Modals, and Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initA11y();
    initNavbar();
    initModals();
    initMemoryOrbit();
    initScrollStory();
    initGuidedDemo();
    initLandingCognitiveCheck();
    initLandingMemoryForm();
    initProblemVoices();
});

/* --------------------------------------------------------------------------
   1. THEME MANAGEMENT (LIGHT IVORY / NIGHT GARDEN)
   -------------------------------------------------------------------------- */
function initTheme() {
    const savedTheme = window.MindCareStorage ? window.MindCareStorage.getTheme() : 'light';
    applyTheme(savedTheme);

    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            if (window.MindCareStorage) {
                window.MindCareStorage.setTheme(next);
            }
            showToast(`Switched to ${next === 'dark' ? 'Night Garden' : 'Warm Ivory'} theme`, 'info');
        });
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
        if (theme === 'dark') {
            btn.setAttribute('title', 'Switch to Warm Ivory Theme');
            btn.setAttribute('aria-label', 'Switch to Warm Ivory Theme');
        } else {
            btn.setAttribute('title', 'Switch to Night Garden Theme');
            btn.setAttribute('aria-label', 'Switch to Night Garden Theme');
        }
    });
}

/* --------------------------------------------------------------------------
   2. ACCESSIBILITY CONTROLS & FLOATING PANEL
   -------------------------------------------------------------------------- */
function initA11y() {
    const a11y = window.MindCareStorage ? window.MindCareStorage.getA11y() : {
        fontSize: 'normal',
        highContrast: false,
        reducedMotion: false
    };

    applyA11ySettings(a11y);

    const trigger = document.getElementById('a11yTrigger');
    const panel = document.getElementById('a11yPanel');
    const closeBtn = document.getElementById('a11yCloseBtn');

    if (trigger && panel) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
            trigger.setAttribute('aria-expanded', panel.classList.contains('open'));
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        }

        document.addEventListener('click', (e) => {
            if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
                panel.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Font size controls
    const fontBtns = document.querySelectorAll('[data-font-size]');
    fontBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.getAttribute('data-font-size');
            fontBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const current = window.MindCareStorage.getA11y();
            current.fontSize = size;
            window.MindCareStorage.setA11y(current);
            applyA11ySettings(current);
            showToast(`Text size set to ${size}`, 'info');
        });
    });

    // High contrast toggle
    const contrastToggle = document.getElementById('contrastToggle');
    if (contrastToggle) {
        contrastToggle.checked = a11y.highContrast;
        contrastToggle.addEventListener('change', () => {
            const current = window.MindCareStorage.getA11y();
            current.highContrast = contrastToggle.checked;
            window.MindCareStorage.setA11y(current);
            applyA11ySettings(current);
            showToast(current.highContrast ? 'High Contrast enabled' : 'Normal Contrast restored', 'info');
        });
    }

    // Reduced motion toggle
    const motionToggle = document.getElementById('motionToggle');
    if (motionToggle) {
        motionToggle.checked = a11y.reducedMotion;
        motionToggle.addEventListener('change', () => {
            const current = window.MindCareStorage.getA11y();
            current.reducedMotion = motionToggle.checked;
            window.MindCareStorage.setA11y(current);
            applyA11ySettings(current);
            showToast(current.reducedMotion ? 'Reduced Motion enabled' : 'Natural animations active', 'info');
        });
    }

    // Reset A11y
    const resetBtn = document.getElementById('a11yResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const defaultSettings = { fontSize: 'normal', highContrast: false, reducedMotion: false };
            window.MindCareStorage.setA11y(defaultSettings);
            applyA11ySettings(defaultSettings);
            if (contrastToggle) contrastToggle.checked = false;
            if (motionToggle) motionToggle.checked = false;
            fontBtns.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-font-size') === 'normal');
            });
            showToast('Accessibility settings reset to default', 'info');
        });
    }
}

function applyA11ySettings(settings) {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${settings.fontSize || 'normal'}`);

    const fontBtns = document.querySelectorAll('[data-font-size]');
    fontBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-font-size') === settings.fontSize);
    });

    if (settings.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    if (settings.reducedMotion) root.classList.add('reduced-motion');
    else root.classList.remove('reduced-motion');
}

/* --------------------------------------------------------------------------
   3. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');

    if (mobileBtn && drawer) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            drawer.classList.toggle('open');
            const isOpen = drawer.classList.contains('open');
            mobileBtn.setAttribute('aria-expanded', isOpen);
        });

        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (drawer.classList.contains('open') && !drawer.contains(e.target) && !mobileBtn.contains(e.target)) {
                drawer.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. TOAST NOTIFICATIONS
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '🌿';
    if (type === 'success') iconSvg = '✓';
    else if (type === 'warning') iconSvg = '⚠️';

    toast.innerHTML = `
        <span style="font-weight: 700; color: var(--brand-forest);">${iconSvg}</span>
        <span style="flex: 1;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 240ms cubic-bezier(0.2, 0.9, 0.3, 1)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 240);
    }, duration);
}

window.showToast = showToast;

/* --------------------------------------------------------------------------
   5. MODAL SYSTEM
   -------------------------------------------------------------------------- */
function initModals() {
    document.querySelectorAll('[data-modal-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-target');
            openModal(modalId);
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-backdrop');
            if (modal) closeModal(modal.id);
        });
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal(backdrop.id);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

window.openModal = openModal;
window.closeModal = closeModal;

/* --------------------------------------------------------------------------
   6. SIGNATURE FEATURE: THE "MEMORY ORBIT"
   -------------------------------------------------------------------------- */
const ORBIT_DATA = {
    memory: {
        title: "Memory",
        icon: "❤️",
        text: "Keep important people and moments close.",
        subtext: "Cherished photos, spoken stories, and family voices preserved forever.",
        url: "memory.html",
        btnText: "Open Memory Journal →"
    },
    routine: {
        title: "Routine",
        icon: "⏰",
        text: "Make everyday tasks easier to remember.",
        subtext: "Gentle step-by-step rhythms for medications, meals, and walks.",
        url: "routine.html",
        btnText: "View Daily Routine →"
    },
    cognitive: {
        title: "Cognitive",
        icon: "🧠",
        text: "Engage with simple cognitive activities.",
        subtext: "Calm puzzles, object recall, and orientation exercises without pressure.",
        url: "assessment.html",
        btnText: "Take Cognitive Check →"
    },
    family: {
        title: "Family",
        icon: "🤝",
        text: "Keep caregivers connected.",
        subtext: "Quiet daily insights, schedule updates, and collaborative peace of mind.",
        url: "caregiver.html",
        btnText: "Caregiver Dashboard →"
    },
    safety: {
        title: "Safety",
        icon: "🛡️",
        text: "Help caregivers stay informed.",
        subtext: "Safe-zone telemetry, emergency contacts, and discreet check-ins.",
        url: "caregiver.html",
        btnText: "View Safety Perimeters →"
    }
};

function initMemoryOrbit() {
    const coreTitle = document.getElementById('orbitCoreTitle');
    const coreText = document.getElementById('orbitCoreText');
    const coreLink = document.getElementById('orbitCoreLink');
    const nodes = document.querySelectorAll('.orbit-node');

    if (!coreTitle || !nodes.length) return;

    function setOrbitState(key) {
        const item = ORBIT_DATA[key];
        if (!item) return;

        nodes.forEach(n => n.classList.toggle('active', n.getAttribute('data-orbit') === key));

        coreTitle.textContent = `${item.icon} ${item.title}`;
        coreText.textContent = item.text;
        if (coreLink) {
            coreLink.href = item.url;
            coreLink.textContent = item.btnText;
            coreLink.style.display = 'inline-flex';
        }
    }

    nodes.forEach(node => {
        const key = node.getAttribute('data-orbit');
        node.addEventListener('mouseenter', () => setOrbitState(key));
        node.addEventListener('click', () => setOrbitState(key));
    });

    // Default to Memory
    setOrbitState('memory');
}

/* --------------------------------------------------------------------------
   7. SCROLL STORY: "A DAY WITH MINDCARE"
   -------------------------------------------------------------------------- */
const DAY_STORY_DATA = {
    morning: {
        time: "07:30 AM",
        period: "Morning",
        heading: "Start the day gently.",
        quote: "No rushing. Morning sunlight, a glass of water, and today's first reminders presented with calm simplicity.",
        items: [
            { icon: "💊", title: "Morning Medicine", desc: "Blood pressure tablet with light breakfast" },
            { icon: "📋", title: "Daily Schedule Plan", desc: "Garden stroll at 9:30 AM, lunch at 1:00 PM" },
            { icon: "🌿", title: "Gentle Mood Check", desc: "Patient reported feeling calm & rested" }
        ],
        bgTone: "radial-gradient(circle at 50% 20%, rgba(207, 110, 45, 0.08) 0%, transparent 60%)"
    },
    midday: {
        time: "12:30 PM",
        period: "Midday",
        heading: "Keep the mind engaged.",
        quote: "A short pause after lunch for gentle cognitive stimulation that brings clarity and confidence to the afternoon.",
        items: [
            { icon: "🧠", title: "Cognitive Activity", desc: "5-minute object recall challenge completed" },
            { icon: "📘", title: "Memory Reflection", desc: "Reflected on family summer trip to Maine" },
            { icon: "🍲", title: "Hydration & Soup", desc: "Warm nourishment and herbal tea logged" }
        ],
        bgTone: "radial-gradient(circle at 50% 20%, rgba(51, 97, 89, 0.09) 0%, transparent 60%)"
    },
    evening: {
        time: "04:00 PM",
        period: "Evening",
        heading: "Stay connected.",
        quote: "Family bonds are reinforced with simple video greetings and reassuring reminders about the upcoming evening.",
        items: [
            { icon: "❤️", title: "Family Connection", desc: "Video catch-up with granddaughter Maya" },
            { icon: "📅", title: "Appointment Reminder", desc: "Gentle reminder about tomorrow's walk" },
            { icon: "🖼️", title: "Photo Album Review", desc: "Looked at Rose Garden anniversary photo" }
        ],
        bgTone: "radial-gradient(circle at 50% 20%, rgba(184, 91, 108, 0.08) 0%, transparent 60%)"
    },
    night: {
        time: "08:00 PM",
        period: "Night",
        heading: "End the day with confidence.",
        quote: "Soothing acoustic piano music, final evening medicine checked off, and tomorrow already calmly structured.",
        items: [
            { icon: "💊", title: "Evening Supplements", desc: "Calcium & evening wellness tablet taken" },
            { icon: "✓", title: "Routine Completion", desc: "7 of 8 daily care moments achieved" },
            { icon: "🛡️", title: "Caregiver Summary", desc: "Sarah received daily report: Home safe" }
        ],
        bgTone: "radial-gradient(circle at 50% 20%, rgba(30, 61, 47, 0.1) 0%, transparent 60%)"
    }
};

function initScrollStory() {
    const tabs = document.querySelectorAll('.story-time-tab');
    const timeEl = document.getElementById('storyTimeBadge');
    const headEl = document.getElementById('storyHeading');
    const quoteEl = document.getElementById('storyQuote');
    const listEl = document.getElementById('storyItemsList');

    if (!tabs.length || !headEl) return;

    function renderStory(key) {
        const d = DAY_STORY_DATA[key];
        if (!d) return;

        tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-story-period') === key));
        if (timeEl) timeEl.textContent = `${d.period} • ${d.time}`;
        headEl.textContent = d.heading;
        if (quoteEl) quoteEl.textContent = `"${d.quote}"`;

        if (listEl) {
            listEl.innerHTML = d.items.map(item => `
                <div style="display: flex; gap: var(--space-md); align-items: center; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <div style="font-size: 1.4rem; width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--bg-surface); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        ${item.icon}
                    </div>
                    <div>
                        <strong style="font-size: 0.95rem; color: var(--text-primary); display: block;">${item.title}</strong>
                        <small style="color: var(--text-secondary);">${item.desc}</small>
                    </div>
                </div>
            `).join('');
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const period = tab.getAttribute('data-story-period');
            renderStory(period);
        });
    });

    renderStory('morning');
}

/* --------------------------------------------------------------------------
   8. THE "WOW" DEMO SECTION (30-SECOND GUIDED HACKATHON DEMO)
   -------------------------------------------------------------------------- */
const DEMO_STEPS = [
    {
        num: 1,
        title: "Step 1: Patient Starts Day",
        badge: "07:30 AM",
        desc: "Arthur wakes up. MindCare softly displays his calm morning view with zero overwhelming tech clutter.",
        previewHtml: `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2.2rem; background: var(--brand-amber-soft); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">🌅</div>
                <div>
                    <span class="eyebrow-tag">Stage 1 • Morning Awaken</span>
                    <h3 class="serif-heading" style="font-size: 1.35rem;">"Good morning, Arthur. Today is Thursday."</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Clean ivory layout guides attention without medical anxiety.</p>
                </div>
            </div>
        `
    },
    {
        num: 2,
        title: "Step 2: MindCare Reminder",
        badge: "08:00 AM",
        desc: "A gentle audible and visual prompt reminds Arthur of his prescribed morning blood pressure medication.",
        previewHtml: `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2.2rem; background: var(--status-info-bg); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">💊</div>
                <div>
                    <span class="eyebrow-tag">Stage 2 • Empathetic Reminder</span>
                    <h3 class="serif-heading" style="font-size: 1.35rem;">"Time for morning medicine with a cup of water."</h3>
                    <button type="button" class="btn btn-sm btn-primary" style="margin-top: 6px;" onclick="window.showToast('Medicine confirmed taken!', 'success')">Tap to Confirm Dose</button>
                </div>
            </div>
        `
    },
    {
        num: 3,
        title: "Step 3: Cognitive Activity",
        badge: "10:30 AM",
        desc: "Arthur plays an enjoyable 3-minute memory recall challenge. No stress, no clinical grading.",
        previewHtml: `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2.2rem; background: var(--brand-forest-light); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">🧠</div>
                <div>
                    <span class="eyebrow-tag">Stage 3 • Cognitive Exercise</span>
                    <h3 class="serif-heading" style="font-size: 1.35rem;">"Remember 4 everyday objects: Key, Apple, Book, Star"</h3>
                    <p style="color: var(--status-success); font-weight: 600; font-size: 0.9rem;">✓ Arthur successfully recognized all 4 objects (96% Focus)</p>
                </div>
            </div>
        `
    },
    {
        num: 4,
        title: "Step 4: Routine Updates",
        badge: "11:00 AM",
        desc: "The task updates in Arthur's timeline and synchronizes across devices seamlessly.",
        previewHtml: `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2.2rem; background: var(--status-success-bg); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">✓</div>
                <div>
                    <span class="eyebrow-tag">Stage 4 • Automatic Routine Checkoff</span>
                    <h3 class="serif-heading" style="font-size: 1.35rem;">Daily Routine Progress: 5 of 8 Completed</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Zero manual logging effort required by the patient.</p>
                </div>
            </div>
        `
    },
    {
        num: 5,
        title: "Step 5: Caregiver Sync",
        badge: "11:05 AM",
        desc: "Daughter Sarah opens her Caregiver Portal and instantly sees today's verified progress.",
        previewHtml: `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2.2rem; background: var(--brand-amber-soft); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">📊</div>
                <div>
                    <span class="eyebrow-tag">Stage 5 • Caregiver Peace of Mind</span>
                    <h3 class="serif-heading" style="font-size: 1.35rem;">Sarah's Dashboard: Medication 92% • Mood Positive</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">No need to make intrusive phone calls asking "Did you take your pills?"</p>
                </div>
            </div>
        `
    },
    {
        num: 6,
        title: "Step 6: Safe-Zone All Clear",
        badge: "01:00 PM",
        desc: "Discreet geofencing confirms Arthur is safe in his home garden. Quiet confidence for all.",
        previewHtml: `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2.2rem; background: var(--status-success-bg); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">🛡️</div>
                <div>
                    <span class="eyebrow-tag">Stage 6 • Dignified Safety Support</span>
                    <h3 class="serif-heading" style="font-size: 1.35rem;">Perimeter Status: ● Home Safe Zone Active</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Demonstration loop complete: Dignity, memory, routine, and safety united.</p>
                </div>
            </div>
        `
    }
];

let demoTimer = null;
let currentDemoStep = 0;

function initGuidedDemo() {
    const runBtn = document.getElementById('runDemoBtn');
    const stepperWrap = document.getElementById('demoStepperPills');
    const screenEl = document.getElementById('demoStageScreen');

    if (!runBtn || !stepperWrap || !screenEl) return;

    // Render step pills
    stepperWrap.innerHTML = DEMO_STEPS.map((s, idx) => `
        <button type="button" class="demo-step-pill ${idx === 0 ? 'active' : ''}" data-step="${idx}">
            <span>0${s.num}</span>
            <span>${s.title}</span>
        </button>
    `).join('');

    const pills = stepperWrap.querySelectorAll('.demo-step-pill');

    function showDemoStep(idx) {
        currentDemoStep = idx;
        const step = DEMO_STEPS[idx];
        pills.forEach((p, i) => p.classList.toggle('active', i === idx));
        screenEl.innerHTML = step.previewHtml;
    }

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            if (demoTimer) clearInterval(demoTimer);
            showDemoStep(parseInt(pill.getAttribute('data-step')));
            runBtn.innerHTML = '▶ Restart Demo Tour';
        });
    });

    runBtn.addEventListener('click', () => {
        if (demoTimer) clearInterval(demoTimer);
        currentDemoStep = 0;
        showDemoStep(0);
        runBtn.innerHTML = '⏸ Tour Running (30s)...';

        demoTimer = setInterval(() => {
            currentDemoStep++;
            if (currentDemoStep >= DEMO_STEPS.length) {
                clearInterval(demoTimer);
                demoTimer = null;
                runBtn.innerHTML = '↺ Replay Demo Tour';
                if (window.showToast) window.showToast('Demo loop completed! Explore all pages anytime.', 'success');
            } else {
                showDemoStep(currentDemoStep);
            }
        }, 4800);
    });

    showDemoStep(0);
}

/* --------------------------------------------------------------------------
   9. INLINE COGNITIVE MINI-GAME (LANDING PAGE)
   -------------------------------------------------------------------------- */
function initLandingCognitiveCheck() {
    const startRecallBtn = document.getElementById('miniRecallStartBtn');
    const studyArea = document.getElementById('miniStudyPhase');
    const recallArea = document.getElementById('miniRecallPhase');
    const resultArea = document.getElementById('miniResultPhase');
    const submitBtn = document.getElementById('miniCheckSubmitBtn');

    if (!startRecallBtn || !studyArea || !recallArea) return;

    let selectedChoices = [];
    const correctTargets = ['key', 'apple', 'book', 'flower'];

    startRecallBtn.addEventListener('click', () => {
        studyArea.style.display = 'none';
        recallArea.style.display = 'block';
    });

    document.querySelectorAll('.mini-tile-choice').forEach(tile => {
        tile.addEventListener('click', () => {
            const id = tile.getAttribute('data-item-id');
            if (selectedChoices.includes(id)) {
                selectedChoices = selectedChoices.filter(x => x !== id);
                tile.classList.remove('selected');
            } else {
                if (selectedChoices.length < 4) {
                    selectedChoices.push(id);
                    tile.classList.add('selected');
                } else {
                    if (window.showToast) window.showToast('Please select only 4 items', 'warning');
                }
            }
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (selectedChoices.length < 4) {
                if (window.showToast) window.showToast('Please pick 4 objects to verify recall', 'warning');
                return;
            }
            recallArea.style.display = 'none';
            if (resultArea) resultArea.style.display = 'block';
            if (window.showToast) window.showToast('✓ Activity complete!', 'success');
        });
    }
}

/* --------------------------------------------------------------------------
   10. IMMEDIATE LOCALSTORAGE MEMORY ADD ON LANDING PAGE
   -------------------------------------------------------------------------- */
function initLandingMemoryForm() {
    const form = document.getElementById('landingAddMemoryForm');
    const grid = document.getElementById('landingMemoryGrid');

    if (!form || !grid || !window.MindCareStorage) return;

    async function renderLandingMemories() {
        let memories = [];
        if (window.MindCareAPI && typeof window.MindCareAPI.fetchMemories === 'function') {
            try {
                memories = await window.MindCareAPI.fetchMemories();
            } catch {
                memories = window.MindCareStorage.getMemories();
            }
        } else {
            memories = window.MindCareStorage.getMemories();
        }

        if (!Array.isArray(memories) || memories.length === 0) {
            memories = window.MindCareStorage.getMemories();
        }

        const topMemories = memories.slice(0, 3);
        grid.innerHTML = topMemories.map(mem => `
            <div class="memory-card" data-memory-id="${mem.id}">
                <div class="memory-card-img-wrap">
                    <img src="${mem.image}" alt="${mem.title}" class="memory-card-img">
                </div>
                <div class="memory-card-body">
                    <div>
                        <span class="memory-date-tag">${mem.category || 'Special Moments'} • ${mem.date || mem.formatted_date || 'Cherished Moment'}</span>
                        <h3 class="memory-card-title">${mem.title}</h3>
                        <p class="memory-card-desc">${mem.description}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px solid var(--border-subtle);">
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${mem.person || ''}</span>
                        <a href="memory.html" class="btn btn-secondary btn-sm">View Story →</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('landingMemTitle').value.trim();
        const person = document.getElementById('landingMemPerson').value.trim();
        const desc = document.getElementById('landingMemDesc').value.trim();

        if (!title || !desc) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const origBtnText = submitBtn ? submitBtn.innerHTML : 'Save to Memory Journal';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Saving to journal...';
        }

        const memoryPayload = {
            title,
            person,
            description: desc,
            category: 'Special Moments',
            image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
        };

        try {
            if (window.MindCareAPI && typeof window.MindCareAPI.createMemory === 'function') {
                await window.MindCareAPI.createMemory(memoryPayload);
            } else if (window.MindCareStorage) {
                window.MindCareStorage.addMemory(memoryPayload);
            }
        } catch (err) {
            console.warn('[MindCare Main] API save error, fallback to local storage:', err);
            if (window.MindCareStorage) {
                window.MindCareStorage.addMemory(memoryPayload);
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnText;
            }
        }

        form.reset();
        window.closeModal('addMemoryModal');
        if (window.showToast) window.showToast(`Memory "${title}" saved to your journal!`, 'success');
        await renderLandingMemories();
    });

    window.addEventListener('mindcare:synced', (e) => {
        if (e.detail && e.detail.type === 'memories') {
            renderLandingMemories();
        }
    });

    renderLandingMemories();
}

/* --------------------------------------------------------------------------
   11. PROBLEM VOICES INTERACTIVE EXPANSION
   -------------------------------------------------------------------------- */
function initProblemVoices() {
    const cards = document.querySelectorAll('.problem-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const isExpanded = card.classList.contains('expanded');
            cards.forEach(c => c.classList.remove('expanded'));
            if (!isExpanded) card.classList.add('expanded');
        });
    });
}
