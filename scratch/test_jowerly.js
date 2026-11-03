const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('.');
const artDir = 'C:\\Users\\lory\\.gemini\\antigravity\\brain\\180e8f8a-f0bc-44a9-8e86-be276ad1a9dc';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const httpPort = 9455;
const chromePort = 9456;

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
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=' + chromePort,
        'about:blank'
    ]);

    setTimeout(async () => {
        try {
            const targetsRes = await fetch('http://127.0.0.1:' + chromePort + '/json');
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

            // 1. TEST HOME PAGE (Jowerly window and TOC)
            console.log('--- Testing Home Page (Jowerly window) ---');
            await send('Page.navigate', { url: `http://127.0.0.1:${httpPort}/index.html` });
            await new Promise(r => setTimeout(r, 2200));

            const homeCheck = await send('Runtime.evaluate', {
                expression: `(() => {
                    const win = document.getElementById('project-win-2');
                    const titleEl = win ? win.querySelector('.kali-title-text') : null;
                    const tocItem = document.querySelector('a[href="#project-win-2"]');
                    const fullProjectLink = win ? win.querySelector('.fg-window-view-btn') : null;
                    return {
                        windowFound: !!win,
                        windowTitle: titleEl ? titleEl.textContent : null,
                        tocLabel: tocItem ? tocItem.querySelector('.sd-toc-label').textContent : null,
                        fullProjectHref: fullProjectLink ? fullProjectLink.getAttribute('href') : null
                    };
                })()`,
                returnByValue: true
            });
            console.log('Home check result:', homeCheck.result.value);

            // Pause animations for crisp screenshot
            await send('Runtime.evaluate', {
                expression: `document.querySelectorAll('.sd-scam-about-link, .vlc-coming-soon-text').forEach(el => {
                    el.style.animationPlayState = 'paused';
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });`
            });
            const homeShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(artDir, 'index_jowerly_window.png'), Buffer.from(homeShot.data, 'base64'));
            console.log('Saved index_jowerly_window.png');

            // 2. TEST JEWELRY PAGE (Editorial layout with 8 images)
            console.log('\n--- Testing jewelry.html ---');
            await send('Page.navigate', { url: `http://127.0.0.1:${httpPort}/jewelry.html` });
            await new Promise(r => setTimeout(r, 800));

            const jwCheck = await send('Runtime.evaluate', {
                expression: `(() => {
                    const p1 = document.getElementById('plate-01').getBoundingClientRect();
                    const p2 = document.getElementById('plate-02').getBoundingClientRect();
                    const p3 = document.getElementById('plate-03').getBoundingClientRect();
                    const p4 = document.getElementById('plate-04').getBoundingClientRect();
                    const p56 = document.getElementById('plate-05-06').getBoundingClientRect();
                    const p7 = document.getElementById('plate-07').getBoundingClientRect();
                    const p8 = document.getElementById('plate-08').getBoundingClientRect();
                    const csText = document.querySelector('.fos-coming-soon-text');
                    const csBox = document.querySelector('.fos-img-box-coming-soon');

                    let isCentered = false;
                    if (csText && csBox) {
                        const tr = csText.getBoundingClientRect();
                        const br = csBox.getBoundingClientRect();
                        const tMidX = tr.left + tr.width / 2;
                        const tMidY = tr.top + tr.height / 2;
                        const bMidX = br.left + br.width / 2;
                        const bMidY = br.top + br.height / 2;
                        isCentered = Math.abs(tMidX - bMidX) < 4 && Math.abs(tMidY - bMidY) < 4;
                    }

                    return {
                        dislivello12: Math.round(p2.top - p1.top),
                        dislivello34: Math.round(p4.top - p3.top),
                        row3SideBySide: Math.abs(p56.bottom - p7.bottom) < 50,
                        csTextFound: !!csText,
                        csCentered: isCentered,
                        csStyle: csText ? {
                            color: getComputedStyle(csText).color,
                            fontFamily: getComputedStyle(csText).fontFamily,
                            fontSize: getComputedStyle(csText).fontSize,
                            textDecoration: getComputedStyle(csText).textDecoration,
                            animation: getComputedStyle(csText).animation
                        } : null
                    };
                })()`,
                returnByValue: true
            });
            console.log('Jowerly layout check:', jwCheck.result.value);

            // Pause coming soon blink for screenshot
            await send('Runtime.evaluate', {
                expression: `const cs = document.querySelector('.fos-coming-soon-text'); if(cs){ cs.style.animationPlayState = 'paused'; cs.style.opacity = '1'; cs.style.visibility = 'visible'; }`
            });

            // Capture top section of jowerly.html (Didascalia + Row 1 + Row 2)
            const jwTopShot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: { x: 0, y: 0, width: 1440, height: 1200, scale: 1 }
            });
            fs.writeFileSync(path.join(artDir, 'jowerly_top_editorial.png'), Buffer.from(jwTopShot.data, 'base64'));
            console.log('Saved jowerly_top_editorial.png');

            // Scroll down to Row 3 (joined 5+6 + 7) & Row 4 (Coming soon 8)
            await send('Runtime.evaluate', { expression: `window.scrollTo(0, 1100);` });
            await new Promise(r => setTimeout(r, 400));

            const jwBottomShot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: { x: 0, y: 0, width: 1440, height: 1200, scale: 1 }
            });
            fs.writeFileSync(path.join(artDir, 'jowerly_bottom_editorial.png'), Buffer.from(jwBottomShot.data, 'base64'));
            console.log('Saved jowerly_bottom_editorial.png');

            // Capture full page screenshot of jowerly.html
            const metrics = await send('Page.getLayoutMetrics');
            const totalH = Math.ceil(metrics.contentSize.height);
            await send('Emulation.setDeviceMetricsOverride', {
                width: 1440,
                height: totalH,
                deviceScaleFactor: 1,
                mobile: false
            });
            await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
            await new Promise(r => setTimeout(r, 300));
            const fullPageShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(artDir, 'jowerly_full_editorial.png'), Buffer.from(fullPageShot.data, 'base64'));
            console.log('Saved jowerly_full_editorial.png (total height: ' + totalH + 'px)');

            // Dark theme test
            await send('Runtime.evaluate', { expression: `document.body.classList.add('dark-theme');` });
            await new Promise(r => setTimeout(r, 300));
            const darkPageShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(artDir, 'jowerly_dark_editorial.png'), Buffer.from(darkPageShot.data, 'base64'));
            console.log('Saved jowerly_dark_editorial.png');

            chrome.kill();
            server.close();
            process.exit(0);
        } catch (err) {
            console.error('Error during testing:', err);
            chrome.kill();
            server.close();
            process.exit(1);
        }
    }, 1200);
});
