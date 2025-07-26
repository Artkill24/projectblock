const http = require('http');
const fs = require('fs');
const path = require('path');

// Quick server per testing
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
    
    if (fs.existsSync(filePath)) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fs.readFileSync(filePath));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(3000, () => {
    console.log('🌐 Test server running: http://localhost:3000');
    console.log('📊 Analytics Dashboard: http://localhost:3000/analytics-dashboard.html');
    console.log('🧪 Test email popup, affiliate clicks, e tracking');
});
