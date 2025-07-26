// scripts/integrate-convertkit.js
const fs = require('fs');
const path = require('path');

// 🎯 CONVERTKIT INTEGRATION OTTIMIZZATA
const CONVERTKIT_CONFIG = {
    scriptSrc: 'https://project-block.kit.com/rwgdE2wlgIw9qe3elZWM-recommendations.js',
    formId: 'rwgdE2wlgIw9qe3elZWM',
    affiliateLink: 'https://convertkit.com?lmref=projectblock', // Sostituisci con il tuo
    commission: 7.50, // €7.50 per conversione
    estimatedLTV: 25.00 // Lifetime Value stimato per subscriber
};

// 📧 CONVERTKIT SCRIPT OTTIMIZZATO
const optimizedConvertKitScript = `
<!-- 🚀 CONVERTKIT INTEGRATION OTTIMIZZATA -->
<script src="${CONVERTKIT_CONFIG.scriptSrc}" async="async"></script>

<!-- 📊 CONVERTKIT ANALYTICS TRACKING -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Wait for ConvertKit to load
    const checkConvertKit = setInterval(() => {
        if (window.ck && window.ck.forms) {
            clearInterval(checkConvertKit);
            setupConvertKitTracking();
        }
    }, 100);
    
    function setupConvertKitTracking() {
        console.log('🎯 ConvertKit loaded, setting up tracking...');
        
        // Track form submissions
        window.ck.forms.on('submit', function(data) {
            console.log('📧 ConvertKit form submitted:', data);
            
            // Track in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'convertkit_signup', {
                    'form_id': '${CONVERTKIT_CONFIG.formId}',
                    'value': ${CONVERTKIT_CONFIG.estimatedLTV},
                    'currency': 'EUR',
                    'custom_parameter_1': 'convertkit_form'
                });
                
                gtag('event', 'generate_lead', {
                    'currency': 'EUR',
                    'value': ${CONVERTKIT_CONFIG.estimatedLTV}
                });
            }
            
            // Store conversion locally
            localStorage.setItem('projectblock_convertkit_signup', 'true');
            localStorage.setItem('projectblock_signup_date', new Date().toISOString());
            
            // Show success message with affiliate promotion
            setTimeout(() => {
                showConvertKitPromotion();
            }, 2000);
        });
        
        // Track form views
        window.ck.forms.on('show', function(data) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'convertkit_form_shown', {
                    'form_id': '${CONVERTKIT_CONFIG.formId}'
                });
            }
        });
    }
    
    // 💰 SHOW CONVERTKIT AFFILIATE PROMOTION
    function showConvertKitPromotion() {
        const promoHTML = \`
        <div id="convertkit-promo" style="position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 16px; max-width: 350px; z-index: 10001; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideIn 0.5s ease;">
            <button onclick="document.getElementById('convertkit-promo').remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
            
            <div style="text-align: center;">
                <h3 style="margin-bottom: 10px; color: white;">🎉 Benvenuto nel Club!</h3>
                <p style="margin-bottom: 15px; opacity: 0.9;">Visto che ti piace ricevere contenuti di qualità...</p>
                
                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h4 style="color: white; margin-bottom: 8px;">💡 Vuoi creare la TUA newsletter?</h4>
                    <p style="font-size: 0.9em; opacity: 0.8;">ConvertKit è il tool che uso per gestire 10K+ subscribers</p>
                </div>
                
                <a href="${CONVERTKIT_CONFIG.affiliateLink}" target="_blank" rel="nofollow" data-affiliate="true" data-product="ConvertKit" data-commission="${CONVERTKIT_CONFIG.commission}" style="display: inline-block; background: white; color: #059669; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                    🚀 Prova ConvertKit Gratis
                </a>
                
                <p style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">14 giorni gratis, poi da €25/mese</p>
            </div>
        </div>
        
        <style>
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        </style>
        \`;
        
        document.body.insertAdjacentHTML('beforeend', promoHTML);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            const promo = document.getElementById('convertkit-promo');
            if (promo) promo.remove();
        }, 10000);
    }
});
</script>`;

// 🚀 IMPLEMENTATION FUNCTION
async function integrateConvertKit() {
    console.log('📧 Integrando ConvertKit ottimizzato...');
    
    // 1. Update all HTML files with ConvertKit script
    const htmlFiles = [
        'index.html',
        'blog/template.html'
    ];
    
    htmlFiles.forEach(file => {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Remove existing ConvertKit scripts
            content = content.replace(/<!-- ConvertKit[\s\S]*?<\/script>/g, '');
            content = content.replace(/<script src="https:\/\/project-block\.kit\.com[\s\S]*?<\/script>/g, '');
            
            // Add optimized ConvertKit script
            content = content.replace('</head>', `${optimizedConvertKitScript}\n</head>`);
            
            fs.writeFileSync(filePath, content);
            console.log(`✅ ConvertKit integrato in ${file}`);
        }
    });
    
    console.log('🎉 ConvertKit integration completata!');
    console.log('📧 Setup ConvertKit sequences in dashboard');
    console.log('💰 Registrati a ConvertKit affiliate: https://convertkit.com/ambassador');
}

// 🚀 ESECUZIONE
if (require.main === module) {
    integrateConvertKit();
}

module.exports = {
    integrateConvertKit,
    CONVERTKIT_CONFIG
};
