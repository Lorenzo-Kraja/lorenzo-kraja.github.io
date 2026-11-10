const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 1. Static file server
const PORT = 8111;
const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/about.html';
    const filePath = path.join(ROOT, reqPath);

    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        return res.end('Not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
    console.log(`[Test Server] Listening on http://localhost:${PORT}`);
    runTest().catch(err => {
        console.error('Test execution failed:', err);
        process.exit(1);
    });
});

async function runTest() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const debugPort = 9223;
    const userDataDir = path.join(__dirname, 'chrome_tmp_' + Date.now());

    const chromeProc = spawn(chromePath, [
        `--remote-debugging-port=${debugPort}`,
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        `--user-data-dir=${userDataDir}`,
        `http://localhost:${PORT}/about.html`
    ]);

    await new Promise(r => setTimeout(r, 2000));

    // Get CDP WebSocket url
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
        try {
            const listRes = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
            const pages = await listRes.json();
            const page = pages.find(p => p.type === 'page');
            if (page && page.webSocketDebuggerUrl) {
                wsUrl = page.webSocketDebuggerUrl;
                break;
            }
        } catch (e) {
            await new Promise(r => setTimeout(r, 300));
        }
    }

    if (!wsUrl) {
        throw new Error('Failed to find CDP target page');
    }

    // Global WebSocket in Node 22
    const ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve);
        ws.addEventListener('error', reject);
    });

    let msgId = 1;
    const pending = new Map();

    ws.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
        }
    });

    function send(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = msgId++;
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    async function evaluate(expression) {
        const res = await send('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise: true
        });
        if (res.exceptionDetails) {
            throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
        }
        return res.result ? res.result.value : undefined;
    }

    console.log('=== CDP CONNECTED ===');

    // Wait for page ready
    await evaluate(`new Promise(r => {
        if (document.readyState === 'complete') r();
        else window.addEventListener('load', () => r());
    })`);
    await new Promise(r => setTimeout(r, 1000));

    console.log('--- TEST 1: DESKTOP VERIFICATION ---');
    await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false
    });
    await new Promise(r => setTimeout(r, 500));

    // 1. Check side HOME blinking button on desktop
    const desktopHomeBtn = await evaluate(`(() => {
        const btn = document.getElementById('about-side-back');
        if (!btn) return { error: 'Missing #about-side-back' };
        const cs = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        const link = btn.querySelector('a');
        const arrow = btn.querySelector('.sd-scam-arrow-left-svg');
        const text = btn.querySelector('.sd-scam-about-text');
        return {
            display: cs.display,
            position: cs.position,
            opacity: cs.opacity,
            visible: rect.width > 0 && rect.height > 0 && cs.display !== 'none',
            href: link ? link.getAttribute('href') : null,
            arrowPresent: !!arrow,
            textContent: text ? text.textContent.trim() : null,
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        };
    })()`);
    console.log('Desktop HOME button:', desktopHomeBtn);
    if (!desktopHomeBtn.visible || desktopHomeBtn.textContent !== 'HOME' || !desktopHomeBtn.arrowPresent || desktopHomeBtn.href !== 'index.html') {
        throw new Error('Desktop HOME button failed validation');
    }

    // 2. Check footer on desktop
    const desktopFooter = await evaluate(`(() => {
        const ft = document.querySelector('.nb-about-page-footer');
        if (!ft) return { error: 'Missing .nb-about-page-footer' };
        const cs = window.getComputedStyle(ft);
        const rect = ft.getBoundingClientRect();
        const links = Array.from(ft.querySelectorAll('.nb-footer-link')).map(a => ({ text: a.textContent.trim(), href: a.href }));
        const center = ft.querySelector('.nb-footer-center')?.textContent.trim();
        const end = ft.querySelector('.nb-footer-end')?.textContent.trim();
        return {
            display: cs.display,
            visible: rect.width > 0 && rect.height > 0 && cs.display !== 'none',
            links,
            center,
            end,
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        };
    })()`);
    console.log('Desktop Footer:', desktopFooter);
    if (!desktopFooter.visible || desktopFooter.links.length < 4) {
        throw new Error('Desktop Footer failed validation');
    }

    // 3. Open image in Personal Stuff and test image viewer navigation
    console.log('--- TEST 2: IMAGE VIEWER ARROWS, THUMBNAILS, SWIPE & KEYBOARD ---');
    
    // Open Personal Stuff folder if closed, or click the first image card
    await evaluate(`(() => {
        // Double-click jewelry-inspiration if on root, or card
        const card = document.querySelector('.pd-file-card');
        if (card) {
            card.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        } else {
            const folder = document.querySelector('.pd-folder-card');
            if (folder) folder.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
            setTimeout(() => {
                const c2 = document.querySelector('.pd-file-card');
                if (c2) c2.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
            }, 300);
        }
    })()`);

    await new Promise(r => setTimeout(r, 600));

    // Verify Image Viewer window is open and check UI elements
    const viewerState1 = await evaluate(`(() => {
        const win = document.getElementById('kali-win-preview');
        const img = document.getElementById('preview-win-img');
        const btnPrev = document.getElementById('preview-btn-prev');
        const btnNext = document.getElementById('preview-btn-next');
        const thumbs = Array.from(document.querySelectorAll('.kali-preview-thumb-item'));
        const activeThumb = document.querySelector('.kali-preview-thumb-item.is-active');
        const statusLeft = document.getElementById('preview-win-status-left')?.textContent.trim();
        const statusRight = document.getElementById('preview-win-status-right')?.textContent.trim();
        const title = document.getElementById('preview-win-title')?.textContent.trim();

        return {
            isOpen: win && !win.classList.contains('is-closed'),
            imgSrc: img ? img.getAttribute('src') : null,
            hasBtnPrev: !!btnPrev,
            hasBtnNext: !!btnNext,
            thumbCount: thumbs.length,
            activeThumbIdx: activeThumb ? parseInt(activeThumb.dataset.thumbIdx, 10) : -1,
            title,
            statusLeft,
            statusRight
        };
    })()`);
    console.log('Initial Viewer State:', viewerState1);
    if (!viewerState1.isOpen || viewerState1.thumbCount < 10 || !viewerState1.hasBtnPrev || !viewerState1.hasBtnNext) {
        throw new Error('Image viewer initial state failed');
    }

    // Test clicking NEXT button
    await evaluate(`document.getElementById('preview-btn-next').click()`);
    await new Promise(r => setTimeout(r, 400));

    const viewerState2 = await evaluate(`(() => {
        const img = document.getElementById('preview-win-img');
        const activeThumb = document.querySelector('.kali-preview-thumb-item.is-active');
        const statusRight = document.getElementById('preview-win-status-right')?.textContent.trim();
        return {
            imgSrc: img ? img.getAttribute('src') : null,
            activeThumbIdx: activeThumb ? parseInt(activeThumb.dataset.thumbIdx, 10) : -1,
            statusRight
        };
    })()`);
    console.log('After Next Click:', viewerState2);
    if (viewerState2.activeThumbIdx !== 1 || !viewerState2.statusRight.includes('2 /')) {
        throw new Error('Next navigation failed');
    }

    // Test clicking PREV button
    await evaluate(`document.getElementById('preview-btn-prev').click()`);
    await new Promise(r => setTimeout(r, 400));

    const viewerState3 = await evaluate(`(() => {
        const img = document.getElementById('preview-win-img');
        const activeThumb = document.querySelector('.kali-preview-thumb-item.is-active');
        const statusRight = document.getElementById('preview-win-status-right')?.textContent.trim();
        return {
            imgSrc: img ? img.getAttribute('src') : null,
            activeThumbIdx: activeThumb ? parseInt(activeThumb.dataset.thumbIdx, 10) : -1,
            statusRight
        };
    })()`);
    console.log('After Prev Click:', viewerState3);
    if (viewerState3.activeThumbIdx !== 0 || !viewerState3.statusRight.includes('1 /')) {
        throw new Error('Prev navigation failed');
    }

    // Test clicking on thumbnail 5
    await evaluate(`(() => {
        const thumbs = document.querySelectorAll('.kali-preview-thumb-item');
        if (thumbs[5]) thumbs[5].click();
    })()`);
    await new Promise(r => setTimeout(r, 400));

    const viewerState4 = await evaluate(`(() => {
        const img = document.getElementById('preview-win-img');
        const activeThumb = document.querySelector('.kali-preview-thumb-item.is-active');
        const statusRight = document.getElementById('preview-win-status-right')?.textContent.trim();
        return {
            imgSrc: img ? img.getAttribute('src') : null,
            activeThumbIdx: activeThumb ? parseInt(activeThumb.dataset.thumbIdx, 10) : -1,
            statusRight
        };
    })()`);
    console.log('After Thumbnail 5 Click:', viewerState4);
    if (viewerState4.activeThumbIdx !== 5 || !viewerState4.statusRight.includes('6 /')) {
        throw new Error('Direct thumbnail click failed');
    }

    // Test touch swipe left (should navigate to next image, index 6)
    await evaluate(`(() => {
        const stage = document.getElementById('preview-win-stage');
        const t1 = new Touch({ identifier: 1, target: stage, clientX: 300, clientY: 200 });
        const t2 = new Touch({ identifier: 1, target: stage, clientX: 180, clientY: 205 }); // moved 120px left
        stage.dispatchEvent(new TouchEvent('touchstart', { touches: [t1], bubbles: true }));
        stage.dispatchEvent(new TouchEvent('touchmove', { touches: [t2], bubbles: true }));
        stage.dispatchEvent(new TouchEvent('touchend', { changedTouches: [t2], bubbles: true }));
    })()`);
    await new Promise(r => setTimeout(r, 400));

    const viewerState5 = await evaluate(`(() => {
        const activeThumb = document.querySelector('.kali-preview-thumb-item.is-active');
        const statusRight = document.getElementById('preview-win-status-right')?.textContent.trim();
        return {
            activeThumbIdx: activeThumb ? parseInt(activeThumb.dataset.thumbIdx, 10) : -1,
            statusRight
        };
    })()`);
    console.log('After Swipe Left:', viewerState5);
    if (viewerState5.activeThumbIdx !== 6 || !viewerState5.statusRight.includes('7 /')) {
        throw new Error('Touch swipe left navigation failed');
    }

    // Test keyboard ArrowRight (should navigate to index 7)
    await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))`);
    await new Promise(r => setTimeout(r, 300));
    const keyState = await evaluate(`document.querySelector('.kali-preview-thumb-item.is-active')?.dataset.thumbIdx`);
    console.log('After ArrowRight key:', keyState);
    if (parseInt(keyState, 10) !== 7) {
        throw new Error('Keyboard ArrowRight navigation failed');
    }

    console.log('--- TEST 3: MOBILE VIEWPORT VERIFICATION (390x844) ---');
    await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
    });
    await new Promise(r => setTimeout(r, 500));

    // Verify mobile HOME button
    const mobileHomeBtn = await evaluate(`(() => {
        const btn = document.getElementById('about-side-back');
        if (!btn) return { error: 'Missing #about-side-back' };
        const cs = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        return {
            display: cs.display,
            position: cs.position,
            visible: rect.width > 0 && rect.height > 0 && cs.display !== 'none',
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        };
    })()`);
    console.log('Mobile HOME Button:', mobileHomeBtn);
    if (!mobileHomeBtn.visible || mobileHomeBtn.display === 'none') {
        throw new Error('Mobile HOME button failed (was hidden or 0-size)');
    }

    // Verify mobile footer
    const mobileFooter = await evaluate(`(() => {
        const ft = document.querySelector('.nb-about-page-footer');
        if (!ft) return { error: 'Missing .nb-about-page-footer' };
        const cs = window.getComputedStyle(ft);
        const rect = ft.getBoundingClientRect();
        const links = Array.from(ft.querySelectorAll('.nb-footer-link')).map(a => a.textContent.trim());
        return {
            display: cs.display,
            visible: cs.display !== 'none' && rect.height > 0,
            links
        };
    })()`);
    console.log('Mobile Footer:', mobileFooter);
    if (!mobileFooter.visible || mobileFooter.links.length < 4) {
        throw new Error('Mobile footer failed validation');
    }

    console.log('=== ALL TESTS PASSED SUCCESSFULLY! ===');

    ws.close();
    chromeProc.kill();
    server.close();
    process.exit(0);
}
