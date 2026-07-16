const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/<!--.*?-->/g, '');
            fs.writeFileSync(fullPath, content);
        }
    });
}

replaceInDir(path.join(__dirname, 'client', 'src', 'pages'));
console.log('Replaced HTML comments');
