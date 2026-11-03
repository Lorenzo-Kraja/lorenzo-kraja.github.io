const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9630;
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
        await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1800, deviceScaleFactor: 1, mobile: false });

        // 1. VERIFY HARP CHAIR PAGE
        await send('Page.navigate', { url: 'http://127.0.0.1:8080/harp-chair.html' });
        await new Promise(r => setTimeout(r, 1200));

        const harpDom = await send('Runtime.evaluate', {
            expression: `(() => {
                const container = document.querySelector('.digital-tree-body');
                const nodes = Array.from(container.children).filter(el => !el.classList.contains('digital-rails-gutter'));
                return JSON.stringify(nodes.map(n => ({
                    id: n.id || 'no-id',
                    classes: n.className,
                    text: n.innerText.trim().replace(/\\s+/g, ' ').slice(0, 100),
                    imgSrc: n.querySelector('img')?.getAttribute('src') || null
                })), null, 2);
            })()`
        });
        console.log("Harp Chair DOM nodes:");
        console.log(harpDom.result.value);

        // Scroll to caption after 5th image
        await send('Runtime.evaluate', {
            expression: `document.querySelector('#caption-windsor')?.scrollIntoView({ block: 'center' });`
        });
        await new Promise(r => setTimeout(r, 500));

        const harpCapShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'harp_caption_windsor_verified.png'), Buffer.from(harpCapShot.data, 'base64'));
        console.log("Saved harp_caption_windsor_verified.png");

        // 2. VERIFY HOME PAGE HARP CHAIR WINDOW
        await send('Page.navigate', { url: 'http://127.0.0.1:8080/index.html' });
        await new Promise(r => setTimeout(r, 1500));

        const homeHarp = await send('Runtime.evaluate', {
            expression: `(() => {
                const win = document.querySelector('#project-win-0');
                if (!win) return { error: "Window not found" };
                const slides = Array.from(win.querySelectorAll('.fg-slide img')).map(img => img.getAttribute('src'));
                const counter = win.querySelector('.fg-slides-counter')?.innerText.trim().replace(/\\s+/g, ' ');
                return {
                    slides,
                    counter
                };
            })()`
        });
        console.log("Home page Harp Chair window check:");
        console.log(homeHarp.result.value);

        // Take screenshot of home page showing windows
        await send('Runtime.evaluate', {
            expression: `document.querySelector('#project-win-0')?.scrollIntoView({ block: 'center' });`
        });
        await new Promise(r => setTimeout(r, 500));

        const homeShot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'home_harp_gifs_window.png'), Buffer.from(homeShot.data, 'base64'));
        console.log("Saved home_harp_gifs_window.png");

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (err) {
        console.error(err);
        chrome.kill();
        process.exit(1);
    }
}, 800);
