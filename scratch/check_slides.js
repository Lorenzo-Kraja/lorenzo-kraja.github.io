const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'images', 'nomod');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

// Sort by page number if possible
files.sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
});

console.log('Found files:', files);

let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>NOMOD / Mikk Slides Preview</title>
    <style>
        body { background: #111; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; padding: 40px; }
        .slide-card { margin-bottom: 60px; background: #1c1c1c; padding: 20px; border-radius: 8px; border: 1px solid #333; max-width: 900px; }
        h2 { font-size: 16px; margin-top: 0; color: #88c0d0; }
        img { width: 100%; height: auto; display: block; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Mikk (formerly NOMOD) - New Slides</h1>
`;

files.forEach((f, idx) => {
    html += `
    <div class="slide-card">
        <h2>Slide ${idx + 1}: ${f}</h2>
        <img src="../images/nomod/${encodeURIComponent(f)}" alt="${f}">
    </div>`;
});

html += `</body></html>`;

fs.writeFileSync(path.join(__dirname, 'nomod_slides_preview.html'), html);
console.log('Wrote scratch/nomod_slides_preview.html');
