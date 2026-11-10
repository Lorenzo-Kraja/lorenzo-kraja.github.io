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
    const port = 9338;
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const edge = exec(`"${edgePath}" --headless --remote-debugging-port=${port} --disable-gpu about:blank`);

    await new Promise(r => setTimeout(r, 1200));
    const wsUrl = await getWsUrl(port);
    const ws = new globalThis.WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    await sendCommand(ws, 'Page.enable');
    await sendCommand(ws, 'Runtime.enable');

    console.log('==============================================');
    console.log('TEST 1: about.html Projects Menu & Clicks (Desktop & Mobile)');
    console.log('==============================================');

    // Desktop mode
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
    });
    await sendCommand(ws, 'Page.navigate', { url: 'http://127.0.0.1:8097/about.html' });
    await new Promise(r => setTimeout(r, 2000));

    let res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const btn = document.getElementById('mac-projects-btn');
            const dropdown = document.getElementById('mac-projects-dropdown');
            btn.click();
            const isOpenAfterClick = dropdown.classList.contains('is-open');
            const harpLink = dropdown.querySelector('a[href="harp-chair.html"]');
            return {
                btnExists: !!btn,
                isOpenAfterClick,
                harpLinkExists: !!harpLink
            };
        })()`,
        returnByValue: true
    });
    console.log('about.html Desktop Projects Menu:', res.result.value);

    // Click Harp Chair link
    await sendCommand(ws, 'Runtime.evaluate', {
        expression: `document.querySelector('#mac-projects-dropdown a[href="harp-chair.html"]').click();`
    });
    await new Promise(r => setTimeout(r, 800));

    res = await sendCommand(ws, 'Runtime.evaluate', { expression: `window.location.pathname` });
    console.log('Navigated from about.html projects dropdown to:', res.result.value);

    // Mobile mode on about.html
    await sendCommand(ws, 'Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
    });
    await sendCommand(ws, 'Page.navigate', { url: 'http://127.0.0.1:8097/about.html' });
    await new Promise(r => setTimeout(r, 2000));

    res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const btn = document.getElementById('mac-projects-btn');
            const dropdown = document.getElementById('mac-projects-dropdown');
            btn.click();
            const isOpenAfterClick = dropdown.classList.contains('is-open');
            return {
                btnVisible: btn.offsetParent !== null,
                isOpenAfterClick
            };
        })()`,
        returnByValue: true
    });
    console.log('about.html Mobile Projects Menu:', res.result.value);

    console.log('==============================================');
    console.log('TEST 2: Language Switching (EN vs IT) on about.html');
    console.log('==============================================');

    // Switch to EN
    await sendCommand(ws, 'Runtime.evaluate', {
        expression: `window.I18N.setLang('en', true);`
    });
    await new Promise(r => setTimeout(r, 300));

    res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const projectsLabel = document.querySelector('#mac-projects-btn .mac-menu-label')?.textContent;
            const contactLabel = document.querySelector('#mac-contact-btn .mac-menu-label')?.textContent;
            const cvTitle = document.querySelector('#kali-tb-cv .kali-title-text')?.textContent;
            const cvStatus = document.querySelector('#kali-win-cv .kali-statusbar .kali-status-left span:nth-child(3)')?.textContent;
            const cvLupoDate = document.querySelector('#kali-win-cv [data-i18n="cv.dateLupo"]')?.textContent;
            const cvExpTitle = document.querySelector('#kali-win-cv [data-i18n="cv.secExperience"]')?.textContent;
            const finderItemCount = document.getElementById('pd-item-count')?.textContent;
            const finderStatusHint = document.getElementById('pd-status-hint')?.textContent;
            const copyBtnText = document.getElementById('copy-email-btn')?.textContent;
            const closeBtnTitle = document.querySelector('#kali-tb-cv .kali-btn-close')?.getAttribute('title');

            return {
                projectsLabel,
                contactLabel,
                cvTitle,
                cvStatus,
                cvLupoDate,
                cvExpTitle,
                finderItemCount,
                finderStatusHint,
                copyBtnText,
                closeBtnTitle
            };
        })()`,
        returnByValue: true
    });
    console.log('about.html in EN mode:', res.result.value);

    // Switch to IT
    await sendCommand(ws, 'Runtime.evaluate', {
        expression: `window.I18N.setLang('it', true);`
    });
    await new Promise(r => setTimeout(r, 300));

    res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const projectsLabel = document.querySelector('#mac-projects-btn .mac-menu-label')?.textContent;
            const contactLabel = document.querySelector('#mac-contact-btn .mac-menu-label')?.textContent;
            const cvTitle = document.querySelector('#kali-tb-cv .kali-title-text')?.textContent;
            const cvStatus = document.querySelector('#kali-win-cv .kali-statusbar .kali-status-left span:nth-child(3)')?.textContent;
            const cvLupoDate = document.querySelector('#kali-win-cv [data-i18n="cv.dateLupo"]')?.textContent;
            const cvExpTitle = document.querySelector('#kali-win-cv [data-i18n="cv.secExperience"]')?.textContent;
            const finderItemCount = document.getElementById('pd-item-count')?.textContent;
            const finderStatusHint = document.getElementById('pd-status-hint')?.textContent;
            const copyBtnText = document.getElementById('copy-email-btn')?.textContent;
            const closeBtnTitle = document.querySelector('#kali-tb-cv .kali-btn-close')?.getAttribute('title');

            return {
                projectsLabel,
                contactLabel,
                cvTitle,
                cvStatus,
                cvLupoDate,
                cvExpTitle,
                finderItemCount,
                finderStatusHint,
                copyBtnText,
                closeBtnTitle
            };
        })()`,
        returnByValue: true
    });
    console.log('about.html in IT mode:', res.result.value);

    console.log('==============================================');
    console.log('TEST 3: index.html VLC & Projects Menu & Footer');
    console.log('==============================================');
    await sendCommand(ws, 'Page.navigate', { url: 'http://127.0.0.1:8097/index.html' });
    await new Promise(r => setTimeout(r, 2000));

    // Test in EN
    await sendCommand(ws, 'Runtime.evaluate', {
        expression: `window.I18N.setLang('en', true);`
    });
    await new Promise(r => setTimeout(r, 300));

    res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const vlcPlayTitle = document.querySelector('.vlc-btn-play')?.getAttribute('title');
            const vlcCloseTitle = document.querySelector('.vlc-titlebar .kali-btn-close')?.getAttribute('title');
            const footerRights = document.querySelector('.nb-footer-end')?.textContent;
            const footerContact = document.getElementById('footer-contact-link')?.textContent;
            const liveClock = document.getElementById('live-clock')?.textContent;

            return {
                vlcPlayTitle,
                vlcCloseTitle,
                footerRights,
                footerContact,
                liveClock
            };
        })()`,
        returnByValue: true
    });
    console.log('index.html in EN mode:', res.result.value);

    // Test in IT
    await sendCommand(ws, 'Runtime.evaluate', {
        expression: `window.I18N.setLang('it', true);`
    });
    await new Promise(r => setTimeout(r, 300));

    res = await sendCommand(ws, 'Runtime.evaluate', {
        expression: `(() => {
            const vlcPlayTitle = document.querySelector('.vlc-btn-play')?.getAttribute('title');
            const vlcCloseTitle = document.querySelector('.vlc-titlebar .kali-btn-close')?.getAttribute('title');
            const footerRights = document.querySelector('.nb-footer-end')?.textContent;
            const footerContact = document.getElementById('footer-contact-link')?.textContent;
            const liveClock = document.getElementById('live-clock')?.textContent;

            return {
                vlcPlayTitle,
                vlcCloseTitle,
                footerRights,
                footerContact,
                liveClock
            };
        })()`,
        returnByValue: true
    });
    console.log('index.html in IT mode:', res.result.value);

    ws.close();
    edge.kill();
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
