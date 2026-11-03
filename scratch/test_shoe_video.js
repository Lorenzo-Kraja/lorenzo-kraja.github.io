const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('.');
const artDir = 'C:\\Users\\lory\\.gemini\\antigravity\\brain\\180e8f8a-f0bc-44a9-8e86-be276ad1a9dc';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const httpPort = 9465;
const chromePort = 9466;

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

            console.log('Navigating to index.html...');
            await send('Page.navigate', { url: `http://127.0.0.1:${httpPort}/index.html` });
            // Wait for intro overlay to finish dismiss (1.4s + fade)
            await new Promise(r => setTimeout(r, 2400));

            const inspection = await send('Runtime.evaluate', {
                expression: `(() => {
                    const video = document.getElementById('sd-reel-video');
                    const titleText = document.querySelector('.vlc-title-text');
                    const overlay = document.querySelector('.vlc-coming-soon-overlay');
                    const csText = document.querySelector('.vlc-coming-soon-text');
                    const vlcWin = document.getElementById('hero-win-vlc');
                    const videoBox = document.querySelector('.vlc-video-container');

                    let videoRect = videoBox ? videoBox.getBoundingClientRect() : null;
                    let csRect = csText ? csText.getBoundingClientRect() : null;

                    let isCentered = false;
                    if (videoRect && csRect) {
                        const boxMidX = videoRect.left + videoRect.width / 2;
                        const boxMidY = videoRect.top + videoRect.height / 2;
                        const csMidX = csRect.left + csRect.width / 2;
                        const csMidY = csRect.top + csRect.height / 2;
                        isCentered = Math.abs(boxMidX - csMidX) < 2 && Math.abs(boxMidY - csMidY) < 2;
                    }

                    return {
                        videoSrc: video ? video.currentSrc || video.src : null,
                        videoPaused: video ? video.paused : null,
                        videoReadyState: video ? video.readyState : null,
                        videoWidth: video ? video.videoWidth : null,
                        videoHeight: video ? video.videoHeight : null,
                        windowTitle: titleText ? titleText.textContent : null,
                        comingSoonText: csText ? csText.textContent : null,
                        comingSoonStyle: csText ? {
                            color: getComputedStyle(csText).color,
                            fontFamily: getComputedStyle(csText).fontFamily,
                            fontSize: getComputedStyle(csText).fontSize,
                            fontWeight: getComputedStyle(csText).fontWeight,
                            textTransform: getComputedStyle(csText).textTransform,
                            textDecoration: getComputedStyle(csText).textDecoration,
                            animation: getComputedStyle(csText).animation
                        } : null,
                        isCentered,
                        csRect,
                        videoRect
                    };
                })()`,
                returnByValue: true
            });
            console.log('Inspection result:', JSON.stringify(inspection.result.value, null, 2));

            // Force opacity on coming soon text & about link for screenshot if in blink hidden state
            await send('Runtime.evaluate', {
                expression: `(() => {
                    document.querySelectorAll('.sd-scam-about-link, .vlc-coming-soon-text').forEach(el => {
                        el.style.animationPlayState = 'paused';
                        el.style.opacity = '1';
                        el.style.visibility = 'visible';
                    });
                })()`
            });

            // Capture full index screenshot
            const fullShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(artDir, 'index_shoe_coming_soon_light.png'), Buffer.from(fullShot.data, 'base64'));
            console.log('Saved index_shoe_coming_soon_light.png');

            const rects = await send('Runtime.evaluate', {
                expression: `(() => {
                    const r = document.querySelector('.vlc-video-container').getBoundingClientRect();
                    return { x: r.left, y: r.top, width: r.width, height: r.height };
                })()`,
                returnByValue: true
            });
            const r = rects.result.value;

            // Capture zoomed screenshot of VLC window
            const vlcShot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: {
                    x: Math.round(r.x - 5),
                    y: Math.round(r.y - 35),
                    width: Math.round(r.width + 10),
                    height: Math.round(r.height + 70),
                    scale: 1
                }
            });
            fs.writeFileSync(path.join(artDir, 'vlc_shoe_zoom_light.png'), Buffer.from(vlcShot.data, 'base64'));
            console.log('Saved vlc_shoe_zoom_light.png');

            // Test Dark Theme
            await send('Runtime.evaluate', { expression: `document.body.classList.add('dark-theme');` });
            await new Promise(r => setTimeout(r, 400));

            const darkShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(artDir, 'index_shoe_coming_soon_dark.png'), Buffer.from(darkShot.data, 'base64'));
            console.log('Saved index_shoe_coming_soon_dark.png');

            chrome.kill();
            server.close();
            process.exit(0);
        } catch (err) {
            console.error('Error:', err);
            chrome.kill();
            server.close();
            process.exit(1);
        }
    }, 1200);
});
