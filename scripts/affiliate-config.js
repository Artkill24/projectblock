const HIGH_COMMISSION_PRODUCTS = [
    {
        name: "SEMrush",
        commission: 40.00,
        price: "€99.95/mese",
        url: "https://semrush.com/partner/",
        signup: "Registrati su semrush.com/partner/",
        priority: "HIGH"
    },
    {
        name: "Systeme.io", 
        commission: 58.00,
        price: "€97/mese",
        url: "https://systeme.io/affiliate",
        signup: "Registrati su systeme.io/affiliate",
        priority: "HIGH"
    },
    {
        name: "Jasper AI",
        commission: 14.70,
        price: "€49/mese", 
        url: "https://jasper.ai/partner",
        signup: "Applica su jasper.ai/partner",
        priority: "MEDIUM"
    },
    {
        name: "ConvertKit",
        commission: 7.50,
        price: "€25/mese",
        url: "https://convertkit.com/ambassador",
        signup: "Registrati su convertkit.com/ambassador", 
        priority: "MEDIUM"
    }
];

console.log("💰 AFFILIATE PRIORITY SETUP:");
HIGH_COMMISSION_PRODUCTS.forEach(product => {
    console.log(`${product.priority === 'HIGH' ? '🎯' : '⭐'} ${product.name}: €${product.commission}/vendita`);
    console.log(`   ${product.signup}`);
    console.log("");
});

module.exports = { HIGH_COMMISSION_PRODUCTS };
