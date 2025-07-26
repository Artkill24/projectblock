
// config/affiliate-products.js
const HIGH_COMMISSION_PRODUCTS = [
    {
        name: "SEMrush",
        category: "SEO Tools",
        price: "€99.95/mese",
        commission: 40.00, // €40 per vendita
        commissionPercent: "40%",
        url: "https://semrush.com/partner/",
        affiliateLink: "https://semrush.com/partner/projectblock", // Sostituisci con il tuo
        description: "Il tool SEO più completo per dominare Google",
        keywords: ["SEO", "keyword research", "competitor analysis", "rank tracking"],
        avgConversion: "2.1%",
        priority: "HIGH",
        setupInstructions: "1. Vai su semrush.com/partner/ 2. Registrati come partner 3. Ottieni il tuo link"
    },
    {
        name: "Systeme.io",
        category: "Marketing",
        price: "€97/mese",
        commission: 58.00, // €58 per vendita
        commissionPercent: "60%",
        url: "https://systeme.io/affiliate",
        affiliateLink: "https://systeme.io/?sa=projectblock", // Sostituisci con il tuo
        description: "Piattaforma all-in-one per marketing online",
        keywords: ["email marketing", "sales funnel", "course platform", "automation"],
        avgConversion: "3.4%",
        priority: "HIGH",
        setupInstructions: "1. Vai su systeme.io/affiliate 2. Registrati 3. Ottieni codice ?sa=TUOCODICE"
    },
    {
        name: "Jasper AI",
        category: "AI Writing",
        price: "€49/mese",
        commission: 14.70, // €14.7 per vendita
        commissionPercent: "30%",
        url: "https://jasper.ai/partner",
        affiliateLink: "https://jasper.ai/free-trial?fpr=projectblock", // Sostituisci
        description: "L'AI che scrive come un copywriter esperto",
        keywords: ["AI writing", "content creation", "copywriting", "blog posts"],
        avgConversion: "3.2%",
        priority: "MEDIUM",
        setupInstructions: "1. Applica su jasper.ai/partner 2. Attendi approvazione 3. Ottieni ?fpr=TUOCODICE"
    },
    {
        name: "ConvertKit",
        category: "Email Marketing",
        price: "€25/mese",
        commission: 7.50, // €7.5 per vendita
        commissionPercent: "30%",
        url: "https://convertkit.com/ambassador",
        affiliateLink: "https://convertkit.com?lmref=projectblock", // Sostituisci
        description: "Email marketing semplice per creators",
        keywords: ["email marketing", "newsletter", "automation", "creators"],
        avgConversion: "4.5%",
        priority: "MEDIUM",
        setupInstructions: "1. Registrati su convertkit.com/ambassador 2. Ottieni ?lmref=TUOCODICE"
    }
];

// 📊 CALCOLATORE REVENUE
function calculatePotentialRevenue(monthlyTraffic = 10000) {
    return HIGH_COMMISSION_PRODUCTS.map(product => {
        const monthlyClicks = monthlyTraffic * 0.15; // 15% CTR medio su affiliate
        const monthlyConversions = monthlyClicks * (parseFloat(product.avgConversion) / 100);
        const monthlyRevenue = monthlyConversions * product.commission;
        
        return {
            product: product.name,
            monthlyRevenue: Math.round(monthlyRevenue),
            yearlyRevenue: Math.round(monthlyRevenue * 12),
            conversions: Math.round(monthlyConversions),
            priority: product.priority
        };
    }).sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);
}

// 🎯 DISPLAY SETUP INSTRUCTIONS
function displaySetupInstructions() {
    console.log("\n🎯 SETUP AFFILIATE PROGRAMS (PRIORITÀ ALTA):");
    console.log("==============================================");
    
    HIGH_COMMISSION_PRODUCTS
        .filter(p => p.priority === 'HIGH')
        .forEach(product => {
            console.log(`\n${product.priority === 'HIGH' ? '🚀' : '⭐'} ${product.name} - €${product.commission}/vendita`);
            console.log(`   ${product.setupInstructions}`);
        });
        
    console.log("\n💰 PROIEZIONE REVENUE (traffico 10K/mese):");
    const projections = calculatePotentialRevenue();
    projections.forEach(proj => {
        console.log(`   ${proj.product}: €${proj.monthlyRevenue}/mese (€${proj.yearlyRevenue}/anno)`);
    });
}

module.exports = { 
    HIGH_COMMISSION_PRODUCTS, 
    calculatePotentialRevenue,
    displaySetupInstructions
};

if (require.main === module) {
    displaySetupInstructions();
}