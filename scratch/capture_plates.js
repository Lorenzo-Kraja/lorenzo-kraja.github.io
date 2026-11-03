const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9570;
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
        await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });

        const mikkUrl = 'file:///' + path.join(__dirname, '..', 'mikk.html').replace(/\\/g, '/');
        await send('Page.navigate', { url: mikkUrl });
        await new Promise(r => setTimeout(r, 1000));

        // Scroll to Plate 05
        await send('Runtime.evaluate', {
            expression: `document.getElementById('plate-05').scrollIntoView({ behavior: 'instant', block: 'start' });`
        });
        await new Promise(r => setTimeout(r, 1000));

        let ss = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1440, height: 960, scale: 1 } });
        fs.writeFileSync(path.join(brainDir, 'mikk_plate_05.png'), Buffer.from(ss.data, 'base64'));

        // Scroll to Plate 10
        await send('Runtime.evaluate', {
            expression: `document.getElementById('plate-10').scrollIntoView({ behavior: 'instant', block: 'start' });`
        });
        await new Promise(r => setTimeout(r, 1000));

        ss = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1440, height: 960, scale: 1 } });
        fs.writeFileSync(path.join(brainDir, 'mikk_plate_10.png'), Buffer.from(ss.data, 'base64'));

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
