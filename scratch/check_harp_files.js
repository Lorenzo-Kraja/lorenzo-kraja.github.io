const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'images', 'harp-chair');
const files = fs.readdirSync(dir);

console.log('Files in harp-chair:');
files.forEach(f => {
    const stat = fs.statSync(path.join(dir, f));
    console.log(f, `${(stat.size / 1024 / 1024).toFixed(2)} MB`);
});
