/* ============================================================
   PORTFOLIO — Main JavaScript
   ============================================================ */

// --------------- Configuration (easy to edit) ---------------
const CONFIG = {
    designerName: "Lorenzo Kraja",
    timezoneLabel: "RM",
    timezoneIANA: "Europe/Rome",
    bioText:
        "Curious by nature and attentive to every detail, I base my work on observation and research. I turn my constant desire to learn into new practical skills, applying them directly to the development and growth of every project.",
    statementTicker:
        "Hi! My name is Lorenzo, and I'm a product and jewelry designer. I design products and accessories with meticulous attention to every detail, combining pure design with a strong focus on visual presentation and brand identity.",
    motionReel: "images/reel/3D printed shoe project.mp4",
    reelPoster: "images/reel/shoe_poster.jpg",
    curriculumPdf: "assets/cv_lorenzo_kraja.pdf",
    footerLeft: "Instagram, LinkedIn, Email",
    footerCenter: "© 2026",
    footerRight: "All rights reserved",
};

const PROJECTS = [
    {
        title: "Harp Chair",
        url: "harp-chair.html",
        meta: "Design del Prodotto & Arredo, 2025",
        meta_it: "Design del Prodotto & Arredo, 2025",
        meta_en: "Product & Furniture Design, 2025",
        description:
            "La mia missione è progettare una sedia monoscocca in polipropilene impilabile e ideale per l'outdoor in luoghi storici. Ispirata alle sedie Windsor del XVII secolo, con il caratteristico schienale a pettine e le gambe integrate nella seduta, questa sedia combina l'eleganza storica con il design contemporaneo delle sedute a guscio. Riprende inoltre le forme smussate e squadrate dell'arpa, offrendo una soluzione pratica e stilisticamente raffinata.\n\nLe curve eleganti e i sottili listelli del design Windsor si fondono in un affascinante parallelo visivo, dando vita a una sedia che coniuga tradizione e modernità con praticità e stile.",
        description_it:
            "La mia missione è progettare una sedia monoscocca in polipropilene impilabile e ideale per l'outdoor in luoghi storici. Ispirata alle sedie Windsor del XVII secolo, con il caratteristico schienale a pettine e le gambe integrate nella seduta, questa sedia combina l'eleganza storica con il design contemporaneo delle sedute a guscio. Riprende inoltre le forme smussate e squadrate dell'arpa, offrendo una soluzione pratica e stilisticamente raffinata.\n\nLe curve eleganti e i sottili listelli del design Windsor si fondono in un affascinante parallelo visivo, dando vita a una sedia che coniuga tradizione e modernità con praticità e stile.",
        description_en:
            "My mission is to design a polypropylene monocoque chair that is stackable and perfect for outdoor use in historic venues. Inspired by 17th-century Windsor chairs, with their distinctive comb back and legs integrated into the seat, this chair combines historic elegance with the contemporary design of shell chairs. It also echoes the beveled, squared-off forms of the harp, offering a practical and stylistically refined solution.\n\nThe elegant curves and slender sticks of the Windsor design merge into a fascinating visual parallel, creating a chair that combines tradition and modernity with practicality and style.",
        items: [
            {
                image: "images/harp-chair/01.gif",
                video: "images/harp-chair/01.mp4",
                caption: "HARP_01.GIF",
                aspect: "landscape",
                overlayLeft: "HARP CHAIR",
                overlayCenter: "FURNITURE DESIGN",
                overlayRight: "2025",
                duration: 4700,
            },
            {
                image: "images/harp-chair/02.gif",
                video: "images/harp-chair/02.mp4",
                caption: "HARP_02.GIF",
                aspect: "landscape",
                duration: 2100,
            },
            {
                image: "images/harp-chair/03.gif",
                video: "images/harp-chair/03.mp4",
                caption: "HARP_03.GIF",
                aspect: "landscape",
                duration: 2100,
            },
        ],
    },
    {
        title: "Mikk",
        url: "mikk.html",
        meta: "Design Mobilità Sostenibile, 2023",
        meta_it: "Design Mobilità Sostenibile, 2023",
        meta_en: "Sustainable Mobility Design, 2023",
        description:
            "L'attuale progresso potrebbe non essere sostenibile per il pianeta, specialmente nel settore automobilistico che punta su grandi veicoli elettrici. La mia idea è trasformare le abitudini attuali verso qualcosa di più sostenibile per il pianeta e l'umanità: auto più piccole, leggere ed efficienti.\n\n“Mikk” è elettrica ed è perfetta per quattro persone, progettata per l'uso quotidiano. Consuma poca energia ed è leggera, anche con un pacco batterie medio-piccolo. È dotata di trazione anteriore per una maggiore agilità in città.",
        description_it:
            "L'attuale progresso potrebbe non essere sostenibile per il pianeta, specialmente nel settore automobilistico che punta su grandi veicoli elettrici. La mia idea è trasformare le abitudini attuali verso qualcosa di più sostenibile per il pianeta e l'umanità: auto più piccole, leggere ed efficienti.\n\n“Mikk” è elettrica ed è perfetta per quattro persone, progettata per l'uso quotidiano. Consuma poca energia ed è leggera, anche con un pacco batterie medio-piccolo. È dotata di trazione anteriore per una maggiore agilità in città.",
        description_en:
            "Current progress may not be sustainable for the planet, especially in the automotive sector, which focuses on large electric vehicles. My idea is to transform current habits into something more sustainable for the planet and humanity: smaller, lighter, and more efficient cars.\n\n\"Mikk\" is electric and is perfect for four people, designed for everyday use. It consumes little fuel and is lightweight, even with a small-to-medium battery pack. It also features front-wheel drive for improved agility in town.",
        items: [
            {
                image: "images/nomod/Presentazione Tesi_Page_01.png",
                caption: "MIKK_01.PNG",
                aspect: "landscape",
            },
            {
                image: "images/nomod/Presentazione Tesi_Page_12.png",
                caption: "MIKK_12.PNG",
                aspect: "landscape",
            },
            {
                image: "images/nomod/Presentazione Tesi_Page_18.png",
                caption: "MIKK_18.PNG",
                aspect: "landscape",
            },
            {
                image: "images/nomod/Presentazione Tesi_Page_23.png",
                caption: "MIKK_23.PNG",
                aspect: "landscape",
            },
        ],
    },
    {
        title: "Jewelry",
        url: "jewelry.html",
        meta: "Oreficeria Contemporanea & Scultura, 2025",
        meta_it: "Oreficeria Contemporanea & Scultura, 2025",
        meta_en: "Contemporary Sculptural Jewelry, 2025",
        description:
            "Jewelry esplora la gioielleria scultorea contemporanea, fondendo microfusione in argento 925, lavorazioni meccaniche di precisione e dettagli anatomici d'avanguardia.",
        description_it:
            "Jewelry esplora la gioielleria scultorea contemporanea, fondendo microfusione in argento 925, lavorazioni meccaniche di precisione e dettagli anatomici d'avanguardia.",
        description_en:
            "Jewelry explores contemporary sculptural jewelry, fusing 925 sterling silver lost-wax casting, precision mechanical hardware, and avant-garde anatomical details.",
        items: [
            {
                image: "images/Jewelry/1.jpg",
                caption: "JWL_01.JPG",
                aspect: "tall",
                overlayLeft: "JEWELRY",
                overlayCenter: "SCULPTURAL JEWELRY",
                overlayRight: "2025",
            },
            {
                image: "images/Jewelry/2.png",
                caption: "JWL_02.PNG",
                aspect: "landscape",
            },
            {
                image: "images/Jewelry/3.png",
                caption: "JWL_03.PNG",
                aspect: "landscape",
            },
            {
                image: "images/Jewelry/4.png",
                caption: "JWL_04.PNG",
                aspect: "landscape",
            },
            {
                image: "images/Jewelry/5_6_joined.jpg",
                caption: "JWL_05.JPG",
                aspect: "landscape",
            },
            {
                image: "images/Jewelry/6008163273330592822.jpg",
                caption: "JWL_06.JPG",
                aspect: "landscape",
            },
            {
                image: "images/Jewelry/7.png",
                caption: "JWL_07.PNG",
                aspect: "tall",
            },
            {
                image: "images/Jewelry/ring_render.png",
                caption: "JWL_08.PNG",
                aspect: "tall",
            },
            {
                image: "images/Jewelry/ring_craft.jpg",
                caption: "JWL_09.JPG",
                aspect: "tall",
            },
            {
                image: "images/Jewelry/8_bw_blur.png",
                caption: "JWL_10.PNG [COMING SOON]",
                aspect: "landscape",
            },
        ],
    },
];

// Helper functions for i18n project fields
function getProjectMeta(idx) {
    const lang = (window.I18N && window.I18N.getLang()) || localStorage.getItem('portfolio_user_selected_lang') || localStorage.getItem('portfolio_lang') || 'en';
    const proj = PROJECTS[idx];
    if (!proj) return "";
    return lang === 'en' ? (proj.meta_en || proj.meta) : (proj.meta_it || proj.meta);
}

function getProjectDescription(idx) {
    const lang = (window.I18N && window.I18N.getLang()) || localStorage.getItem('portfolio_user_selected_lang') || localStorage.getItem('portfolio_lang') || 'en';
    const proj = PROJECTS[idx];
    if (!proj) return "";
    return lang === 'en' ? (proj.description_en || proj.description) : (proj.description_it || proj.description);
}

// --------------- Live Clock --------------------------------
function startClock() {
    const el = document.getElementById("live-clock");
    if (!el) return;

    const tick = () => {
        try {
            const now = new Date();
            el.textContent =
                new Intl.DateTimeFormat("en-US", {
                    timeZone: CONFIG.timezoneIANA,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                }).format(now) +
                " " +
                CONFIG.timezoneLabel;
        } catch {
            el.textContent = "08:22:30 " + CONFIG.timezoneLabel;
        }
    };

    tick();
    setInterval(tick, 1000);
}

