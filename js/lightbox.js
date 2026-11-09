/* ============================================================
   PROJECT LIGHTBOX — Fullscreen Image Viewer
   Lorenzo Kraja Portfolio
   ============================================================ */

(function () {
    'use strict';

    function initLightbox() {
        // Collect all project content images
        const imageElements = Array.from(
            document.querySelectorAll(
                '.digital-image-box img, .digital-editorial-pair img, .digital-editorial-hero img, .digital-tree-node img, .digital-monograph-container img'
            )
        ).filter(img => {
            // Exclude small icons, logos, or utility images if any
            const w = img.naturalWidth || img.width || 100;
            const h = img.naturalHeight || img.height || 100;
            return !img.classList.contains('nb-theme-icon') && w > 50 && h > 50;
        });

        if (!imageElements.length) return;

        // Build Lightbox DOM
        let lightbox = document.getElementById('project-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'project-lightbox';
            lightbox.className = 'project-lightbox';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-modal', 'true');
            lightbox.setAttribute('aria-label', 'Anteprima a schermo intero');
            lightbox.setAttribute('aria-hidden', 'true');

            lightbox.innerHTML = `
                <div class="lightbox-backdrop"></div>
                <div class="lightbox-stage">
                    <button class="lightbox-btn lightbox-close" type="button" aria-label="Chiudi (Esc)" title="Chiudi (Esc)">
                        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <button class="lightbox-btn lightbox-prev" type="button" aria-label="Immagine precedente (Freccia sinistra)" title="Precedente (&larr;)">
                        <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <button class="lightbox-btn lightbox-next" type="button" aria-label="Immagine successiva (Freccia destra)" title="Successiva (&rarr;)">
                        <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    <div class="lightbox-figure">
                        <div class="lightbox-image-wrap">
                            <img class="lightbox-img" src="" alt="" draggable="false">
                        </div>
                        <div class="lightbox-meta">
                            <span class="lightbox-counter">01 / 01</span>
                            <span class="lightbox-caption"></span>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(lightbox);
        }

        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const stage = lightbox.querySelector('.lightbox-stage');
        const imgEl = lightbox.querySelector('.lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const counterEl = lightbox.querySelector('.lightbox-counter');
        const captionEl = lightbox.querySelector('.lightbox-caption');

        let currentIndex = 0;
        let isOpen = false;
        let touchStartX = 0;
        let touchStartY = 0;

        function updateContent(index) {
            if (index < 0) index = imageElements.length - 1;
            if (index >= imageElements.length) index = 0;
            currentIndex = index;

            const targetImg = imageElements[currentIndex];
            if (!targetImg) return;

            imgEl.style.opacity = '0';
            imgEl.style.transform = 'scale(0.97)';

            const src = targetImg.currentSrc || targetImg.src;
            const alt = targetImg.alt || '';

            // Extract nearest plate title or caption if available
            const node = targetImg.closest('.digital-tree-node');
            let label = alt;
            if (node) {
                const headerTag = node.querySelector('.digital-section-tag, .digital-caption-label');
                if (headerTag && headerTag.textContent.trim()) {
                    label = headerTag.textContent.trim();
                }
            }

            imgEl.onload = () => {
                imgEl.style.opacity = '1';
                imgEl.style.transform = 'scale(1)';
            };

            imgEl.src = src;
            imgEl.alt = alt;

            const total = String(imageElements.length).padStart(2, '0');
            const cur = String(currentIndex + 1).padStart(2, '0');
            if (counterEl) counterEl.textContent = `${cur} / ${total}`;
            if (captionEl) captionEl.textContent = label ? `// ${label}` : '';

            // Hide nav arrows if only 1 image
            if (imageElements.length <= 1) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
            } else {
                if (prevBtn) prevBtn.style.display = '';
                if (nextBtn) nextBtn.style.display = '';
            }
        }

        function openLightbox(index) {
            isOpen = true;
            lightbox.classList.add('is-active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('lightbox-open');
            updateContent(index);
            closeBtn.focus();
        }

        function closeLightbox() {
            if (!isOpen) return;
            isOpen = false;
            lightbox.classList.remove('is-active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lightbox-open');
            if (imageElements[currentIndex]) {
                imageElements[currentIndex].focus();
            }
        }

        function showNext() {
            updateContent(currentIndex + 1);
        }

        function showPrev() {
            updateContent(currentIndex - 1);
        }

        // Attach click to page images
        imageElements.forEach((img, idx) => {
            img.style.cursor = 'zoom-in';
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', `Ingrandisci immagine: ${img.alt || 'Progetto'}`);
            img.title = 'Clicca per aprire a tutto schermo';

            img.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(idx);
            });

            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(idx);
                }
            });
        });

        // Event listeners
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

        if (backdrop) backdrop.addEventListener('click', closeLightbox);

        // Clicking outside image (on stage) closes lightbox
        if (stage) {
            stage.addEventListener('click', (e) => {
                if (!e.target.closest('.lightbox-image-wrap') && !e.target.closest('.lightbox-btn') && !e.target.closest('.lightbox-meta')) {
                    closeLightbox();
                }
            });
        }

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                showNext();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                showPrev();
            }
        });

        // Touch Swipe gestures
        lightbox.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const diffX = e.changedTouches[0].clientX - touchStartX;
                const diffY = e.changedTouches[0].clientY - touchStartY;
                if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX < 0) showNext();
                    else showPrev();
                } else if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX)) {
                    // Swipe down to close
                    closeLightbox();
                }
            }
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }
})();
