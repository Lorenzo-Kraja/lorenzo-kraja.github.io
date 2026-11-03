const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'images', 'harp-chair');

const mapping = [
    { from: 'anim 5-min.gif', to: '01.gif' },
    { from: 'anim 4-min.gif', to: '02.gif' },
    { from: 'anim 3-min.gif', to: '03.gif' },
    { from: '1.jpg', to: '04.jpg' },
    { from: '2.jpg', to: '05.jpg' },
    { from: '4.jpg', to: '06.jpg' },
    { from: '6.jpg', to: '07.jpg' },
    { from: '8.jpg', to: '08.jpg' },
    { from: 'Presentazione_Esame_Harp_Chair_Lorenzo_Kraja17.jpg', to: '09.jpg' },
    { from: 'Presentazione_Esame_Harp_Chair_Lorenzo_Kraja22.jpg', to: '10.jpg' },
];

mapping.forEach(m => {
    const src = path.join(dir, m.from);
    const dest = path.join(dir, m.to);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${m.from} -> ${m.to}`);
    } else {
        console.error(`Source not found: ${m.from}`);
    }
});
