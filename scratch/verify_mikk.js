const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9622;
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

        await send('Page.navigate', { url: 'http://127.0.0.1:8080/mikk.html' });
        await new Promise(r => setTimeout(r, 1200));

        // Evaluate DOM structure
        const evalRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const container = document.querySelector('.digital-tree-body');
                const nodes = Array.from(container.children).filter(el => !el.classList.contains('digital-rails-gutter'));
                return JSON.stringify(nodes.map(n => ({
                    id: n.id || 'no-id',
                    classes: n.className,
                    textSnippet: n.innerText.trim().replace(/\\s+/g, ' ').slice(0, 100)
                })), null, 2);
            })()`
        });

        console.log("DOM tree nodes in Mikk:");
        console.log(evalRes.result.value);

        // Check language switcher and texts in Italian vs English
        const langCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const out = {};
                // Default is EN
                out.en_top = document.querySelector('.digital-section-node')?.innerText.replace(/\\s+/g, ' ');
                out.en_cap1 = document.querySelector('#caption-architecture')?.innerText.replace(/\\s+/g, ' ');
                out.en_cap2 = document.querySelector('#caption-specs')?.innerText.replace(/\\s+/g, ' ');

                // Switch to IT
                const itBtn = document.querySelector('.mac-lang-btn[data-lang="it"]');
                if (itBtn) itBtn.click();
                out.it_top = document.querySelector('.digital-section-node')?.innerText.replace(/\\s+/g, ' ');
                out.it_cap1 = document.querySelector('#caption-architecture')?.innerText.replace(/\\s+/g, ' ');
                out.it_cap2 = document.querySelector('#caption-specs')?.innerText.replace(/\\s+/g, ' ');

                // Switch back to EN
                const enBtn = document.querySelector('.mac-lang-btn[data-lang="en"]');
                if (enBtn) enBtn.click();

                return JSON.stringify(out, null, 2);
            })()`
        });
        console.log("Language evaluation:");
        console.log(langCheck.result.value);

        // Capture screenshot of upper half
        const shot1 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'mikk_captions_verified.png'), Buffer.from(shot1.data, 'base64'));
        console.log("Saved mikk_captions_verified.png");

        // Scroll to caption 2 (around plate 6)
        await send('Runtime.evaluate', {
            expression: `document.querySelector('#caption-specs')?.scrollIntoView({ block: 'center' });`
        });
        await new Promise(r => setTimeout(r, 600));

        const shot2 = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(brainDir, 'mikk_caption2_specs.png'), Buffer.from(shot2.data, 'base64'));
        console.log("Saved mikk_caption2_specs.png");

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (err) {
        console.error(err);
        chrome.kill();
        process.exit(1);
    }
}, 800);
