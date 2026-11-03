const { spawn } = require('child_process');
const http = require('http');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9610',
    '--disable-gpu',
    'about:blank'
]);

setTimeout(async () => {
    const targets = await new Promise((res, rej) => {
        http.get('http://127.0.0.1:9610/json', r => {
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
    await send('Page.navigate', { url: 'file:///C:/Users/lory/Desktop/Sito%20Portfolio/mikk.html' });
    await new Promise(r => setTimeout(r, 1000));
    const title = await send('Runtime.evaluate', { expression: 'document.title', returnByValue: true });
    const year = await send('Runtime.evaluate', { expression: 'document.querySelector(".digital-pill-year").textContent', returnByValue: true });
    console.log('Title:', title.result.value);
    console.log('Year pill:', year.result.value);
    chrome.kill();
    process.exit(0);
}, 1200);
