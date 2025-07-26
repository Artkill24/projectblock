
// scripts/test-analytics.js
const http = require('http');
const path = require('path');
const fs = require('fs');

// Simple test server
function createTestServer() {
  const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
    
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json'
      }[ext] || 'text/plain';
      
      res.writeHead(200, {'Content-Type': contentType});
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  return server;
}

function testAnalyticsImplementation() {
  console.log('🧪 Testing Analytics Implementation...');
  
  const server = createTestServer();
  server.listen(8000, () => {
    console.log('🌐 Test server started: http://localhost:8000');
    console.log('📊 Analytics Dashboard: http://localhost:8000/analytics-dashboard.html');
    console.log('');
    console.log('🔍 MANUAL TESTING CHECKLIST:');
    console.log('1. ✅ Apri il sito in Chrome');
    console.log('2. ✅ Apri DevTools > Network tab');
    console.log('3. ✅ Cerca chiamate a google-analytics.com');
    console.log('4. ✅ Testa click su link affiliate');
    console.log('5. ✅ Testa email popup (dopo 30 sec)');
    console.log('6. ✅ Verifica eventi in GA4 Real-Time');
    console.log('');
    console.log('🎯 Google Analytics Real-Time: https://analytics.google.com');
    console.log('');
    console.log('Press Ctrl+C to stop server');
  });
  
  return server;
}

// Run test
if (require.main === module) {
  testAnalyticsImplementation();
}

module.exports = { testAnalyticsImplementation, createTestServer };