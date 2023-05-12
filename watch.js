const fs = require('fs');
const { exec } = require("child_process");

fs.watch(__dirname, { recursive: true }, async (...args) => {
    if (
        !args[1].startsWith('dist') &&
        !args[1].startsWith('node_modules')
    ) {
        console.log(`File ${args[1]} was changed`);
        exec("npm run build", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`Rebuilt`);
        });
    }
});