const fs = require('fs');
const https = require('https');
const path = require('path');

const logos = [
    {
        name: "kth.png",
        urls: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/KTH_Royal_Institute_of_Technology_logo.svg/500px-KTH_Royal_Institute_of_Technology_logo.svg.png",
            "https://www.google.com/s2/favicons?domain=kth.se&sz=256"
        ]
    },
    {
        name: "ucl.png",
        urls: [
            "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/University_College_London_logo.svg/500px-University_College_London_logo.svg.png",
            "https://www.google.com/s2/favicons?domain=ucl.ac.uk&sz=256"
        ]
    },
    {
        name: "usc.png",
        urls: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/University_of_Santiago_de_Compostela_-_Logo.svg/500px-University_of_Santiago_de_Compostela_-_Logo.svg.png",
            "https://www.google.com/s2/favicons?domain=usc.es&sz=256"
        ]
    },
    {
        name: "esa.png",
        urls: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/European_Space_Agency_logo.svg/500px-European_Space_Agency_logo.svg.png",
            "https://www.google.com/s2/favicons?domain=esa.int&sz=256"
        ]
    },
    {
        name: "ki.png",
        urls: [
            "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Karolinska_Institutet_logo.svg/500px-Karolinska_Institutet_logo.svg.png",
            "https://www.google.com/s2/favicons?domain=ki.se&sz=256"
        ]
    },
    {
        name: "scilifelab.png",
        urls: [
            "https://www.scilifelab.se/wp-content/themes/scilifelab/assets/images/logo-green.png",
            "https://www.google.com/s2/favicons?domain=scilifelab.se&sz=256"
        ]
    },
    {
        name: "isu.png",
        urls: [
            "https://www.isunet.edu/wp-content/uploads/2019/07/ISU_Logo.png",
            "https://www.google.com/s2/favicons?domain=isunet.edu&sz=256"
        ]
    }
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            timeout: 15000
        }, (response) => {
            if (response.statusCode !== 200) {
                response.resume();
                reject(`Status Code: ${response.statusCode}`);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    const stats = fs.statSync(dest);
                    // Google Favicons can be small (~1-2KB), so we lower the threshold but keep it > 500b to avoid empty
                    if (stats.size < 500) {
                        fs.unlinkSync(dest);
                        reject(`File too small (${stats.size} bytes)`);
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

    for (const item of logos) {
        console.log(`\nProcessing ${item.name}...`);

        // Remove existing file to force fresh download
        const p = path.join(dir, item.name);
        if (fs.existsSync(p)) fs.unlinkSync(p);

        let success = false;
        for (const url of item.urls) {
            try {
                process.stdout.write(`  Trying ${url.substring(0, 50)}... `);
                await download(url, p);
                console.log(`✅ Success!`);
                success = true;
                break;
            } catch (e) {
                console.log(`❌ Failed: ${e}`);
            }
        }

        if (!success) {
            console.error(`⚠️ Could not download ${item.name} from any source.`);
        }
    }
};

run();
