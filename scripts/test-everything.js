
// scripts/test-everything.js
const http = require('http');
const path = require('path');
const fs = require('fs');

class ProjectBlockTester {
    constructor() {
        this.testResults = [];
        this.server = null;
    }
    
    async runAllTests() {
        console.log('🧪 ProjectBlock - Test Suite Completo');
        console.log('=====================================');
        
        // Start test server
        await this.startTestServer();
        
        // Run tests
        await this.testAnalyticsImplementation();
        await this.testEmailCaptureSystem();
        await this.testAffiliateLinks();
        await this.testContentGeneration();
        
        this.displayResults();
        this.server.close();
    }
    
    startTestServer() {
        return new Promise((resolve) => {
            this.server = http.createServer((req, res) => {
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
            
            this.server.listen(8000, () => {
                console.log('🌐 Test server avviato: http://localhost:8000');
                resolve();
            });
        });
    }
    
    async testAnalyticsImplementation() {
        console.log('\n📊 Testing Analytics Implementation...');
        
        const checks = [
            {
                name: 'Google Analytics Script',
                test: () => {
                    const indexPath = path.join(__dirname, '..', 'index.html');
                    if (fs.existsSync(indexPath)) {
                        const content = fs.readFileSync(indexPath, 'utf8');
                        return content.includes('GT-MRM7BGZ') && content.includes('gtag');
                    }
                    return false;
                }
            },
            {
                name: 'Analytics Dashboard',
                test: () => fs.existsSync(path.join(__dirname, '..', 'analytics-dashboard.html'))
            },
            {
                name: 'Email Capture Tracking',
                test: () => {
                    const indexPath = path.join(__dirname, '..', 'index.html');
                    if (fs.existsSync(indexPath)) {
                        const content = fs.readFileSync(indexPath, 'utf8');
                        return content.includes('email_capture') && content.includes('emailPopup');
                    }
                    return false;
                }
            }
        ];
        
        checks.forEach(check => {
            const result = check.test();
            this.testResults.push({
                category: 'Analytics',
                name: check.name,
                status: result ? 'PASS' : 'FAIL'
            });
            console.log(`   ${result ? '✅' : '❌'} ${check.name}`);
        });
    }
    
    async testEmailCaptureSystem() {
        console.log('\n📧 Testing Email Capture System...');
        
        const checks = [
            {
                name: 'Email Popup HTML',
                test: () => {
                    const indexPath = path.join(__dirname, '..', 'index.html');
                    const content = fs.readFileSync(indexPath, 'utf8');
                    return content.includes('emailPopup') && content.includes('submitEmail');
                }
            },
            {
                name: 'LocalStorage Integration', 
                test: () => {
                    const indexPath = path.join(__dirname, '..', 'index.html');
                    const content = fs.readFileSync(indexPath, 'utf8');
                    return content.includes('localStorage') && content.includes('projectblock_email');
                }
            }
        ];
        
        checks.forEach(check => {
            const result = check.test();
            this.testResults.push({
                category: 'Email Capture',
                name: check.name,
                status: result ? 'PASS' : 'FAIL'
            });
            console.log(`   ${result ? '✅' : '❌'} ${check.name}`);
        });
    }
    
    async testAffiliateLinks() {
        console.log('\n💰 Testing Affiliate Configuration...');
        
        const checks = [
            {
                name: 'Affiliate Config File',
                test: () => fs.existsSync(path.join(__dirname, '..', 'config', 'affiliate-products.js'))
            },
            {
                name: 'Social Templates',
                test: () => fs.existsSync(path.join(__dirname, '..', 'config', 'social-templates.js'))
            }
        ];
        
        checks.forEach(check => {
            const result = check.test();
            this.testResults.push({
                category: 'Affiliate',
                name: check.name, 
                status: result ? 'PASS' : 'FAIL'
            });
            console.log(`   ${result ? '✅' : '❌'} ${check.name}`);
        });
    }
    
    async testContentGeneration() {
        console.log('\n📝 Testing Content Generation...');
        
        const checks = [
            {
                name: 'Generate Article Script',
                test: () => fs.existsSync(path.join(__dirname, 'generate-article.js'))
            },
            {
                name: 'Blog Feed',
                test: () => fs.existsSync(path.join(__dirname, '..', 'blog', 'feed.json'))
            }
        ];
        
        checks.forEach(check => {
            const result = check.test();
            this.testResults.push({
                category: 'Content',
                name: check.name,
                status: result ? 'PASS' : 'FAIL'
            });
            console.log(`   ${result ? '✅' : '❌'} ${check.name}`);
        });
    }
    
    displayResults() {
        console.log('\n📋 TEST RESULTS SUMMARY');
        console.log('========================');
        
        const categories = [...new Set(this.testResults.map(r => r.category))];
        categories.forEach(category => {
            const categoryTests = this.testResults.filter(r => r.category === category);
            const passed = categoryTests.filter(r => r.status === 'PASS').length;
            const total = categoryTests.length;
            
            console.log(`\n${category}: ${passed}/${total} tests passed`);
        });
        
        const totalPassed = this.testResults.filter(r => r.status === 'PASS').length;
        const totalTests = this.testResults.length;
        
        console.log(`\n🎯 OVERALL: ${totalPassed}/${totalTests} tests passed`);
        
        if (totalPassed === totalTests) {
            console.log('\n🎉 ALL SYSTEMS GO! ProjectBlock è pronto per generare revenue!');
            console.log('');
            console.log('🚀 NEXT STEPS:');
            console.log('1. Registrati ai programmi affiliate high-commission');
            console.log('2. Sostituisci i link affiliate nei config files');
            console.log('3. Genera primo contenuto: npm run generate-content');
            console.log('4. Monitora analytics: http://localhost:8000/analytics-dashboard.html');
        } else {
            console.log(`\n⚠️  Alcuni test falliti. Controlla i dettagli sopra.`);
        }
    }
}

// Run tests
if (require.main === module) {
    const tester = new ProjectBlockTester();
    tester.runAllTests().catch(console.error);
}

module.exports = { ProjectBlockTester };