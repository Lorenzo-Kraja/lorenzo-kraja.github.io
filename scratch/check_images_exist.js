const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'mikk.html'), 'utf8');
const regex = /src="([^"]+)"/g;
let m;
while ((m = regex.exec(html)) !== null) {
    const s = m[1];
    const decoded = decodeURIComponent(s);
    const fullPath = path.join(__dirname, '..', decoded);
    console.log(s, '-> exists?', fs.existsSync(fullPath));
}
