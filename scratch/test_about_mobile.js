const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
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
        res.end();
    }
});

server.listen(8092, async () => {
    console.log('Test server running on port 8092');

    const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
        '--headless=new',
        '--remote-debugging-port=9224',
        '--window-size=390,844',
        '--disable-gpu',
        '--no-first-run',
        '--user-data-dir=' + path.join(__dirname, 'edge_user_data_about')
    ]);

    await new Promise(r => setTimeout(r, 1500));

    try {
        const res = await fetch('http://127.0.0.1:9224/json');
        const tabs = await res.json();
        const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
        const WebSocket = globalThis.WebSocket;
        const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

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

            await send('Page.navigate', { url: 'http://localhost:8092/about.html' });
            await new Promise(r => setTimeout(r, 1500));

            const checkState = async (stepName) => {
                const r = await send('Runtime.evaluate', {
                    expression: `(() => {
                        const winKeys = ['cv', 'projects', 'contact', 'preview'];
                        const states = {};
                        winKeys.forEach(k => {
                            const el = document.getElementById('kali-win-' + k);
                            const tab = document.getElementById('tab-' + k);
                            states[k] = {
                                isClosed: el ? el.classList.contains('is-closed') : true,
                                isMinimized: el ? el.classList.contains('is-minimized') : false,
                                display: el ? window.getComputedStyle(el).display : 'none',
                                tabDisplay: tab ? window.getComputedStyle(tab).display : null
                            };
                        });
                        const openCount = winKeys.filter(k => !states[k].isClosed && states[k].display !== 'none').length;
                        const topTitle = document.getElementById('kali-active-title') ? document.getElementById('kali-active-title').textContent : '';
                        return { stepName: "${stepName}", openCount, topTitle, states };
                    })()`,
                    returnByValue: true
                });
                console.log('RAW R:', JSON.stringify(r));
                if (r && r.result && r.result.value) return r.result.value;
                if (r && r.value) return r.value;
                return r;
            };

            // 1. Initial State (All windows closed)
            const initial = await checkState('1. Initial Load');
            console.log('\n--- 1. INITIAL ABOUT STATE (Mobile) ---');
            console.log('Open Windows Count:', initial.openCount, '(Expected: 0)');
            console.log('Topbar Title:', initial.topTitle, '(Expected: Desktop)');
            console.log('Window States:', initial.states);

            // Screenshot initial desktop
            const initialShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(__dirname, 'screenshot_about_mobile_desktop.png'), Buffer.from(initialShot.data, 'base64'));
            console.log('Saved screenshot_about_mobile_desktop.png');

            // 2. Click icon-projects (Personal Stuff)
            await send('Runtime.evaluate', {
                expression: `document.getElementById('icon-projects').click()`
            });
            await new Promise(r => setTimeout(r, 600));

            const afterProjects = await checkState('2. After clicking Personal Stuff icon');
            console.log('\n--- 2. AFTER CLICKING PERSONAL STUFF ICON ---');
            console.log('Open Windows Count:', afterProjects.openCount, '(Expected: 1)');
            console.log('Projects isClosed:', afterProjects.states.projects.isClosed, '(Expected: false)');
            console.log('Projects Display:', afterProjects.states.projects.display, '(Expected: flex)');
            console.log('Topbar Title:', afterProjects.topTitle);

            // Screenshot Personal Stuff window
            const projectsShot = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.join(__dirname, 'screenshot_about_mobile_personal_stuff.png'), Buffer.from(projectsShot.data, 'base64'));
            console.log('Saved screenshot_about_mobile_personal_stuff.png');

            // 3. Click icon-cv (curriculum.pdf) - should close Personal Stuff and open ONLY CV
            await send('Runtime.evaluate', {
                expression: `document.getElementById('icon-cv').click()`
            });
            await new Promise(r => setTimeout(r, 600));

            const afterCv = await checkState('3. After clicking CV icon (Single window switch)');
            console.log('\n--- 3. AFTER CLICKING CV ICON ---');
            console.log('Open Windows Count:', afterCv.openCount, '(Expected: 1)');
            console.log('CV isClosed:', afterCv.states.cv.isClosed, '(Expected: false)');
            console.log('Projects isClosed:', afterCv.states.projects.isClosed, '(Expected: true)');
            console.log('Topbar Title:', afterCv.topTitle);

            // 4. Close CV window (click red close button)
            await send('Runtime.evaluate', {
                expression: `document.querySelector('#kali-win-cv .kali-btn-close').click()`
            });
            await new Promise(r => setTimeout(r, 600));

            const afterClose = await checkState('4. After closing CV window');
            console.log('\n--- 4. AFTER CLOSING CV WINDOW ---');
            console.log('Open Windows Count:', afterClose.openCount, '(Expected: 0)');
            console.log('Topbar Title:', afterClose.topTitle, '(Expected: Desktop)');

            ws.close();
            edge.kill();
            server.close();
            process.exit(0);
        };
    } catch (err) {
        console.error(err);
        edge.kill();
        server.close();
        process.exit(1);
    }
});
