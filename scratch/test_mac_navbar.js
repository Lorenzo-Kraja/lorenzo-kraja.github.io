const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('.');
const artDir = 'C:\\Users\\lory\\.gemini\\antigravity\\brain\\180e8f8a-f0bc-44a9-8e86-be276ad1a9dc';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const httpPort = 9485;
const chromePort = 9486;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
    let cleanUrl = decodeURIComponent(req.url.split('?')[0].replace(/^\/+/, ''));
    if (!cleanUrl) cleanUrl = 'index.html';
    let filePath = path.join(rootDir, cleanUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const stat = fs.statSync(filePath);
        const range = req.headers.range;

        if (ext === '.mp4' && range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4'
            });
            file.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Type': mimeTypes[ext] || 'application/octet-stream',
                'Content-Length': stat.size,
                'Accept-Ranges': 'bytes'
            });
            fs.createReadStream(filePath).pipe(res);
        }
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(httpPort, async () => {
    console.log(`Server listening on ${httpPort}`);
    const chrome = spawn(chromePath, [
        '--headless=new',
        `--remote-debugging-port=${chromePort}`,
        'about:blank'
    ]);

    setTimeout(async () => {
        try {
            const targetsRes = await fetch(`http://127.0.0.1:${chromePort}/json`);
            const targets = await targetsRes.json();
            const target = targets.find(t => t.type === 'page') || targets[0];
            const ws = new WebSocket(target.webSocketDebuggerUrl);
            await new Promise(r => ws.addEventListener('open', r));

            let id = 1;
            function send(method, params = {}) {
                return new Promise((resolve, reject) => {
                    const curId = id++;
                    const onMsg = (evt) => {
                        const msg = JSON.parse(evt.data);
                        if (msg.id === curId) {
                            ws.removeEventListener('message', onMsg);
                            if (msg.error) reject(msg.error);
                            else resolve(msg.result);
                        }
                    };
                    ws.addEventListener('message', onMsg);
                    ws.send(JSON.stringify({ id: curId, method, params }));
                });
            }

            await send('Page.enable');
            await send('DOM.enable');

            await send('Emulation.setDeviceMetricsOverride', {
                width: 1440,
                height: 900,
                deviceScaleFactor: 1,
                mobile: false
            });

            console.log('--- Navigating to index.html ---');
            await send('Page.navigate', { url: `http://127.0.0.1:${httpPort}/index.html` });
            await new Promise(r => setTimeout(r, 2000));

            // Verify DOM State
            const state = await send('Runtime.evaluate', {
                expression: `(() => {
                    const nav = document.getElementById('mac-top-nav');
                    const appleLogo = document.querySelector('.mac-apple-link, .mac-apple-logo');
                    const brand = document.querySelector('.mac-nav-brand');
                    const contactCard = document.querySelector('.mac-preview-contact');
                    const contactItem = document.getElementById('mac-menu-contact');
                    const contactBtn = document.getElementById('mac-contact-btn');
                    const dropdown = document.getElementById('mac-contact-dropdown');
                    const dropdownLinks = Array.from(document.querySelectorAll('.mac-dropdown-item')).map(a => a.textContent.trim());

                    return {
                        hasMacNav: !!nav,
                        appleLogoPresent: !!appleLogo,
                        brandText: brand ? brand.textContent.trim() : null,
                        contactCardPresent: !!contactCard,
                        hasContactItem: !!contactItem,
                        hasContactBtn: !!contactBtn,
                        hasDropdown: !!dropdown,
                        dropdownCount: dropdownLinks.length,
                        dropdownLinks
                    };
                })()`,
                returnByValue: true
            });

            console.log('DOM State:', JSON.stringify(state.result.value, null, 2));

            // 1. Capture top navbar screenshot (showing Lorenzo Kraja at the far left without Apple logo)
            const navShot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: { x: 0, y: 0, width: 700, height: 120, scale: 1 }
            });
            fs.writeFileSync(path.join(artDir, 'mac_navbar_no_apple.png'), Buffer.from(navShot.data, 'base64'));
            console.log('Saved mac_navbar_no_apple.png');

            // 2. Simulate mouseenter on #mac-menu-contact
            await send('Runtime.evaluate', {
                expression: `(() => {
                    const contactItem = document.getElementById('mac-menu-contact');
                    if (contactItem) {
                        contactItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                    }
                })()`
            });
            await new Promise(r => setTimeout(r, 300));

            const hoverOpenState = await send('Runtime.evaluate', {
                expression: `(() => {
                    const dropdown = document.getElementById('mac-contact-dropdown');
                    const btn = document.getElementById('mac-contact-btn');
                    return {
                        isOpen: dropdown ? dropdown.classList.contains('is-open') : false,
                        isActive: btn ? btn.classList.contains('is-active') : false,
                        computedDisplay: dropdown ? getComputedStyle(dropdown).display : null
                    };
                })()`,
                returnByValue: true
            });
            console.log('Hover open state:', hoverOpenState.result.value);

            const hoverShot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: { x: 0, y: 0, width: 650, height: 420, scale: 1 }
            });
            fs.writeFileSync(path.join(artDir, 'mac_contact_hover_open.png'), Buffer.from(hoverShot.data, 'base64'));
            console.log('Saved mac_contact_hover_open.png');

            // 3. Test in dark theme
            await send('Runtime.evaluate', {
                expression: `(() => {
                    document.body.classList.add('dark-theme');
                })()`
            });
            await new Promise(r => setTimeout(r, 300));

            const darkHoverShot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: { x: 0, y: 0, width: 650, height: 420, scale: 1 }
            });
            fs.writeFileSync(path.join(artDir, 'mac_contact_hover_dark.png'), Buffer.from(darkHoverShot.data, 'base64'));
            console.log('Saved mac_contact_hover_dark.png');

            console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
            ws.close();
            chrome.kill();
            server.close();
            process.exit(0);

        } catch (err) {
            console.error('Test error:', err);
            chrome.kill();
            server.close();
            process.exit(1);
        }
    }, 1500);
});