// --------------- Render helpers ----------------------------
function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function renderMediaItem(item) {
    const aspect = item.aspect || "tall";
    const overlay =
        item.overlayLeft
            ? `<div class="nb-overlay-text">
                   <span>${escapeHTML(item.overlayLeft || "")}</span>
                   <span>${escapeHTML(item.overlayCenter || "")}</span>
                   <span>${escapeHTML(item.overlayRight || "")}</span>
               </div>`
            : "";

    return `
        <div class="nb-media-item">
            <div class="nb-media-box nb-aspect-${aspect}">
                ${item.image ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.caption || "")}" loading="lazy">` : ""}
                ${overlay}
            </div>
            <span class="nb-caption">${escapeHTML(item.caption || "")}</span>
        </div>`;
}

function renderProject(proj, idx) {
    const items = proj.items || [];
    const allItems = items.map(renderMediaItem).join("");

    // Split meta into category and year (e.g. "Jewelry, 2025")
    const metaParts = (proj.meta || "").split(",").map(s => s.trim());
    const category = metaParts[0] || "";
    const year = metaParts[1] || "";

    const titleHtml = proj.url
        ? `<a href="${escapeHTML(proj.url)}" class="nb-project-title-link" title="Apri pagina progetto">${escapeHTML(proj.title)} &rarr;</a>`
        : `<span class="nb-meta-title">${escapeHTML(proj.title)}</span>`;

    const metaHtml = `
        ${titleHtml}
        ${category ? `<span class="nb-meta-sep">,</span><span class="nb-meta-category">${escapeHTML(category)}</span>` : ""}
        ${year ? `<span class="nb-meta-sep">,</span><span class="nb-meta-year">${escapeHTML(year)}</span>` : ""}
    `;

    // Smart placement of "full project" button:
    // Desktop (4 cols): if row full (items % 4 === 0), place under last photo (Col 4); else adjacent in next col
    // Mobile (2 cols with hero): if row full ((items - 1) % 2 === 0), place under last photo (Col 2); else adjacent in Col 2
    const numItems = items.length;
    const isDeskFull = (numItems % 4 === 0);
    const isMobFull = ((numItems - 1) % 2 === 0);

    const actionItemClass = [
        "nb-media-item",
        "nb-media-action-item",
        isDeskFull ? "nb-action-under-desk" : "nb-action-adj-desk",
        isMobFull ? "nb-action-under-mob" : "nb-action-adj-mob"
    ].join(" ");

    const actionItemHtml = `
        <div class="${actionItemClass}">
            <div class="nb-action-slot">
                <a href="${escapeHTML(proj.url || '#')}" class="nb-btn-full-project" aria-label="Visualizza progetto completo ${escapeHTML(proj.title)}">
                    <span class="nb-btn-bracket">[</span>
                    <span class="nb-btn-full-text">full project</span>
                    <span class="nb-btn-full-arrow">&rarr;</span>
                    <span class="nb-btn-bracket">]</span>
                </a>
            </div>
        </div>
    `;

    return `
        <section class="nb-project" id="project-${idx}" data-project="${idx}">
            <div class="nb-project-details">
                <div class="nb-project-meta">${metaHtml}</div>
                <div class="nb-project-description">${escapeHTML(proj.description)}</div>
            </div>

            <div class="nb-media-container">
                <div class="nb-media-track" data-track="${idx}">
                    ${allItems}
                    ${actionItemHtml}
                </div>
            </div>
        </section>`;
}

// --------------- Render VLC Player Window (macOS Style) -----
function renderVlcWindow() {
    const rawVideoSrc = CONFIG.motionReel || "images/reel/3D printed shoe project.mp4";
    const videoSrc = escapeHTML(encodeURI(rawVideoSrc));
    const posterAttr = CONFIG.reelPoster ? `poster="${escapeHTML(CONFIG.reelPoster)}"` : "";

    return `
        <div class="kali-window kali-window-vlc fg-hero-window fg-vlc-window" id="hero-win-vlc" role="region" aria-label="3D printed shoe project.mp4 — VLC Media Player">
            <!-- 8 Resize Handles (4 Edges + 4 Corners) -->
            <div class="kali-resize-handle kali-resize-n" data-dir="n" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-s" data-dir="s" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-w" data-dir="w" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-e" data-dir="e" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-nw" data-dir="nw" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-ne" data-dir="ne" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-sw" data-dir="sw" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-se" data-dir="se" aria-hidden="true"></div>

            <!-- 1. VLC Titlebar (macOS Style with authentic VLC cone icon) -->
            <div class="kali-titlebar vlc-titlebar">
                <div class="kali-controls">
                    <button class="kali-btn kali-btn-close" type="button" aria-label="Chiudi finestra" title="Chiudi"></button>
                    <button class="kali-btn kali-btn-min" type="button" aria-label="Riduci finestra" title="Riduci a icona"></button>
                    <button class="kali-btn kali-btn-max" type="button" aria-label="Ingrandisci finestra" title="Ingrandisci"></button>
                </div>
                <div class="vlc-title-info">
                    <svg class="vlc-cone-icon" viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">
                        <ellipse cx="16" cy="27" rx="13" ry="3.5" fill="#e05300"/>
                        <ellipse cx="16" cy="26" rx="12" ry="3" fill="#f58220"/>
                        <polygon points="12,5 20,5 23,24 9,24" fill="#f58220"/>
                        <polygon points="10,21 22,21 22.8,24.5 9.2,24.5" fill="#ffffff"/>
                        <polygon points="11.4,12 20.6,12 21.6,15.5 10.4,15.5" fill="#ffffff"/>
                        <ellipse cx="16" cy="5" rx="4" ry="1.5" fill="#f58220"/>
                        <ellipse cx="16" cy="4.5" rx="3.5" ry="1.2" fill="#ff9d47"/>
                    </svg>
                    <span class="vlc-title-text">3D printed shoe project.mp4 — VLC Media Player</span>
                </div>
                <div class="kali-titlebar-spacer" aria-hidden="true"></div>
            </div>

            <!-- 2. VLC Video Player Body (Landscape 16:9) -->
            <div class="vlc-video-container" title="Click per Riprodurre / Pausa">
                <video class="vlc-video-element"
                       id="sd-reel-video"
                       src="${videoSrc}"
                       ${posterAttr}
                       autoplay
                       muted
                       loop
                       playsinline
                       webkit-playsinline
                       preload="auto"
                       aria-label="3D printed shoe project"
                       onerror="if (this.src.indexOf('images/reel') === -1) { this.src = 'images/reel/3D%20printed%20shoe%20project.mp4'; } else { this.style.display='none'; const fb = this.parentElement ? this.parentElement.querySelector('.nb-reel-placeholder') : null; if(fb) fb.style.display='flex'; }"></video>
                <div class="vlc-coming-soon-overlay" aria-label="Coming soon">
                    <span class="vlc-coming-soon-text">Coming soon</span>
                </div>
                <div class="nb-reel-placeholder" style="display:none;" aria-label="Placeholder 3D printed shoe project">
                    <div class="nb-reel-placeholder-inner">
                        <div class="nb-reel-placeholder-title">3D printed shoe project.mp4</div>
                        <div class="nb-reel-placeholder-text">3D printed shoe project preview</div>
                    </div>
                </div>
            </div>

            <!-- 3. VLC Bottom Control Toolbar (macOS VLC Style) -->
            <div class="vlc-toolbar">
                <div class="vlc-transport-btns">
                    <button type="button" class="vlc-ctrl-btn vlc-btn-play" title="Riproduci / Pausa" aria-label="Riproduci o Pausa">
                        <svg class="vlc-icon-pause" viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                            <rect x="3" y="2" width="3.5" height="12" rx="0.8"/>
                            <rect x="9.5" y="2" width="3.5" height="12" rx="0.8"/>
                        </svg>
                        <svg class="vlc-icon-play" style="display:none;" viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                            <polygon points="3,2 14,8 3,14"/>
                        </svg>
                    </button>
                    <button type="button" class="vlc-ctrl-btn vlc-btn-prev" title="Indietro (5s)" aria-label="Indietro">
                        <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                            <rect x="1" y="3" width="2" height="10"/>
                            <polygon points="8,8 14,3 14,13"/>
                            <polygon points="3,8 9,3 9,13"/>
                        </svg>
                    </button>
                    <button type="button" class="vlc-ctrl-btn vlc-btn-stop" title="Ferma riproduzione" aria-label="Ferma">
                        <svg viewBox="0 0 16 16" width="9" height="9" fill="currentColor">
                            <rect x="2" y="2" width="12" height="12" rx="1"/>
                        </svg>
                    </button>
                    <button type="button" class="vlc-ctrl-btn vlc-btn-next" title="Avanti (5s)" aria-label="Avanti">
                        <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                            <polygon points="1,3 7,8 1,13"/>
                            <polygon points="7,3 13,8 7,13"/>
                            <rect x="13" y="3" width="2" height="10"/>
                        </svg>
                    </button>
                </div>

                <!-- Timeline Scrubber -->
                <div class="vlc-scrubber-wrap">
                    <input type="range" class="vlc-scrubber" min="0" max="100" value="0" step="0.1" title="Posizione di riproduzione">
                </div>

                <!-- Time readout -->
                <div class="vlc-time-display">
                    <span class="vlc-time-current">00:00</span>
                </div>

                <!-- Volume speaker + slider -->
                <div class="vlc-volume-wrap">
                    <button type="button" class="vlc-ctrl-btn vlc-btn-volume" title="Volume / Muto" aria-label="Volume">
                        <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
                            <path d="M2 5v6h3l4 4V1L5 5H2zM12 4a5 5 0 0 1 0 8v-1.5a3.5 3.5 0 0 0 0-5V4z"/>
                        </svg>
                    </button>
                    <input type="range" class="vlc-volume-slider" min="0" max="1" step="0.05" value="0" title="Volume">
                </div>

                <!-- Fullscreen button -->
                <button type="button" class="vlc-ctrl-btn vlc-btn-fullscreen" title="Schermo intero" aria-label="Schermo intero">
                    <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                        <path d="M1 1h4v1.5H2.5v2.5H1V1zm10 0h4v4h-1.5V2.5H11V1zM1 11h1.5v2.5H5V15H1v-4zm13.5 0H15v4h-4v-1.5h2.5V11z"/>
                    </svg>
                </button>
            </div>
        </div>`;
}

// --------------- Render Hero (Sophia Denison Style / Desktop OS Workspace) ---
function renderSophiaHero() {
    return `
        <section class="sd-hero-section sd-desktop-workspace" id="hero-section" aria-label="Desktop Workspace">
            <!-- Unified Desktop Canvas holding the 4 Interactive OS Windows -->
            <div class="sd-desktop-canvas" id="desktop-canvas">
                <!-- 1. VLC Media Player Window (Top Center/Left) -->
                ${renderVlcWindow()}

                <!-- 2. Mikk Window (Top Right) -->
                ${renderProjectWindow(PROJECTS[1], 1, "fg-win-nomod fg-win-mikk")}

                <!-- 3. HARP CHAIR Window (Bottom Left) -->
                ${renderProjectWindow(PROJECTS[0], 0, "fg-win-harp")}

                <!-- 4. JEWELRY Window (Bottom Center/Right) -->
                ${renderProjectWindow(PROJECTS[2], 2, "fg-win-luca fg-win-jewelry")}
            </div>

            <!-- Right: About Link (Almost attached to right margin, Adv Scam Arrow & Blink) -->
            <div class="sd-hero-right" id="sd-about-col">
                <a href="about.html" class="sd-scam-about-link" aria-label="About Lorenzo Kraja">
                    <span class="sd-scam-about-text">ABOUT</span>
                    <span class="sd-scam-arrow-wrap" aria-hidden="true">
                        <svg class="sd-scam-arrow-svg" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                            <rect x="1" y="6" width="7" height="4"/>
                            <rect x="8" y="2" width="2" height="12"/>
                            <rect x="10" y="4" width="2" height="8"/>
                            <rect x="12" y="6" width="2" height="4"/>
                            <rect x="14" y="7" width="1" height="2"/>
                        </svg>
                    </span>
                </a>
            </div>
        </section>`;
}

// --------------- Render Project Windows (Showcase Cards) ----
function renderProjectWindow(project, idx, customClass = "") {
    const items = project.items || [];
    const winId = "project-win-" + idx;
    const fileSlug = (project.title || "project").toLowerCase().replace(/[^a-z0-9]/g, "_") + ".prj";

    const slidesHtml = items.map((item, i) => {
        const mediaTag = item.video
            ? `<video src="${escapeHTML(item.video)}" poster="${escapeHTML(item.image)}" muted playsinline webkit-playsinline preload="auto" draggable="false"></video>`
            : `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.caption || project.title)}" loading="lazy" draggable="false">`;
        return `
        <div class="fg-slide ${i === 0 ? 'is-active' : ''}" data-slide-index="${i}">
            ${mediaTag}
        </div>`;
    }).join("");

    const totalCountStr = String(items.length).padStart(2, '0');

    return `
        <div class="fg-hero-window fg-project-window kali-window ${customClass}" id="${winId}" data-project-idx="${idx}">
            <!-- 8 Resize Handles (4 Edges + 4 Corners) -->
            <div class="kali-resize-handle kali-resize-n" data-dir="n" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-s" data-dir="s" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-w" data-dir="w" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-e" data-dir="e" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-nw" data-dir="nw" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-ne" data-dir="ne" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-sw" data-dir="sw" aria-hidden="true"></div>
            <div class="kali-resize-handle kali-resize-se" data-dir="se" aria-hidden="true"></div>

            <!-- 1. Titlebar (macOS Style Draggable Handle) -->
            <div class="kali-titlebar">
                <div class="kali-controls">
                    <button class="kali-btn kali-btn-close" type="button" aria-label="Chiudi finestra" title="Chiudi"></button>
                    <button class="kali-btn kali-btn-min" type="button" aria-label="Riduci finestra" title="Riduci a icona"></button>
                    <button class="kali-btn kali-btn-max" type="button" aria-label="Ingrandisci finestra" title="Ingrandisci"></button>
                </div>
                <div class="kali-title-info">
                    <span class="kali-title-text">${escapeHTML(project.title)} — Project Viewer</span>
                </div>
                <div class="kali-titlebar-spacer" aria-hidden="true"></div>
            </div>

            <!-- Content Area (16:9 Landscape Format, Smooth Fade Slideshow) -->
            <a href="${escapeHTML(project.url)}" class="fg-hero-window-content fg-project-slideshow" aria-label="Apri progetto: ${escapeHTML(project.title)}">
                <div class="fg-slides-track">
                    ${slidesHtml}
                </div>
                <div class="fg-slides-counter">
                    <span class="fg-slide-cur">01</span> / <span class="fg-slide-total">${totalCountStr}</span>
                </div>
            </a>

            <!-- Statusbar -->
            <div class="kali-statusbar">
                <div class="kali-status-left">
                    <span>${escapeHTML(project.title)}</span>
                    <span class="kali-status-sep">&bull;</span>
                    <span data-meta-idx="${idx}">${escapeHTML(getProjectMeta(idx))}</span>
                </div>
                <div class="kali-status-right">
                    <span>Lorenzo Kraja</span>
                </div>
            </div>
        </div>`;
}

