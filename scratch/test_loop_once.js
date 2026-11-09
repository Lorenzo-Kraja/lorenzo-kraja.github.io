const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Make a temporary test GIF with loop count = 1
const testGifPath = path.join(__dirname, '..', 'images', 'harp-chair', '02.gif');
const buf = fs.readFileSync(testGifPath);
const idx = buf.indexOf('NETSCAPE2.0');
const testCopy = Buffer.from(buf);
testCopy[idx + 13] = 1;
testCopy[idx + 14] = 0;
fs.writeFileSync(path.join(__dirname, 'test_loop_1.gif'), testCopy);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9645;

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

        await send('Page.navigate', { url: 'http://127.0.0.1:8080/scratch/test_loop_1.gif' });
        await new Promise(r => setTimeout(r, 1000));
        console.log("Loaded test_loop_1.gif successfully!");

        ws.close();
        chrome.kill();
        process.exit(0);
    } catch (e) {
        console.error(e);
        chrome.kill();
        process.exit(1);
    }
}, 800);
