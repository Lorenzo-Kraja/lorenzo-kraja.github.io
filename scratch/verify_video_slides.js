const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9655;
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

        await send('Page.navigate', { url: 'http://127.0.0.1:8080/index.html' });
        await new Promise(r => setTimeout(r, 1500));

        // Track video slide events
        await send('Runtime.evaluate', {
            expression: `(() => {
                window.__mediaEvents = [];
                const win = document.querySelector('#project-win-0');
                const vids = Array.from(win.querySelectorAll('video'));
                vids.forEach((v, i) => {
                    v.addEventListener('play', () => {
                        window.__mediaEvents.push({ type: 'play', slide: i, time: performance.now(), curTime: v.currentTime });
                    });
                    v.addEventListener('ended', () => {
                        window.__mediaEvents.push({ type: 'ended', slide: i, time: performance.now(), duration: v.duration });
                    });
                });
            })()`
        });

        console.log("Observing video playback across 10 seconds...");
        await new Promise(r => setTimeout(r, 10000));

        const logsRes = await send('Runtime.evaluate', {
            expression: `JSON.stringify(window.__mediaEvents, null, 2)`
        });
        console.log("Media events observed:");
        console.log(logsRes.result.value);

        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_perfect_playback.png'), Buffer.from(screenshot.data, 'base64'));
        console.log("Saved harp_perfect_playback.png");

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 800);
