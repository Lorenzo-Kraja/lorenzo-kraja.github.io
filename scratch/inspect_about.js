const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].replace(/^\/+/, '');
    if (!cleanUrl) cleanUrl = 'index.html';
    let filePath = path.join(path.resolve('.'), cleanUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimes = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
        res.writeHead(200, { 'Content-Type': mimes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end();
    }
});
server.listen(9881, async () => {
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--remote-debugging-port=9882', 'about:blank']);
    setTimeout(async () => {
        const tr = await (await fetch('http://127.0.0.1:9882/json')).json();
        const ws = new WebSocket(tr[0].webSocketDebuggerUrl);
        await new Promise(r => ws.addEventListener('open', r));
        let id = 1;
        const send = (m, p={}) => new Promise(res => {
            const cid = id++;
            const cb = e => { const d = JSON.parse(e.data); if (d.id === cid) { ws.removeEventListener('message', cb); res(d.result); } };
            ws.addEventListener('message', cb);
            ws.send(JSON.stringify({ id: cid, method: m, params: p }));
        });
        await send('Page.enable');
        await send('Runtime.enable');
        ws.addEventListener('message', e => {
            const m = JSON.parse(e.data);
            if (m.method === 'Runtime.consoleAPICalled') console.log('Console:', m.params.args);
            if (m.method === 'Runtime.exceptionThrown') console.log('Exception:', m.params.exceptionDetails);
        });
        await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
        await send('Page.navigate', { url: 'http://127.0.0.1:9881/index.html' });
        await new Promise(r => setTimeout(r, 2000));
        const res = await send('Runtime.evaluate', {
            expression: `(() => {
                const app = document.getElementById('app');
                const links = Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText, href: a.href, className: a.className }));
                const scam = document.querySelector('.sd-scam-about-link');
                const aboutCol = document.querySelector('.sd-hero-right');
                return {
                    appLength: app ? app.innerHTML.length : 0,
                    links,
                    scam: !!scam,
                    aboutCol: !!aboutCol,
                    bodyClasses: document.body.className
                };
            })()`,
            returnByValue: true
        });
        console.log(JSON.stringify(res.result.value, null, 2));
        chrome.kill();
        server.close();
        process.exit(0);
    }, 1500);
});
