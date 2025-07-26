// config/email-automation.js
const EMAIL_AUTOMATION_TEMPLATES = {
    welcome_series: [
        {
            delay_days: 0,
            subject: "🎉 Benvenuto in ProjectBlock! (+ sorpresa inside)",
            content: `Ciao {{first_name}},

Benvenuto nella community di imprenditori che guadagnano con l'AI! 🚀

🎁 REGALO DI BENVENUTO:
- Checklist 47 AI Tools profitable
- Template email che convertono al 12%
- Accesso Discord community esclusiva

💡 TI SVELO UN SEGRETO:
Questa email è stata creata con ConvertKit, lo stesso tool che uso per gestire 12K+ subscribers e automatizzare completamente il mio email marketing.

Se vuoi creare anche tu un sistema automatico che genera revenue mentre dormi:
👉 https://convertkit.com?lmref=projectblock

A presto,
ProjectBlock Team

P.S. Nei prossimi giorni ti condividerò esattamente come ho costruito un business da €5K+/mese con l'AI 💰`
        },
        
        {
            delay_days: 2,
            subject: "💰 Come ho guadagnato €2,847 questo mese (breakdown completo)",
            content: `{{first_name}}, oggi ti mostro i numeri REALI...

📊 REVENUE BREAKDOWN LUGLIO:
• Affiliate marketing: €1,234
• Course sales: €847  
• Consulting: €766
• TOTALE: €2,847

🛠️ TOOL STACK CHE USO:
1. ConvertKit per email automation (€7.50 commission per referral)
2. SEMrush per SEO research (€40 commission!)
3. Jasper AI per content creation (€14.70 commission)

Il segreto? AUTOMATION.

Mentre scrivo questa email, ConvertKit sta:
✅ Nurturing 847 prospects
✅ Sending targeted offers
✅ Segmenting subscribers per interesse
✅ Tracking conversioni automaticamente

Vuoi il mio setup completo?
👉 https://convertkit.com?lmref=projectblock (14gg gratis)

Next email: ti svelo i 3 errori che mi sono costati €1000+ 😱`
        },
        
        {
            delay_days: 5,
            subject: "😱 I 3 errori che mi sono costati €1,247 (evitali!)",
            content: `{{first_name}}, questi errori mi hanno fatto perdere soldi VERI...

❌ ERRORE #1: Email marketing manuale
Prima perdevo 10 ore/settimana scrivendo email una per una.
SOLUZIONE: ConvertKit automation (ora 0 ore/settimana)

❌ ERRORE #2: Non segmentare subscribers  
Mandavo stesso contenuto a tutti (conversion rate 1.2%)
SOLUZIONE: Tag e segmentazione (ora 8.7% conversion)

❌ ERRORE #3: Non trackare metriche
Non sapevo cosa funzionava davvero
SOLUZIONE: Analytics dettagliati ConvertKit

💰 RISULTATO:
Da €500/mese a €2,800+/mese in 6 mesi

Il tool che ha fatto la differenza?
ConvertKit. Punto.

Se guadagni meno di €1000/mese con email marketing, il problema non sei tu.
È il tool che usi.

👉 Prova ConvertKit 14 giorni gratis: https://convertkit.com?lmref=projectblock

Domani ti mostro il mio template che converte al 15% 🎯`
        }
    ]
};

// 📊 CONVERTKIT REVENUE CALCULATOR
function calculateConvertKitRevenue(subscribers = 100) {
    const monthlyEmails = 8; // 2 per week
    const openRate = 0.32; // 32%
    const clickRate = 0.07; // 7%
    const affiliateConversion = 0.02; // 2%
    
    const monthlyOpens = subscribers * monthlyEmails * openRate;
    const monthlyClicks = monthlyOpens * clickRate;
    const monthlyConversions = monthlyClicks * affiliateConversion;
    
    // Revenue sources
    const convertKitCommissions = monthlyConversions * 0.1 * 7.50; // 10% sign up to CK
    const otherAffiliateCommissions = monthlyConversions * 0.9 * 25; // Other tools
    const directSales = subscribers * 0.01 * 97; // 1% buy course/month
    
    const totalMonthly = convertKitCommissions + otherAffiliateCommissions + directSales;
    
    return {
        monthly: Math.round(totalMonthly),
        yearly: Math.round(totalMonthly * 12),
        perSubscriber: Math.round(totalMonthly / subscribers * 100) / 100
    };
}

module.exports = { EMAIL_AUTOMATION_TEMPLATES, calculateConvertKitRevenue };
