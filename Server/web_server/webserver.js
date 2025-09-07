const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());

const httpsServer = https.createServer({
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt'),
}, app);


// Get arguments from the command line
const args = process.argv.slice(2);
const PORT = args[0] || 3000; // Default port: 3000
const DIRECTORY = args[1] ? path.resolve(args[1]) : path.join(__dirname, 'public'); // Default directory: ./public

app.use(express.static(DIRECTORY));

httpsServer.listen(PORT, () => {
    console.log(`Serving files from ${DIRECTORY}`);
    console.log(`Server running at http://localhost:${PORT}`);
});