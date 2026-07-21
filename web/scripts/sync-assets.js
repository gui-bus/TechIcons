/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const srcDark = path.join(__dirname, '..', '..', 'Dark');
const srcLight = path.join(__dirname, '..', '..', 'Light');

const destDark = path.join(__dirname, '..', 'public', 'Dark');
const destLight = path.join(__dirname, '..', 'public', 'Light');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const dataJsonFile = path.join(dataDir, 'icons.json');

function copyDir(src, dest) {
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log("Syncing Dark and Light asset directories...");
copyDir(srcDark, destDark);
copyDir(srcLight, destLight);
console.log("Assets synced to web/public!");

const files = fs.readdirSync(srcDark).filter(f => f.endsWith('.svg'));
const icons = files.map(filename => {
    const label = filename.replace('.svg', '');
    return {
        filename,
        label
    };
});

icons.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'accent', numeric: true }));

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(dataJsonFile, JSON.stringify(icons, null, 2), 'utf8');
console.log(`Generated database with ${icons.length} icons at ${dataJsonFile}`);