// --------------- Render Projects Showcase (Alternating Left / Right Rows) ---
function renderProjectsShowcase() {
    const rows = PROJECTS.map((proj, idx) => {
        const isLeft = (idx % 2 === 0);
        const rowClass = isLeft ? "is-left" : "is-right";
        const windowMarkup = renderProjectWindow(proj, idx, isLeft ? "fg-win-stagger-left" : "fg-win-stagger-right");

        return `
            <div class="fg-project-row ${rowClass}" id="project-row-${idx}">
                <div class="fg-project-window-shell">
                    <div class="fg-project-row-stamp">
                        <span class="fg-stamp-num">0${idx + 1} //</span>
                        <span class="fg-stamp-title">${escapeHTML(proj.title.toUpperCase())}</span>
                        <span class="fg-stamp-meta" data-stamp-meta-idx="${idx}">${escapeHTML(getProjectMeta(idx))}</span>
                    </div>
                    ${windowMarkup}
                </div>
            </div>
        `;
    }).join("");

    return `
        <section class="fg-projects-showcase" id="projects-showcase" aria-label="Progetti Selezionati">
            ${rows}
        </section>
    `;
}

// --------------- Project Windows Slideshow Controller -------
function initProjectSlideshows() {
    const projectWindows = document.querySelectorAll('.fg-project-window');
    if (!projectWindows.length) return;

    projectWindows.forEach((winEl) => {
        const pIdx = parseInt(winEl.dataset.projectIdx, 10);
        const proj = PROJECTS[pIdx];
        if (!proj) return;

        const slides = Array.from(winEl.querySelectorAll('.fg-slide'));
        const totalCount = slides.length;
        if (totalCount <= 0) return;

        const curCounterEl = winEl.querySelector('.fg-slide-cur');

        let currentIndex = 0;
        let autoplayTimer = null;
        let isPaused = false;

        function getSlideDuration(idx) {
            if (proj.items && proj.items[idx] && proj.items[idx].duration) {
                return proj.items[idx].duration;
            }
            return 3200;
        }

        // Attach ended listener to video slides so each animation plays exactly once to completion
        slides.forEach((slide, sIdx) => {
            const vid = slide.querySelector('video');
            if (vid) {
                vid.addEventListener('ended', () => {
                    if (!isPaused && sIdx === currentIndex) {
                        setTimeout(() => {
                            if (!isPaused && sIdx === currentIndex) {
                                goToSlide(currentIndex + 1);
                            }
                        }, 250);
                    }
                });
            }
        });

        function goToSlide(idx) {
            if (idx < 0) idx = totalCount - 1;
            if (idx >= totalCount) idx = 0;
            currentIndex = idx;

            slides.forEach((slide, i) => {
                const vid = slide.querySelector('video');
                if (i === currentIndex) {
                    slide.classList.add('is-active');
                    if (vid) {
                        try {
                            vid.currentTime = 0;
                            const playPromise = vid.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(() => {});
                            }
                        } catch {}
                    }
                } else {
                    slide.classList.remove('is-active');
                    if (vid) {
                        try {
                            vid.pause();
                            vid.currentTime = 0;
                        } catch {}
                    }
                }
            });

            if (curCounterEl) {
                curCounterEl.textContent = String(currentIndex + 1).padStart(2, '0');
            }

            scheduleNext();
        }

        function scheduleNext() {
            if (autoplayTimer) {
                clearTimeout(autoplayTimer);
                autoplayTimer = null;
            }
            if (totalCount <= 1 || isPaused) return;

            const activeVid = slides[currentIndex]?.querySelector('video');
            // If the active slide has a video, native 'ended' handles advancement;
            // timeout serves as safety fallback
            const dur = getSlideDuration(currentIndex) + (activeVid ? 800 : 0);
            autoplayTimer = setTimeout(() => {
                if (!isPaused) {
                    goToSlide(currentIndex + 1);
                }
            }, dur);
        }

        // Pause slideshow on hover to invite viewing / examining project details
        winEl.addEventListener('mouseenter', () => {
            isPaused = true;
            if (autoplayTimer) {
                clearTimeout(autoplayTimer);
                autoplayTimer = null;
            }
            const activeVid = slides[currentIndex]?.querySelector('video');
            if (activeVid) activeVid.pause();
        });

        winEl.addEventListener('mouseleave', () => {
            isPaused = false;
            const activeVid = slides[currentIndex]?.querySelector('video');
            if (activeVid) {
                if (activeVid.ended) {
                    goToSlide(currentIndex + 1);
                } else {
                    activeVid.play().catch(() => {});
                    scheduleNext();
                }
            } else {
                scheduleNext();
            }
        });

        // Initialize first slide and start rotation
        goToSlide(0);
    });
}

// --------------- Render MSCHF-Style Statement Ticker ---------
function getTickerText() {
    if (window.I18N && window.I18N.t) {
        return window.I18N.t('marquee.text');
    }
    const lang = localStorage.getItem('portfolio_user_selected_lang') || localStorage.getItem('portfolio_lang') || 'en';
    return lang === 'en'
        ? "I'M LORENZO, AND I'M A PRODUCT AND JEWELRY DESIGNER. I DESIGN PRODUCTS AND ACCESSORIES WITH METICULOUS ATTENTION TO DETAIL, COMBINING PURE DESIGN WITH A STRONG FOCUS ON PROPORTIONS, MATERIALS, AND STRUCTURAL SENSITIVITY."
        : "SONO LORENZO, E SONO UN PRODUCT E JEWELRY DESIGNER. PROGETTO PRODOTTI E ACCESSORI CON METICOLOSA ATTENZIONE AI DETTAGLI, UNENDO IL DESIGN PURO A UN FORTE FOCUS SULLE PROPORZIONI, SUI MATERIALI E SULLA SENSIBILITÀ STRUTTURALE.";
}

function renderMschfTicker() {
    const rawText = escapeHTML(getTickerText());
    // MSCHF Hotels ticker repetition with hyphen separator
    const itemContent = `<span>${rawText} &nbsp;-&nbsp;&nbsp;</span>`;

    return `
        <!-- MSCHF-STYLE STATEMENT MARQUEE TICKER -->
        <div class="mschf-marquee-wrap" id="home-statement-ticker" aria-label="Lorenzo Kraja statement">
            <div class="mschf-marquee-track">
                <div class="mschf-marquee-item">${itemContent}</div>
                <div class="mschf-marquee-item" aria-hidden="true">${itemContent}</div>
                <div class="mschf-marquee-item" aria-hidden="true">${itemContent}</div>
                <div class="mschf-marquee-item" aria-hidden="true">${itemContent}</div>
            </div>
        </div>
    `;
}

