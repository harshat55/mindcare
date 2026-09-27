/**
 * MindCare — Multilingual Translation Dictionary & i18n Engine (js/translations.js)
 * Supports: English (en), Hindi (hi - हिन्दी), and Assamese (as - অসমীয়া).
 * Provides dynamic real-time DOM translation, language persistence, and helper formatting.
 */

const MindCareTranslations = {
    en: {
        // Brand & Header
        'brand.name': 'MindCare',
        'brand.tagline': 'Every memory matters.',
        'brand.footer_disclaimer': 'MindCare is a supportive companion platform for individuals living with memory loss, their caregivers, and loving families.',

        // Navigation
        'nav.home': 'Home',
        'nav.companion': 'Companion',
        'nav.routine': 'Daily Routine',
        'nav.memory': 'Memory Journal',
        'nav.caregiver': 'Caregiver Portal',
        'nav.assessment': 'Cognitive Check',
        'nav.login': 'Log In',
        'nav.logout': 'Sign Out',
        'nav.back': 'Back',
        'nav.start': 'Start MindCare',

        // Login Page
        'login.title': 'Welcome to MindCare',
        'login.subtitle': 'Select your role, then enter your details to continue',
        'login.role_label': 'I am a…',
        'login.role_patient_title': 'Patient / Companion',
        'login.role_patient_desc': 'Daily routines & gentle support',
        'login.role_caregiver_title': 'Caregiver',
        'login.role_caregiver_desc': 'Monitor health & safety alerts',
        'login.details_divider': 'Your details',
        'login.name_label': 'Email / Username',
        'login.name_placeholder': 'e.g. patient@mindcare.com',
        'login.pin_label': '4-Digit PIN',
        'login.pin_placeholder': 'Enter 4-digit PIN',
        'login.submit_btn': 'Sign In',
        'login.footer_note': 'Your data stays on this device only. No account needed.',
        'login.demo_access_label': 'Demo Access:',
        'login.demo_patient': 'Patient (patient@mindcare.com / 1234)',
        'login.demo_caregiver': 'Caregiver (caregiver@mindcare.com / 9999)',
        'login.error_empty': 'Please enter both fields to continue.',
        'login.error_role': 'Please select a role to continue.',
        'login.error_patient': 'Invalid Patient Credentials! Demo credentials: patient@mindcare.com / 1234',
        'login.error_caregiver': 'Invalid Caregiver Credentials! Demo credentials: caregiver@mindcare.com / 9999',

        // Companion Page
        'companion.header_title': 'Memory Companion',
        'companion.header_subtitle': 'A calm conversation space to ask about reminders, view stories, or share a quiet moment.',
        'companion.assistant_name': 'MindCare Companion',
        'companion.status_available': 'Always Available',
        'companion.btn_read_aloud': '🔊 Read Aloud',
        'companion.btn_sos': '🚨 Emergency Help / SOS',
        'companion.restart_title': 'Restart conversation',
        'companion.input_placeholder': 'Message or tap mic to speak...',
        'companion.btn_send': 'Send',
        'companion.welcome_msg': 'Good morning. You have a video call with Maya at 3:30 PM today, and your morning medicine was completed. How can I help right now?',
        'companion.btn_check_routine': 'Check Routine →',
        'companion.btn_view_photos': 'View Photos →',
        'companion.card_routine_sub': 'Medications & tasks',
        'companion.card_memory_sub': 'Photos & life stories',
        'companion.card_caregiver_sub': 'Overview & contacts',

        // Quick prompts
        'prompt.medicines': '💊 What medicines are due?',
        'prompt.maya': '❤️ Tell me about Maya',
        'prompt.schedule': "📅 Today's schedule",
        'prompt.confused': '🌿 I feel confused / worried',
        'prompt.memories': '🖼️ Show my memories',
        'prompt.brain': '🧠 Light brain activity',
        'prompt.water': '💧 Need Water',

        // Routine Page
        'routine.badge': 'Schedule',
        'routine.title': 'Daily Routine',
        'routine.subtitle': 'Simple, predictable rhythm for medications, meals, and activities.',
        'routine.completed_of': 'completed',
        'routine.filter_all': 'All',
        'routine.filter_meds': '💊 Medications',
        'routine.filter_activity': '🌿 Activities',
        'routine.filter_meals': '🍲 Meals',
        'routine.filter_social': '❤️ Social',
        'routine.status_completed': 'Completed',
        'routine.status_upcoming': 'Upcoming',
        'routine.btn_undo': 'Undo',
        'routine.btn_complete': 'Complete',
        'routine.btn_add': '+ Add Reminder',
        'routine.empty_msg': 'No scheduled reminders in this category.',
        'routine.btn_show_all': 'Show All',
        'routine.ask_companion_title': 'Ask MindCare to read reminders',
        'routine.ask_companion_desc': 'Your Companion can speak your daily reminders aloud whenever needed.',
        'routine.btn_talk_companion': 'Talk to Companion →',

        // Routine Modal
        'routine_modal.title': 'Add Reminder',
        'routine_modal.label_title': 'Reminder Title',
        'routine_modal.placeholder_title': 'e.g., Evening Blood Pressure Tablet',
        'routine_modal.label_time': 'Time',
        'routine_modal.label_category': 'Category',
        'routine_modal.label_notes': 'Notes (Optional)',
        'routine_modal.placeholder_notes': 'e.g., Take with a full glass of water after dinner',
        'routine_modal.btn_cancel': 'Cancel',
        'routine_modal.btn_save': 'Save Reminder',

        // Caregiver Page
        'caregiver.header_badge': 'Care Overview',
        'caregiver.header_title': 'Caregiver Dashboard',
        'caregiver.range_today': 'Today',
        'caregiver.range_week': 'Week',
        'caregiver.range_month': 'Month',
        'caregiver.stat_medication': 'Medication Reminder',
        'caregiver.stat_activities': 'Activities',
        'caregiver.stat_routine': 'Daily Routine',
        'caregiver.stat_safety': 'Safety',
        'caregiver.stat_mood': 'Mood',
        'caregiver.safety_all_clear': 'All clear',
        'caregiver.safety_home_zone': 'Home Zone active',
        'caregiver.mood_positive': 'Positive',
        'caregiver.mood_desc': 'Calm & settled',
        'caregiver.chart_adherence_title': 'Adherence Trends',
        'caregiver.chart_adherence_sub': 'Medication & routine completion',
        'caregiver.chart_cognitive_title': 'Cognitive Domains',
        'caregiver.chart_cognitive_sub': 'Distribution across exercises',
        'caregiver.activity_feed_title': "Today's Activity Feed",
        'caregiver.activity_feed_sub': 'Chronological care events and logged routines',
        'caregiver.btn_full_schedule': 'Full Schedule →',
        'caregiver.btn_med_plan': 'Medication Plan',
        'caregiver.btn_cog_report': 'Cognitive Report',
        'caregiver.btn_safety_perimeter': 'Safety Perimeter',
        'caregiver.btn_test_alert': 'Send Safety Test Alert',
        'caregiver.disclaimer': 'MindCare is a supportive technology platform for caregivers and families, not a substitute for clinical physician guidance.',
        'caregiver.panel_title': 'Live Alerts',
        'caregiver.panel_clear': 'Clear All',
        'caregiver.panel_empty': 'No alerts yet. Patient activity will appear here in real time.',

        // Common Alerts & Events
        'alert.sos_title': '🚨 Emergency Help / SOS',
        'alert.task_completed': '✅ Task Completed',
        'alert.med_taken': '💊 Medicine Taken',
        'alert.water_needed': '💧 Need Water',
        'alert.patient_online': '🟢 Patient Connected',
        'alert.patient_offline': '⚪ Patient Disconnected',
        'alert.reminder_added': '📋 Reminder Added'
    },

    hi: {
        // Brand & Header
        'brand.name': 'माइंडकेयर (MindCare)',
        'brand.tagline': 'हर याद अनमोल है।',
        'brand.footer_disclaimer': 'माइंडकेयर स्मृति लोप से प्रभावित व्यक्तियों, उनके देखभालकर्ताओं और प्रिय परिवारों के लिए एक समर्पित साथी मंच है।',

        // Navigation
        'nav.home': 'होम',
        'nav.companion': 'पेशेंट साथी',
        'nav.routine': 'दैनिक दिनचर्या',
        'nav.memory': 'स्मृति पत्रिका',
        'nav.caregiver': 'केयरगिवर डैशबोर्ड',
        'nav.assessment': 'संज्ञानात्मक जांच',
        'nav.login': 'लॉग इन',
        'nav.logout': 'लॉग आउट',
        'nav.back': 'वापस',
        'nav.start': 'माइंडकेयर शुरू करें',

        // Login Page
        'login.title': 'नमस्ते / स्वागत है',
        'login.subtitle': 'अपनी भूमिका चुनें, फिर जारी रखने के लिए विवरण दर्ज करें',
        'login.role_label': 'मैं हूँ…',
        'login.role_patient_title': 'पेशेंट साथी (Patient)',
        'login.role_patient_desc': 'दैनिक दिनचर्या, यादें और सौम्य सहायता',
        'login.role_caregiver_title': 'केयरगिवर (Caregiver)',
        'login.role_caregiver_desc': 'स्वास्थ्य, दवा और सुरक्षा अलर्ट की निगरानी',
        'login.details_divider': 'आपका विवरण',
        'login.name_label': 'ईमेल / यूज़रनेम',
        'login.name_placeholder': 'उदा. patient@mindcare.com',
        'login.pin_label': '4-अंकों का एक्सेस पिन (PIN)',
        'login.pin_placeholder': '4 अंकों का पिन दर्ज करें',
        'login.submit_btn': 'लॉग इन करें',
        'login.footer_note': 'आपका डेटा केवल इस डिवाइस पर सुरक्षित रहता है। किसी खाते की आवश्यकता नहीं है।',
        'login.demo_access_label': 'डेमो एक्सेस:',
        'login.demo_patient': 'पेशेंट (patient@mindcare.com / 1234)',
        'login.demo_caregiver': 'केयरगिवर (caregiver@mindcare.com / 9999)',
        'login.error_empty': 'कृपया जारी रखने के लिए दोनों फ़ील्ड भरें।',
        'login.error_role': 'कृपया जारी रखने के लिए एक भूमिका चुनें।',
        'login.error_patient': 'गलत पेशेंट क्रेडेंशियल्स! डेमो विवरण: patient@mindcare.com / 1234',
        'login.error_caregiver': 'गलत केयरगिवर क्रेडेंशियल्स! डेमो विवरण: caregiver@mindcare.com / 9999',

        // Companion Page
        'companion.header_title': 'स्मृति साथी (Memory Companion)',
        'companion.header_subtitle': 'दवाओं, दैनिक यादों के बारे में पूछने और शांत बातचीत के लिए आपका साथी।',
        'companion.assistant_name': 'माइंडकेयर साथी',
        'companion.status_available': 'हमेशा उपलब्ध',
        'companion.btn_read_aloud': '🔊 बोलकर सुनाएं',
        'companion.btn_sos': '🚨 आपातकालीन सहायता (SOS)',
        'companion.restart_title': 'बातचीत पुनः शुरू करें',
        'companion.input_placeholder': 'संदेश लिखें या बोलने के लिए माइक दबाएं...',
        'companion.btn_send': 'भेजें',
        'companion.welcome_msg': 'शुभ प्रभात। आज दोपहर 3:30 बजे माया के साथ आपका वीडियो कॉल है, और आपकी सुबह की दवा पूरी हो चुकी है। मैं आपकी क्या मदद कर सकता हूँ?',
        'companion.btn_check_routine': 'दिनचर्या देखें →',
        'companion.btn_view_photos': 'तस्वीरें देखें →',
        'companion.card_routine_sub': 'दवाइयाँ और कार्य',
        'companion.card_memory_sub': 'तस्वीरें और जीवन की कहानियाँ',
        'companion.card_caregiver_sub': 'अवलोकन और संपर्क',

        // Quick prompts
        'prompt.medicines': '💊 कौन सी दवाइयाँ बाकी हैं?',
        'prompt.maya': '❤️ मुझे माया के बारे में बताएं',
        'prompt.schedule': "📅 आज का कार्यक्रम",
        'prompt.confused': '🌿 मुझे उलझन / चिंता महसूस हो रही है',
        'prompt.memories': '🖼️ मेरी पुरानी यादें दिखाएं',
        'prompt.brain': '🧠 हल्का दिमागी अभ्यास',
        'prompt.water': '💧 पानी चाहिए',

        // Routine Page
        'routine.badge': 'समय सारणी',
        'routine.title': 'दैनिक दिनचर्या',
        'routine.subtitle': 'दवाओं, भोजन और गतिविधियों के लिए सरल, पूर्वानुमेय दिनचर्या।',
        'routine.completed_of': 'पूर्ण',
        'routine.filter_all': 'सभी',
        'routine.filter_meds': '💊 दवाइयाँ',
        'routine.filter_activity': '🌿 गतिविधियाँ',
        'routine.filter_meals': '🍲 भोजन',
        'routine.filter_social': '❤️ सामाजिक',
        'routine.status_completed': 'पूर्ण हुआ',
        'routine.status_upcoming': 'आगामी',
        'routine.btn_undo': 'पूर्ववत करें',
        'routine.btn_complete': 'पूरा करें',
        'routine.btn_add': '+ नया अनुस्मारक',
        'routine.empty_msg': 'इस श्रेणी में कोई निर्धारित अनुस्मारक नहीं है।',
        'routine.btn_show_all': 'सभी दिखाएं',
        'routine.ask_companion_title': 'माइंडकेयर से याद दिलाने को कहें',
        'routine.ask_companion_desc': 'जरूरत पड़ने पर आपका साथी आपकी दैनिक दिनचर्या बोलकर सुना सकता है।',
        'routine.btn_talk_companion': 'साथी से बात करें →',

        // Routine Modal
        'routine_modal.title': 'नया अनुस्मारक जोड़ें',
        'routine_modal.label_title': 'अनुस्मारक शीर्षक',
        'routine_modal.placeholder_title': 'उदा., शाम की ब्लड प्रेशर की गोली',
        'routine_modal.label_time': 'समय',
        'routine_modal.label_category': 'श्रेणी',
        'routine_modal.label_notes': 'नोट्स (वैकल्पिक)',
        'routine_modal.placeholder_notes': 'उदा., रात के खाने के बाद एक गिलास पानी के साथ लें',
        'routine_modal.btn_cancel': 'रद्द करें',
        'routine_modal.btn_save': 'सहेजें',

        // Caregiver Page
        'caregiver.header_badge': 'देखभाल अवलोकन',
        'caregiver.header_title': 'केयरगिवर डैशबोर्ड',
        'caregiver.range_today': 'आज',
        'caregiver.range_week': 'सप्ताह',
        'caregiver.range_month': 'महीना',
        'caregiver.stat_medication': 'दवा की याद',
        'caregiver.stat_activities': 'गतिविधियाँ',
        'caregiver.stat_routine': 'दैनिक दिनचर्या',
        'caregiver.stat_safety': 'सुरक्षा स्थिति',
        'caregiver.stat_mood': 'मनोदशा',
        'caregiver.safety_all_clear': 'सब सुरक्षित',
        'caregiver.safety_home_zone': 'होम ज़ोन सक्रिय',
        'caregiver.mood_positive': 'सकारात्मक',
        'caregiver.mood_desc': 'शांत और स्थिर',
        'caregiver.chart_adherence_title': 'दवा अनुपालन रुझान',
        'caregiver.chart_adherence_sub': 'दवा और दिनचर्या पूर्णता दर',
        'caregiver.chart_cognitive_title': 'संज्ञानात्मक क्षेत्र',
        'caregiver.chart_cognitive_sub': 'अभ्यासों का वितरण',
        'caregiver.activity_feed_title': 'आज की गतिविधि फ़ीड',
        'caregiver.activity_feed_sub': 'समय अनुसार देखभाल घटनाएं और दर्ज दिनचर्या',
        'caregiver.btn_full_schedule': 'पूरी समय सारणी →',
        'caregiver.btn_med_plan': 'दवा योजना',
        'caregiver.btn_cog_report': 'संज्ञानात्मक रिपोर्ट',
        'caregiver.btn_safety_perimeter': 'सुरक्षा परिधि',
        'caregiver.btn_test_alert': 'सुरक्षा टेस्ट अलर्ट भेजें',
        'caregiver.disclaimer': 'माइंडकेयर देखभालकर्ताओं और परिवारों के लिए एक सहायक मंच है, न कि चिकित्सक की सलाह का विकल्प।',
        'caregiver.panel_title': 'लाइव अलर्ट',
        'caregiver.panel_clear': 'सभी हटाएं',
        'caregiver.panel_empty': 'अभी कोई अलर्ट नहीं है। पेशेंट की गतिविधि यहाँ लाइव दिखाई देगी।',

        // Common Alerts & Events
        'alert.sos_title': '🚨 आपातकालीन सहायता (SOS)',
        'alert.task_completed': '✅ कार्य पूर्ण हुआ',
        'alert.med_taken': '💊 दवा ली गई',
        'alert.water_needed': '💧 पानी चाहिए',
        'alert.patient_online': '🟢 पेशेंट कनेक्ट हुआ',
        'alert.patient_offline': '⚪ पेशेंट डिस्कनेक्ट हुआ',
        'alert.reminder_added': '📋 अनुस्मारक जोड़ा गया'
    },

    as: {
        // Brand & Header
        'brand.name': 'মাইণ্ডকেয়াৰ (MindCare)',
        'brand.tagline': 'প্ৰতিটো স্মৃতিয়েই গুৰুত্বপূৰ্ণ।',
        'brand.footer_disclaimer': 'মাইণ্ডকেয়াৰ স্মৃতিশক্তি হ্ৰাস পোৱা ব্যক্তি, তেওঁলোকৰ যত্ন লওঁতা আৰু মৰমৰ পৰিয়ালৰ বাবে এটি শান্ত আৰু বিশ্বাসযোগ্য সংগী।',

        // Navigation
        'nav.home': 'গৃহ (Home)',
        'nav.companion': 'ৰোগীৰ সংগী',
        'nav.routine': 'দৈনন্দিন কাৰ্যসূচী',
        'nav.memory': 'স্মৃতি সংগ্ৰহ',
        'nav.caregiver': 'যত্ন লওঁতাৰ ডেশ্ববৰ্ড',
        'nav.assessment': 'মানসিক পৰীক্ষা',
        'nav.login': 'প্ৰৱেশ কৰক',
        'nav.logout': 'প্ৰস্থান কৰক',
        'nav.back': 'উভতি যাওক',
        'nav.start': 'মাইণ্ডকেয়াৰ আৰম্ভ কৰক',

        // Login Page
        'login.title': 'স্বাগতম',
        'login.subtitle': 'আপোনাৰ ভূমিকা নিৰ্বাচন কৰক আৰু আগবাঢ়িবলৈ তথ্য দিয়ক',
        'login.role_label': 'মই এজন…',
        'login.role_patient_title': 'ৰোগীৰ সংগী (Patient)',
        'login.role_patient_desc': 'দৈনন্দিন কাৰ্যসূচী আৰু সহজ সহায়',
        'login.role_caregiver_title': 'যত্ন লওঁতা (Caregiver)',
        'login.role_caregiver_desc': 'স্বাস্থ্য আৰু সুৰক্ষাৰ নিৰীক্ষণ',
        'login.details_divider': 'আপোনাৰ তথ্য',
        'login.name_label': 'ইমেইল / ব্যৱহাৰকাৰীৰ নাম',
        'login.name_placeholder': 'যেনে patient@mindcare.com',
        'login.pin_label': '৪-অংকৰ পিন (PIN)',
        'login.pin_placeholder': '৪-অংকৰ পিন লিখক',
        'login.submit_btn': 'প্ৰৱেশ কৰক',
        'login.footer_note': 'আপোনাৰ তথ্য কেৱল এই ডিভাইচতে সুৰক্ষিত থাকে। কোনো একাউণ্টৰ প্ৰয়োজন নাই।',
        'login.demo_access_label': 'ডেমো তথ্য:',
        'login.demo_patient': 'ৰোগী (patient@mindcare.com / 1234)',
        'login.demo_caregiver': 'যত্ন লওঁতা (caregiver@mindcare.com / 9999)',
        'login.error_empty': 'অনুগ্ৰহ কৰি আগবাঢ়িবলৈ দুয়োটা তথ্য পূৰণ কৰক।',
        'login.error_role': 'অনুগ্ৰহ কৰি এটা ভূমিকা নিৰ্বাচন কৰক।',
        'login.error_patient': 'ভুল ৰোগীৰ তথ্য! ডেমো তথ্য: patient@mindcare.com / 1234',
        'login.error_caregiver': 'ভুল যত্ন লওঁতাৰ তথ্য! ডেমো তথ্য: caregiver@mindcare.com / 9999',

        // Companion Page
        'companion.header_title': 'স্মৃতি সংগী (Memory Companion)',
        'companion.header_subtitle': 'ঔষধৰ সোঁৱৰণী, অতীতৰ স্মৃতি আৰু কথা পাতিবলৈ এটি শান্ত পৰিৱেশ।',
        'companion.assistant_name': 'মাইণ্ডকেয়াৰ সংগী',
        'companion.status_available': 'সদায় উপলব্ধ',
        'companion.btn_read_aloud': '🔊 পঢ়ি শুনোৱা',
        'companion.btn_sos': '🚨 জৰুৰীকালীন সাহায্য (SOS)',
        'companion.restart_title': 'কথোপকথন পুনৰ আৰম্ভ কৰক',
        'companion.input_placeholder': 'বাৰ্তা লিখক বা ক\'বলৈ মাইক টিপক...',
        'companion.btn_send': 'প্ৰেৰণ কৰক',
        'companion.welcome_msg': 'সু-প্ৰভাত। আজি আবেলি ৩:৩০ বজাত মায়াৰ সৈতে আপোনাৰ ভিডিঅ\' কল আছে, আৰু ৰাতিপুৱাৰ ঔষধ লোৱা সম্পূৰ্ণ হৈছে। মই কেনেকৈ সহায় কৰিব পাৰোঁ?',
        'companion.btn_check_routine': 'কাৰ্যসূচী চাওক →',
        'companion.btn_view_photos': 'ছবি চাওক →',
        'companion.card_routine_sub': 'ঔষধ আৰু কামসমূহ',
        'companion.card_memory_sub': 'ছবি আৰু জীৱনৰ কাহিনী',
        'companion.card_caregiver_sub': 'অৱলোকন আৰু যোগাযোগ',

        // Quick prompts
        'prompt.medicines': '💊 কোনবোৰ ঔষধৰ সময় হৈছে?',
        'prompt.maya': '❤️ মায়াৰ বিষয়ে কওক',
        'prompt.schedule': "📅 আজিৰ কাৰ্যসূচী",
        'prompt.confused': '🌿 মই কিছু বিভ্ৰান্ত বোধ কৰিছোঁ',
        'prompt.memories': '🖼️ মোৰ স্মৃতিসমূহ দেখুৱাওক',
        'prompt.brain': '🧠 সহজ মানসিক অনুশীলন',
        'prompt.water': '💧 পানী লাগে',

        // Routine Page
        'routine.badge': 'কাৰ্যসূচী',
        'routine.title': 'দৈনন্দিন কাৰ্যসূচী',
        'routine.subtitle': 'ঔষধ, আহাৰ আৰু দৈনিক কামৰ বাবে নিয়মীয়া আৰু শান্ত ব্যৱস্থা।',
        'routine.completed_of': 'সম্পূৰ্ণ',
        'routine.filter_all': 'সকলো',
        'routine.filter_meds': '💊 ঔষধৰ সময়',
        'routine.filter_activity': '🌿 কাম-কাজ',
        'routine.filter_meals': '🍲 আহাৰ',
        'routine.filter_social': '❤️ সামাজিক',
        'routine.status_completed': 'সম্পূৰ্ণ হ\'ল',
        'routine.status_upcoming': 'অনাগত',
        'routine.btn_undo': 'বাতিল কৰক',
        'routine.btn_complete': 'সম্পূৰ্ণ কৰক',
        'routine.btn_add': '+ নতুন সোঁৱৰণী',
        'routine.empty_msg': 'এই বিভাগত কোনো সোঁৱৰণী নাই।',
        'routine.btn_show_all': 'সকলো দেখুৱাওক',
        'routine.ask_companion_title': 'মাইণ্ডকেয়াৰক সোঁৱৰণী পঢ়ি শুনাবলৈ কওক',
        'routine.ask_companion_desc': 'আপোনাৰ সংগীয়ে প্ৰয়োজন অনুসৰি আপোনাৰ দৈনিক সোঁৱৰণীসমূহ পঢ়ি শুনাব পাৰে।',
        'routine.btn_talk_companion': 'সংগীৰ সৈতে কথা পাতক →',

        // Routine Modal
        'routine_modal.title': 'সোঁৱৰণী যোগ কৰক',
        'routine_modal.label_title': 'সোঁৱৰণীৰ নাম',
        'routine_modal.placeholder_title': 'যেনে, সন্ধিয়াৰ ৰক্তচাপৰ ঔষধ',
        'routine_modal.label_time': 'সময়',
        'routine_modal.label_category': 'শ্ৰেণী',
        'routine_modal.label_notes': 'টোকা (ঐচ্ছিক)',
        'routine_modal.placeholder_notes': 'যেনে, ৰাতিৰ সাজ খোৱাৰ পিছত এক গিলাচ পানীৰে ল\'ব',
        'routine_modal.btn_cancel': 'বাতিল',
        'routine_modal.btn_save': 'সংৰক্ষণ কৰক',

        // Caregiver Page
        'caregiver.header_badge': 'যত্ন লোৱাৰ অৱলোকন',
        'caregiver.header_title': 'যত্ন লওঁতাৰ ডেশ্ববৰ্ড',
        'caregiver.range_today': 'আজি',
        'caregiver.range_week': 'সপ্তাহ',
        'caregiver.range_month': 'মাহ',
        'caregiver.stat_medication': 'ঔষধৰ সময়',
        'caregiver.stat_activities': 'কাম-কাজ',
        'caregiver.stat_routine': 'দৈনন্দিন কাৰ্যসূচী',
        'caregiver.stat_safety': 'সুৰক্ষা স্থিতি',
        'caregiver.stat_mood': 'মনৰ অৱস্থা',
        'caregiver.safety_all_clear': 'সকলো ঠিক আছে',
        'caregiver.safety_home_zone': 'গৃহ সুৰক্ষা এলেকা সক্ৰিয়',
        'caregiver.mood_positive': 'ইতিবাচক',
        'caregiver.mood_desc': 'শান্ত আৰু স্থিৰ',
        'caregiver.chart_adherence_title': 'নিয়মীয়তাৰ অগ্ৰগতি',
        'caregiver.chart_adherence_sub': 'ঔষধ আৰু কাৰ্যসূচী সমাপ্তিৰ হাৰ',
        'caregiver.chart_cognitive_title': 'মানসিক বিভাগসমূহ',
        'caregiver.chart_cognitive_sub': 'অনুশীলনসমূহৰ বিভাজন',
        'caregiver.activity_feed_title': 'আজিৰ সক্ৰিয়তাৰ তালিকা',
        'caregiver.activity_feed_sub': 'সময় অনুসৰি হোৱা ঘটনা আৰু কামৰ তথ্য',
        'caregiver.btn_full_schedule': 'সম্পূৰ্ণ কাৰ্যসূচী →',
        'caregiver.btn_med_plan': 'ঔষধৰ পৰিকল্পনা',
        'caregiver.btn_cog_report': 'মানসিক প্ৰতিবেদন',
        'caregiver.btn_safety_perimeter': 'সুৰক্ষা সীমা',
        'caregiver.btn_test_alert': 'সুৰক্ষা পৰীক্ষা সতৰ্কবাৰ্তা',
        'caregiver.disclaimer': 'মাইণ্ডকেয়াৰ যত্ন লওঁতা আৰু পৰিয়ালৰ বাবে এটি সহায়ক প্ৰযুক্তি, চিকিৎসকৰ পৰামৰ্শৰ বিকল্প নহয়।',
        'caregiver.panel_title': 'সরাসৰি সতৰ্কবাৰ্তা',
        'caregiver.panel_clear': 'সকলো মচক',
        'caregiver.panel_empty': 'এতিয়ালৈকে কোনো সতৰ্কবাৰ্তা নাই। ৰোগীৰ সক্ৰিয়তা ইয়াত প্ৰকাশ পাব।',

        // Common Alerts & Events
        'alert.sos_title': '🚨 জৰুৰীকালীন সাহায্য (SOS)',
        'alert.task_completed': '✅ কাম সম্পূৰ্ণ হ\'ল',
        'alert.med_taken': '💊 ঔষধ গ্ৰহণ কৰা হ\'ল',
        'alert.water_needed': '💧 পানী লাগে',
        'alert.patient_online': '🟢 ৰোগী সংযুক্ত হ\'ল',
        'alert.patient_offline': '⚪ ৰোগী সংযোগ বিচ্ছিন্ন হ\'ল',
        'alert.reminder_added': '📋 নতুন সোঁৱৰণী যোগ কৰা হ\'ল'
    }
};

