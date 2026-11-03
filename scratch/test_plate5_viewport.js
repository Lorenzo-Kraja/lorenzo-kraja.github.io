const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9580',
    '--disable-gpu',
    'about:blank'
]);

setTimeout(async () => {
    try {
        const targets = await new Promise((res, rej) => {
            http.get('http://127.0.0.1:9580/json', r => {
                let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
            }).on('error', rej);
        });
        const target = targets.find(t => t.type === 'page');
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        let id = 1;
        const send = (method, params = {}) => new Promise(r => {
            const curId = id++;
            const h = (evt) => {
                const data = JSON.parse(evt.data);
                if (data.id === curId) { ws.removeEventListener('message', h); r(data.result); }
            };
            ws.addEventListener('message', h);
            ws.send(JSON.stringify({ id: curId, method, params }));
        });
        await new Promise(r => ws.addEventListener('open', r));
        await send('Page.enable');
        await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
        await send('Page.navigate', { url: 'file:///C:/Users/lory/Desktop/Sito%20Portfolio/mikk.html' });
        await new Promise(r => setTimeout(r, 1200));

        // Scroll plate 05 into view
        await send('Runtime.evaluate', { expression: 'document.getElementById("plate-05").scrollIntoView();' });
        await new Promise(r => setTimeout(r, 1000));
        const ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:\\Users\\lory\\.gemini\\antigravity\\brain\\180e8f8a-f0bc-44a9-8e86-be276ad1a9dc\\mikk_plate_05_vp.png', Buffer.from(ss.data, 'base64'));
        console.log('Successfully saved mikk_plate_05_vp.png');

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
