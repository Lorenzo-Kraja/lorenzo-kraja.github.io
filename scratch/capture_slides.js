const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9555;
const brainDir = 'C:\\Users\\lory\\.gemini\\antigravity\\brain\\180e8f8a-f0bc-44a9-8e86-be276ad1a9dc';

const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'about:blank'
]);

setTimeout(async () => {
    try {
        const targets = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:' + port + '/json', res => {
                let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
            }).on('error', reject);
        });
        const target = targets.find(t => t.type === 'page');
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        let id = 1;
        const send = (method, params = {}) => new Promise(res => {
            const curId = id++;
            const handler = (evt) => {
                const data = JSON.parse(evt.data);
                if (data.id === curId) {
                    ws.removeEventListener('message', handler);
                    res(data.result);
                }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id: curId, method, params }));
        });
        await new Promise(r => ws.addEventListener('open', r));
        await send('Page.enable');
        await send('Runtime.enable');
        await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

        const url = 'file:///' + path.join(__dirname, 'nomod_slides_preview.html').replace(/\\/g, '/');
        await send('Page.navigate', { url });
        await new Promise(r => setTimeout(r, 1500));

        // Evaluate cards
        const cardsCount = await send('Runtime.evaluate', { expression: 'document.querySelectorAll(".slide-card").length', returnByValue: true });
        console.log('Cards count:', cardsCount.result.value);

        // Take a screenshot of top 3
        const ss = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1440, height: 2500, scale: 1 } });
        fs.writeFileSync(path.join(brainDir, 'mikk_slides_top.png'), Buffer.from(ss.data, 'base64'));
        console.log('Saved mikk_slides_top.png');

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