function initMschfMarquee() {
    const wrap = document.getElementById('home-statement-ticker');
    if (!wrap) return;
    const item = wrap.querySelector('.mschf-marquee-item');
    if (!item) return;

    function updateSpeed() {
        // Measure real rendered width of 1 item
        const width = item.getBoundingClientRect().width;
        if (width > 0) {
            // MSCHF hotels exact speed: 82.2667 px / second
            const duration = width / 82.2667;
            wrap.style.setProperty('--marquee-duration', `${duration.toFixed(2)}s`);
        }
    }

    updateSpeed();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateSpeed);
    }
    window.addEventListener('resize', updateSpeed, { passive: true });
}

// --------------- Render Classic Mac OS System 7 Top Menu Bar -
function renderMacTopNav() {
    return `
        <!-- CLASSIC MAC OS SYSTEM 7 TOP MENU BAR -->
        <nav class="mac-top-nav" id="mac-top-nav" aria-label="Mac OS System Menu Bar">
            <div class="mac-nav-left">
                <!-- App / Brand Name -->
                <a href="index.html" class="mac-nav-brand nb-nav-home-link" aria-label="Lorenzo Kraja — Home">
                    <span class="nb-nav-home-text">${escapeHTML(CONFIG.designerName)}</span>
                </a>

                <!-- Mac OS System Menus (Replacing File, Edit with TOC items) -->
                <div class="mac-menu-bar-items" role="menubar">
                    <!-- 1. CONTACT (Opens dropdown directly on hover or click) -->
                    <div class="mac-menu-item mac-menu-has-dropdown" id="mac-menu-contact" data-menu="contact">
                        <button type="button" class="mac-menu-title" id="mac-contact-btn" aria-haspopup="true" aria-expanded="false" data-i18n="nav.contact">
                            Contatti
                        </button>

                        <!-- Dropdown Menu ("Tendina") -->
                        <div class="mac-dropdown-menu" id="mac-contact-dropdown" role="menu" aria-label="Contact Channels">
                            <a href="about.html" class="mac-dropdown-item" role="menuitem">
                                <span class="mac-item-icon">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                        <path d="M2 2h12v9H2V2zm1 1v7h10V3H3zm-2 9h14v2H1v-2zm5 1h4v-0.5H6v0.5z"/>
                                    </svg>
                                </span>
                                <span class="mac-item-text" data-i18n="nav.about">Chi Sono...</span>
                            </a>

                            <div class="mac-dropdown-divider" role="separator"></div>

                            <a href="mailto:lorenzokraja99@gmail.com" class="mac-dropdown-item" role="menuitem">
                                <span class="mac-item-icon">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                        <path d="M1 3h14v10H1V3zm1 1v1.2l6 4.3 6-4.3V4H2zm12 8V6.4L8 10.7 2 6.4V12h12z"/>
                                    </svg>
                                </span>
                                <span class="mac-item-text">Email: lorenzokraja99@gmail.com</span>
                            </a>

                            <a href="https://www.instagram.com/lorenzo.kraja?vrfl=emV0cDFlbW51NWFm" target="_blank" rel="noopener noreferrer" class="mac-dropdown-item" role="menuitem">
                                <span class="mac-item-icon">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                        <path d="M5 2l-1 2H1v10h14V4h-3L11 2H5zm3 3.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm0 1a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm4-1.5a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
                                    </svg>
                                </span>
                                <span class="mac-item-text">Instagram: @lorenzo.kraja</span>
                                <span class="mac-item-arrow">&nearr;</span>
                            </a>

                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="mac-dropdown-item" role="menuitem">
                                <span class="mac-item-icon">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                        <path d="M5 2h6v2h4v10H1V4h4V2zm1 1v1h4V3H6zm-4 2v2h12V5H2zm0 3v5h12V8H2z"/>
                                    </svg>
                                </span>
                                <span class="mac-item-text">LinkedIn: Lorenzo Kraja</span>
                                <span class="mac-item-arrow">&nearr;</span>
                            </a>

                            <a href="https://behance.net/SpiritWorks" target="_blank" rel="noopener noreferrer" class="mac-dropdown-item" role="menuitem">
                                <span class="mac-item-icon">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                        <path d="M8 1a7 7 0 100 14c1.1 0 2-.9 2-2 0-.5-.2-1-.2-1.5 0-.8.7-1.5 1.5-1.5H13c1.7 0 3-1.3 3-3 0-3.3-3.6-6-8-6zm-4 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-2a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm2 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
                                    </svg>
                                </span>
                                <span class="mac-item-text">Behance: SpiritWorks</span>
                                <span class="mac-item-arrow">&nearr;</span>
                            </a>

                            <a href="tel:3429787242" class="mac-dropdown-item" role="menuitem">
                                <span class="mac-item-icon">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                        <path d="M3.6 1.2c-.4-.4-1.1-.4-1.5 0L1 2.3c-.6.6-.8 1.5-.4 2.3 1.4 2.8 3.5 5.3 6.3 7.1.8.5 1.7.4 2.3-.2l1.2-1.2c.4-.4.4-1.1 0-1.5l-2.1-2.1c-.4-.4-1.1-.4-1.5 0l-.8.8C5.2 7 4.5 5.8 4.3 4.9l.8-.8c.4-.4.4-1.1 0-1.5L3.6 1.2z"/>
                                    </svg>
                                </span>
                                <span class="mac-item-text">Phone: +39 342 978 7242</span>
                            </a>

                            <div class="mac-dropdown-divider" role="separator"></div>

                            <a href="assets/cv_lorenzo_kraja.pdf" target="_blank" rel="noopener noreferrer" class="mac-dropdown-item" role="menuitem">
                                <span class="mac-item-icon">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                        <path d="M3 1h8l3 3v11H3V1zm1 1v12h9V4.5L10.5 2H4zm2 2h3v2H6V4zm-1 6h6v3H5v-3z"/>
                                    </svg>
                                </span>
                                <span class="mac-item-text">Curriculum Vitae (PDF)</span>
                                <span class="mac-item-arrow">&nearr;</span>
                            </a>
                        </div>
                    </div>

                    <!-- 2. MOTION REEL -->
                    <div class="mac-menu-item" id="mac-menu-reel" data-target="#hero-win-vlc">
                        <button type="button" class="mac-menu-title">Motion Reel</button>
                        <div class="mac-preview-popover" role="tooltip">
                            <div class="mac-popover-titlebar">
                                <span class="mac-popover-close"></span>
                                <span class="mac-popover-title">Motion Reel</span>
                                <span class="mac-popover-zoom"></span>
                            </div>
                            <div class="mac-popover-body">
                                <div class="mac-popover-thumb">
                                    <img src="images/reel/shoe_poster.jpg" alt="Motion Reel Preview" onerror="this.src='images/reel/shoe_poster.jpg'">
                                </div>
                                <div class="mac-popover-meta">
                                    <strong>3D Printed Shoe Project</strong>
                                    <span>Industrial &amp; Footwear Concept</span>
                                    <span class="mac-popover-tag">2025</span>
                                    <span class="mac-popover-action">Clicca per visualizzare &amp; play &#9654;</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. HARP CHAIR -->
                    <div class="mac-menu-item" id="mac-menu-harp" data-target="#project-win-0" data-url="harp-chair.html">
                        <button type="button" class="mac-menu-title">Harp Chair</button>
                        <div class="mac-preview-popover" role="tooltip">
                            <div class="mac-popover-titlebar">
                                <span class="mac-popover-close"></span>
                                <span class="mac-popover-title">Harp Chair</span>
                                <span class="mac-popover-zoom"></span>
                            </div>
                            <div class="mac-popover-body">
                                <div class="mac-popover-thumb">
                                    <img src="images/harp-chair/01.gif" alt="Harp Chair Preview">
                                </div>
                                <div class="mac-popover-meta">
                                    <strong>Harp Chair</strong>
                                    <span data-i18n="popover.harp.tag">Sedia Monoscocca &amp; Corde Windsor</span>
                                    <span class="mac-popover-tag">2025</span>
                                    <a href="harp-chair.html" class="mac-popover-link" data-i18n="nav.openProject">Apri Progetto &rarr;</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. MIKK -->
                    <div class="mac-menu-item" id="mac-menu-nomod" data-target="#project-win-1" data-url="mikk.html">
                        <button type="button" class="mac-menu-title">Mikk</button>
                        <div class="mac-preview-popover" role="tooltip">
                            <div class="mac-popover-titlebar">
                                <span class="mac-popover-close"></span>
                                <span class="mac-popover-title">Mikk</span>
                                <span class="mac-popover-zoom"></span>
                            </div>
                            <div class="mac-popover-body">
                                <div class="mac-popover-thumb">
                                    <img src="images/nomod/Presentazione%20Tesi_Page_01.png" alt="Mikk Preview">
                                </div>
                                <div class="mac-popover-meta">
                                    <strong>Mikk</strong>
                                    <span data-i18n="popover.mikk.tag">Auto Elettrica Urbana Sostenibile</span>
                                    <span class="mac-popover-tag">2023</span>
                                    <a href="mikk.html" class="mac-popover-link" data-i18n="nav.openProject">Apri Progetto &rarr;</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 5. JEWELRY -->
                    <div class="mac-menu-item" id="mac-menu-jewelry" data-target="#project-win-2" data-url="jewelry.html">
                        <button type="button" class="mac-menu-title">Jewelry</button>
                        <div class="mac-preview-popover" role="tooltip">
                            <div class="mac-popover-titlebar">
                                <span class="mac-popover-close"></span>
                                <span class="mac-popover-title">Jewelry</span>
                                <span class="mac-popover-zoom"></span>
                            </div>
                            <div class="mac-popover-body">
                                <div class="mac-popover-thumb">
                                    <img src="images/Jewelry/1.jpg" alt="Jewelry Preview">
                                </div>
                                <div class="mac-popover-meta">
                                    <strong>Jewelry</strong>
                                    <span data-i18n="popover.jewelry.tag">Argento 925 Scultoreo &amp; Hardware</span>
                                    <span class="mac-popover-tag">2025</span>
                                    <a href="jewelry.html" class="mac-popover-link" data-i18n="nav.openProject">Apri Progetto &rarr;</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Classic Mac Clock, Help Balloon, Finder Icon & Theme Switcher -->
            <div class="mac-nav-right">
                <!-- Mac OS Language Switcher (IT / EN) a sinistra dell'orario -->
                <div class="mac-lang-switch" id="lang-switch-home" role="group" aria-label="Language Switcher">
                    <button type="button" class="mac-lang-btn" data-lang="it" aria-pressed="false">IT</button>
                    <span class="mac-lang-sep" aria-hidden="true">/</span>
                    <button type="button" class="mac-lang-btn active" data-lang="en" aria-pressed="true">EN</button>
                </div>

                <span id="live-clock" class="mac-clock"></span>

                <div class="mac-help-icon" title="Mac OS Balloon Help" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                        <path d="M8 1C4.1 1 1 3.7 1 7c0 1.8.9 3.4 2.4 4.5-.1.8-.4 1.8-1.2 2.7 1.4 0 2.8-.5 3.8-1.4.6.1 1.3.2 2 .2 3.9 0 7-2.7 7-6s-3.1-6-7-6zm0 10.5c-.7 0-1.3-.1-1.9-.3l-.4-.1-.3.3c-.7.6-1.5.9-2.3 1 .4-.6.7-1.3.8-1.9l.1-.5-.4-.3C2.5 8.9 2 7.9 2 7c0-2.8 2.7-5 6-5s6 2.2 6 5-2.7 5-6 5zm.1-7.2c-.7 0-1.2.5-1.2 1.2h1c0-.2.1-.3.2-.3.2 0 .4.1.4.3 0 .2-.1.3-.3.5-.3.2-.5.5-.5.9v.3h1v-.2c0-.2.1-.3.3-.5.3-.2.5-.5.5-.9.1-.7-.5-1.3-1.4-1.3zm-.1 3.5c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5z"/>
                    </svg>
                </div>

                <div class="mac-app-icon" title="Finder Application Switcher" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                        <path d="M1 2h14v12H1V2zm1 1v2h12V3H2zm0 3v7h12V6H2zm1 1h4v5H3V7z"/>
                    </svg>
                </div>

                <button id="theme-toggle" class="mac-theme-toggle nb-theme-toggle" aria-label="Cambia tema chiaro / scuro" title="Tema chiaro / scuro">
                    <span class="nb-theme-icon-wrap">
                        <svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" class="nb-theme-icon nb-theme-icon-sun" aria-hidden="true">
                            <circle cx="256" cy="256" r="128"/>
                            <g>
                                <rect x="230" y="0" width="52" height="91" rx="26"/>
                                <rect x="230" y="0" width="52" height="91" rx="26" transform="rotate(45 256 256)"/>
                                <rect x="230" y="0" width="52" height="91" rx="26" transform="rotate(90 256 256)"/>
                                <rect x="230" y="0" width="52" height="91" rx="26" transform="rotate(135 256 256)"/>
                                <rect x="230" y="0" width="52" height="91" rx="26" transform="rotate(180 256 256)"/>
                                <rect x="230" y="0" width="52" height="91" rx="26" transform="rotate(225 256 256)"/>
                                <rect x="230" y="0" width="52" height="91" rx="26" transform="rotate(270 256 256)"/>
                                <rect x="230" y="0" width="52" height="91" rx="26" transform="rotate(315 256 256)"/>
                            </g>
                        </svg>
                        <svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" class="nb-theme-icon nb-theme-icon-moon" aria-hidden="true">
                            <path d="M 129 3 L 125 5 L 123 7 L 113 13 L 109 16 L 104 20 L 99 24 L 93 29 L 69 53 L 63 60 L 59 65 L 55 70 L 52 74 L 40 92 L 37 97 L 32 106 L 25 120 L 21 129 L 19 134 L 16 142 L 14 148 L 11 157 L 9 164 L 8 168 L 7 172 L 4 187 L 3 193 L 2 199 L 1 208 L 0 220 L 0 252 L 1 264 L 2 272 L 3 279 L 4 285 L 5 290 L 6 295 L 10 311 L 12 318 L 15 327 L 18 335 L 20 340 L 22 345 L 27 356 L 30 362 L 36 373 L 39 378 L 44 386 L 46 389 L 48 392 L 53 399 L 56 403 L 60 408 L 64 413 L 71 421 L 90 440 L 97 446 L 103 451 L 108 455 L 112 458 L 119 463 L 122 465 L 125 467 L 133 472 L 140 476 L 153 483 L 166 489 L 171 491 L 176 493 L 184 496 L 187 497 L 190 498 L 200 501 L 216 505 L 221 506 L 226 507 L 232 508 L 239 509 L 247 510 L 259 511 L 291 511 L 303 510 L 312 509 L 318 508 L 324 507 L 339 504 L 343 503 L 354 500 L 360 498 L 369 495 L 377 492 L 382 490 L 391 486 L 405 479 L 414 474 L 419 471 L 425 467 L 434 461 L 441 456 L 446 452 L 451 448 L 458 442 L 481 419 L 487 412 L 491 407 L 495 402 L 498 398 L 508 382 L 510 379 L 508 380 L 506 381 L 504 383 L 496 387 L 482 394 L 475 397 L 470 399 L 462 402 L 450 406 L 443 408 L 431 411 L 416 414 L 409 415 L 402 416 L 392 417 L 347 417 L 337 416 L 330 415 L 324 414 L 318 413 L 313 412 L 304 410 L 300 409 L 293 407 L 283 404 L 280 403 L 272 400 L 267 398 L 262 396 L 255 393 L 249 390 L 239 385 L 230 380 L 222 375 L 210 367 L 206 364 L 202 361 L 197 357 L 192 353 L 184 346 L 165 327 L 158 319 L 154 314 L 150 309 L 147 305 L 144 301 L 136 289 L 131 281 L 126 272 L 123 266 L 118 256 L 115 249 L 113 244 L 111 239 L 108 231 L 107 228 L 104 218 L 102 211 L 101 207 L 99 198 L 98 193 L 97 187 L 96 181 L 95 174 L 94 164 L 94 119 L 95 109 L 96 102 L 97 95 L 100 80 L 103 68 L 105 61 L 109 49 L 112 41 L 114 36 L 117 29 L 121 21 L 128 7 L 130 5 L 132 1 Z"/>
                        </svg>
                    </span>
                </button>

                <button id="menu-toggle" class="mac-menu-toggle nb-menu-toggle" aria-label="Menu" aria-expanded="false" title="Menu">
                    <span class="nb-menu-icon" aria-hidden="true">
                        <span class="nb-menu-line nb-line-top"></span>
                        <span class="nb-menu-line nb-line-bottom"></span>
                    </span>
                </button>
            </div>
        </nav>
    `;
}

