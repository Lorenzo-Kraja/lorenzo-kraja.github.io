const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 1. Static file server
const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.mp4': 'video/mp4',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(__dirname, '..', reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(8089, async () => {
    console.log('Server running on port 8089');

    // Launch Edge in headless mode with remote debugging
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const edge = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9222',
        '--window-size=390,844',
        '--disable-gpu',
        '--no-first-run',
        '--user-data-dir=' + path.join(__dirname, 'edge_user_data')
    ]);

    // Give Edge a second to start
    await new Promise(r => setTimeout(r, 1500));

    // Connect to CDP
    try {
        const res = await fetch('http://127.0.0.1:9222/json');
        const tabs = await res.json();
        const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
        console.log('Selected Tab URL:', pageTab.url);
        const wsUrl = pageTab.webSocketDebuggerUrl;

        // Use built-in WebSocket (available in Node 21+) or simple CDP protocol
        const WebSocket = globalThis.WebSocket;
        if (!WebSocket) {
            console.log('Global WebSocket not available in this node version');
            edge.kill();
            server.close();
            return;
        }

        const ws = new WebSocket(wsUrl);
        let idCounter = 1;
        const send = (method, params = {}) => new Promise((resolve) => {
            const id = idCounter++;
            const handler = (event) => {
                const data = JSON.parse(event.data);
                if (data.id === id) {
                    ws.removeEventListener('message', handler);
                    resolve(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
        });

        ws.onopen = async () => {
            console.log('Connected to CDP');
            await send('Emulation.setDeviceMetricsOverride', {
                width: 390,
                height: 844,
                deviceScaleFactor: 3,
                mobile: true
            });

            await send('Page.navigate', { url: 'http://localhost:8089/index.html' });
            await new Promise(r => setTimeout(r, 2000));

            // Check Home Page Windows
            const evalResult = await send('Runtime.evaluate', {
                expression: `(() => {
                    const vlc = document.getElementById('hero-win-vlc');
                    const w0 = document.getElementById('project-win-0');
                    const w1 = document.getElementById('project-win-1');
                    const w2 = document.getElementById('project-win-2');

                    const getMetrics = (win) => {
                        if (!win) return null;
                        const rect = win.getBoundingClientRect();
                        const content = win.querySelector('.vlc-video-container') || win.querySelector('.fg-hero-window-content');
                        const contentRect = content ? content.getBoundingClientRect() : null;
                        return {
                            id: win.id,
                            rect: { width: Math.round(rect.width), height: Math.round(rect.height) },
                            contentRect: contentRect ? { width: Math.round(contentRect.width), height: Math.round(contentRect.height) } : null,
                            isCollapsed: rect.height < 100
                        };
                    };

                    return {
                        vlc: getMetrics(vlc),
                        w0: getMetrics(w0),
                        w1: getMetrics(w1),
                        w2: getMetrics(w2)
                    };
                })()`,
                returnByValue: true
            });

            const getVal = (r) => (r && r.result && r.result.value) || r;
            console.log('\n--- HOME PAGE METRICS (390px Mobile Viewport) ---');
            console.log(JSON.stringify(getVal(evalResult), null, 2));

            // Take screenshot of Home Page
            const homeShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(__dirname, 'screenshot_home_mobile.png'), Buffer.from(homeShot.data, 'base64'));
            console.log('Saved screenshot_home_mobile.png');

            // Now test Project Page (Harp Chair)
            await send('Page.navigate', { url: 'http://localhost:8089/harp-chair.html' });
            await new Promise(r => setTimeout(r, 1500));

            const harpShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(__dirname, 'screenshot_harp_mobile.png'), Buffer.from(harpShot.data, 'base64'));
            console.log('Saved screenshot_harp_mobile.png');

            const harpEval = await send('Runtime.evaluate', {
                expression: `(() => {
                    const images = Array.from(document.querySelectorAll('.digital-image-box img'));
                    return {
                        totalImages: images.length,
                        firstImageWidth: images[0] ? Math.round(images[0].getBoundingClientRect().width) : 0,
                        firstImageHeight: images[0] ? Math.round(images[0].getBoundingClientRect().height) : 0,
                        treeBodyPaddingLeft: window.getComputedStyle(document.querySelector('.digital-tree-body')).paddingLeft
                    };
                })()`,
                returnByValue: true
            });

            console.log('\n--- HARP CHAIR MONOGRAPH METRICS (390px Mobile Viewport) ---');
            console.log(JSON.stringify(getVal(harpEval), null, 2));

            // Now test Jewelry Page
            await send('Page.navigate', { url: 'http://localhost:8089/jewelry.html' });
            await new Promise(r => setTimeout(r, 1500));

            const jewelryEval = await send('Runtime.evaluate', {
                expression: `(() => {
                    const images = Array.from(document.querySelectorAll('.digital-image-box img'));
                    return {
                        totalImages: images.length,
                        firstImageWidth: images[0] ? Math.round(images[0].getBoundingClientRect().width) : 0,
                        ringCraftImageWidth: document.querySelector('img[src*="ring_craft"]') ? Math.round(document.querySelector('img[src*="ring_craft"]').getBoundingClientRect().width) : 0
                    };
                })()`,
                returnByValue: true
            });

            console.log('\n--- JEWELRY MONOGRAPH METRICS (390px Mobile Viewport) ---');
            console.log(JSON.stringify(getVal(jewelryEval), null, 2));

            ws.close();
            edge.kill();
            server.close();
            process.exit(0);
        };
    } catch (err) {
        console.error('Error during test:', err);
        edge.kill();
        server.close();
        process.exit(1);
    }
});
