const { exec } = require('child_process');
const http = require('http');

async function getWsUrl(port) {
    return new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/list`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const page = json.find(t => t.type === 'page') || json[0];
                    resolve(page.webSocketDebuggerUrl);
                } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function sendCommand(ws, method, params = {}) {
    return new Promise((resolve) => {
        const id = Math.floor(Math.random() * 1000000);
        const msg = JSON.stringify({ id, method, params });
        const handler = (event) => {
            const res = JSON.parse(event.data);
            if (res.id === id) {
                ws.removeEventListener('message', handler);
                resolve(res.result || res);
            }
        };
        ws.addEventListener('message', handler);
        ws.send(msg);
    });
}

async function run() {
    const port = 9335;
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const edge = exec(`"${edgePath}" --headless --remote-debugging-port=${port} --disable-gpu about:blank`);

    await new Promise(r => setTimeout(r, 1200));
    const wsUrl = await getWsUrl(port);
    const ws = new globalThis.WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');

    console.log('--- Testing index.html (Mobile: 390x844) ---');
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
    });

    await sendCommand(ws, 'Page.navigate', { url: 'http://127.0.0.1:8097/index.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Check Projects button and items on index.html mobile
    let evalRes = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const btn = document.getElementById('mac-projects-btn');
            const dropdown = document.getElementById('mac-projects-dropdown');
            const items = Array.from(document.querySelectorAll('.mac-project-dropdown-item')).map(a => ({
                text: a.querySelector('.mac-item-text')?.textContent,
                href: a.getAttribute('href'),
                visible: a.offsetParent !== null
            }));
            return {
                btnExists: !!btn,
                btnDisplay: btn ? getComputedStyle(btn).display : null,
                dropdownExists: !!dropdown,
                dropdownIsOpen: dropdown ? dropdown.classList.contains('is-open') : false,
                items
            };
        })()`,
        returnByValue: true
    });
    console.log('Mobile index initial state:', evalRes);

    // Click Projects button
    await sendCommand(ws, 'Runtime.evaluate', {
        expression: `document.getElementById('mac-projects-btn').click();`
    });
    await new Promise(r => setTimeout(r, 300));

    // Click Harp Chair link
    await sendCommand(ws, 'Runtime.evaluate', {
        expression: `document.querySelector('a.mac-project-dropdown-item[href="harp-chair.html"]').click();`
    });
    await new Promise(r => setTimeout(r, 1000));
    evalRes = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `window.location.href`
    });
    console.log('After clicking Harp Chair link, URL is:', evalRes);

    // Now test about.html
    console.log('--- Testing about.html (Desktop: 1440x900) ---');
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
    });
    await sendCommand(ws, 'Page.navigate', { url: 'http://127.0.0.1:8097/about.html' });
    await new Promise(r => setTimeout(r, 2000));

    evalRes = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const btn = document.getElementById('mac-projects-btn');
            const dropdown = document.getElementById('mac-projects-dropdown');
            if (btn) btn.click();
            return {
                btnExists: !!btn,
                dropdownExists: !!dropdown,
                dropdownIsOpenAfterClick: dropdown ? dropdown.classList.contains('is-open') : false
            };
        })()`,
        returnByValue: true
    });
    console.log('about.html projects button click:', evalRes);

    ws.close();
    edge.kill();
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