// --------------- Build Page --------------------------------
function buildPage() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <!-- CLASSIC MAC OS TOP BAR -->
        ${renderMacTopNav()}

        <!-- MOBILE MENU OVERLAY / DROPDOWN -->
        <div id="mobile-menu" class="nb-mobile-menu" aria-hidden="true">
            <div class="nb-mobile-menu-inner">
                <nav class="nb-mobile-menu-nav">
                    <a href="about.html" class="nb-mobile-link">
                        <span class="nb-mobile-link-text">About</span>
                        <span class="nb-mobile-link-tag">v2.4 &rarr;</span>
                    </a>
                    <a href="#contact" class="nb-mobile-link" id="mobile-link-contact">
                        <span class="nb-mobile-link-text">Contact</span>
                        <span class="nb-mobile-link-tag">&darr;</span>
                    </a>
                    <a href="#hero-win-vlc" class="nb-mobile-link" id="mobile-link-reel">
                        <span class="nb-mobile-link-text">Motion Reel</span>
                        <span class="nb-mobile-link-tag">[ 02 ]</span>
                    </a>
                    <a href="harp-chair.html" class="nb-mobile-link" id="mobile-link-harp">
                        <span class="nb-mobile-link-text">Harp Chair</span>
                        <span class="nb-mobile-link-tag">[ 03 ]</span>
                    </a>
                    <a href="mikk.html" class="nb-mobile-link" id="mobile-link-nomod">
                        <span class="nb-mobile-link-text">Mikk</span>
                        <span class="nb-mobile-link-tag">[ 04 ]</span>
                    </a>
                    <a href="jewelry.html" class="nb-mobile-link" id="mobile-link-jewelry">
                        <span class="nb-mobile-link-text">Jewelry</span>
                        <span class="nb-mobile-link-tag">[ 05 ]</span>
                    </a>
                </nav>
                <div class="nb-mobile-menu-footer">
                    <div class="nb-mobile-meta-item">
                        <span class="nb-mobile-meta-label">Timezone</span>
                        <span class="nb-mobile-meta-val">Europe/Rome (RM)</span>
                    </div>
                    <div class="nb-mobile-meta-item">
                        <span class="nb-mobile-meta-label">Direct</span>
                        <a href="mailto:lorenzokraja99@gmail.com" class="nb-mobile-meta-email">lorenzokraja99@gmail.com</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- HERO / DESKTOP OS WORKSPACE -->
        ${renderSophiaHero()}

        <!-- MSCHF-STYLE STATEMENT MARQUEE TICKER -->
        ${renderMschfTicker()}

        <!-- FOOTER -->
        <footer class="nb-footer" id="contact">
            <div class="nb-footer-links">
                <a href="#contact">Contact</a>
                <span class="nb-footer-sep">&bull;</span>
                <span>${escapeHTML(CONFIG.footerLeft)}</span>
            </div>
            <div>${escapeHTML(CONFIG.footerCenter)}</div>
            <div>${escapeHTML(CONFIG.footerRight)}</div>
        </footer>
    `;

    startClock();
    bindEvents();
    initMacMenuBar();
    bindHeroTocLinks();
    initVlcPlayer();
    initHeroWindows();
    initProjectSlideshows();
    initHeroLogoDock();
    initMacosSpacesTransition();
    initSiteIntro();
    initMschfMarquee();
}

// --------------- Classic Mac OS Menu Bar Interactions --------
function initMacMenuBar() {
    const contactItem = document.getElementById("mac-menu-contact");
    const contactBtn = document.getElementById("mac-contact-btn");
    const contactDropdown = document.getElementById("mac-contact-dropdown");

    if (contactBtn && contactDropdown && contactItem) {
        let closeTimer = null;

        const openDropdown = () => {
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
            contactDropdown.classList.add("is-open");
            contactBtn.classList.add("is-active");
            contactItem.classList.add("is-open");
            contactBtn.setAttribute("aria-expanded", "true");
        };

        const closeDropdown = (immediate = false) => {
            if (closeTimer) {
                clearTimeout(closeTimer);
                closeTimer = null;
            }
            if (immediate) {
                contactDropdown.classList.remove("is-open");
                contactBtn.classList.remove("is-active");
                contactItem.classList.remove("is-open");
                contactBtn.setAttribute("aria-expanded", "false");
            } else {
                closeTimer = setTimeout(() => {
                    contactDropdown.classList.remove("is-open");
                    contactBtn.classList.remove("is-active");
                    contactItem.classList.remove("is-open");
                    contactBtn.setAttribute("aria-expanded", "false");
                }, 180);
            }
        };

        // Open directly when hovering with the mouse pointer
        contactItem.addEventListener("mouseenter", openDropdown);
        contactItem.addEventListener("mouseleave", () => closeDropdown(false));

        // Click to toggle
        contactBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (contactDropdown.classList.contains("is-open")) {
                closeDropdown(true);
            } else {
                openDropdown();
            }
        });

        // Close on clicking outside
        document.addEventListener("click", (e) => {
            if (contactDropdown.classList.contains("is-open")) {
                if (!contactDropdown.contains(e.target) && !contactBtn.contains(e.target)) {
                    closeDropdown(true);
                }
            }
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && contactDropdown.classList.contains("is-open")) {
                closeDropdown(true);
            }
        });
    }

    // Project menu items click handling
    const menuItems = document.querySelectorAll(".mac-menu-item[data-target]");
    menuItems.forEach((item) => {
        const titleBtn = item.querySelector(".mac-menu-title");
        const targetSel = item.getAttribute("data-target");
        if (!titleBtn || !targetSel) return;

        titleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(targetSel);
            if (!target) return;

            if (window.innerWidth <= 900) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            }

            const win = (target.classList.contains("kali-window") || target.classList.contains("fg-hero-window"))
                ? target
                : target.querySelector(".kali-window, .fg-hero-window");

            if (win && typeof win._bringToFront === "function") {
                win._bringToFront();
            } else if (win) {
                document.querySelectorAll(".kali-window, .fg-hero-window").forEach(w => w.classList.remove("is-focused"));
                win.classList.add("is-focused");
            }

            if (targetSel === "#hero-win-vlc") {
                const video = target.querySelector(".vlc-video-element");
                if (video && video.paused) {
                    video.play().catch(() => {});
                }
            }
        });
    });
}

// --------------- Hero TOC smooth scroll & window focus -----
function bindHeroTocLinks() {
    document.querySelectorAll(".sd-toc-scroll, .fg-toc-scroll").forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    if (target.id === "contact") {
                        if (window.innerWidth <= 900) {
                            target.scrollIntoView({ behavior: "smooth", block: "center" });
                        } else {
                            window.location.href = "mailto:lorenzokraja99@gmail.com";
                        }
                        return;
                    }
                    const win = (target.classList.contains('kali-window') || target.classList.contains('fg-hero-window'))
                        ? target
                        : target.querySelector('.kali-window, .fg-hero-window');
                    if (win && typeof win._bringToFront === 'function') {
                        win._bringToFront();
                    } else if (win) {
                        document.querySelectorAll('.kali-window, .fg-hero-window').forEach(w => w.classList.remove('is-focused'));
                        win.classList.add('is-focused');
                    }
                    if (target.id === "hero-win-vlc") {
                        const video = target.querySelector('.vlc-video-element');
                        if (video && video.paused) {
                            video.play().catch(() => {});
                        }
                    }
                    if (window.innerWidth <= 900) {
                        target.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            }
        });
    });

    const logoLink = document.querySelector(".fg-hero-logo-link");
    if (logoLink) {
        logoLink.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

// --------------- VLC Player Controller ---------------------
function initVlcPlayer() {
    const vlcWin = document.getElementById('hero-win-vlc');
    if (!vlcWin) return;

    const video = vlcWin.querySelector('.vlc-video-element');
    const playBtn = vlcWin.querySelector('.vlc-btn-play');
    const prevBtn = vlcWin.querySelector('.vlc-btn-prev');
    const nextBtn = vlcWin.querySelector('.vlc-btn-next');
    const stopBtn = vlcWin.querySelector('.vlc-btn-stop');
    const scrubber = vlcWin.querySelector('.vlc-scrubber');
    const timeDisplay = vlcWin.querySelector('.vlc-time-current');
    const volumeBtn = vlcWin.querySelector('.vlc-btn-volume');
    const volumeSlider = vlcWin.querySelector('.vlc-volume-slider');
    const fullscreenBtn = vlcWin.querySelector('.vlc-btn-fullscreen');
    const videoContainer = vlcWin.querySelector('.vlc-video-container');
    const iconPlay = vlcWin.querySelector('.vlc-icon-play');
    const iconPause = vlcWin.querySelector('.vlc-icon-pause');

    if (!video) return;

    function formatTime(sec) {
        if (isNaN(sec) || sec < 0) return "00:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }

    function updatePlayIcon() {
        if (video.paused) {
            if (iconPlay) iconPlay.style.display = 'block';
            if (iconPause) iconPause.style.display = 'none';
        } else {
            if (iconPlay) iconPlay.style.display = 'none';
            if (iconPause) iconPause.style.display = 'block';
        }
    }

    function togglePlay() {
        if (video.paused) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
        updatePlayIcon();
    }

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });
    }

    if (videoContainer) {
        videoContainer.addEventListener('click', (e) => {
            if (e.target.closest('.kali-controls') || e.target.closest('.vlc-toolbar')) return;
            togglePlay();
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.pause();
            video.currentTime = 0;
            if (scrubber) scrubber.value = 0;
            if (timeDisplay) timeDisplay.textContent = "00:00";
            updatePlayIcon();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.currentTime = Math.max(0, video.currentTime - 5);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.currentTime = Math.min(video.duration || 100, video.currentTime + 5);
        });
    }

    let isScrubbing = false;
    if (scrubber) {
        scrubber.addEventListener('pointerdown', () => { isScrubbing = true; });
        scrubber.addEventListener('input', () => {
            if (video.duration) {
                video.currentTime = (parseFloat(scrubber.value) / 100) * video.duration;
                if (timeDisplay) timeDisplay.textContent = formatTime(video.currentTime);
            }
        });
        const stopScrub = () => { isScrubbing = false; };
        scrubber.addEventListener('pointerup', stopScrub);
        scrubber.addEventListener('pointercancel', stopScrub);
    }

    video.addEventListener('timeupdate', () => {
        if (!isScrubbing && video.duration) {
            if (scrubber) scrubber.value = (video.currentTime / video.duration) * 100;
            if (timeDisplay) timeDisplay.textContent = formatTime(video.currentTime);
        }
        updatePlayIcon();
    });

    video.addEventListener('play', updatePlayIcon);
    video.addEventListener('pause', updatePlayIcon);

    let lastVolume = 0.8;
    if (volumeSlider) {
        volumeSlider.value = video.muted ? 0 : video.volume;
        volumeSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            const val = parseFloat(volumeSlider.value);
            video.volume = val;
            video.muted = (val === 0);
            if (val > 0) lastVolume = val;
        });
    }

    if (volumeBtn) {
        volumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            if (volumeSlider) {
                volumeSlider.value = video.muted ? 0 : (video.volume || lastVolume);
            }
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            } else if (vlcWin.requestFullscreen) {
                vlcWin.requestFullscreen().catch(() => {});
            } else if (video.requestFullscreen) {
                video.requestFullscreen().catch(() => {});
            }
        });
    }
}

// --------------- Hero Windows Drag & 8-Direction Resize (VLC) -
function initHeroWindows() {
    const windows = document.querySelectorAll('.kali-window, .fg-hero-window, #hero-win-vlc');
    if (!windows.length) return;

    let highestZ = 35;

    windows.forEach((winEl) => {
        const titlebar = winEl.querySelector('.kali-titlebar') || winEl.querySelector('.vlc-titlebar');
        const contentEl = winEl.querySelector('.vlc-video-container') || winEl.querySelector('.fg-hero-window-content');
        const handles = winEl.querySelectorAll('.kali-resize-handle');

        let tx = 0;
        let ty = 0;
        let isDragging = false;
        let isResizing = false;
        let pointerMoved = false;

        const bringToFront = () => {
            highestZ += 2;
            winEl.style.zIndex = highestZ;
            document.querySelectorAll('.kali-window, .fg-hero-window').forEach(w => w.classList.remove('is-focused'));
            winEl.classList.add('is-focused');
        };
        winEl._bringToFront = bringToFront;

        winEl.addEventListener('pointerdown', () => {
            bringToFront();
        });

        // 1. Titlebar Dragging
        if (titlebar) {
            let startX = 0, startY = 0;
            let startTx = 0, startTy = 0;

            const onPointerMove = (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                tx = startTx + dx;
                ty = startTy + dy;
                winEl.style.transform = `translate3d(${Math.round(tx)}px, ${Math.round(ty)}px, 0)`;
            };

            const onPointerUp = (e) => {
                if (!isDragging) return;
                isDragging = false;
                winEl.classList.remove('is-dragging');
                document.body.classList.remove('is-window-interacting');
                try {
                    titlebar.releasePointerCapture(e.pointerId);
                } catch (_) {}
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                window.removeEventListener('pointercancel', onPointerUp);
            };

            titlebar.addEventListener('pointerdown', (e) => {
                if (e.target.closest('.kali-controls') || e.target.closest('button') || e.target.closest('a')) {
                    return;
                }
                bringToFront();
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startTx = tx;
                startTy = ty;

                winEl.classList.add('is-dragging');
                document.body.classList.add('is-window-interacting');
                try {
                    titlebar.setPointerCapture(e.pointerId);
                } catch (_) {}

                window.addEventListener('pointermove', onPointerMove, { passive: false });
                window.addEventListener('pointerup', onPointerUp, { passive: false });
                window.addEventListener('pointercancel', onPointerUp, { passive: false });
                e.preventDefault();
            });
        }

        // 2. 8-Direction Resizing (Corners & Edges) with Flex-Centering Compensation
        handles.forEach(handle => {
            const dir = handle.dataset.dir;
            if (!dir) return;

            let startX = 0, startY = 0;
            let startW = 0, startH = 0;
            let startTx = 0, startTy = 0;

            const onResizeMove = (e) => {
                if (!isResizing) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                const minW = 260;
                const maxW = Math.max(minW, window.innerWidth - 40);

                let newW = startW;
                let newH = startH;
                let newTx = startTx;
                let newTy = startTy;

                const isCorner = dir === 'nw' || dir === 'ne' || dir === 'sw' || dir === 'se';

                // Check if this window's parent is flex-centered (like VLC in sd-hero-center)
                const isParentFlexCentered = (() => {
                    const parent = winEl.parentElement;
                    if (!parent) return false;
                    const style = window.getComputedStyle(parent);
                    return style.display === 'flex' && style.justifyContent === 'center';
                })();

                if (isParentFlexCentered) {
                    if (isCorner) {
                        let deltaW = 0;
                        if (dir === 'se') deltaW = dx;
                        else if (dir === 'sw') deltaW = -dx;
                        else if (dir === 'ne') deltaW = dx;
                        else if (dir === 'nw') deltaW = -dx;

                        let targetW = Math.max(minW, Math.min(maxW, startW + deltaW));
                        let targetH = Math.round(targetW * (9 / 16));

                        newW = targetW;
                        newH = targetH;

                        // Flex-centering anchor compensation
                        if (dir.indexOf('e') !== -1) {
                            newTx = startTx + (newW - startW) / 2;
                        } else {
                            newTx = startTx - (newW - startW) / 2;
                        }

                        if (dir.indexOf('s') !== -1) {
                            newTy = startTy + (newH - startH) / 2;
                        } else {
                            newTy = startTy - (newH - startH) / 2;
                        }
                    } else {
                        if (dir === 'e') {
                            newW = Math.max(minW, Math.min(maxW, startW + dx));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx + (newW - startW) / 2;
                            newTy = startTy + (newH - startH) / 2;
                        } else if (dir === 'w') {
                            newW = Math.max(minW, Math.min(maxW, startW - dx));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx - (newW - startW) / 2;
                            newTy = startTy + (newH - startH) / 2;
                        } else if (dir === 's') {
                            newH = Math.max(Math.round(minW * 9 / 16), startH + dy);
                            newW = Math.max(minW, Math.min(maxW, Math.round(newH * (16 / 9))));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx + (newW - startW) / 2;
                            newTy = startTy + (newH - startH) / 2;
                        } else if (dir === 'n') {
                            newH = Math.max(Math.round(minW * 9 / 16), startH - dy);
                            newW = Math.max(minW, Math.min(maxW, Math.round(newH * (16 / 9))));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx + (newW - startW) / 2;
                            newTy = startTy - (newH - startH) / 2;
                        }
                    }
                } else {
                    // Standard flow / left-aligned window anchor compensation (zero opposite-edge jitter)
                    if (isCorner) {
                        let deltaW = 0;
                        if (dir === 'se') deltaW = dx;
                        else if (dir === 'sw') deltaW = -dx;
                        else if (dir === 'ne') deltaW = dx;
                        else if (dir === 'nw') deltaW = -dx;

                        let targetW = Math.max(minW, Math.min(maxW, startW + deltaW));
                        let targetH = Math.round(targetW * (9 / 16));

                        newW = targetW;
                        newH = targetH;

                        const dw = newW - startW;
                        const dh = newH - startH;

                        if (dir === 'se') {
                            newTx = startTx;
                            newTy = startTy;
                        } else if (dir === 'sw') {
                            newTx = startTx - dw;
                            newTy = startTy;
                        } else if (dir === 'ne') {
                            newTx = startTx;
                            newTy = startTy - dh;
                        } else if (dir === 'nw') {
                            newTx = startTx - dw;
                            newTy = startTy - dh;
                        }
                    } else {
                        if (dir === 'e') {
                            newW = Math.max(minW, Math.min(maxW, startW + dx));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx;
                            newTy = startTy;
                        } else if (dir === 'w') {
                            newW = Math.max(minW, Math.min(maxW, startW - dx));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx - (newW - startW);
                            newTy = startTy;
                        } else if (dir === 's') {
                            newH = Math.max(Math.round(minW * 9 / 16), startH + dy);
                            newW = Math.max(minW, Math.min(maxW, Math.round(newH * (16 / 9))));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx;
                            newTy = startTy;
                        } else if (dir === 'n') {
                            newH = Math.max(Math.round(minW * 9 / 16), startH - dy);
                            newW = Math.max(minW, Math.min(maxW, Math.round(newH * (16 / 9))));
                            newH = Math.round(newW * (9 / 16));
                            newTx = startTx;
                            newTy = startTy - (newH - startH);
                        }
                    }
                }

                winEl.style.width = `${Math.round(newW)}px`;
                winEl.style.maxWidth = 'none';
                winEl.style.flexShrink = '0';
                if (winEl.parentElement && winEl.parentElement.classList.contains('fg-project-window-shell')) {
                    winEl.parentElement.style.maxWidth = 'none';
                    winEl.parentElement.style.width = `${Math.round(newW)}px`;
                }
                if (contentEl) {
                    contentEl.style.height = `${Math.round(newH)}px`;
                    contentEl.style.maxHeight = 'none';
                    contentEl.style.aspectRatio = '16 / 9';
                }
                tx = newTx;
                ty = newTy;
                winEl.style.transform = `translate3d(${Math.round(tx)}px, ${Math.round(ty)}px, 0)`;
            };

            const onResizeUp = (e) => {
                if (!isResizing) return;
                isResizing = false;
                winEl.classList.remove('is-resizing');
                document.body.classList.remove('is-window-interacting');
                try {
                    handle.releasePointerCapture(e.pointerId);
                } catch (_) {}
                window.removeEventListener('pointermove', onResizeMove);
                window.removeEventListener('pointerup', onResizeUp);
                window.removeEventListener('pointercancel', onResizeUp);
            };

            handle.addEventListener('pointerdown', (e) => {
                bringToFront();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startW = winEl.offsetWidth;
                startH = contentEl ? contentEl.offsetHeight : Math.round(startW * (9 / 16));
                startTx = tx;
                startTy = ty;

                winEl.classList.add('is-resizing');
                document.body.classList.add('is-window-interacting');
                try {
                    handle.setPointerCapture(e.pointerId);
                } catch (_) {}

                window.addEventListener('pointermove', onResizeMove, { passive: false });
                window.addEventListener('pointerup', onResizeUp, { passive: false });
                window.addEventListener('pointercancel', onResizeUp, { passive: false });
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // 3. Window Control Buttons
        const closeBtn = winEl.querySelector('.kali-btn-close');
        const minBtn = winEl.querySelector('.kali-btn-min');
        const maxBtn = winEl.querySelector('.kali-btn-max');

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                winEl.style.opacity = '0';
                winEl.style.transform = `translate3d(${tx}px, ${ty + 16}px, 0) scale(0.96)`;
                winEl.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
                setTimeout(() => {
                    winEl.style.display = 'none';
                }, 240);
            });
        }

        if (minBtn) {
            let isMin = false;
            minBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                isMin = !isMin;
                const tb = winEl.querySelector('.vlc-toolbar') || winEl.querySelector('.kali-nav-toolbar');
                const sb = winEl.querySelector('.kali-statusbar');
                if (isMin) {
                    if (contentEl) contentEl.style.display = 'none';
                    if (tb) tb.style.display = 'none';
                    if (sb) sb.style.display = 'none';
                } else {
                    if (contentEl) contentEl.style.display = '';
                    if (tb) tb.style.display = '';
                    if (sb) sb.style.display = '';
                }
            });
        }

        if (maxBtn) {
            let isMax = false;
            let prevW = '';
            let prevH = '';
            let prevTx = 0;
            let prevTy = 0;

            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                isMax = !isMax;
                if (isMax) {
                    prevW = winEl.style.width;
                    prevH = contentEl ? contentEl.style.height : '';
                    prevTx = tx;
                    prevTy = ty;

                    winEl.style.width = 'calc(100vw - 48px)';
                    winEl.style.maxWidth = '1100px';
                    if (contentEl) {
                        contentEl.style.height = '520px';
                        contentEl.style.maxHeight = 'none';
                        contentEl.style.aspectRatio = 'auto';
                    }
                    tx = 0;
                    ty = 0;
                    winEl.style.transform = 'translate3d(0, 0, 0)';
                } else {
                    winEl.style.width = prevW || '';
                    winEl.style.maxWidth = '';
                    if (contentEl) {
                        contentEl.style.height = prevH || '';
                        contentEl.style.maxHeight = '';
                    }
                    tx = prevTx;
                    ty = prevTy;
                    winEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
                }
            });
        }

        // Prevent accidental click when dragging or resizing
        if (contentEl) {
            contentEl.addEventListener('click', (e) => {
                if (pointerMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    pointerMoved = false;
                }
            });
        }
    });
}

// --------------- Hero Logo Dock Animation ------------------
function initHeroLogoDock() {
    const navLink = document.querySelector('.nb-nav-home-link');
    const dock = document.getElementById('nb-nav-logo-dock');
    const heroAnchor = document.getElementById('fg-hero-logo-anchor');
    if (!navLink || !dock || !heroAnchor) return;

    document.body.classList.add('has-dock-logo');

    let deltaX = 0;
    let deltaY = 0;
    let scaleFactor = 1;
    let isInitialized = false;

    function computeMeasurements() {
        const prevTransform = dock.style.transform;
        const prevTransition = dock.style.transition;
        dock.style.transition = 'none';
        dock.style.transform = 'translate3d(0, 0, 0) scale(1)';

        const navRect = navLink.getBoundingClientRect();
        const heroRect = heroAnchor.getBoundingClientRect();

        const dockedWidth = dock.offsetWidth || (navRect.width > 0 ? navRect.width : 115);
        const heroWidth = heroAnchor.offsetWidth || heroRect.width || 580;

        scaleFactor = heroWidth / (dockedWidth || 1);

        const scrollY = window.scrollY || window.pageYOffset || 0;
        const navPageTop = navRect.top + scrollY;
        const heroPageTop = heroRect.top + scrollY;

        deltaX = heroRect.left - navRect.left;
        deltaY = heroPageTop - navPageTop;

        dock.style.transition = prevTransition;
        dock.style.transform = prevTransform;

        applyState(false);
    }

    function applyState(smooth = true) {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const shouldDock = scrollY > 28;

        if (!smooth) {
            dock.style.transition = 'none';
        } else {
            dock.style.transition = 'transform 0.46s cubic-bezier(0.16, 1, 0.3, 1)';
        }

        if (shouldDock) {
            document.body.classList.add('is-docked');
            dock.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        } else {
            document.body.classList.remove('is-docked');
            dock.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0) scale(${scaleFactor.toFixed(4)})`;
        }

        if (!smooth) {
            dock.offsetHeight;
            dock.style.transition = 'transform 0.46s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    }

    computeMeasurements();
    setTimeout(() => {
        computeMeasurements();
        isInitialized = true;
    }, 60);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!isInitialized) return;
        if (!ticking) {
            requestAnimationFrame(() => {
                applyState(true);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        computeMeasurements();
    });

    navLink.addEventListener('click', (e) => {
        if (document.body.classList.contains('is-docked')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    dock.addEventListener('click', (e) => {
        if (!document.body.classList.contains('is-docked')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// --------------- macOS Spaces Desktop Switch Transition -----
function ensureMacosHud() {
    let hud = document.getElementById('macos-spaces-hud');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'macos-spaces-hud';
        hud.className = 'macos-spaces-hud';
        hud.setAttribute('aria-hidden', 'true');
        hud.innerHTML = `
            <div class="macos-hud-pill">
                <span class="macos-hud-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="4" width="9" height="7" rx="1.5"></rect>
                        <rect x="13" y="4" width="9" height="7" rx="1.5"></rect>
                        <rect x="2" y="13" width="9" height="7" rx="1.5"></rect>
                        <rect x="13" y="13" width="9" height="7" rx="1.5"></rect>
                    </svg>
                </span>
                <span class="macos-hud-text" id="macos-hud-text">DESKTOP 1 &rarr; DESKTOP 2</span>
                <div class="macos-hud-dots">
                    <span class="macos-hud-dot macos-dot-1 active" id="macos-dot-1"></span>
                    <span class="macos-hud-dot macos-dot-2" id="macos-dot-2"></span>
                </div>
            </div>`;
        document.body.appendChild(hud);
    }
    return hud;
}

function showMacosHud(fromDesktop, toDesktop, duration = 1200) {
    const hud = ensureMacosHud();
    const textEl = document.getElementById('macos-hud-text');
    const dot1 = document.getElementById('macos-dot-1');
    const dot2 = document.getElementById('macos-dot-2');

    if (textEl) {
        textEl.textContent = `DESKTOP ${fromDesktop} \u2192 DESKTOP ${toDesktop}`;
    }
    if (dot1 && dot2) {
        dot1.classList.toggle('active', toDesktop === 1);
        dot2.classList.toggle('active', toDesktop === 2);
    }

    hud.classList.add('visible');
    clearTimeout(hud._hideTimeout);
    hud._hideTimeout = setTimeout(() => {
        hud.classList.remove('visible');
    }, duration);
}

function initMacosSpacesTransition() {
    // 1. Check if returning from About
    const pendingTrans = sessionStorage.getItem('macos_space_transition');
    if (pendingTrans === 'to_portfolio') {
        document.documentElement.dataset.vtDirection = 'backward';
        sessionStorage.removeItem('macos_space_transition');
        showMacosHud(2, 1, 1000);
    }

    // 2. Intercept all About links
    const aboutLinks = document.querySelectorAll('a[href="about.html"]');
    aboutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;

            e.preventDefault();
            const targetUrl = link.getAttribute('href');

            // Set direction forward (Slide left)
            document.documentElement.dataset.vtDirection = 'forward';
            sessionStorage.setItem('macos_space_transition', 'to_about');

            // Show HUD bezel
            showMacosHud(1, 2, 1400);

            // Navigate
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 80);
        });
    });
}

// --------------- Dynamic Monochrome Navbar Contrast --------
function initNavbarContrast() {
    const cols = [
        document.querySelector(".nb-nav-col-1"),
        document.querySelector(".nb-nav-col-4")
    ];

    let ticking = false;

    function checkContrast() {
        const mediaElements = document.querySelectorAll(
            ".nb-media-box, .nb-reel, .kali-window-vlc, .vlc-video-element, .nb-media-item img, .nb-reel video"
        );
        if (!mediaElements.length) return;

        cols.forEach(col => {
            if (!col) return;
            const r = col.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;

            let isOverMedia = false;
            for (let i = 0; i < mediaElements.length; i++) {
                const mr = mediaElements[i].getBoundingClientRect();
                const overlapX = Math.max(0, Math.min(r.right, mr.right) - Math.max(r.left, mr.left));
                const overlapY = Math.max(0, Math.min(r.bottom, mr.bottom) - Math.max(r.top, mr.top));

                if (overlapX > 4 && overlapY > 4) {
                    isOverMedia = true;
                    break;
                }
            }

            if (isOverMedia) {
                col.classList.add("nb-contrast-invert");
            } else {
                col.classList.remove("nb-contrast-invert");
            }
        });

        ticking = false;
    }

    window.checkNavbarContrast = checkContrast;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(checkContrast);
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    checkContrast();
}

// --------------- Site Intro Splash Overlay -----------------
function initSiteIntro() {
    const overlay = document.getElementById("site-intro-overlay");
    if (!overlay) return;

    // Se l'intro è già stata visualizzata in questa sessione o stiamo tornando da About, non riavviarla
    const alreadyPlayed = sessionStorage.getItem("site_intro_played");
    const isSpaceTransition = sessionStorage.getItem("macos_space_transition") === "to_portfolio";
    if (alreadyPlayed || isSpaceTransition) {
        overlay.style.display = "none";
        return;
    }

    // Segna che l'intro è stata mostrata per non ripeterla ai cambi pagina
    sessionStorage.setItem("site_intro_played", "true");

    let isDismissed = false;

    function dismissIntro() {
        if (isDismissed) return;
        isDismissed = true;
        overlay.classList.add("is-faded");

        const cleanup = () => {
            overlay.style.display = "none";
            overlay.removeEventListener("transitionend", cleanup);
        };
        overlay.addEventListener("transitionend", cleanup);
        setTimeout(cleanup, 950);
    }

    // Dissolvenza automatica dopo ~1.4s di esposizione
    const timer = setTimeout(dismissIntro, 1400);

    // Permette all'utente di fare click o tap per entrare subito
    overlay.addEventListener("click", () => {
        clearTimeout(timer);
        dismissIntro();
    });

    // Permette di chiudere con Escape, Spazio o Invio
    window.addEventListener("keydown", (e) => {
        if (!isDismissed && (e.key === "Escape" || e.key === " " || e.key === "Enter")) {
            clearTimeout(timer);
            dismissIntro();
        }
    }, { once: true });
}

// --------------- Theme & Event Handling --------------------
function initTheme() {
    const savedTheme = localStorage.getItem("portfolio_theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
}

function bindEvents() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-theme");
            localStorage.setItem("portfolio_theme", isDark ? "dark" : "light");
            if (window.checkNavbarContrast) window.checkNavbarContrast();
        });
    }

    // Reactive Language Switch Listener for Desktop Canvas & Ticker
    window.addEventListener("langchange", (e) => {
        const lang = e.detail ? e.detail.lang : ((window.I18N && window.I18N.getLang()) || localStorage.getItem("portfolio_user_selected_lang") || localStorage.getItem("portfolio_lang") || "en");

        // 1. Update MSCHF Ticker
        const tickerWrap = document.getElementById("home-statement-ticker");
        if (tickerWrap) {
            const rawText = escapeHTML(getTickerText());
            const itemContent = `<span>${rawText} &nbsp;-&nbsp;&nbsp;</span>`;
            tickerWrap.querySelectorAll(".mschf-marquee-item").forEach(el => {
                el.innerHTML = itemContent;
            });
            if (typeof initMschfMarquee === "function") initMschfMarquee();
        }

        // 2. Update window toolbar & statusbar project metadata
        document.querySelectorAll("[data-meta-idx]").forEach(el => {
            const idx = parseInt(el.getAttribute("data-meta-idx"), 10);
            el.textContent = getProjectMeta(idx);
        });

        // 3. Update stamp metas
        document.querySelectorAll("[data-stamp-meta-idx]").forEach(el => {
            const idx = parseInt(el.getAttribute("data-stamp-meta-idx"), 10);
            el.textContent = getProjectMeta(idx);
        });

        // 4. Update project descriptions if displayed
        document.querySelectorAll("[data-desc-idx]").forEach(el => {
            const idx = parseInt(el.getAttribute("data-desc-idx"), 10);
            el.textContent = getProjectDescription(idx);
        });
    });

    const homeLink = document.querySelector(".nb-nav-home-link");
    if (homeLink) {
        homeLink.addEventListener("click", (e) => {
            const path = window.location.pathname;
            if (path.endsWith("index.html") || path.endsWith("/") || path === "") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    // Contact smooth scrolling for desktop
    const contactDesktopLink = document.querySelector(".nb-nav-contact-link");
    if (contactDesktopLink) {
        contactDesktopLink.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.getElementById("contact");
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Mobile Hamburger Menu
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const contactMobileLink = document.getElementById("mobile-link-contact");

    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === "boolean" ? open : !mobileMenu.classList.contains("is-open");
            mobileMenu.classList.toggle("is-open", isOpen);
            menuToggle.classList.toggle("is-open", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
        };

        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        if (contactMobileLink) {
            contactMobileLink.addEventListener("click", (e) => {
                e.preventDefault();
                toggleMenu(false);
                const target = document.getElementById("contact");
                if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        }

        const reelMobileLink = document.getElementById("mobile-link-reel");
        if (reelMobileLink) {
            reelMobileLink.addEventListener("click", (e) => {
                e.preventDefault();
                toggleMenu(false);
                const target = document.getElementById("hero-win-vlc");
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                    const video = target.querySelector(".vlc-video-element");
                    if (video && video.paused) video.play().catch(() => {});
                }
            });
        }

        // Close when clicking outside
        document.addEventListener("click", (e) => {
            if (mobileMenu.classList.contains("is-open")) {
                if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    toggleMenu(false);
                }
            }
        });

        // Close on escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
                toggleMenu(false);
            }
        });

        // Close on resize to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains("is-open")) {
                toggleMenu(false);
            }
        });
    }

    initNavbarContrast();
}

