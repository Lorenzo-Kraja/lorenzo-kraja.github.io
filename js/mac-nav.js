/* ============================================================
   CLASSIC MAC OS TOP MENU BAR LOGIC
   Shared across Home, About, and Project Pages
   ============================================================ */

(function () {
    'use strict';

    function initMacNav() {
        const nav = document.getElementById('mac-top-nav');
        if (!nav) return;

        // 1. Dropdown menus (Projects & Contatti)
        function setupDropdown(itemId, btnId, dropdownId) {
            const item = document.getElementById(itemId);
            const btn = document.getElementById(btnId);
            const dropdown = document.getElementById(dropdownId);
            if (!item || !btn || !dropdown) return null;

            let closeTimer = null;

            const openDropdown = () => {
                clearTimeout(closeTimer);
                // Close other dropdowns
                document.querySelectorAll('.mac-dropdown-menu.is-open').forEach(d => {
                    if (d !== dropdown) d.classList.remove('is-open');
                });
                document.querySelectorAll('.mac-menu-title.is-active').forEach(b => {
                    if (b !== btn) {
                        b.classList.remove('is-active');
                        b.setAttribute('aria-expanded', 'false');
                    }
                });
                document.querySelectorAll('.mac-menu-item.is-open').forEach(it => {
                    if (it !== item) it.classList.remove('is-open');
                });

                dropdown.classList.add('is-open');
                btn.classList.add('is-active');
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            };

            const closeDropdown = (immediate = false) => {
                clearTimeout(closeTimer);
                if (immediate) {
                    dropdown.classList.remove('is-open');
                    btn.classList.remove('is-active');
                    item.classList.remove('is-open');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    closeTimer = setTimeout(() => {
                        dropdown.classList.remove('is-open');
                        btn.classList.remove('is-active');
                        item.classList.remove('is-open');
                        btn.setAttribute('aria-expanded', 'false');
                    }, 180);
                }
            };

            // Hover on desktop
            item.addEventListener('mouseenter', openDropdown);
            item.addEventListener('mouseleave', () => closeDropdown(false));

            // Click / touch toggle
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (dropdown.classList.contains('is-open')) {
                    closeDropdown(true);
                } else {
                    openDropdown();
                }
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (dropdown.classList.contains('is-open')) {
                    if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                        closeDropdown(true);
                    }
                }
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
                    closeDropdown(true);
                }
            });

            return { open: openDropdown, close: closeDropdown };
        }

        const projectsMenu = setupDropdown('mac-menu-projects', 'mac-projects-btn', 'mac-projects-dropdown');
        const contactMenu = setupDropdown('mac-menu-contact', 'mac-contact-btn', 'mac-contact-dropdown');

        // 2. Project dropdown items click handling
        document.querySelectorAll('.mac-project-dropdown-item').forEach(link => {
            link.addEventListener('click', (e) => {
                if (projectsMenu) projectsMenu.close(true);
                const href = link.getAttribute('href');
                if (!href) return;

                // If clicking current page project link, scroll smoothly to top
                const currentPath = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '');
                const targetClean = href.replace(/\.html$/, '').replace(/^\.\//, '');
                if (currentPath.endsWith(targetClean) && targetClean !== '' && !href.includes('#')) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        // 3. Theme Toggle
        const themeBtn = document.getElementById('theme-toggle');
        function applyTheme(isDark) {
            document.body.classList.toggle('dark-theme', isDark);
            try {
                localStorage.setItem('portfolio_theme', isDark ? 'dark' : 'light');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            } catch(e) {}
        }

        const storedTheme = (() => {
            try {
                return localStorage.getItem('portfolio_theme') || localStorage.getItem('theme');
            } catch(e) { return null; }
        })();
        if (storedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (storedTheme === 'light') {
            document.body.classList.remove('dark-theme');
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nowDark = !document.body.classList.contains('dark-theme');
                applyTheme(nowDark);
            });
        }

        // 4. Live Clock
        if (window.I18N && typeof window.I18N.initLiveClock === 'function') {
            window.I18N.initLiveClock('live-clock');
        }

        // 5. Fallback for file:// protocol
        if (window.location.protocol === 'file:') {
            document.addEventListener('click', function (e) {
                const a = e.target.closest('a');
                if (a) {
                    const href = a.getAttribute('href');
                    if (href === './' || href === '/') {
                        e.preventDefault();
                        window.location.href = 'index.html';
                    } else if (href && href.startsWith('./#')) {
                        e.preventDefault();
                        window.location.href = 'index.html' + href.slice(2);
                    }
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMacNav);
    } else {
        initMacNav();
    }
})();
