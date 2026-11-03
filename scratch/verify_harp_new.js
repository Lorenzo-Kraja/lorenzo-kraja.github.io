const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9600;
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

        // Scroll to load all
        for (let s = 0; s < 12; s++) {
            await send('Runtime.evaluate', { expression: `window.scrollBy(0, 1000);` });
            await new Promise(r => setTimeout(r, 150));
        }
        await new Promise(r => setTimeout(r, 1000));

        const harpData = await send('Runtime.evaluate', {
            expression: `(() => {
                const title = document.querySelector('.digital-project-title')?.textContent.trim();
                const plates = Array.from(document.querySelectorAll('.digital-plate-node')).map(p => {
                    const badge = p.querySelector('.digital-plate-badge')?.textContent.trim();
                    const pTitle = p.querySelector('.digital-plate-title')?.textContent.trim();
                    const img = p.querySelector('img');
                    return {
                        id: p.id,
                        badge,
                        title: pTitle,
                        src: img?.src.split('/').pop(),
                        complete: img?.complete,
                        naturalWidth: img?.naturalWidth,
                        naturalHeight: img?.naturalHeight,
                        centerX: img ? img.getBoundingClientRect().left + img.getBoundingClientRect().width / 2 : null
                    };
                });
                return { title, count: plates.length, plates };
            })()`,
            returnByValue: true
        });

        console.log('HARP CHAIR DATA:');
        console.log('Title:', harpData.result.value.title);
        console.log('Plates Count:', harpData.result.value.count);
        console.table(harpData.result.value.plates);

        // Capture top with Plate 01 (anim 5 min)
        await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
        await new Promise(r => setTimeout(r, 300));
        let ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_plate_01_top.png'), Buffer.from(ss.data, 'base64'));

        // Capture dark mode top
        await send('Runtime.evaluate', { expression: 'document.body.classList.add("dark-theme");' });
        await new Promise(r => setTimeout(r, 300));
        ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_plate_01_dark.png'), Buffer.from(ss.data, 'base64'));

        // Capture outdoor terrace (Plate 10)
        await send('Runtime.evaluate', { expression: 'document.body.classList.remove("dark-theme"); document.getElementById("plate-10").scrollIntoView();' });
        await new Promise(r => setTimeout(r, 500));
        ss = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_plate_10_outdoor.png'), Buffer.from(ss.data, 'base64'));

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 1200);
