const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('.');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const httpPort = 9471;
const chromePort = 9472;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].replace(/^\/+/, '');
    if (!cleanUrl) cleanUrl = 'index.html';
    let filePath = path.join(rootDir, cleanUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(httpPort, async () => {
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=' + chromePort,
        'about:blank'
    ]);

    setTimeout(async () => {
        try {
            const targetsRes = await fetch('http://127.0.0.1:' + chromePort + '/json');
            const targets = await targetsRes.json();
            const target = targets.find(t => t.type === 'page') || targets[0];
            const ws = new WebSocket(target.webSocketDebuggerUrl);
            await new Promise(r => ws.addEventListener('open', r));

            let id = 1;
            function send(method, params = {}) {
                return new Promise((resolve, reject) => {
                    const curId = id++;
                    const onMsg = (evt) => {
                        const msg = JSON.parse(evt.data);
                        if (msg.id === curId) {
                            ws.removeEventListener('message', onMsg);
                            if (msg.error) reject(msg.error);
                            else resolve(msg.result);
                        }
                    };
                    ws.addEventListener('message', onMsg);
                    ws.send(JSON.stringify({ id: curId, method, params }));
                });
            }

            await send('Page.enable');
            await send('DOM.enable');
            await send('Emulation.setDeviceMetricsOverride', {
                width: 1440,
                height: 900,
                deviceScaleFactor: 1,
                mobile: false
            });

            await send('Page.navigate', { url: `http://127.0.0.1:${httpPort}/index.html` });
            await new Promise(r => setTimeout(r, 2200));

            const res = await send('Runtime.evaluate', {
                expression: `(() => {
                    const el = document.querySelector('.sd-scam-about-link');
                    const col = document.querySelector('.sd-hero-right');
                    return {
                        linkFound: !!el,
                        linkRect: el ? el.getBoundingClientRect() : null,
                        colRect: col ? col.getBoundingClientRect() : null,
                        linkStyle: el ? {
                            display: getComputedStyle(el).display,
                            visibility: getComputedStyle(el).visibility,
                            opacity: getComputedStyle(el).opacity,
                            color: getComputedStyle(el).color,
                            fontFamily: getComputedStyle(el).fontFamily,
                            fontSize: getComputedStyle(el).fontSize,
                            fontWeight: getComputedStyle(el).fontWeight,
                            textTransform: getComputedStyle(el).textTransform,
                            animation: getComputedStyle(el).animation
                        } : null
                    };
                })()`,
                returnByValue: true
            });
            console.log(JSON.stringify(res.result.value, null, 2));

            chrome.kill();
            server.close();
            process.exit(0);
        } catch (err) {
            console.error(err);
            chrome.kill();
            server.close();
            process.exit(1);
        }
    }, 1200);
});