/**
 * Global MindCare i18n Controller
 */
const MindCareI18n = (function () {
    'use strict';

    const STORAGE_KEY = 'mindcare_lang';
    const SUPPORTED_LANGS = ['en', 'hi', 'as'];
    const DEFAULT_LANG = 'en';

    let currentLang = DEFAULT_LANG;

    function init() {
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
            currentLang = savedLang;
        } else {
            currentLang = DEFAULT_LANG;
        }

        document.documentElement.setAttribute('lang', currentLang);
        applyTranslations();
        bindLanguageSwitchers();
    }

    function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.setAttribute('lang', lang);
        applyTranslations();
        syncSwitcherUI();

        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('mindcare:language-changed', {
            detail: { language: lang }
        }));
    }

    function getLanguage() {
        return currentLang;
    }

    function t(key, fallback = '') {
        const dict = MindCareTranslations[currentLang] || MindCareTranslations.en;
        if (dict && dict[key] !== undefined) {
            return dict[key];
        }
        // Fallback to English
        const enDict = MindCareTranslations.en;
        if (enDict && enDict[key] !== undefined) {
            return enDict[key];
        }
        return fallback || key;
    }

    function applyTranslations(root = document) {
        // 1. Text content nodes
        const textElements = root.querySelectorAll('[data-i18n]');
        textElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key);
            if (translation) {
                // If element has nested elements and we want only text or full HTML
                el.textContent = translation;
            }
        });

        // 2. Placeholder attributes
        const placeholderElements = root.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = t(key);
            if (translation) {
                el.setAttribute('placeholder', translation);
            }
        });

        // 3. Title / aria-label attributes
        const titleElements = root.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = t(key);
            if (translation) {
                el.setAttribute('title', translation);
                el.setAttribute('aria-label', translation);
            }
        });
    }

    function bindLanguageSwitchers() {
        const switchers = document.querySelectorAll('.lang-select, select[data-lang-switcher]');
        switchers.forEach(select => {
            select.value = currentLang;
            select.addEventListener('change', (e) => {
                setLanguage(e.target.value);
            });
        });

        // Button group switchers (.lang-btn[data-lang])
        const langBtns = document.querySelectorAll('.lang-btn[data-lang]');
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
            btn.addEventListener('click', () => {
                setLanguage(btn.getAttribute('data-lang'));
            });
        });
    }

    function syncSwitcherUI() {
        const switchers = document.querySelectorAll('.lang-select, select[data-lang-switcher]');
        switchers.forEach(select => {
            select.value = currentLang;
        });

        const langBtns = document.querySelectorAll('.lang-btn[data-lang]');
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
        });
    }

    return {
        init,
        setLanguage,
        getLanguage,
        t,
        applyTranslations,
        syncSwitcherUI,
        translations: MindCareTranslations
    };
})();

// Auto-initialize on script load if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MindCareI18n.init());
} else {
    MindCareI18n.init();
}
