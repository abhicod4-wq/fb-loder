const express = require('express');
const login = require('fca-project-orion');
const multer = require('multer');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.post('/start', upload.single('file'), (req, res) => {
    const { tid, cookie, interval } = req.body;
    const messages = fs.readFileSync(req.file.path, 'utf-8').split('\n');
    
    // Cookie to AppState conversion logic
    const appState = cookie.split(';').map(c => {
        const [k, v] = c.split('=');
        return { key: k ? k.trim() : "", value: v ? v.trim() : "", domain: "facebook.com", path: "/" };
    });

    login({ appState }, (err, api) => {
        if (err) return res.send("Login Failed: " + err);
        res.send("Loader Started Successfully!");
        let i = 0;
        setInterval(() => {
            if (i < messages.length) {
                api.sendMessage(messages[i], tid);
                i++;
            } else { i = 0; }
        }, interval * 1000);
    });
});

app.listen(process.env.PORT || 3000);
         