// --------------- Typing Animation Bio Overlay ---------------
function initTypingBio() {
    const textContainer = document.querySelector("#reel-typing-text .typing-content");
    if (!textContainer) return;

    const fullText = CONFIG.bioText ||
        "Curious by nature and attentive to every detail, I base my work on observation and research. I turn my constant desire to learn into new practical skills, applying them directly to the development and growth of every project.";

    textContainer.textContent = "";
    let charIndex = 0;
    let hasStarted = false;

    function typeNextChar() {
        if (charIndex < fullText.length) {
            const char = fullText.charAt(charIndex);
            textContainer.textContent += char;
            charIndex++;

            let delay = 22 + Math.random() * 12;
            if (char === '.' || char === '!' || char === '?') {
                delay = 230;
            } else if (char === ',') {
                delay = 130;
            }

            setTimeout(typeNextChar, delay);
        }
    }

    function startTyping() {
        if (hasStarted) return;
        hasStarted = true;
        setTimeout(typeNextChar, 350);
    }

    const overlay = document.getElementById("site-intro-overlay");
    const alreadyPlayed = sessionStorage.getItem("site_intro_played");
    const isSpaceTransition = sessionStorage.getItem("macos_space_transition") === "to_portfolio";

    if (!alreadyPlayed && !isSpaceTransition && overlay && overlay.style.display !== "none" && !overlay.classList.contains("is-faded")) {
        const checkIntro = setInterval(() => {
            if (overlay.style.display === "none" || overlay.classList.contains("is-faded")) {
                clearInterval(checkIntro);
                setTimeout(startTyping, 200);
            }
        }, 100);
    } else {
        startTyping();
    }
}

// --------------- Init --------------------------------------
initTheme();
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildPage);
} else {
    buildPage();
}
