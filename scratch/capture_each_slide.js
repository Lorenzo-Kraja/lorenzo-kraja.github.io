const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9557;
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
        await new Promise(r => setTimeout(r, 2000));

        const count = 11;
        for (let i = 0; i < count; i++) {
            await send('Runtime.evaluate', {
                expression: `document.querySelectorAll('.slide-card')[${i}].scrollIntoView({block: 'start'});`
            });
            await new Promise(r => setTimeout(r, 250));
            const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 });
            fs.writeFileSync(path.join(brainDir, `slide_${i + 1}.jpg`), Buffer.from(ss.data, 'base64'));
            console.log(`Saved slide_${i + 1}.jpg`);
        }

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
