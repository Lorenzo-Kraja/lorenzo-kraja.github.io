/* ============================================================
   LORENZO KRAJA OS — Desktop Operating System Manager
   Inspired by Virgil Abloh's public---domain.com & Debian Kali XFCE
   ============================================================ */

(function () {
    'use strict';

    // --------------- Configuration ---------------
    const CONFIG = {
        timezoneIANA: "Europe/Rome",
        timezoneLabel: "RM",
    };

    // --------------- State ---------------
    let highestZIndex = 50;
    const windows = {};
    const winKeys = ['cv', 'projects', 'contact', 'preview'];
    let activePreviewFile = null;
    let activeWinKey = null;
    let prevWindowBeforePreview = null;
    let allMinimized = false;
    let prevStatesBeforeShowDesktop = {};

    // --------------- Theme Initialization ---------------
    function initTheme() {
        const savedTheme = localStorage.getItem("portfolio_theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }

        const toggleBtn = document.getElementById("theme-toggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                const isDark = document.body.classList.toggle("dark-theme");
                localStorage.setItem("portfolio_theme", isDark ? "dark" : "light");
            });
        }
    }

    const t = (k) => (window.I18N && window.I18N.t ? window.I18N.t(k) : k);

    // --------------- Live Clock -------------------------
    function initClock() {
        if (window.I18N && typeof window.I18N.initLiveClock === 'function') {
            window.I18N.initLiveClock('live-clock');
            return;
        }

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
                    }).format(now) + " " + CONFIG.timezoneLabel;
            } catch {
                el.textContent = "08:22:30 " + CONFIG.timezoneLabel;
            }
        };

        tick();
        setInterval(tick, 1000);
    }

    // --------------- Classic Mac OS System Menu Bar (Dropdowns) -----
    function initMacMenuBar() {
        function setupDropdown(itemId, btnId, dropdownId) {
            const item = document.getElementById(itemId);
            const btn = document.getElementById(btnId);
            const dropdown = document.getElementById(dropdownId);
            if (!item || !btn || !dropdown) return null;

            let closeTimer = null;

            const openDropdown = () => {
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
                document.querySelectorAll(".mac-dropdown-menu.is-open").forEach(d => {
                    if (d !== dropdown) d.classList.remove("is-open");
                });
                document.querySelectorAll(".mac-menu-title.is-active").forEach(b => {
                    if (b !== btn) {
                        b.classList.remove("is-active");
                        b.setAttribute("aria-expanded", "false");
                    }
                });
                document.querySelectorAll(".mac-menu-item.is-open").forEach(it => {
                    if (it !== item) it.classList.remove("is-open");
                });

                dropdown.classList.add("is-open");
                btn.classList.add("is-active");
                item.classList.add("is-open");
                btn.setAttribute("aria-expanded", "true");
            };

            const closeDropdown = (immediate = false) => {
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
                if (immediate) {
                    dropdown.classList.remove("is-open");
                    btn.classList.remove("is-active");
                    item.classList.remove("is-open");
                    btn.setAttribute("aria-expanded", "false");
                } else {
                    closeTimer = setTimeout(() => {
                        dropdown.classList.remove("is-open");
                        btn.classList.remove("is-active");
                        item.classList.remove("is-open");
                        btn.setAttribute("aria-expanded", "false");
                    }, 180);
                }
            };

            // Hover for desktop
            item.addEventListener("mouseenter", openDropdown);
            item.addEventListener("mouseleave", () => closeDropdown(false));

            // Click / touch toggle
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (dropdown.classList.contains("is-open")) {
                    closeDropdown(true);
                } else {
                    openDropdown();
                }
            });

            // Close on clicking outside
            document.addEventListener("click", (e) => {
                if (dropdown.classList.contains("is-open")) {
                    if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                        closeDropdown(true);
                    }
                }
            });

            // Close on Escape key
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && dropdown.classList.contains("is-open")) {
                    closeDropdown(true);
                }
            });

            return { open: openDropdown, close: closeDropdown };
        }

        const projectsMenu = setupDropdown("mac-menu-projects", "mac-projects-btn", "mac-projects-dropdown");
        const contactMenu = setupDropdown("mac-menu-contact", "mac-contact-btn", "mac-contact-dropdown");

        // Project dropdown items click handling: opens directly the project page on click!
        const projectItems = document.querySelectorAll(".mac-project-dropdown-item");
        projectItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                const href = item.getAttribute("href");
                if (projectsMenu) projectsMenu.close(true);
                if (href) {
                    window.location.href = href;
                }
            });
        });

        // Contact dropdown items click handling: "Chi Sono..." focuses the CV/About window
        const aboutDropdownItems = document.querySelectorAll("#mac-contact-dropdown a");
        aboutDropdownItems.forEach(link => {
            const href = link.getAttribute("href");
            if (href === "about.html" || href === "#kali-win-contact" || link.querySelector("[data-i18n='nav.about']")) {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    if (contactMenu) contactMenu.close(true);
                    openWindow("cv");
                    bringToFront("cv");
                });
            }
        });
    }

    // --------------- Window Manager ---------------------
    function initWindows() {
        winKeys.forEach(key => {
            const el = document.getElementById(`kali-win-${key}`);
            const titlebar = document.getElementById(`kali-tb-${key}`);
            const tab = document.getElementById(`tab-${key}`);
            if (!el) return;

            windows[key] = {
                el,
                titlebar,
                tab,
                isMaximized: false,
                isMinimized: el.classList.contains('is-closed'),
                hasBeenDragged: false,
                prevRect: null
            };

            // Focus on mousedown
            el.addEventListener('pointerdown', () => {
                bringToFront(key);
            });

            // Titlebar Dragging
            if (titlebar) {
                setupWindowDragging(key, el, titlebar);
            }
        });

        // Window Resizing (Corners & Edges)
        initWindowResizing();

        // Window Control Buttons
        document.querySelectorAll('.kali-btn-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.dataset.win;
                if (key) closeWindow(key);
            });
        });

        document.querySelectorAll('.kali-btn-min').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.dataset.win;
                if (key) minimizeWindow(key);
            });
        });

        document.querySelectorAll('.kali-btn-max').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const key = btn.dataset.win;
                if (key) toggleMaximizeWindow(key);
            });
        });

        // Taskbar tabs
        document.querySelectorAll('.kali-task-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const key = tab.dataset.win;
                if (!key || !windows[key]) return;

                const winObj = windows[key];
                if (winObj.el.classList.contains('is-closed')) {
                    openWindow(key);
                } else if (winObj.el.classList.contains('is-minimized')) {
                    winObj.el.classList.remove('is-minimized');
                    bringToFront(key);
                } else if (activeWinKey === key) {
                    minimizeWindow(key);
                } else {
                    bringToFront(key);
                }
            });
        });

        // Show Desktop toggle
        const showDesktopBtn = document.getElementById('kali-show-desktop');
        if (showDesktopBtn) {
            showDesktopBtn.addEventListener('click', () => {
                if (!allMinimized) {
                    winKeys.forEach(k => {
                        const w = windows[k];
                        if (w && !w.el.classList.contains('is-closed')) {
                            prevStatesBeforeShowDesktop[k] = !w.el.classList.contains('is-minimized');
                            w.el.classList.add('is-minimized');
                            if (w.tab) w.tab.classList.remove('active');
                        }
                    });
                    allMinimized = true;
                    updateTopBarTitle("Desktop");
                } else {
                    winKeys.forEach(k => {
                        const w = windows[k];
                        if (w && prevStatesBeforeShowDesktop[k]) {
                            w.el.classList.remove('is-minimized');
                        }
                    });
                    allMinimized = false;
                    if (activeWinKey) bringToFront(activeWinKey);
                }
            });
        }

        // Applications Launcher Menu
        const launcherBtn = document.getElementById('kali-launcher-btn');
        const appMenu = document.getElementById('kali-app-menu');
        if (launcherBtn && appMenu) {
            launcherBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = appMenu.style.display === 'flex';
                appMenu.style.display = isOpen ? 'none' : 'flex';
            });

            document.addEventListener('click', (e) => {
                if (!appMenu.contains(e.target) && e.target !== launcherBtn) {
                    appMenu.style.display = 'none';
                }
            });

            appMenu.querySelectorAll('.kali-app-menu-item[data-action="win"]').forEach(item => {
                item.addEventListener('click', () => {
                    const target = item.dataset.target;
                    if (target) openWindow(target);
                    appMenu.style.display = 'none';
                });
            });
        }

        // Global Esc shortcut
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeWinKey && windows[activeWinKey]) {
                const cur = windows[activeWinKey];
                if (cur && !cur.el.classList.contains('is-closed') && !cur.el.classList.contains('is-minimized')) {
                    closeWindow(activeWinKey);
                }
            }
        });
    }

    function bringToFront(key) {
        const win = windows[key];
        if (!win || win.el.classList.contains('is-closed')) return;

        highestZIndex += 2;
        win.el.style.zIndex = highestZIndex;

        // On mobile, enforce single-window view so windows don't overlap or clutter
        if (window.innerWidth <= 768) {
            winKeys.forEach(otherKey => {
                if (otherKey !== key && windows[otherKey]) {
                    const otherWin = windows[otherKey];
                    otherWin.el.classList.add('is-closed');
                    otherWin.el.classList.remove('is-focused');
                    otherWin.el.classList.remove('is-minimized');
                    if (otherWin.tab) {
                        otherWin.tab.style.display = 'none';
                        otherWin.tab.classList.remove('active');
                    }
                }
            });
        }

        // Visual classes
        winKeys.forEach(k => {
            if (windows[k]) {
                windows[k].el.classList.remove('is-focused');
                if (windows[k].tab) windows[k].tab.classList.remove('active');
            }
        });

        win.el.classList.add('is-focused');
        win.el.classList.remove('is-minimized');
        if (win.tab) {
            win.tab.style.display = 'inline-flex';
            win.tab.classList.add('active');
        }

        activeWinKey = key;
        updateTopBarTitle(getWindowTitle(key));

        if (window.innerWidth <= 768 && win.el) {
            setTimeout(() => {
                win.el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 60);
        }
    }

    function getWindowTitle(key) {
        switch (key) {
            case 'cv': return 'curriculum.pdf — Document Viewer';
            case 'projects': return 'Personal Stuff';
            case 'contact': return 'contacts.txt — Text Editor';
            case 'preview': return activePreviewFile ? `${activePreviewFile.name} — Image Viewer` : 'Image Viewer';
            default: return 'Desktop';
        }
    }

    function updateTopBarTitle(title) {
        const titleEl = document.getElementById('kali-active-title');
        if (titleEl) titleEl.textContent = title;
    }

    function openWindow(key) {
        const win = windows[key];
        if (!win) return;

        // On mobile, close all other windows so only a single window is open at a time
        if (window.innerWidth <= 768) {
            winKeys.forEach(otherKey => {
                if (otherKey !== key && windows[otherKey]) {
                    const otherWin = windows[otherKey];
                    otherWin.el.classList.add('is-closed');
                    otherWin.el.classList.remove('is-focused');
                    otherWin.el.classList.remove('is-minimized');
                    if (otherWin.tab) {
                        otherWin.tab.style.display = 'none';
                        otherWin.tab.classList.remove('active');
                    }
                }
            });
        }

        win.el.classList.remove('is-closed');
        win.el.classList.remove('is-minimized');
        if (win.tab) win.tab.style.display = 'inline-flex';

        bringToFront(key);
    }

    function closeWindow(key) {
        const win = windows[key];
        if (!win) return;

        win.el.classList.add('is-closed');
        win.el.classList.remove('is-focused');
        if (win.tab) {
            win.tab.style.display = 'none';
            win.tab.classList.remove('active');
        }

        // On mobile, if preview was closed and opened from projects, return smoothly to Personal Stuff
        if (window.innerWidth <= 768) {
            if (key === 'preview' && prevWindowBeforePreview === 'projects' && windows['projects']) {
                prevWindowBeforePreview = null;
                openWindow('projects');
                return;
            }
            activeWinKey = null;
            updateTopBarTitle("Desktop");
            return;
        }

        // Find next open window to focus
        let next = winKeys.find(k => windows[k] && !windows[k].el.classList.contains('is-closed') && !windows[k].el.classList.contains('is-minimized'));
        if (next) {
            bringToFront(next);
        } else {
            activeWinKey = null;
            updateTopBarTitle("Desktop");
        }
    }

    function minimizeWindow(key) {
        const win = windows[key];
        if (!win) return;

        win.el.classList.add('is-minimized');
        win.el.classList.remove('is-focused');
        if (win.tab) win.tab.classList.remove('active');

        // Focus next
        let next = winKeys.find(k => windows[k] && !windows[k].el.classList.contains('is-closed') && !windows[k].el.classList.contains('is-minimized'));
        if (next) {
            bringToFront(next);
        } else {
            activeWinKey = null;
            updateTopBarTitle("Desktop");
        }
    }

    function toggleMaximizeWindow(key) {
        const win = windows[key];
        if (!win) return;

        if (!win.isMaximized) {
            // Save current position
            win.prevRect = {
                top: win.el.style.top,
                left: win.el.style.left,
                width: win.el.style.width,
                height: win.el.style.height
            };
            win.el.classList.add('is-maximized');
            win.isMaximized = true;
        } else {
            win.el.classList.remove('is-maximized');
            if (win.prevRect) {
                win.el.style.top = win.prevRect.top;
                win.el.style.left = win.prevRect.left;
                win.el.style.width = win.prevRect.width;
                win.el.style.height = win.prevRect.height;
            }
            win.isMaximized = false;
        }
        bringToFront(key);
    }

    // --------------- Window Dragging ---------------------
    function setupWindowDragging(key, winEl, handleEl) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let initialLeft = 0, initialTop = 0;

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            const parent = winEl.offsetParent || document.getElementById('kali-os-desktop') || document.body;
            const maxLeft = parent.clientWidth - 80;
            const minLeft = -(winEl.offsetWidth - 80);
            const maxTop = Math.max(0, parent.clientHeight - 36);
            const minTop = 0; // Flush with topbar (0px gap)

            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));

            winEl.style.left = `${newLeft}px`;
            winEl.style.top = `${newTop}px`;
            winEl.style.margin = '0';
        };

        const stopDrag = (e) => {
            if (isDragging) {
                isDragging = false;
                winEl.classList.remove('is-dragging');
                document.body.classList.remove('is-window-interacting');
                try {
                    handleEl.releasePointerCapture(e.pointerId);
                } catch { }
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', stopDrag);
                window.removeEventListener('pointercancel', stopDrag);
            }
        };

        handleEl.addEventListener('pointerdown', (e) => {
            if (window.innerWidth <= 768) return;
            // Ignore if maximized or clicking control buttons
            if (windows[key].isMaximized || e.target.closest('.kali-controls') || e.target.closest('button')) {
                return;
            }

            windows[key].hasBeenDragged = true;
            bringToFront(key);
            isDragging = true;
            winEl.classList.add('is-dragging');
            document.body.classList.add('is-window-interacting');
            try {
                handleEl.setPointerCapture(e.pointerId);
            } catch { }

            startX = e.clientX;
            startY = e.clientY;

            // Accurate parent-relative coordinates (fixes cursor jump and top gap)
            const parent = winEl.offsetParent || document.getElementById('kali-os-desktop') || document.body;
            const parentRect = parent.getBoundingClientRect();
            const rect = winEl.getBoundingClientRect();

            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', stopDrag);
            window.addEventListener('pointercancel', stopDrag);

            e.preventDefault();
        });
    }

    // --------------- Window Resizing (Corners & Edges) ---
    function initWindowResizing() {
        winKeys.forEach(key => {
            const win = windows[key];
            if (!win || !win.el) return;
            const winEl = win.el;

            const directions = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'];
            directions.forEach(dir => {
                let handle = winEl.querySelector(`.kali-resize-${dir}`);
                if (!handle) {
                    handle = document.createElement('div');
                    handle.className = `kali-resize-handle kali-resize-${dir}`;
                    handle.dataset.dir = dir;
                    handle.dataset.win = key;
                    handle.setAttribute('aria-hidden', 'true');
                    winEl.appendChild(handle);
                }
                setupWindowResizeHandle(key, winEl, handle, dir);
            });
        });
    }

    function setupWindowResizeHandle(key, winEl, handleEl, dir) {
        let isResizing = false;
        let startX = 0, startY = 0;
        let initialLeft = 0, initialTop = 0;
        let initialWidth = 0, initialHeight = 0;

        const onPointerMove = (e) => {
            if (!isResizing) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let minW = 280;
            let minH = 200;
            if (key === 'projects') {
                minW = 380;
                minH = 240;
            } else if (key === 'cv') {
                minW = 280;
                minH = 220;
            } else if (key === 'contact') {
                minW = 260;
                minH = 200;
            }

            const parent = winEl.offsetParent || document.getElementById('kali-os-desktop') || document.body;
            const maxDesktopW = parent.clientWidth;
            const maxDesktopH = parent.clientHeight;

            let newLeft = initialLeft;
            let newTop = initialTop;
            let newWidth = initialWidth;
            let newHeight = initialHeight;

            // East: adjust width
            if (dir.indexOf('e') !== -1) {
                newWidth = Math.max(minW, Math.min(initialWidth + dx, maxDesktopW - initialLeft));
            }

            // West: adjust left and width
            if (dir.indexOf('w') !== -1) {
                let proposedW = initialWidth - dx;
                let proposedLeft = initialLeft + dx;
                if (proposedW < minW) {
                    proposedLeft = initialLeft + (initialWidth - minW);
                    proposedW = minW;
                }
                if (proposedLeft < 0) {
                    proposedW += proposedLeft;
                    proposedLeft = 0;
                }
                newLeft = proposedLeft;
                newWidth = Math.max(minW, proposedW);
            }

            // South: adjust height
            if (dir.indexOf('s') !== -1) {
                newHeight = Math.max(minH, Math.min(initialHeight + dy, maxDesktopH - initialTop));
            }

            // North: adjust top and height
            if (dir.indexOf('n') !== -1) {
                let proposedH = initialHeight - dy;
                let proposedTop = initialTop + dy;
                if (proposedH < minH) {
                    proposedTop = initialTop + (initialHeight - minH);
                    proposedH = minH;
                }
                if (proposedTop < 0) {
                    proposedH += proposedTop;
                    proposedTop = 0;
                }
                newTop = proposedTop;
                newHeight = Math.max(minH, proposedH);
            }

            winEl.style.left = `${Math.round(newLeft)}px`;
            winEl.style.top = `${Math.round(newTop)}px`;
            winEl.style.width = `${Math.round(newWidth)}px`;
            winEl.style.height = `${Math.round(newHeight)}px`;
            winEl.style.margin = '0';
        };

        const stopResize = (e) => {
            if (isResizing) {
                isResizing = false;
                winEl.classList.remove('is-resizing');
                document.body.classList.remove('is-window-interacting');
                document.body.style.cursor = '';
                try {
                    handleEl.releasePointerCapture(e.pointerId);
                } catch { }
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', stopResize);
                window.removeEventListener('pointercancel', stopResize);
            }
        };

        handleEl.addEventListener('pointerdown', (e) => {
            if (window.innerWidth <= 768) return;
            if (windows[key].isMaximized || winEl.classList.contains('is-closed') || winEl.classList.contains('is-minimized')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            windows[key].hasBeenDragged = true;
            bringToFront(key);

            isResizing = true;
            winEl.classList.add('is-resizing');
            document.body.classList.add('is-window-interacting');
            try {
                handleEl.setPointerCapture(e.pointerId);
            } catch { }

            const activeCursor = window.getComputedStyle(handleEl).cursor;
            document.body.style.cursor = activeCursor;

            startX = e.clientX;
            startY = e.clientY;

            const parent = winEl.offsetParent || document.getElementById('kali-os-desktop') || document.body;
            const parentRect = parent.getBoundingClientRect();
            const rect = winEl.getBoundingClientRect();

            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;
            initialWidth = rect.width;
            initialHeight = rect.height;

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', stopResize);
            window.addEventListener('pointercancel', stopResize);
        });
    }

    // --------------- Desktop Icons Dragging & Clicks -----
    function initDesktopIcons() {
        const iconCv = document.getElementById('icon-cv');
        const iconProjects = document.getElementById('icon-projects');
        const iconContact = document.getElementById('icon-contact');
        const iconTrash = document.getElementById('icon-trash');

        const map = [
            { el: iconCv, key: 'cv' },
            { el: iconProjects, key: 'projects' },
            { el: iconContact, key: 'contact' },
        ];

        map.forEach(item => {
            if (!item.el) return;

            // Single click selects, double click or enter opens
            let lastTap = 0;
            item.el.addEventListener('click', (e) => {
                const now = Date.now();
                const isDouble = (now - lastTap) < 320;
                lastTap = now;

                document.querySelectorAll('.kali-desktop-icon').forEach(ic => ic.classList.remove('is-selected'));
                item.el.classList.add('is-selected');

                // If mobile or double-clicked, open window
                if (isDouble || window.innerWidth <= 768) {
                    openWindow(item.key);
                }
            });

            item.el.addEventListener('dblclick', () => {
                openWindow(item.key);
            });

            item.el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openWindow(item.key);
                }
            });

            // Draggable desktop icon
            setupIconDragging(item.el);
        });

        if (iconTrash) {
            let lastTapTrash = 0;
            iconTrash.addEventListener('click', () => {
                const now = Date.now();
                const isDouble = (now - lastTapTrash) < 320;
                lastTapTrash = now;

                document.querySelectorAll('.kali-desktop-icon').forEach(ic => ic.classList.remove('is-selected'));
                iconTrash.classList.add('is-selected');

                if (isDouble) {
                    alert("Trash is empty.");
                }
            });
            iconTrash.addEventListener('dblclick', () => {
                alert("Trash is empty.");
            });
            iconTrash.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    alert("Trash is empty.");
                }
            });
            setupIconDragging(iconTrash);
        }

        // Deselect icons when clicking empty canvas
        const desktopCanvas = document.getElementById('kali-os-desktop');
        if (desktopCanvas) {
            desktopCanvas.addEventListener('pointerdown', (e) => {
                if (!e.target.closest('.kali-desktop-icon') && !e.target.closest('.kali-window') && !e.target.closest('.kali-topbar') && !e.target.closest('.kali-os-taskbar')) {
                    document.querySelectorAll('.kali-desktop-icon').forEach(ic => ic.classList.remove('is-selected'));
                }
            });
        }
    }

    function setupIconDragging(iconEl) {
        let isDragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;
        let moved = false;

        iconEl.addEventListener('pointerdown', (e) => {
            if (window.innerWidth <= 768) return; // Disable icon dragging on mobile for clean scrolling
            isDragging = true;
            moved = false;
            startX = e.clientX;
            startY = e.clientY;

            const r = iconEl.getBoundingClientRect();
            startLeft = r.left;
            startTop = r.top;
            iconEl.setPointerCapture(e.pointerId);
        });

        iconEl.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                moved = true;
                iconEl.classList.add('is-dragging');
                iconEl.style.position = 'fixed';
                iconEl.style.right = 'auto';
                iconEl.style.bottom = 'auto';
                iconEl.style.left = `${startLeft + dx}px`;
                iconEl.style.top = `${startTop + dy}px`;
            }
        });

        const stop = (e) => {
            if (isDragging) {
                isDragging = false;
                iconEl.classList.remove('is-dragging');
                try {
                    iconEl.releasePointerCapture(e.pointerId);
                } catch { }
            }
        };

        iconEl.addEventListener('pointerup', stop);
        iconEl.addEventListener('pointercancel', stop);
    }

    // --------------- Curriculum Viewer Controls ----------
    function initCvControls() {
        const zoomInBtn = document.getElementById('cv-zoom-in');
        const zoomOutBtn = document.getElementById('cv-zoom-out');
        const zoomVal = document.getElementById('cv-zoom-val');
        const sheetZoom = document.getElementById('kali-doc-sheet-zoom');

        let zoomLevel = 100;

        if (zoomInBtn && zoomOutBtn && zoomVal && sheetZoom) {
            zoomInBtn.addEventListener('click', () => {
                if (zoomLevel < 160) {
                    zoomLevel += 15;
                    applyZoom();
                }
            });

            zoomOutBtn.addEventListener('click', () => {
                if (zoomLevel > 60) {
                    zoomLevel -= 15;
                    applyZoom();
                }
            });

            function applyZoom() {
                zoomVal.textContent = `${zoomLevel}%`;
                sheetZoom.style.transform = `scale(${zoomLevel / 100})`;
                sheetZoom.style.transformOrigin = 'top center';
            }
        }
    }

    // --------------- Projects Data (macOS Finder / Personal Stuff) ---------------
    const PROJECT_FOLDERS = [
    {
            "id": "jewelry-inspiration",
            "name": "Jewelry Inspiration",
            "displayPath": "Jewelry Inspiration",
            "category": "Inspiration & Research, 2025-2026",
            "description": "Visual references, traditional silver ornaments and sculptural hardware inspiration for contemporary jewelry.",
            "tagColor": "purple",
            "files": [
                    {
                            "name": "01.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/01.png",
                            "size": "484 KB",
                            "sizeBytes": "484041",
                            "created": "08/14/2025, 02:41:18 AM",
                            "modified": "08/14/2025, 02:41:18 AM",
                            "contentType": "image/png",
                            "dimensions": "486 × 500",
                            "caption": "Jewelry Inspiration — Traditional silver armlet / cuff with conical stud details"
                    },
                    {
                            "name": "02.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/02.png",
                            "size": "226 KB",
                            "sizeBytes": "226167",
                            "created": "08/19/2025, 03:15:42 AM",
                            "modified": "08/19/2025, 03:22:10 AM",
                            "contentType": "image/png",
                            "dimensions": "327 × 500",
                            "caption": "Jewelry Inspiration — Engraved side profile & concentric filigree ornament"
                    },
                    {
                            "name": "03.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/03.png",
                            "size": "366 KB",
                            "sizeBytes": "366147",
                            "created": "09/02/2025, 11:34:09 PM",
                            "modified": "09/03/2025, 12:05:33 AM",
                            "contentType": "image/png",
                            "dimensions": "500 × 430",
                            "caption": "Jewelry Inspiration — Complete circular bangle with geometric fluted nodes"
                    },
                    {
                            "name": "04.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/04.png",
                            "size": "110 KB",
                            "sizeBytes": "109649",
                            "created": "09/11/2025, 01:22:50 AM",
                            "modified": "09/11/2025, 01:22:50 AM",
                            "contentType": "image/png",
                            "dimensions": "316 × 273",
                            "caption": "Jewelry Inspiration — Open torque bracelet with crown terminals"
                    },
                    {
                            "name": "05.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/05.png",
                            "size": "151 KB",
                            "sizeBytes": "150699",
                            "created": "09/27/2025, 04:08:15 AM",
                            "modified": "09/27/2025, 04:15:00 AM",
                            "contentType": "image/png",
                            "dimensions": "320 × 378",
                            "caption": "Jewelry Inspiration — Articulated ceremonial necklace with repoussé pendants"
                    },
                    {
                            "name": "06.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/06.png",
                            "size": "712 KB",
                            "sizeBytes": "711982",
                            "created": "10/05/2025, 10:14:30 AM",
                            "modified": "10/05/2025, 10:20:12 AM",
                            "contentType": "image/png",
                            "dimensions": "1024 × 1024",
                            "caption": "Jewelry Inspiration — Gothic openwork collar necklace with Maltese cross"
                    },
                    {
                            "name": "07.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/07.png",
                            "size": "726 KB",
                            "sizeBytes": "726428",
                            "created": "10/18/2025, 02:55:04 AM",
                            "modified": "10/18/2025, 02:55:04 AM",
                            "contentType": "image/png",
                            "dimensions": "1024 × 1024",
                            "caption": "Jewelry Inspiration — Leather belt with engraved circular silver ring buckle"
                    },
                    {
                            "name": "08.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/08.png",
                            "size": "611 KB",
                            "sizeBytes": "611314",
                            "created": "11/04/2025, 05:20:11 PM",
                            "modified": "11/04/2025, 05:45:00 PM",
                            "contentType": "image/png",
                            "dimensions": "564 × 1024",
                            "caption": "Jewelry Inspiration — Sterling silver filigree link chain with bell pendant"
                    },
                    {
                            "name": "09.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/09.png",
                            "size": "530 KB",
                            "sizeBytes": "530091",
                            "created": "11/21/2025, 01:48:33 AM",
                            "modified": "11/21/2025, 01:52:19 AM",
                            "contentType": "image/png",
                            "dimensions": "934 × 751",
                            "caption": "Jewelry Inspiration — Sculptural silver cross buckle on black leather"
                    },
                    {
                            "name": "10.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/10.png",
                            "size": "490 KB",
                            "sizeBytes": "489505",
                            "created": "12/03/2025, 08:30:22 PM",
                            "modified": "12/03/2025, 08:45:10 PM",
                            "contentType": "image/png",
                            "dimensions": "480 × 640",
                            "caption": "Jewelry Inspiration — Celtic knotwork interlaced 3-piece belt buckle hardware set"
                    },
                    {
                            "name": "11.jpg",
                            "type": "image",
                            "subType": "JPEG image",
                            "src": "images/jewelry-inspiration/11.jpg",
                            "size": "397 KB",
                            "sizeBytes": "397366",
                            "created": "12/15/2025, 03:37:19 AM",
                            "modified": "12/15/2025, 03:37:19 AM",
                            "contentType": "image/jpeg",
                            "dimensions": "675 × 1024",
                            "caption": "Jewelry Inspiration — Architectural engraving of Gothic tracery roundels & medallions"
                    },
                    {
                            "name": "12.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/12.png",
                            "size": "954 KB",
                            "sizeBytes": "953730",
                            "created": "01/08/2026, 04:12:00 AM",
                            "modified": "01/08/2026, 04:19:44 AM",
                            "contentType": "image/png",
                            "dimensions": "800 × 800",
                            "caption": "Jewelry Inspiration — Carved floral rosettes & ornamental acanthus medallions"
                    },
                    {
                            "name": "13.jpg",
                            "type": "image",
                            "subType": "JPEG image",
                            "src": "images/jewelry-inspiration/13.jpg",
                            "size": "257 KB",
                            "sizeBytes": "257473",
                            "created": "01/22/2026, 02:18:45 PM",
                            "modified": "01/22/2026, 02:30:00 PM",
                            "contentType": "image/jpeg",
                            "dimensions": "736 × 978",
                            "caption": "Jewelry Inspiration — Gothic flamboyant stone tracery with cathedral gargoyle"
                    },
                    {
                            "name": "14.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/14.png",
                            "size": "384 KB",
                            "sizeBytes": "384139",
                            "created": "02/03/2026, 01:05:28 AM",
                            "modified": "02/03/2026, 01:05:28 AM",
                            "contentType": "image/png",
                            "dimensions": "300 × 470",
                            "caption": "Jewelry Inspiration — Gothic arch tracery detail with relief spire carving"
                    },
                    {
                            "name": "15.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/15.png",
                            "size": "717 KB",
                            "sizeBytes": "717326",
                            "created": "02/19/2026, 11:42:10 AM",
                            "modified": "02/19/2026, 11:55:02 AM",
                            "contentType": "image/png",
                            "dimensions": "740 × 493",
                            "caption": "Jewelry Inspiration — Gothic openwork tracery window with quatrefoil balustrade"
                    },
                    {
                            "name": "16.jpg",
                            "type": "image",
                            "subType": "JPEG image",
                            "src": "images/jewelry-inspiration/16.jpg",
                            "size": "325 KB",
                            "sizeBytes": "325390",
                            "created": "03/07/2026, 03:50:41 AM",
                            "modified": "03/07/2026, 03:50:41 AM",
                            "contentType": "image/jpeg",
                            "dimensions": "631 × 1024",
                            "caption": "Jewelry Inspiration — Antique bronze grotesque door pull & keyhole plate"
                    },
                    {
                            "name": "17.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/17.png",
                            "size": "800 KB",
                            "sizeBytes": "799791",
                            "created": "03/24/2026, 09:15:20 PM",
                            "modified": "03/24/2026, 09:40:11 PM",
                            "contentType": "image/png",
                            "dimensions": "463 × 828",
                            "caption": "Jewelry Inspiration — Traditional silver filigree beads with purple cord & articulated chain"
                    },
                    {
                            "name": "18.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/18.png",
                            "size": "955 KB",
                            "sizeBytes": "954846",
                            "created": "04/11/2026, 02:29:55 AM",
                            "modified": "04/11/2026, 02:35:10 AM",
                            "contentType": "image/png",
                            "dimensions": "457 × 806",
                            "caption": "Jewelry Inspiration — Cathedral stone portal with deeply carved arch archivolts"
                    },
                    {
                            "name": "19.png",
                            "type": "image",
                            "subType": "PNG image",
                            "src": "images/jewelry-inspiration/19.png",
                            "size": "629 KB",
                            "sizeBytes": "629059",
                            "created": "05/02/2026, 04:03:12 AM",
                            "modified": "05/02/2026, 04:03:12 AM",
                            "contentType": "image/png",
                            "dimensions": "458 × 808",
                            "caption": "Jewelry Inspiration — Wrought iron cast cartouche escutcheon with volute scrolls"
                    }
            ]
    }
    ];

    // --------------- Virgil Abloh & macOS Yosemite Finder File Manager ---------------
    function initPublicDomainFileManager() {
        // View Switcher & Containers
        const btnViewIcons = document.getElementById('pd-view-icons');
        const btnViewColumns = document.getElementById('pd-view-columns');
        const viewIcons = document.getElementById('pd-icons-view');
        const viewColumns = document.getElementById('pd-columns-view');

        // Breadcrumbs & Navigation
        const crumbRoot = document.getElementById('pd-crumb-root');
        const crumbSep = document.getElementById('pd-crumb-sep');
        const crumbSub = document.getElementById('pd-crumb-sub');
        const countLabel = document.getElementById('pd-item-count');
        const btnBack = document.getElementById('pd-btn-back');
        const btnFwd = document.getElementById('pd-btn-forward');

        // Finder Icon View Elements
        const sidebarFolders = document.getElementById('pd-sidebar-folders');
        const finderGrid = document.getElementById('pd-finder-grid');

        // Column View Elements
        const foldersContainer = document.getElementById('pd-folders-list');
        const filesContainer = document.getElementById('pd-files-list');
        const previewImg = document.getElementById('pd-preview-img');
        const previewTitle = document.getElementById('pd-preview-title');
        const previewSub = document.getElementById('pd-preview-sub');
        const metaCreated = document.getElementById('pd-meta-created');
        const metaModified = document.getElementById('pd-meta-modified');
        const metaSize = document.getElementById('pd-meta-size');
        const metaType = document.getElementById('pd-meta-type');
        const metaDims = document.getElementById('pd-meta-dims');
        const metaProject = document.getElementById('pd-meta-project');
        const previewLink = document.getElementById('pd-preview-link');
        const statusSummary = document.getElementById('pd-status-summary');
        const statusLeft = document.getElementById('pd-status-left');
        const inspectorIcons = document.getElementById('pd-inspector-icons');
        const inspectorColumns = document.getElementById('pd-inspector');
        const closeBtnIcons = document.getElementById('pd-close-inspector-icons');
        const closeBtnCols = document.getElementById('pd-close-inspector-cols');
        const finderMain = document.getElementById('pd-finder-main');

        if (!viewIcons || !viewColumns) return;

        let currentView = 'icons'; // 'icons' or 'columns'
        let inRoot = true; // In icons view: true = looking at all folders; false = inside a folder
        let activeFolderIdx = 0;
        let activeFileIdx = -1; // -1 = no file selected initially
        let isPreviewOpen = false; // Preview pane hidden by default until image click
        let history = [{ view: 'icons', inRoot: true, folderIdx: 0 }];
        let historyIdx = 0;

        let currentPreviewFolder = null;
        let currentPreviewFiles = [];
        let currentPreviewIdx = 0;

        function renderPreviewIndex(newIdx) {
            if (!currentPreviewFiles || currentPreviewFiles.length === 0) return;

            // Wrap around modulo so navigation is infinite
            currentPreviewIdx = ((newIdx % currentPreviewFiles.length) + currentPreviewFiles.length) % currentPreviewFiles.length;
            const file = currentPreviewFiles[currentPreviewIdx];
            if (!file) return;

            activePreviewFile = file;

            const imgEl = document.getElementById('preview-win-img');
            const titleEl = document.getElementById('preview-win-title');
            const tabLabel = document.getElementById('tab-preview-label');
            const statusLeft = document.getElementById('preview-win-status-left');
            const statusRight = document.getElementById('preview-win-status-right');

            if (imgEl) {
                imgEl.style.opacity = '0.6';
                imgEl.src = file.src;
                imgEl.alt = file.name;
                imgEl.onload = () => { imgEl.style.opacity = '1'; };
            }

            const titleText = `${file.name} ${t('previewWin.titleSuffix')}`;
            if (titleEl) titleEl.textContent = titleText;
            if (tabLabel) tabLabel.textContent = file.name;
            if (statusLeft) {
                statusLeft.textContent = `${file.name} • ${file.subType || t('finder.imageTypePng')} • ${file.size}`;
            }
            if (statusRight) {
                const folderName = currentPreviewFolder ? currentPreviewFolder.name : 'Personal Stuff';
                statusRight.textContent = `${folderName} • ${currentPreviewIdx + 1} / ${currentPreviewFiles.length}`;
            }

            // Highlight active thumbnail and scroll it smoothly into view
            const thumbsStrip = document.getElementById('preview-thumbs-strip');
            if (thumbsStrip) {
                const thumbItems = thumbsStrip.querySelectorAll('.kali-preview-thumb-item');
                thumbItems.forEach((btn, idx) => {
                    if (idx === currentPreviewIdx) {
                        btn.classList.add('is-active');
                        btn.setAttribute('aria-selected', 'true');
                        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    } else {
                        btn.classList.remove('is-active');
                        btn.setAttribute('aria-selected', 'false');
                    }
                });
            }

            // Keep Finder selection in sync if folder matches
            if (currentPreviewFolder && currentPreviewFolder.files) {
                const fIdx = currentPreviewFolder.files.indexOf(file);
                if (fIdx >= 0) {
                    selectFile(fIdx);
                }
            }
        }

        function previewNext() {
            renderPreviewIndex(currentPreviewIdx + 1);
        }

        function previewPrev() {
            renderPreviewIndex(currentPreviewIdx - 1);
        }

        function openImageWindow(file, folder, fileIdx) {
            if (!file) return;

            currentPreviewFolder = folder || PROJECT_FOLDERS[activeFolderIdx] || PROJECT_FOLDERS[0];
            currentPreviewFiles = (currentPreviewFolder && currentPreviewFolder.files)
                ? currentPreviewFolder.files.filter(f => f.type === 'image')
                : [];

            let idx = -1;
            if (typeof fileIdx === 'number' && fileIdx >= 0 && currentPreviewFiles[fileIdx] === file) {
                idx = fileIdx;
            }
            if (idx < 0) {
                idx = currentPreviewFiles.findIndex(f => f.src === file.src || f.name === file.name);
            }
            if (idx < 0) idx = 0;
            currentPreviewIdx = idx;

            activePreviewFile = currentPreviewFiles[currentPreviewIdx] || file;
            if (window.innerWidth <= 768) {
                prevWindowBeforePreview = 'projects';
            }

            // Populate thumbnails strip in the image viewer
            const thumbsStrip = document.getElementById('preview-thumbs-strip');
            if (thumbsStrip) {
                thumbsStrip.innerHTML = currentPreviewFiles.map((f, i) => `
                    <button class="kali-preview-thumb-item ${i === currentPreviewIdx ? 'is-active' : ''}" 
                            data-thumb-idx="${i}" 
                            role="tab" 
                            aria-selected="${i === currentPreviewIdx ? 'true' : 'false'}" 
                            title="${escapeHTML(f.name)} (${i + 1}/${currentPreviewFiles.length})">
                        <img src="${f.src}" alt="${escapeHTML(f.name)}" loading="lazy">
                    </button>
                `).join('');

                thumbsStrip.querySelectorAll('.kali-preview-thumb-item').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const tIdx = parseInt(btn.dataset.thumbIdx, 10);
                        if (!isNaN(tIdx)) {
                            renderPreviewIndex(tIdx);
                        }
                    });
                });
            }

            renderPreviewIndex(currentPreviewIdx);

            const winEl = document.getElementById('kali-win-preview');
            if (winEl && windows['preview'] && !windows['preview'].hasBeenDragged && !windows['preview'].isMaximized) {
                const desktop = document.getElementById('kali-os-desktop') || document.body;
                const dw = desktop.clientWidth || window.innerWidth;
                const dh = desktop.clientHeight || window.innerHeight;
                const winW = Math.min(760, Math.round(dw * 0.78));
                const winH = Math.min(580, Math.round(dh * 0.78));
                const left = Math.max(20, Math.round((dw - winW) / 2));
                const top = Math.max(30, Math.round((dh - winH) / 2));

                winEl.style.width = `${winW}px`;
                winEl.style.height = `${winH}px`;
                winEl.style.left = `${left}px`;
                winEl.style.top = `${top}px`;
            }

            openWindow('preview');
        }

        function openPreview(fileIdx) {
            activeFileIdx = fileIdx;
            isPreviewOpen = true;
            selectFile(fileIdx);

            if (currentView === 'icons') {
                if (inspectorIcons) {
                    inspectorIcons.style.display = 'flex';
                    inspectorIcons.classList.add('is-open');
                }
            } else {
                if (inspectorColumns) {
                    inspectorColumns.style.display = 'flex';
                    inspectorColumns.classList.add('is-open');
                }
            }
        }

        function closePreview() {
            activeFileIdx = -1;
            isPreviewOpen = false;
            if (inspectorIcons) {
                inspectorIcons.style.display = 'none';
                inspectorIcons.classList.remove('is-open');
            }
            if (inspectorColumns) {
                inspectorColumns.style.display = 'none';
                inspectorColumns.classList.remove('is-open');
            }
            if (finderGrid) {
                finderGrid.querySelectorAll('.pd-file-card').forEach(c => c.classList.remove('is-selected'));
            }
            if (filesContainer) {
                filesContainer.querySelectorAll('.pd-file-row').forEach(r => {
                    r.classList.remove('active');
                    r.setAttribute('aria-selected', 'false');
                });
            }
        }

        if (closeBtnIcons) {
            closeBtnIcons.addEventListener('click', (e) => {
                e.stopPropagation();
                closePreview();
            });
        }

        if (closeBtnCols) {
            closeBtnCols.addEventListener('click', (e) => {
                e.stopPropagation();
                closePreview();
            });
        }

        if (finderMain) {
            finderMain.addEventListener('click', (e) => {
                if (!e.target.closest('.pd-finder-item') && !e.target.closest('.pd-col-inspector')) {
                    closePreview();
                }
            });
        }

        function updateHistoryButtons() {
            if (btnBack) btnBack.disabled = (historyIdx <= 0);
            if (btnFwd) btnFwd.disabled = (historyIdx >= history.length - 1);
        }

        function pushHistory(state) {
            history = history.slice(0, historyIdx + 1);
            history.push(state);
            historyIdx = history.length - 1;
            updateHistoryButtons();
        }

        // ========================================================
        // 1. VIEW SWITCHER
        // ========================================================
        function switchView(targetView) {
            currentView = targetView;
            if (targetView === 'icons') {
                if (btnViewIcons) btnViewIcons.classList.add('active');
                if (btnViewColumns) btnViewColumns.classList.remove('active');
                viewIcons.style.display = 'flex';
                viewColumns.style.display = 'none';
                renderFinderView();
            } else {
                if (btnViewColumns) btnViewColumns.classList.add('active');
                if (btnViewIcons) btnViewIcons.classList.remove('active');
                viewColumns.style.display = 'flex';
                viewIcons.style.display = 'none';
                renderColumnView(activeFolderIdx);
            }
            updateBreadcrumbs();
            updateHistoryButtons();
        }

        if (btnViewIcons) {
            btnViewIcons.addEventListener('click', () => {
                if (currentView !== 'icons') {
                    pushHistory({ view: 'icons', inRoot, folderIdx: activeFolderIdx });
                    switchView('icons');
                }
            });
        }

        if (btnViewColumns) {
            btnViewColumns.addEventListener('click', () => {
                if (currentView !== 'columns') {
                    pushHistory({ view: 'columns', inRoot: false, folderIdx: activeFolderIdx });
                    switchView('columns');
                }
            });
        }

        // ========================================================
        // 2. BREADCRUMBS
        // ========================================================
        function updateBreadcrumbs() {
            if (!crumbRoot || !crumbSep || !crumbSub) return;

            if (currentView === 'icons' && inRoot) {
                crumbRoot.classList.add('active');
                crumbSep.style.display = 'none';
                crumbSub.style.display = 'none';
                crumbSub.textContent = '';
                if (countLabel) countLabel.textContent = `${PROJECT_FOLDERS.length} ${PROJECT_FOLDERS.length === 1 ? t('finder.folderSingle') : t('finder.folderPlural')}`;
            } else {
                const folder = PROJECT_FOLDERS[activeFolderIdx] || PROJECT_FOLDERS[0];
                crumbRoot.classList.remove('active');
                crumbSep.style.display = 'inline-block';
                crumbSub.style.display = 'inline-block';
                crumbSub.textContent = folder.name;
                crumbSub.classList.add('active');
                if (countLabel) countLabel.textContent = `${folder.files.length} ${t('finder.itemsCount')}`;
            }
        }

        if (crumbRoot) {
            crumbRoot.addEventListener('click', () => {
                if (currentView === 'icons' && !inRoot) {
                    inRoot = true;
                    closePreview();
                    pushHistory({ view: 'icons', inRoot: true, folderIdx: activeFolderIdx });
                    renderFinderView();
                    updateBreadcrumbs();
                }
            });
        }

        // ========================================================
        // 3. FINDER ICON VIEW (macOS Yosemite Style)
        // ========================================================
        function renderSidebar() {
            if (!sidebarFolders) return;
            sidebarFolders.innerHTML = `
                <li class="pd-sidebar-item ${inRoot ? 'active' : ''}" data-action="root">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A.5.5 0 0 0 8.914 4H13.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z"/>
                    </svg>
                    <span>Personal Stuff</span>
                </li>
                ${PROJECT_FOLDERS.map((f, idx) => `
                    <li class="pd-sidebar-item ${(!inRoot && idx === activeFolderIdx) ? 'active' : ''}" data-idx="${idx}">
                        <span class="pd-tag-dot tag-${f.tagColor || 'blue'}"></span>
                        <span>${escapeHTML(f.name)}</span>
                    </li>
                `).join('')}
            `;

            sidebarFolders.querySelectorAll('.pd-sidebar-item').forEach(item => {
                item.addEventListener('click', () => {
                    if (item.dataset.action === 'root') {
                        inRoot = true;
                        closePreview();
                        pushHistory({ view: 'icons', inRoot: true, folderIdx: activeFolderIdx });
                        renderFinderView();
                        updateBreadcrumbs();
                    } else if (item.dataset.idx !== undefined) {
                        const idx = parseInt(item.dataset.idx, 10);
                        inRoot = false;
                        activeFolderIdx = idx;
                        closePreview();
                        pushHistory({ view: 'icons', inRoot: false, folderIdx: idx });
                        renderFinderView();
                        updateBreadcrumbs();
                    }
                });
            });
        }

        function renderFinderView() {
            if (!finderGrid) return;
            renderSidebar();

            if (inRoot) {
                closePreview();
                // Render root: folders grid
                finderGrid.innerHTML = PROJECT_FOLDERS.map((folder, idx) => `
                    <div class="pd-finder-item pd-folder-card" data-folder-idx="${idx}" tabindex="0" role="button" title="${t('finder.dblClickOpen')} ${escapeHTML(folder.name)}">
                        <div class="pd-folder-graphic">
                            <svg viewBox="0 0 74 60" width="70" height="58" fill="none">
                                <path d="M4 10a4 4 0 0 1 4-4h20l6 6h36a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V10z" fill="#007aff"/>
                                <rect x="8" y="14" width="58" height="5" rx="1.5" fill="#005ecb" opacity="0.6"/>
                                <path d="M3 18a4 4 0 0 1 4-4h60a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V18z" fill="#38a5ff"/>
                                <path d="M7 16h60a4 4 0 0 1 4 4v1H3v-1a4 4 0 0 1 4-4z" fill="#6bc0ff" opacity="0.4"/>
                            </svg>
                        </div>
                        <span class="pd-finder-label">${escapeHTML(folder.name)}</span>
                        <div class="pd-finder-tag-row">
                            <span class="pd-tag-dot tag-${folder.tagColor || 'blue'}"></span>
                            <span class="pd-finder-sub">${folder.files.length} ${folder.files.length === 1 ? t('finder.fileSingle') : t('finder.filePlural')}</span>
                        </div>
                    </div>
                `).join('');

                finderGrid.querySelectorAll('.pd-folder-card').forEach(card => {
                    const enterFolder = () => {
                        const idx = parseInt(card.dataset.folderIdx, 10);
                        inRoot = false;
                        activeFolderIdx = idx;
                        closePreview();
                        pushHistory({ view: 'icons', inRoot: false, folderIdx: idx });
                        renderFinderView();
                        updateBreadcrumbs();
                    };

                    card.addEventListener('click', (e) => {
                        finderGrid.querySelectorAll('.pd-finder-item').forEach(c => c.classList.remove('is-selected'));
                        card.classList.add('is-selected');
                        closePreview();
                        // On touch / mobile screens (<= 768px), single tap immediately opens the folder
                        if (window.innerWidth <= 768) {
                            enterFolder();
                        }
                    });

                    card.addEventListener('dblclick', enterFolder);
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            enterFolder();
                        }
                    });
                });

                if (statusSummary) {
                    const totalFiles = PROJECT_FOLDERS.reduce((acc, f) => acc + f.files.length, 0);
                    statusSummary.textContent = `${totalFiles} ${t('finder.filePlural')} • Jewelry Inspiration`;
                }
            } else {
                // Render files inside active folder
                const folder = PROJECT_FOLDERS[activeFolderIdx] || PROJECT_FOLDERS[0];
                finderGrid.innerHTML = folder.files.map((file, idx) => `
                    <div class="pd-finder-item pd-file-card ${idx === activeFileIdx ? 'is-selected' : ''}" data-file-idx="${idx}" tabindex="0" role="button" title="${escapeHTML(file.name)} (${file.size})">
                        <div class="pd-file-graphic">
                            ${file.type === 'image' ? `
                                <img src="${file.src}" alt="${escapeHTML(file.name)}" class="pd-file-thumb-img" loading="lazy">
                            ` : `
                                <svg viewBox="0 0 42 50" width="46" height="52" fill="none">
                                    <path d="M4 3C4 1.89543 4.89543 1 6 1H28L38 11V47C38 48.1046 37.1046 49 36 49H6C4.89543 49 4 48.1046 4 47V3Z" fill="#FFFFFF" stroke="#c0c4cc" stroke-width="1.3" stroke-linejoin="round"/>
                                    <path d="M28 1V9C28 10.1046 28.8954 11 30 11H38" fill="#F3F4F6" stroke="#c0c4cc" stroke-width="1.3" stroke-linejoin="round"/>
                                    <rect x="9" y="24" width="22" height="3" rx="1" fill="#475569"/>
                                    <rect x="9" y="31" width="16" height="3" rx="1" fill="#94A3B8"/>
                                </svg>
                            `}
                        </div>
                        <span class="pd-finder-label">${escapeHTML(file.name)}</span>
                        <div class="pd-finder-tag-row">
                            <span class="pd-tag-dot tag-${folder.tagColor || 'blue'}"></span>
                            <span class="pd-finder-sub">${file.size}</span>
                        </div>
                    </div>
                `).join('');

                finderGrid.querySelectorAll('.pd-file-card').forEach(card => {
                    const fIdx = parseInt(card.dataset.fileIdx, 10);

                    const pick = (e) => {
                        e.stopPropagation();
                        openPreview(fIdx);
                        // On mobile, also directly open the full image window for convenient viewing
                        if (window.innerWidth <= 768) {
                            const file = folder.files[fIdx];
                            if (file) {
                                openImageWindow(file, folder, fIdx);
                            }
                        }
                    };

                    const openDirect = (e) => {
                        e.stopPropagation();
                        openPreview(fIdx);
                        const file = folder.files[fIdx];
                        if (file) {
                            openImageWindow(file, folder, fIdx);
                        }
                    };

                    card.addEventListener('click', pick);
                    card.addEventListener('dblclick', openDirect);

                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            openDirect(e);
                        }
                    });
                });

                if (isPreviewOpen && activeFileIdx >= 0) {
                    openPreview(activeFileIdx);
                } else {
                    closePreview();
                }

                if (statusSummary) {
                    statusSummary.textContent = `${folder.files.length} ${folder.files.length === 1 ? t('finder.fileSingle') : t('finder.filePlural')} • ${folder.name}`;
                }
            }
        }

        // ========================================================
        // 4. COLUMN VIEW (Virgil Abloh public---domain Style)
        // ========================================================
        function renderFolderList() {
            if (!foldersContainer) return;
            foldersContainer.innerHTML = PROJECT_FOLDERS.map((f, idx) => `
                <div class="pd-folder-row ${idx === activeFolderIdx ? 'active' : ''}" data-idx="${idx}" tabindex="0" role="button" aria-selected="${idx === activeFolderIdx ? 'true' : 'false'}">
                    <span class="pd-folder-name">${escapeHTML(f.name)}</span>
                    <span class="pd-pill-count">${f.files.length}</span>
                </div>
            `).join('');

            foldersContainer.querySelectorAll('.pd-folder-row').forEach(row => {
                const handleFolderSelect = () => {
                    const idx = parseInt(row.dataset.idx, 10);
                    if (idx !== activeFolderIdx) {
                        activeFolderIdx = idx;
                        pushHistory({ view: 'columns', inRoot: false, folderIdx: idx });
                        renderColumnView(idx);
                        updateBreadcrumbs();
                    }
                };

                row.addEventListener('click', handleFolderSelect);
                row.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFolderSelect();
                    }
                });
            });
        }

        function selectFile(fileIdx) {
            const folder = PROJECT_FOLDERS[activeFolderIdx] || PROJECT_FOLDERS[0];
            if (!folder || !folder.files || !folder.files[fileIdx]) return;

            activeFileIdx = fileIdx;
            const file = folder.files[fileIdx];

            // 1. Column view file rows active state
            if (filesContainer) {
                const rows = filesContainer.querySelectorAll('.pd-file-row');
                rows.forEach((r, idx) => {
                    if (idx === fileIdx) {
                        r.classList.add('active');
                        r.setAttribute('aria-selected', 'true');
                        r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    } else {
                        r.classList.remove('active');
                        r.setAttribute('aria-selected', 'false');
                    }
                });
            }

            // 2. Icon view file cards active state
            if (finderGrid) {
                const cards = finderGrid.querySelectorAll('.pd-file-card');
                cards.forEach((c, idx) => {
                    if (idx === fileIdx) {
                        c.classList.add('is-selected');
                    } else {
                        c.classList.remove('is-selected');
                    }
                });
            }

            // 3. Update both Inspectors (Icon mode & Column mode)
            document.querySelectorAll('.pd-preview-img-target').forEach(img => {
                img.src = file.src;
                img.alt = file.name;
                img.style.cursor = 'pointer';
                img.title = t('finder.dblClickWindow');
                img.ondblclick = (e) => {
                    e.stopPropagation();
                    openImageWindow(file, folder, activeFileIdx);
                };
                img.onclick = (e) => {
                    if (window.innerWidth <= 768) {
                        e.stopPropagation();
                        openImageWindow(file, folder, activeFileIdx);
                    }
                };
            });
            document.querySelectorAll('.pd-preview-title-target').forEach(el => {
                el.textContent = file.name;
            });
            document.querySelectorAll('.pd-preview-sub-target').forEach(el => {
                el.textContent = `${file.subType || t('finder.imageTypePng')} - ${file.size}`;
            });
            document.querySelectorAll('.pd-meta-created-target').forEach(el => {
                el.textContent = file.created || "08/14/2025, 02:41:18 AM";
            });
            document.querySelectorAll('.pd-meta-modified-target').forEach(el => {
                el.textContent = file.modified || file.created || "08/14/2025, 02:41:18 AM";
            });
            document.querySelectorAll('.pd-meta-size-target').forEach(el => {
                el.textContent = file.sizeBytes || file.size;
            });
            document.querySelectorAll('.pd-meta-type-target').forEach(el => {
                el.textContent = file.contentType || "image/png";
            });
            document.querySelectorAll('.pd-meta-dims-target').forEach(el => {
                el.textContent = file.dimensions || "1024 × 1024";
            });
            document.querySelectorAll('.pd-meta-project-target').forEach(el => {
                el.textContent = `${folder.name} (${folder.category})`;
            });
        }

        function renderFilesList(folder) {
            if (!filesContainer) return;
            filesContainer.innerHTML = folder.files.map((file, idx) => `
                <div class="pd-file-row ${idx === activeFileIdx ? 'active' : ''}" data-file-idx="${idx}" tabindex="0" role="button" aria-selected="${idx === activeFileIdx ? 'true' : 'false'}" title="${escapeHTML(file.name)}">
                    <div class="pd-file-left">
                        <span class="pd-file-icon" aria-hidden="true">
                            <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
                                <path d="M4 0h5.5v3.5H13V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V4.5H9a1 1 0 0 1-1-1V1H4z"/>
                            </svg>
                        </span>
                        <span class="pd-file-name">${escapeHTML(file.name)}</span>
                    </div>
                    <div class="pd-file-right">
                        <span class="pd-arrow-glyph" aria-hidden="true">&#9654;</span>
                    </div>
                </div>
            `).join('');

            filesContainer.querySelectorAll('.pd-file-row').forEach(row => {
                const fIdx = parseInt(row.dataset.fileIdx, 10);

                const handleSelect = (e) => {
                    e.stopPropagation();
                    if (window.innerWidth <= 768) {
                        handleOpen(e);
                    } else {
                        openPreview(fIdx);
                    }
                };

                const handleOpen = (e) => {
                    e.stopPropagation();
                    openPreview(fIdx);
                    const file = folder.files[fIdx];
                    if (file) {
                        openImageWindow(file, folder, fIdx);
                    }
                };

                row.addEventListener('click', handleSelect);
                row.addEventListener('dblclick', handleOpen);
                row.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpen(e);
                    }
                });
            });
        }

        function renderColumnView(idx) {
            activeFolderIdx = idx;
            const folder = PROJECT_FOLDERS[idx];
            if (!folder) return;

            renderFolderList();
            renderFilesList(folder);
            if (isPreviewOpen && activeFileIdx >= 0) {
                openPreview(activeFileIdx);
            } else {
                closePreview();
            }
        }

        // ========================================================
        // 5. HISTORY (BACK / FORWARD)
        // ========================================================
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                if (historyIdx > 0) {
                    historyIdx--;
                    const state = history[historyIdx];
                    currentView = state.view;
                    inRoot = state.inRoot;
                    activeFolderIdx = state.folderIdx;
                    switchView(state.view);
                } else if (currentView === 'icons' && !inRoot) {
                    inRoot = true;
                    renderFinderView();
                    updateBreadcrumbs();
                }
            });
        }

        if (btnFwd) {
            btnFwd.addEventListener('click', () => {
                if (historyIdx < history.length - 1) {
                    historyIdx++;
                    const state = history[historyIdx];
                    currentView = state.view;
                    inRoot = state.inRoot;
                    activeFolderIdx = state.folderIdx;
                    switchView(state.view);
                }
            });
        }

        // ========================================================
        // 6. INITIALIZATION
        // ========================================================
        renderFolderList();
        renderFinderView();
        updateBreadcrumbs();
        updateHistoryButtons();

        // Reactive Language Switch Listener for File Manager
        window.addEventListener('langchange', () => {
            renderFolderList();
            renderFinderView();
            updateBreadcrumbs();
            if (activeFileIdx >= 0) {
                selectFile(activeFileIdx);
            }
            const statusHint = document.getElementById('pd-status-hint');
            if (statusHint) {
                statusHint.textContent = t('finder.dblClickFolderHint');
            }
            if (activePreviewFile) {
                const titleEl = document.getElementById('preview-win-title');
                const statusLeft = document.getElementById('preview-win-status-left');
                const statusRight = document.getElementById('preview-win-status-right');
                if (titleEl) titleEl.textContent = `${activePreviewFile.name} ${t('previewWin.titleSuffix')}`;
                if (statusLeft) statusLeft.textContent = `${activePreviewFile.name} • ${activePreviewFile.subType || t('finder.imageTypePng')} • ${activePreviewFile.size}`;
                if (statusRight && currentPreviewFolder && currentPreviewFiles.length > 0) {
                    statusRight.textContent = `${currentPreviewFolder.name} • ${currentPreviewIdx + 1} / ${currentPreviewFiles.length}`;
                }
            }
        });

        // ========================================================
        // 7. IMAGE VIEWER CONTROLS (ARROWS, SWIPE & KEYBOARD)
        // ========================================================
        const btnPrev = document.getElementById('preview-btn-prev');
        const btnNext = document.getElementById('preview-btn-next');
        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                previewPrev();
            });
        }
        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                previewNext();
            });
        }

        const previewStage = document.getElementById('preview-win-stage') || document.getElementById('preview-win-body');
        if (previewStage) {
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;

            previewStage.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    touchEndX = touchStartX;
                    touchEndY = touchStartY;
                }
            }, { passive: true });

            previewStage.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches.length === 1) {
                    touchEndX = e.touches[0].clientX;
                    touchEndY = e.touches[0].clientY;
                }
            }, { passive: true });

            previewStage.addEventListener('touchend', () => {
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                // Horizontal swipe: threshold 35px, primarily horizontal movement
                if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
                    if (deltaX < 0) {
                        previewNext(); // Swipe finger left -> next image
                    } else {
                        previewPrev(); // Swipe finger right -> previous image
                    }
                }
            });
        }

        window.addEventListener('keydown', (e) => {
            const previewWin = document.getElementById('kali-win-preview');
            if (previewWin && !previewWin.classList.contains('is-closed') && activeWinKey === 'preview') {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    previewPrev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    previewNext();
                }
            }
        });
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // --------------- Scattered / Side-by-Side Windows Layout ---------------
    function arrangeScatteredWindows() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const desktopH = h - 70; // 36px topbar + 34px taskbar

        const winCv = windows['cv'];
        const winProjects = windows['projects'];
        const winContact = windows['contact'];

        if (!winCv || !winProjects) return;

        if (w >= 1400) {
            // Large screens (Exact match to requested user composition):
            // 1. Contacts in lower-left
            // 2. Personal Stuff in center-top (positioned right of contacts to avoid any overlap)
            // 3. CV on right (enlarged to 640px x 910px)

            // Contacts (Lower-Left)
            let contactRight = 400;
            if (winContact && !winContact.hasBeenDragged && !winContact.isMaximized) {
                const contactW = Math.round(Math.min(370, Math.max(320, w * 0.22)));
                const contactLeft = Math.round(Math.max(48, Math.min(80, w * 0.05)));
                const contactTop = Math.round(Math.max(220, desktopH * 0.36));
                const contactH = Math.round(Math.min(460, desktopH * 0.52));
                winContact.el.style.left = `${contactLeft}px`;
                winContact.el.style.top = `${contactTop}px`;
                winContact.el.style.width = `${contactW}px`;
                winContact.el.style.height = `${contactH}px`;
                contactRight = contactLeft + contactW;
            }

            // Personal Stuff (Shifted right so it never overlaps contacts)
            if (!winProjects.hasBeenDragged && !winProjects.isMaximized) {
                const projLeft = Math.round(Math.max(contactRight + 18, w * 0.30));
                const projW = Math.round(Math.min(840, Math.max(720, w * 0.44)));
                const projTop = Math.round(Math.max(42, desktopH * 0.045));
                const projH = Math.round(Math.min(640, desktopH * 0.70));
                winProjects.el.style.left = `${projLeft}px`;
                winProjects.el.style.top = `${projTop}px`;
                winProjects.el.style.width = `${projW}px`;
                winProjects.el.style.height = `${projH}px`;
            }

            // CV (Right side, enlarged to 640px x 910px as requested)
            if (!winCv.hasBeenDragged && !winCv.isMaximized) {
                const cvW = 640;
                const cvLeft = Math.round(w - cvW - 24);
                const cvTop = Math.round(Math.max(40, desktopH * 0.03));
                const cvH = Math.round(Math.min(910, desktopH - 12));
                winCv.el.style.left = `${cvLeft}px`;
                winCv.el.style.top = `${cvTop}px`;
                winCv.el.style.width = `${cvW}px`;
                winCv.el.style.height = `${cvH}px`;
            }
        } else if (w >= 980) {
            // Medium screens (980 - 1399px)
            let contactRight = 360;
            if (winContact && !winContact.hasBeenDragged && !winContact.isMaximized) {
                const contactW = Math.round(Math.min(340, Math.max(280, w * 0.24)));
                const contactLeft = Math.round(Math.max(24, w * 0.03));
                const contactTop = Math.round(Math.max(190, desktopH * 0.38));
                const contactH = Math.round(Math.min(420, desktopH * 0.50));
                winContact.el.style.left = `${contactLeft}px`;
                winContact.el.style.top = `${contactTop}px`;
                winContact.el.style.width = `${contactW}px`;
                winContact.el.style.height = `${contactH}px`;
                contactRight = contactLeft + contactW;
            }

            if (!winProjects.hasBeenDragged && !winProjects.isMaximized) {
                const projLeft = Math.round(contactRight + 14);
                const projW = Math.round(Math.min(700, Math.max(540, w * 0.44)));
                const projTop = 44;
                const projH = Math.round(Math.min(540, desktopH * 0.65));
                winProjects.el.style.left = `${projLeft}px`;
                winProjects.el.style.top = `${projTop}px`;
                winProjects.el.style.width = `${projW}px`;
                winProjects.el.style.height = `${projH}px`;
            }

            if (!winCv.hasBeenDragged && !winCv.isMaximized) {
                const cvW = Math.min(640, Math.round(w * 0.48));
                const cvLeft = Math.round(w - cvW - 16);
                const cvTop = Math.round(Math.max(42, desktopH * 0.04));
                const cvH = Math.round(Math.min(910, desktopH - 12));
                winCv.el.style.left = `${cvLeft}px`;
                winCv.el.style.top = `${cvTop}px`;
                winCv.el.style.width = `${cvW}px`;
                winCv.el.style.height = `${cvH}px`;
            }
        } else if (w > 768) {
            // Small desktop / Tablet landscape (769 - 979px)
            if (winContact && !winContact.hasBeenDragged && !winContact.isMaximized) {
                winContact.el.style.left = '24px';
                winContact.el.style.top = `${Math.round(desktopH * 0.44)}px`;
                winContact.el.style.width = '290px';
                winContact.el.style.height = `${Math.min(380, desktopH * 0.50)}px`;
            }
            if (!winProjects.hasBeenDragged && !winProjects.isMaximized) {
                winProjects.el.style.left = '328px';
                winProjects.el.style.top = '40px';
                winProjects.el.style.width = `${Math.min(460, w - 344)}px`;
                winProjects.el.style.height = `${Math.min(460, desktopH * 0.58)}px`;
            }
            if (!winCv.hasBeenDragged && !winCv.isMaximized) {
                const cvW = Math.min(640, Math.round(w * 0.55));
                winCv.el.style.left = `${w - cvW - 12}px`;
                winCv.el.style.top = '42px';
                winCv.el.style.width = `${cvW}px`;
                winCv.el.style.height = `${Math.min(910, desktopH - 12)}px`;
            }
        } else {
            // Mobile & small screens (w <= 768): Clean fluid vertical cascade
            [winCv, winProjects, winContact].forEach(wObj => {
                if (wObj && !wObj.hasBeenDragged) {
                    wObj.el.style.left = '';
                    wObj.el.style.top = '';
                    wObj.el.style.width = '';
                    wObj.el.style.height = '';
                }
            });
        }
    }

    function openScatteredWorkspace() {
        if (window.innerWidth <= 768) {
            // On mobile, start with ALL windows closed so the user sees the clean desktop with icons
            winKeys.forEach(k => {
                const w = windows[k];
                if (w) {
                    w.el.classList.add('is-closed');
                    w.el.classList.remove('is-focused');
                    w.el.classList.remove('is-minimized');
                    if (w.tab) {
                        w.tab.style.display = 'none';
                        w.tab.classList.remove('active');
                    }
                }
            });
            activeWinKey = null;
            updateTopBarTitle("Desktop");
            return;
        }

        arrangeScatteredWindows();

        // Staggered animated opening sequence: CV -> Contact -> Archive (Projects in front)
        const sequence = [
            { key: 'cv', delay: 40 },
            { key: 'contact', delay: 140 },
            { key: 'projects', delay: 280 }
        ];

        sequence.forEach(({ key, delay }) => {
            setTimeout(() => {
                const w = windows[key];
                if (w) {
                    w.el.classList.remove('is-closed');
                    w.el.classList.remove('is-minimized');
                    if (w.tab) w.tab.style.display = 'inline-flex';
                    bringToFront(key);
                }
            }, delay);
        });
    }

    window.addEventListener('resize', () => {
        arrangeScatteredWindows();
    });

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
                        <span class="macos-hud-dot macos-dot-1" id="macos-dot-1"></span>
                        <span class="macos-hud-dot macos-dot-2 active" id="macos-dot-2"></span>
                    </div>
                </div>`;
            document.body.appendChild(hud);
        }
        return hud;
    }

    function showMacosHud(fromDesktop, toDesktop, duration = 1100) {
        const hud = ensureMacosHud();
        const text = document.getElementById('macos-hud-text');
        const dot1 = document.getElementById('macos-dot-1');
        const dot2 = document.getElementById('macos-dot-2');

        if (text) {
            text.innerHTML = `DESKTOP ${fromDesktop} &rarr; DESKTOP ${toDesktop}`;
        }
        if (dot1 && dot2) {
            if (toDesktop === 2) {
                dot1.classList.remove('active');
                dot2.classList.add('active');
            } else {
                dot2.classList.remove('active');
                dot1.classList.add('active');
            }
        }

        hud.classList.add('is-visible');
        clearTimeout(hud._timer);
        hud._timer = setTimeout(() => {
            hud.classList.remove('is-visible');
        }, duration);
    }

    function initMacosSpacesDesktopTransition() {
        // 1. Check if entering from Portfolio (Desktop 1 -> Desktop 2)
        const pendingTrans = sessionStorage.getItem('macos_space_transition');
        if (pendingTrans === 'to_about') {
            document.documentElement.dataset.vtDirection = 'forward';
            sessionStorage.removeItem('macos_space_transition');
            showMacosHud(1, 2, 1000);
        }

        // 2. Set Workspace 2 as active in taskbar switch
        const wsButtons = document.querySelectorAll('.kali-workspace-switch .kali-ws-btn');
        if (wsButtons.length >= 2) {
            wsButtons[0].classList.remove('active');
            wsButtons[1].classList.add('active');
            wsButtons[0].setAttribute('title', 'Passa a Desktop 1 (Home)');
            wsButtons[0].style.cursor = 'pointer';

            // Clicking Workspace 1 switches back to Desktop 1
            wsButtons[0].addEventListener('click', (e) => {
                e.preventDefault();
                navigateBackToPortfolio();
            });
        }

        function navigateBackToPortfolio(targetUrl = './') {
            document.documentElement.dataset.vtDirection = 'backward';
            sessionStorage.setItem('macos_space_transition', 'to_portfolio');
            showMacosHud(2, 1, 1400);

            // Clean URL: on HTTP/HTTPS use clean path, on file:// preserve index.html
            let dest = targetUrl;
            if (window.location.protocol !== 'file:') {
                if (dest === 'index.html' || dest === '') {
                    dest = './';
                } else if (dest.startsWith('index.html#')) {
                    dest = './' + dest.slice(10);
                }
            } else {
                if (dest === './' || dest === '') {
                    dest = 'index.html';
                } else if (dest.startsWith('./#')) {
                    dest = 'index.html' + dest.slice(2);
                }
            }

            if (document.startViewTransition) {
                window.location.href = dest;
            } else {
                document.body.classList.add('macos-space-slide-out-right');
                setTimeout(() => {
                    window.location.href = dest;
                }, 460);
            }
        }

        // 3. Intercept all links back to Portfolio (index.html or ./)
        const backLinks = document.querySelectorAll('a[href="index.html"], a[href="./"], a[href="/"], a[href^="index.html#"], a[href^="./#"], .kali-topbar-back');
        backLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                const href = link.getAttribute('href') || './';
                navigateBackToPortfolio(href);
            });
        });

        if (window.location.protocol === 'file:') {
            document.addEventListener('click', (e) => {
                const a = e.target.closest('a');
                if (a) {
                    const href = a.getAttribute('href');
                    if (href === './' || href === '/') {
                        e.preventDefault();
                        navigateBackToPortfolio('index.html');
                    } else if (href && href.startsWith('./#')) {
                        e.preventDefault();
                        navigateBackToPortfolio('index.html' + href.slice(2));
                    }
                }
            });
        }
    }

    // --------------- Contact Window Actions -----------------
    function initContactWindowActions() {
        const copyBtn = document.getElementById('copy-email-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText('lorenzokraja99@gmail.com').then(() => {
                    copyBtn.textContent = t('btn.copied');
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = t('btn.copy');
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(() => {
                    copyBtn.textContent = t('btn.copied');
                    setTimeout(() => {
                        copyBtn.textContent = t('btn.copy');
                    }, 2000);
                });
            });
        }

        // Auto-open if URL has #contact
        if (window.location.hash === '#contact' || window.location.search.includes('contact')) {
            setTimeout(() => {
                openWindow('contact');
            }, 300);
        }
    }

    // --------------- Reactive Language Change Listener -----
    window.addEventListener('langchange', () => {
        // Re-render breadcrumbs & current Finder view
        if (typeof updateBreadcrumbs === 'function') updateBreadcrumbs();
        if (typeof renderFinderView === 'function') renderFinderView();

        // Re-update active file inspector text if open
        if (typeof activeFileIdx === 'number' && activeFileIdx >= 0 && typeof selectFile === 'function') {
            selectFile(activeFileIdx);
        }

        // Re-update image viewer window title & statusbar if open
        if (activePreviewFile) {
            const titleEl = document.getElementById('preview-win-title');
            const statusLeft = document.getElementById('preview-win-status-left');
            if (titleEl) titleEl.textContent = `${activePreviewFile.name} ${t('previewWin.titleSuffix')}`;
            if (statusLeft) statusLeft.textContent = `${activePreviewFile.name} • ${activePreviewFile.subType || t('finder.imageTypePng')} • ${activePreviewFile.size}`;
        }

        const copyBtn = document.getElementById('copy-email-btn');
        if (copyBtn && !copyBtn.classList.contains('copied')) {
            copyBtn.textContent = t('btn.copy');
        }
    });

    // --------------- Document Ready ---------------------
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initClock();
        initMacMenuBar();
        initWindows();
        initDesktopIcons();
        initCvControls();
        initPublicDomainFileManager();
        initContactWindowActions();
        initMacosSpacesDesktopTransition();

        // Open scattered side-by-side workspace on entering about
        openScatteredWorkspace();
    });

})();
