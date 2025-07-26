// scripts/test-convertkit.js
const http = require('http');
const path = require('path');
const fs = require('fs');

function testConvertKitIntegration() {
    console.log('📧 Testing ConvertKit Integration...');
    console.log('==================================');
    
    // Check file integration
    const checks = [
        {
            name: 'ConvertKit Script in index.html',
            test: () => {
                if (fs.existsSync('index.html')) {
                    const content = fs.readFileSync('index.html', 'utf8');
                    return content.includes('rwgdE2wlgIw9qe3elZWM-recommendations.js');
                }
                return false;
            }
        },
        {
            name: 'Analytics tracking present',
            test: () => {
                if (fs.existsSync('index.html')) {
                    const content = fs.readFileSync('index.html', 'utf8');
                    return content.includes('convertkit_signup') && content.includes('gtag');
                }
                return false;
            }
        },
        {
            name: 'Affiliate promotion code',
            test: () => {
                if (fs.existsSync('index.html')) {
                    const content = fs.readFileSync('index.html', 'utf8');
                    return content.includes('showConvertKitAffiliatePromo');
                }
                return false;
            }
        },
        {
            name: 'Dashboard ConvertKit section',
            test: () => {
                if (fs.existsSync('analytics-dashboard.html')) {
                    const content = fs.readFileSync('analytics-dashboard.html', 'utf8');
                    return content.includes('ConvertKit Performance');
                }
                return false;
            }
        },
        {
            name: 'Email automation config',
            test: () => fs.existsSync('config/email-automation.js')
        }
    ];
    
    console.log('\n🔍 INTEGRATION CHECKS:');
    let passed = 0;
    
    checks.forEach(check => {
        const result = check.test();
        console.log(`   ${result ? '✅' : '❌'} ${check.name}`);
        if (result) passed++;
    });
    
    console.log(`\n📊 RESULTS: ${passed}/${checks.length} checks passed`);
    
    if (passed === checks.length) {
        console.log('\n🎉 ConvertKit integration SUCCESS!');
        startTestServer();
    } else {
        console.log('\n⚠️  Some checks failed. Review the issues above.');
    }
}

function startTestServer() {
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
    
    server.listen(8000, () => {
        console.log('\n🌐 Test server started: http://localhost:8000');
        console.log('📊 Dashboard: http://localhost:8000/analytics-dashboard.html');
        console.log('');
        console.log('🧪 MANUAL TESTING:');
        console.log('1. ✅ ConvertKit form loads and displays');
        console.log('2. ✅ Email submission triggers analytics events');
        console.log('3. ✅ Affiliate promo appears after signup');
        console.log('4. ✅ Dashboard shows ConvertKit metrics');
        console.log('');
        console.log('📱 Network Tab should show:');
        console.log('- project-block.kit.com requests');
        console.log('- google-analytics.com events');
        console.log('');
        console.log('Press Ctrl+C to stop server');
    });
}

if (require.main === module) {
    testConvertKitIntegration();
}

module.exports = { testConvertKitIntegration };
