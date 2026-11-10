const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };

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

server.listen(8091, async () => {
    const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
        '--headless=new',
        '--remote-debugging-port=9223',
        '--window-size=390,844',
        '--disable-gpu',
        '--user-data-dir=' + path.join(__dirname, 'edge_user_data2')
    ]);

    await new Promise(r => setTimeout(r, 1500));
    const res = await fetch('http://127.0.0.1:9223/json');
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
        await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
        await send('Page.navigate', { url: 'http://localhost:8091/harp-chair.html' });
        await new Promise(r => setTimeout(r, 1500));

        const trace = await send('Runtime.evaluate', {
            expression: `(() => {
                const img = document.querySelector('.digital-image-box img');
                const chain = [];
                let curr = img;
                while (curr && curr !== document.documentElement) {
                    const rect = curr.getBoundingClientRect();
                    const style = window.getComputedStyle(curr);
                    chain.push({
                        tag: curr.tagName.toLowerCase(),
                        cls: curr.className,
                        id: curr.id,
                        width: Math.round(rect.width),
                        padding: style.padding,
                        margin: style.margin,
                        maxWidth: style.maxWidth
                    });
                    curr = curr.parentElement;
                }
                return chain;
            })()`,
            returnByValue: true
        });

        console.log(JSON.stringify(trace.result.value, null, 2));
        ws.close();
        edge.kill();
        server.close();
        process.exit(0);
    };
});
