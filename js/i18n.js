/**
 * Antigravity i18n Translation Engine
 * Lorenzo Kraja Portfolio (IT / EN)
 */

(function () {
    const USER_KEY = 'portfolio_user_selected_lang';
    const STORAGE_KEY = 'portfolio_lang';
    let currentLang = localStorage.getItem(USER_KEY) || 'en';

    const DICTIONARY = {
        it: {
            // Navigation
            'nav.home': 'Lorenzo Kraja',
            'nav.contact': 'Contatti',
            'nav.motionReel': 'Motion Reel',
            'nav.harpChair': 'Harp Chair',
            'nav.mikk': 'Mikk',
            'nav.jewelry': 'Jewelry',
            'nav.about': 'CHI SONO',
            'nav.backHome': '← Torna alla Home',
            'nav.openProject': 'Apri Progetto →',
            'nav.fullProject': 'Progetto Completo ↗',
            'nav.nextProject': 'Prossimo Progetto:',

            // Window Chrome
            'win.menu.file': 'File',
            'win.menu.edit': 'Modifica',
            'win.menu.view': 'Vista',
            'win.menu.go': 'Vai',
            'win.menu.help': 'Aiuto',

            // Popovers & Meta
            'popover.harp.tag': 'Sedia Monoscocca & Corde Windsor',
            'popover.mikk.tag': 'Auto Elettrica Urbana Sostenibile',
            'popover.jewelry.tag': 'Argento 925 Scultoreo & Hardware',

            // Contact Dropdown
            'contact.title': 'Contatti & Informazioni',
            'contact.emailLabel': 'Email Diretta:',
            'contact.phoneLabel': 'Telefono:',
            'contact.locationLabel': 'Sede: Roma, Italia',
            'contact.status': 'Disponibile per commissioni e collaborazioni',

            // Marquee
            'marquee.text': 'SONO LORENZO, E SONO UN PRODUCT E JEWELRY DESIGNER. PROGETTO PRODOTTI E ACCESSORI CON METICOLOSA ATTENZIONE AI DETTAGLI, UNENDO IL DESIGN PURO A UN FORTE FOCUS SULLE PROPORZIONI, SUI MATERIALI E SULLA SENSIBILITÀ STRUTTURALE.',

            // Footer
            'footer.rights': 'Tutti i diritti riservati',
            'footer.contactLine': 'Contatti • Instagram, LinkedIn, Email',

            // Harp Chair Page
            'harp.discipline': '• DESIGN DEL PRODOTTO & ARREDO',
            'harp.mission.tag': 'STATEMENT & MISSION',
            'harp.mission.text': 'La mia missione è progettare una sedia monoscocca in polipropilene impilabile e ideale per l\'outdoor in luoghi storici. Ispirata alle sedie Windsor del XVII secolo, con il caratteristico schienale a pettine e le gambe integrate nella seduta, questa sedia combina l\'eleganza storica con il design contemporaneo delle sedute a guscio. Riprende inoltre le forme smussate e squadrate dell\'arpa, offrendo una soluzione pratica e stilisticamente raffinata.',
            'harp.gif.title': '—— ANIMAZIONI 3D • DETTAGLI MECCANICI',
            'harp.gif.hero': '—— A-HARP-01 • ANIMAZIONE 360° • STUDIO CINEMATICO',
            'harp.gif.p2': '—— A-HARP-02 • INNESTI & SNODI • FRESATURA CNC',
            'harp.gif.p3': '—— A-HARP-03 • SCHIENALE & CURVATURA • FLESSIONE STRUTTURALE',
            'harp.windsor.tag': 'PARALLELO WINDSOR & MODERNITÀ',
            'harp.windsor.text': 'Le curve eleganti e i sottili listelli del design Windsor si fondono in un affascinante parallelo visivo, dando vita a una sedia che coniuga tradizione e modernità con praticità e stile.',
            'harp.p4.title': '—— A-HARP-04 • VISTA FRONTALE SCULTOREA',
            'harp.p5.title': '—— A-HARP-05 • PROFILO & TENSIONE STRUTTURALE',
            'harp.p6.title': '—— A-HARP-06 • DETTAGLIO SNODI & INNESTI MECCANICI',
            'harp.p7.title': '—— A-HARP-07 • VISTA ASSONOMETRICA',
            'harp.p8.title': '—— A-HARP-08 • TEXTURE & ANODIZZAZIONE SATINATA',
            'harp.p9.title': '—— A-HARP-09 • MACRO STRUTTURALE & RIFINITURA BORDI',
            'harp.p10.title': '—— A-HARP-10 • VISTA AMBIENTATA OUTDOOR & SCENARIO STORICO',
            'harp.next': 'Prossimo Progetto: MIKK (2023) →',

            // Mikk Page
            'mikk.discipline': '• DESIGN MOBILITÀ SOSTENIBILE & AUTOMOTIVE',
            'mikk.concept.tag': 'STATEMENT & CONCEPT',
            'mikk.vision.text': 'L\'attuale progresso potrebbe non essere sostenibile per il pianeta, specialmente nel settore automobilistico che punta su grandi veicoli elettrici. La mia idea è trasformare le abitudini attuali verso qualcosa di più sostenibile per il pianeta e l\'umanità: auto più piccole, leggere ed efficienti.',
            'mikk.arch.text': '“Mikk” è elettrica ed è perfetta per quattro persone, progettata per l\'uso quotidiano. Consuma poca energia ed è leggera, anche con un pacco batterie medio-piccolo. È dotata di trazione anteriore per una maggiore agilità in città.',
            'mikk.p1.title': '—— A-MIKK-01 • SILHOUETTE FRONTALE & FIRMA LUMINOSA',
            'mikk.p2.title': '—— A-MIKK-02 • SCHIZZI DI CONCEPT & STUDIO PROPORZIONI',
            'mikk.p3.title': '—— A-MIKK-03 • RENDERING DIGITALE & SVILUPPO FORME',
            'mikk.p4.title': '—— A-MIKK-04 • PROFILO LATERALE & SILHOUETTE AERODINAMICA',
            'mikk.p5.title': '—— A-MIKK-05 • 3D STUDIO RENDER & VOLUME 4 POSTI COMPATTO',
            'mikk.p6.title': '—— A-MIKK-06 • TRE QUARTI POSTERIORE & ARCHITETTURA LUCI',
            'mikk.p7.title': '—— A-MIKK-07 • CONTESTO URBANO & ATTRAVERSAMENTO PEDONALE',
            'mikk.p8.title': '—— A-MIKK-08 • PROFILO CINEMATOGRAFICO & SCALA UMANA',
            'mikk.p9.title': '—— A-MIKK-09 • ILLUMINAZIONE CREPUSCOLARE & COLORAZIONE METALLICA',
            'mikk.p10.title': '—— A-MIKK-10 • CONFRONTO NEL TRAFFICO & INGOMBRO RIDOTTO',
            'mikk.p11.title': '—— A-MIKK-11 • TRAFFICO URBANO & AGILITÀ A TRAZIONE ANTERIORE',
            'mikk.specs.text': 'Powertrain 100% elettrico, trazione anteriore, telaio alleggerito, architettura compatta a 4 posti.',
            'mikk.next': 'Prossimo Progetto: JEWELRY (2025) →',

            // Jewelry Page
            'jewelry.discipline': '• OREFICERIA CONTEMPORANEA & HARDWARE',
            'jewelry.concept.tag': 'STATEMENT & MICROFUSIONE A CERA PERSA',
            'jewelry.concept.text': 'Jewelry nasce dalla ricerca sulla scultura indossabile come estensione del corpo e del segno grafico nello spazio.',
            'jewelry.comingSoon': 'PROGETTO IN LAVORAZIONE / COMING SOON',
            'jewelry.previewStatus': '— Esplorato attraverso la microfusione a cera persa in argento 925 e lavorazioni meccaniche sottrattive.',
            'jewelry.next': 'Prossimo Progetto: HARP CHAIR (2025) →'
        },

        en: {
            // Navigation
            'nav.home': 'Lorenzo Kraja',
            'nav.contact': 'Contact',
            'nav.motionReel': 'Motion Reel',
            'nav.harpChair': 'Harp Chair',
            'nav.mikk': 'Mikk',
            'nav.jewelry': 'Jewelry',
            'nav.about': 'ABOUT',
            'nav.backHome': '← Back to Home',
            'nav.openProject': 'Open Project →',
            'nav.fullProject': 'Full Project ↗',
            'nav.nextProject': 'Next Project:',

            // Window Chrome
            'win.menu.file': 'File',
            'win.menu.edit': 'Edit',
            'win.menu.view': 'View',
            'win.menu.go': 'Go',
            'win.menu.help': 'Help',

            // Popovers & Meta
            'popover.harp.tag': 'Monocoque Chair & Windsor Shell',
            'popover.mikk.tag': 'Sustainable Electric City Car',
            'popover.jewelry.tag': 'Sculptural 925 Silver & Hardware',

            // Contact Dropdown
            'contact.title': 'Contact & Inquiries',
            'contact.emailLabel': 'Direct Email:',
            'contact.phoneLabel': 'Phone:',
            'contact.locationLabel': 'Location: Rome, Italy',
            'contact.status': 'Available for commissions & collaborations',

            // Marquee
            'marquee.text': 'I\'M LORENZO, AND I\'M A PRODUCT AND JEWELRY DESIGNER. I DESIGN PRODUCTS AND ACCESSORIES WITH METICULOUS ATTENTION TO DETAIL, COMBINING PURE DESIGN WITH A STRONG FOCUS ON PROPORTIONS, MATERIALS, AND STRUCTURAL SENSITIVITY.',

            // Footer
            'footer.rights': 'All rights reserved',
            'footer.contactLine': 'Contact • Instagram, LinkedIn, Email',

            // Harp Chair Page
            'harp.discipline': '• PRODUCT & FURNITURE DESIGN',
            'harp.mission.tag': 'STATEMENT & MISSION',
            'harp.mission.text': 'My mission is to design a polypropylene monocoque chair that is stackable and perfect for outdoor use in historic venues. Inspired by 17th-century Windsor chairs, with their distinctive comb back and legs integrated into the seat, this chair combines historic elegance with the contemporary design of shell chairs. It also echoes the beveled, squared-off forms of the harp, offering a practical and stylistically refined solution.',
            'harp.gif.title': '—— 3D ANIMATIONS • MECHANICAL DETAILS',
            'harp.gif.hero': '—— A-HARP-01 • 360° ANIMATION • CINEMATIC STUDY',
            'harp.gif.p2': '—— A-HARP-02 • JOINERY & NODES • CNC MILLING',
            'harp.gif.p3': '—— A-HARP-03 • BACKREST & CURVATURE • STRUCTURAL FLEX',
            'harp.windsor.tag': 'WINDSOR PARALLEL & MODERNITY',
            'harp.windsor.text': 'The elegant curves and slender sticks of the Windsor design merge into a fascinating visual parallel, creating a chair that combines tradition and modernity with practicality and style.',
            'harp.p4.title': '—— A-HARP-04 • SCULPTURAL FRONT ELEVATION',
            'harp.p5.title': '—— A-HARP-05 • PROFILE & MONOCOQUE GEOMETRY',
            'harp.p6.title': '—— A-HARP-06 • JOINT DETAILS & LEG INTEGRATION',
            'harp.p7.title': '—— A-HARP-07 • AXONOMETRIC VIEW',
            'harp.p8.title': '—— A-HARP-08 • TEXTURE & SURFACE FINISH',
            'harp.p9.title': '—— A-HARP-09 • STRUCTURAL MACRO & EDGE DETAILING',
            'harp.p10.title': '—— A-HARP-10 • OUTDOOR CONTEXT & HISTORIC VENUE',
            'harp.next': 'Next Project: MIKK (2023) →',

            // Mikk Page
            'mikk.discipline': '• SUSTAINABLE MOBILITY & AUTOMOTIVE DESIGN',
            'mikk.concept.tag': 'STATEMENT & CONCEPT',
            'mikk.vision.text': 'Current progress may not be sustainable for the planet, especially in the automotive sector, which focuses on large electric vehicles. My idea is to transform current habits into something more sustainable for the planet and humanity: smaller, lighter, and more efficient cars.',
            'mikk.arch.text': '“Mikk” is electric and is perfect for four people, designed for everyday use. It consumes little fuel and is lightweight, even with a small-to-medium battery pack. It also features front-wheel drive for improved agility in town.',
            'mikk.p1.title': '—— A-MIKK-01 • FRONT SILHOUETTE & ILLUMINATED SIGNATURE',
            'mikk.p2.title': '—— A-MIKK-02 • CONCEPT SKETCHES & PROPORTION STUDIES',
            'mikk.p3.title': '—— A-MIKK-03 • DIGITAL RENDERING & FORM DEVELOPMENT',
            'mikk.p4.title': '—— A-MIKK-04 • SIDE ELEVATION & AERODYNAMIC SILHOUETTE',
            'mikk.p5.title': '—— A-MIKK-05 • 3D STUDIO RENDER & COMPACT 4-SEATER VOLUME',
            'mikk.p6.title': '—— A-MIKK-06 • REAR THREE-QUARTER & LIGHTING ARCHITECTURE',
            'mikk.p7.title': '—— A-MIKK-07 • URBAN CONTEXT & PEDESTRIAN CROSSING',
            'mikk.p8.title': '—— A-MIKK-08 • CINEMATIC SIDE PROFILE & HUMAN SCALE',
            'mikk.p9.title': '—— A-MIKK-09 • DUSK LIGHTING & METALLIC LIVERY',
            'mikk.p10.title': '—— A-MIKK-10 • URBAN TRAFFIC COMPARISON & COMPACT FOOTPRINT',
            'mikk.p11.title': '—— A-MIKK-11 • ONCOMING TRAFFIC & FRONT-WHEEL DRIVE AGILITY',
            'mikk.specs.text': 'Full-electric powertrain, front-wheel drive, lightweight chassis, 4-occupant compact architecture.',
            'mikk.next': 'Next Project: JEWELRY (2025) →',

            // Jewelry Page
            'jewelry.discipline': '• CONTEMPORARY JEWELRY & HARDWARE',
            'jewelry.concept.tag': 'STATEMENT & LOST-WAX CASTING',
            'jewelry.concept.text': 'Jewelry originates from research on wearable sculpture as an extension of the human body and graphic gesture in space.',
            'jewelry.comingSoon': 'WORK IN PROGRESS / COMING SOON',
            'jewelry.previewStatus': '— Explored through 925 sterling silver lost-wax casting and subtractive CNC machining.',
            'jewelry.next': 'Next Project: HARP CHAIR (2025) →'
        }
    };

    function t(key) {
        const lang = currentLang in DICTIONARY ? currentLang : 'en';
        return DICTIONARY[lang][key] || key;
    }

    function applyTranslations(lang, isUserAction = false) {
        currentLang = lang;
        if (isUserAction) {
            localStorage.setItem(USER_KEY, lang);
        }
        localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;

        // Update all toggle buttons
        document.querySelectorAll('.mac-lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === lang) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        // Translate elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (val) {
                el.innerHTML = val;
            }
        });

        // Translate elements with explicit data-it and data-en
        document.querySelectorAll('[data-it][data-en]').forEach(el => {
            const val = el.getAttribute(`data-${lang}`);
            if (val) {
                el.innerHTML = val;
            }
        });

        // Dispatch event for dynamic apps like main.js desktop
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    function init() {
        // Bind click events on all language switch buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.mac-lang-btn');
            if (btn) {
                const targetLang = btn.getAttribute('data-lang');
                if (targetLang && targetLang !== currentLang) {
                    applyTranslations(targetLang, true);
                }
            }
        });

        applyTranslations(currentLang, false);
    }

    // Expose global API
    window.I18N = {
        getLang: () => currentLang,
        setLang: applyTranslations,
        t: t,
        dictionary: DICTIONARY
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
