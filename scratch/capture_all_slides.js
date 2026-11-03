const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9556;
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

        // Get box coordinates for all cards
        const boxes = await send('Runtime.evaluate', {
            expression: `Array.from(document.querySelectorAll('.slide-card')).map((el, i) => {
                const r = el.getBoundingClientRect();
                return { index: i, top: r.top + window.scrollY, left: r.left, width: r.width, height: r.height };
            })`,
            returnByValue: true
        });

        console.log('Boxes count:', boxes.result.value.length);
        
        // Take screenshots in groups
        for (let g = 0; g < boxes.result.value.length; g += 3) {
            const b = boxes.result.value[g];
            const endB = boxes.result.value[Math.min(g + 2, boxes.result.value.length - 1)];
            const clipY = b.top;
            const clipHeight = (endB.top + endB.height) - b.top;

            const ss = await send('Page.captureScreenshot', {
                format: 'png',
                clip: { x: 0, y: clipY, width: 1440, height: Math.min(clipHeight + 40, 2800), scale: 0.6 }
            });
            fs.writeFileSync(path.join(brainDir, `mikk_group_${g}.png`), Buffer.from(ss.data, 'base64'));
            console.log(`Saved mikk_group_${g}.png`);
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
