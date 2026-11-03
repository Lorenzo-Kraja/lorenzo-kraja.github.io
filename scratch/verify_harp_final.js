const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9615;
const brainDir = 'C:\\Users\\lory\\.gemini\\antigravity\\brain\\180e8f8a-f0bc-44a9-8e86-be276ad1a9dc';

const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--disable-gpu',
    'about:blank'
]);

setTimeout(async () => {
    try {
        const targets = await new Promise((res, rej) => {
            http.get('http://127.0.0.1:' + port + '/json', r => {
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
        await send('Runtime.enable');
        await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });

        const harpUrl = 'file:///' + path.join(__dirname, '..', 'harp-chair.html').replace(/\\/g, '/');
        await send('Page.navigate', { url: harpUrl });
        await new Promise(r => setTimeout(r, 1500));

        const res = await send('Runtime.evaluate', {
            expression: `(() => {
                const openingText = document.querySelector('.digital-section-node')?.textContent.trim();
                const plateNodes = Array.from(document.querySelectorAll('.digital-plate-node')).map(p => p.id);
                const sectionNodes = Array.from(document.querySelectorAll('.digital-section-node')).map(s => s.textContent.trim());
                return { openingText, plateCount: plateNodes.length, plateNodes, sectionNodes };
            })()`,
            returnByValue: true
        });

        console.log('Verification data:', res.result.value);

        // Screenshot top (opening statement + Plate 01)
        let ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_final_top.png'), Buffer.from(ss.data, 'base64'));

        // Scroll to Windsor section after GIFs
        await send('Runtime.evaluate', {
            expression: `document.querySelectorAll('.digital-section-node')[1].scrollIntoView();`
        });
        await new Promise(r => setTimeout(r, 600));
        ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_final_windsor_section.png'), Buffer.from(ss.data, 'base64'));

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
