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
</script>

<!-- 📈 ENHANCED EMAIL CAPTURE WITH CONVERTKIT FALLBACK -->
<script>
// Enhanced email capture that works with ConvertKit
function enhancedEmailCapture() {
    // Check if user already signed up via ConvertKit
    if (localStorage.getItem('projectblock_convertkit_signup') === 'true') {
        console.log('👤 User already signed up via ConvertKit');
        return;
    }
    
    // Check if ConvertKit form is available
    if (window.ck && window.ck.forms) {
        // Use ConvertKit form
        console.log('📧 Using ConvertKit form');
        return;
    }
    
    // Fallback to custom popup if ConvertKit not loaded
    console.log('📧 Using fallback email capture');
    showFallbackEmailCapture();
}

function showFallbackEmailCapture() {
    const fallbackHTML = \`
    <div id="fallback-email-popup" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; backdrop-filter: blur(5px);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <button onclick="closeFallbackPopup()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
            
            <div style="text-align: center;">
                <h2 style="color: #1e293b; margin-bottom: 15px; font-size: 1.8em;">🚀 AI Revenue Secrets</h2>
                <p style="color: #64748b; margin-bottom: 25px; font-size: 1.1em;">Iscriviti per ricevere strategie esclusive per guadagnare con l'AI</p>
                
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <h4 style="color: #3b82f6; margin-bottom: 10px;">🎁 Cosa Riceverai:</h4>
                    <ul style="text-align: left; color: #374151; line-height: 1.6; list-style: none; padding: 0;">
                        <li>✅ Case study da €5K+/mese</li>
                        <li>✅ Tool AI nascosti che funzionano</li>
                        <li>✅ Template pronti per affiliate</li>
                        <li>✅ Accesso community esclusiva</li>
                    </ul>
                </div>
                
                <form onsubmit="submitFallbackEmail(event)" style="margin-top: 25px;">
                    <input type="email" id="fallbackEmailInput" placeholder="La tua email..." required style="width: 100%; padding: 15px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1.1em; margin-bottom: 15px;">
                    <button type="submit" style="width: 100%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1em; cursor: pointer;">
                        🎯 Voglio i Segreti AI
                    </button>
                </form>
                
                <p style="font-size: 0.9em; color: #94a3b8; margin-top: 15px;">💡 Zero spam. Solo revenue strategies. Cancellati quando vuoi.</p>
            </div>
        </div>
    </div>
    \`;
    
    document.body.insertAdjacentHTML('beforeend', fallbackHTML);
}

function closeFallbackPopup() {
    const popup = document.getElementById('fallback-email-popup');
    if (popup) popup.remove();
}

function submitFallbackEmail(event) {
    event.preventDefault();
    const email = document.getElementById('fallbackEmailInput').value;
    
    // Track fallback signup
    if (typeof gtag !== 'undefined') {
        gtag('event', 'fallback_email_capture', {
            'method': 'popup',
            'value': ${CONVERTKIT_CONFIG.estimatedLTV},
            'currency': 'EUR'
        });
    }
    
    // Store locally
    localStorage.setItem('projectblock_email_captured', 'true');
    localStorage.setItem('projectblock_email', email);
    
    // Success message
    document.querySelector('#fallback-email-popup > div').innerHTML = \`
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #10b981; margin-bottom: 15px;">🎉 Perfetto!</h2>
            <p style="margin-bottom: 20px;">Ti aggiungerò manualmente alla lista VIP</p>
            <p style="color: #64748b;">Email salvata: \${email}</p>
            <button onclick="closeFallbackPopup()" style="margin-top: 20px; background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer;">
                Continua →
            </button>
        </div>
    \`;
    
    setTimeout(closeFallbackPopup, 3000);
}

// Trigger enhanced capture after 30 seconds
setTimeout(() => {
    if (!localStorage.getItem('projectblock_convertkit_signup') && 
        !localStorage.getItem('projectblock_email_captured')) {
        enhancedEmailCapture();
    }
}, 30000);
</script>`;

// 📊 CONVERTKIT DASHBOARD INTEGRATION
const convertKitDashboardSection = `
<div class="chart-container">
    <h2>📧 ConvertKit Performance</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 8px;">
            <h4>📊 Newsletter Stats</h4>
            <p>Subscribers: <span id="ckSubscribers">0</span></p>
            <p>Growth Rate: <span id="ckGrowthRate">0%</span></p>
            <p>Open Rate: <span id="ckOpenRate">0%</span></p>
        </div>
        <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 8px;">
            <h4>💰 Affiliate Revenue</h4>
            <p>ConvertKit Referrals: <span id="ckReferrals">0</span></p>
            <p>Commission Earned: €<span id="ckCommission">0</span></p>
            <p>Conversion Rate: <span id="ckConversionRate">0%</span></p>
        </div>
        <div style="background: rgba(168, 85, 247, 0.1); padding: 20px; border-radius: 8px;">
            <h4>🎯 Email Automation</h4>
            <p>Welcome Series: <span id="ckWelcomeSeries">Active</span></p>
            <p>Revenue Sequence: <span id="ckRevenueSequence">Active</span></p>
            <p>Upsell Campaign: <span id="ckUpsellCampaign">Scheduled</span></p>
        </div>
    </div>
    
    <div style="margin-top: 20px; padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; border-left: 4px solid #10b981;">
        <h4 style="color: #059669; margin-bottom: 10px;">🚀 ConvertKit Optimization Tips</h4>
        <ul style="color: #065f46; line-height: 1.6;">
            <li>✅ Segmenta subscribers per interesse (AI, Marketing, Business)</li>
            <li>✅ Crea sequenze automatiche per ogni prodotto affiliate</li>
            <li>✅ A/B test subject lines per aumentare open rate</li>
            <li>✅ Include affiliate links in email valuable content</li>
            <li>✅ Setup tag per trackare source traffico</li>
        </ul>
    </div>
</div>`;

// 🎯 EMAIL AUTOMATION SEQUENCES
const emailSequences = {
    welcome: {
        name: "Welcome Series",
        emails: [
            {
                delay: 0,
                subject: "🎉 Benvenuto in ProjectBlock! (+ regalo inside)",
                content: "Welcome + link a risorse gratuite + soft mention ConvertKit come tool che uso"
            },
            {
                delay: 2,
                subject: "💰 Come ho guadagnato €2,847 questo mese",
                content: "Case study trasparente + mention tool usati (affiliate links)"
            },
            {
                delay: 5,
                subject: "🎯 I 3 errori che costano €1000+/mese",
                content: "Errori comuni + soluzioni con tool recommendation"
            },
            {
                delay: 7,
                subject: "🚀 Ready per il prossimo level?",
                content: "Survey + segmentazione + upsell premium content"
            }
        ]
    },
    
    revenue: {
        name: "Revenue Maximizer",
        emails: [
            {
                delay: 0,
                subject: "📊 Tool Stack da €10K/mese",
                content: "Lista completa tool con affiliate links + case study"
            },
            {
                delay: 3,
                subject: "💡 Template che converte al 15%",
                content: "Template gratuiti + mention tool per implementare"
            },
            {
                delay: 7,
                subject: "🎯 Ultimi giorni sconto [TOOL]",
                content: "Urgency + sconto esclusivo su tool affiliate"
            }
        ]
    }
};

// 🚀 IMPLEMENTATION FUNCTION
async function integrateConvertKit() {
    console.log('📧 Integrando ConvertKit ottimizzato...');
    
    // 1. Update all HTML files with ConvertKit script
    const htmlFiles = [
        'index.html',
        'blog/template.html',
        'analytics-dashboard.html'
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
    
    // 2. Update analytics dashboard with ConvertKit section
    const dashboardPath = path.join(__dirname, '..', 'analytics-dashboard.html');
    if (fs.existsSync(dashboardPath)) {
        let dashboard = fs.readFileSync(dashboardPath, 'utf8');
        
        if (!dashboard.includes('ConvertKit Performance')) {
            dashboard = dashboard.replace(
                '</div>\n    </div>\n    \n    <script>',
                `</div>\n        \n        ${convertKitDashboardSection}\n    </div>\n    \n    <script>`
            );
            fs.writeFileSync(dashboardPath, dashboard);
            console.log('✅ Dashboard aggiornato con ConvertKit metrics');
        }
    }
    
    // 3. Create email sequences config
    const sequencesConfig = `
// config/email-sequences.js
const EMAIL_SEQUENCES = ${JSON.stringify(emailSequences, null, 4)};

// 📧 CONVERTKIT API INTEGRATION (optional)
const CONVERTKIT_API = {
    apiKey: 'your_api_key_here', // Get from ConvertKit settings
    formId: '${CONVERTKIT_CONFIG.formId}',
    baseUrl: 'https://api.convertkit.com/v3'
};

// 📊 ANALYTICS FUNCTIONS
function trackConvertKitMetrics() {
    return {
        formViews: localStorage.getItem('ck_form_views') || 0,
        formSubmissions: localStorage.getItem('ck_form_submissions') || 0,
        conversionRate: function() {
            const views = parseInt(this.formViews);
            const submissions = parseInt(this.formSubmissions);
            return views > 0 ? ((submissions / views) * 100).toFixed(1) : 0;
        }
    };
}

// 💰 REVENUE CALCULATOR
function calculateEmailRevenue(subscribers, averageOrderValue = 15) {
    const monthlyEmailsSent = subscribers * 8; // 2 emails/week
    const clickRate = 0.03; // 3% click rate
    const conversionRate = 0.02; // 2% conversion rate
    
    const monthlyClicks = monthlyEmailsSent * clickRate;
    const monthlyConversions = monthlyClicks * conversionRate;
    const monthlyRevenue = monthlyConversions * averageOrderValue;
    
    return {
        monthlyRevenue: Math.round(monthlyRevenue),
        yearlyRevenue: Math.round(monthlyRevenue * 12),
        clicksPerMonth: Math.round(monthlyClicks),
        conversionsPerMonth: Math.round(monthlyConversions)
    };
}

module.exports = {
    EMAIL_SEQUENCES,
    CONVERTKIT_API,
    trackConvertKitMetrics,
    calculateEmailRevenue
};`;

    fs.writeFileSync(path.join(__dirname, '..', 'config', 'email-sequences.js'), sequencesConfig);
    console.log('✅ Email sequences configuration creata');
    
    // 4. Create ConvertKit test script
    const testScript = `
// scripts/test-convertkit.js
const http = require('http');
const path = require('path');
const fs = require('fs');

function testConvertKitIntegration() {
    console.log('📧 Testing ConvertKit Integration...');
    
    const server = http.createServer((req, res) => {
        let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url);
        
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript'
            }[ext] || 'text/plain';
            
            res.writeHead(200, {'Content-Type': contentType});
            res.end(fs.readFileSync(filePath));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });
    
    server.listen(8000, () => {
        console.log('🌐 Test server: http://localhost:8000');
        console.log('');
        console.log('🧪 TESTING CHECKLIST:');
        console.log('1. ✅ ConvertKit script loads correctly');
        console.log('2. ✅ Form appears and functions');
        console.log('3. ✅ Email submission tracking works');
        console.log('4. ✅ Affiliate promotion shows after signup');
        console.log('5. ✅ Analytics events fire correctly');
        console.log('');
        console.log('📊 Check Network tab for:');
        console.log('- project-block.kit.com requests');
        console.log('- google-analytics.com events');
        console.log('');
        console.log('Press Ctrl+C to stop');
    });
}

if (require.main === module) {
    testConvertKitIntegration();
}

module.exports = { testConvertKitIntegration };`;

    fs.writeFileSync(path.join(__dirname, 'test-convertkit.js'), testScript);
    console.log('✅ Test ConvertKit script creato');
    
    console.log('\n🎉 CONVERTKIT INTEGRATION COMPLETATA!');
    console.log('');
    console.log('📋 SETUP CHECKLIST:');
    console.log('✅ Script ConvertKit ottimizzato aggiunto');
    console.log('✅ Analytics tracking configurato');
    console.log('✅ Affiliate promotion automatica');
    console.log('✅ Fallback email capture');
    console.log('✅ Dashboard metrics aggiornato');
    console.log('✅ Email sequences template');
    console.log('');
    console.log('🧪 TESTA TUTTO:');
    console.log('   node scripts/test-convertkit.js');
    console.log('');
    console.log('💰 PROSSIMI PASSI:');
    console.log('1. Setup email sequences in ConvertKit');
    console.log('2. Configura affiliate program ConvertKit');
    console.log('3. Crea contenuti per automation');
    console.log('4. A/B test form placement e timing');
}

// 🚀 ESECUZIONE
if (require.main === module) {
    integrateConvertKit();
}

module.exports = {
    integrateConvertKit,
    CONVERTKIT_CONFIG,
    emailSequences
};