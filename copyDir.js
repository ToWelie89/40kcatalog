const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '/testbasefolder');
const outputDir = path.join(__dirname, '/output');

const readDir = async dirPath => {
    console.log('dirPath', dirPath)
    if (fs.lstatSync(dirPath).isDirectory()) {
        const base = dirPath.replace(srcDir, outputDir);
        if (!fs.existsSync(base)) {
            console.log('base', base)
            fs.mkdirSync(base);
        }
        const res = fs.readdirSync(dirPath);
        res.forEach(childDir => {
            const childPath = `${dirPath}/${childDir}`;
            if (fs.lstatSync(dirPath).isDirectory()) {
                console.log('create subfolder', childPath)
                readDir(childPath);
            }
        })
    } else if (
        dirPath.toLowerCase().endsWith('.png') ||
        dirPath.toLowerCase().endsWith('.avif') ||
        dirPath.toLowerCase().endsWith('.webp') ||
        dirPath.toLowerCase().endsWith('.jpeg') ||
        dirPath.toLowerCase().endsWith('.jpg') ||
        dirPath.toLowerCase().endsWith('.gif') ||
        dirPath.toLowerCase().endsWith('.bmp')
    ) {
        // is image
        const dest = dirPath.replace(srcDir, outputDir);
        fs.copyFileSync(dirPath, dest);
    }
}

const run = async () => {
    // Clean
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, {recursive: true});
    }
    fs.mkdirSync(outputDir);
    readDir(srcDir);
}

run();