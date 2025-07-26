// scripts/quick-setup.js
const fs = require('fs');
const path = require('path');

async function quickSetup() {
    console.log('🚀 ProjectBlock Revenue Boost - Quick Setup');
    console.log('==========================================');
    
    try {
        // Create directories
        const dirs = ['config', 'scripts'];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Created directory: ${dir}`);
            }
        });
        
        // Run implementations
        console.log('\n📊 Setting up analytics...');
        const { implementAnalytics } = require('./implement-analytics.js');
        await implementAnalytics();
        
        console.log('\n📧 Setting up ConvertKit...');
        const { integrateConvertKit } = require('./integrate-convertkit.js');
        await integrateConvertKit();
        
        console.log('\n💰 Displaying affiliate setup...');
        const { displaySetupInstructions } = require('../config/affiliate-products.js');
        displaySetupInstructions();
        
        console.log('\n🎉 SETUP COMPLETED!');
        console.log('');
        console.log('🧪 Next steps:');
        console.log('1. npm run test');
        console.log('2. npm start');
        console.log('3. Open http://localhost:8000');
        console.log('4. Register affiliate programs');
        console.log('5. npm run generate:affiliate');
        
    } catch (error) {
        console.error('❌ Setup error:', error.message);
    }
}

if (require.main === module) {
    quickSetup();
}

module.exports = { quickSetup };
