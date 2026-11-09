const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9640;

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

        await send('Page.navigate', { url: 'http://127.0.0.1:8080/index.html' });
        await new Promise(r => setTimeout(r, 1200));

        const testRes = await send('Runtime.evaluate', {
            expression: `(async () => {
                const win = document.querySelector('#project-win-0');
                const slides = Array.from(win.querySelectorAll('.fg-slide'));
                const img0 = slides[0].querySelector('img');
                
                const t0 = performance.now();
                img0.src = 'images/harp-chair/01.gif?v=' + Date.now();
                await new Promise(r => {
                    if (img0.complete) r();
                    else img0.onload = r;
                });
                const t1 = performance.now();
                return JSON.stringify({ loadTimeMs: t1 - t0, naturalWidth: img0.naturalWidth });
            })()`,
            awaitPromise: true
        });
        console.log("Reload test:", testRes.result.value);

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 800);
