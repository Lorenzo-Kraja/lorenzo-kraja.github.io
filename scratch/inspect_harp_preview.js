const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9590;
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
        await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

        const url = 'file:///' + path.join(__dirname, 'preview_harp_new.html').replace(/\\/g, '/');
        await send('Page.navigate', { url });
        await new Promise(r => setTimeout(r, 2000));

        // Get dimensions of all cards
        const info = await send('Runtime.evaluate', {
            expression: `Array.from(document.querySelectorAll('.card')).map((c, i) => {
                const img = c.querySelector('img');
                return {
                    index: i,
                    title: c.querySelector('h3').textContent,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight
                };
            })`,
            returnByValue: true
        });
        console.log('Cards info:');
        console.table(info.result.value);

        // Capture cards individually
        for (let i = 0; i < 5; i++) {
            await send('Runtime.evaluate', {
                expression: `document.querySelectorAll('.card')[${i}].scrollIntoView();`
            });
            await new Promise(r => setTimeout(r, 600));
            const ss = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 });
            fs.writeFileSync(path.join(brainDir, `harp_preview_card_${i + 1}.jpg`), Buffer.from(ss.data, 'base64'));
            console.log(`Saved harp_preview_card_${i + 1}.jpg`);
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
