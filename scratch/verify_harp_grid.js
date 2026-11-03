const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9620;
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

        const gridInfo = await send('Runtime.evaluate', {
            expression: `(() => {
                const trio = document.querySelector('.digital-editorial-trio');
                const items = Array.from(trio.querySelectorAll('.digital-editorial-item')).map(item => {
                    const rect = item.getBoundingClientRect();
                    return {
                        id: item.id,
                        badge: item.querySelector('.digital-mini-badge')?.textContent,
                        title: item.querySelector('.digital-mini-title')?.textContent,
                        width: rect.width,
                        height: rect.height,
                        top: rect.top,
                        left: rect.left
                    };
                });
                return { items, trioWidth: trio.getBoundingClientRect().width };
            })()`,
            returnByValue: true
        });

        console.log('GIF Grid Info:');
        console.table(gridInfo.result.value.items);
        console.log('Trio Width:', gridInfo.result.value.trioWidth);

        // Capture screenshot of top with statement + GIF grid
        let ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_gif_grid_top.png'), Buffer.from(ss.data, 'base64'));

        // Capture dark mode
        await send('Runtime.evaluate', { expression: 'document.body.classList.add("dark-theme");' });
        await new Promise(r => setTimeout(r, 300));
        ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_gif_grid_dark.png'), Buffer.from(ss.data, 'base64'));

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
