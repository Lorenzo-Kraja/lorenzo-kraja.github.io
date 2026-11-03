const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9565;

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

        // Scroll all the way down slowly so lazy images load
        for (let s = 0; s < 12; s++) {
            await send('Runtime.evaluate', { expression: `window.scrollBy(0, 1000);` });
            await new Promise(r => setTimeout(r, 200));
        }
        await new Promise(r => setTimeout(r, 1000));

        const res = await send('Runtime.evaluate', {
            expression: `Array.from(document.querySelectorAll('.digital-image-box img')).map(img => ({
                src: img.src.split('/').pop(),
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            }))`,
            returnByValue: true
        });

        console.log('Images status after scroll:');
        console.table(res.result.value);

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
