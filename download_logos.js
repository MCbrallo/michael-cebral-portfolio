const fs = require('fs');
const https = require('https');
const path = require('path');

const logos = [
    // KTH: https://logo.clearbit.com/kth.se
    { name: "kth.png", url: "https://logo.clearbit.com/kth.se" },

    // UCL: https://logo.clearbit.com/ucl.ac.uk
    { name: "ucl.png", url: "https://logo.clearbit.com/ucl.ac.uk" },

    // USC: https://logo.clearbit.com/usc.es
    { name: "usc.png", url: "https://logo.clearbit.com/usc.es" },

    // ESA: https://logo.clearbit.com/esa.int
    { name: "esa.png", url: "https://logo.clearbit.com/esa.int" },

    // KI: https://logo.clearbit.com/ki.se
    { name: "ki.png", url: "https://logo.clearbit.com/ki.se" },

    // SciLifeLab: https://logo.clearbit.com/scilifelab.se
    { name: "scilifelab.png", url: "https://logo.clearbit.com/scilifelab.se" },

    // ISU: https://logo.clearbit.com/isunet.edu
    { name: "isu.png", url: "https://logo.clearbit.com/isunet.edu" }
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        }, (response) => {
            if (response.statusCode !== 200) {
                response.resume();
                reject(`Status Code: ${response.statusCode}`);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    // Check file size. Clearbit logos are small but > 1kb usually.
                    const stats = fs.statSync(dest);
                    if (stats.size < 100) { // Very small check
                        fs.unlinkSync(dest);
                        reject("File too small");
                    } else {
                        resolve();
                    }
                });
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err.message);
        });
    });
};

const run = async () => {
    const dir = path.join(__dirname, 'public', 'logos');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const logo of logos) {
        console.log(`Downloading ${logo.name} from ${logo.url}...`);
        try {
            await download(logo.url, path.join(dir, logo.name));
            console.log(`✅ Success: ${logo.name}`);
        } catch (e) {
            console.error(`❌ Failed ${logo.name}: ${e}`);
        }
    }
};

run();
