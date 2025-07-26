
// config/social-templates.js
const SOCIAL_MEDIA_TEMPLATES = {
    linkedin: {
        productReview: `🚀 Ho testato {PRODUCT} per 30 giorni

Ecco il mio verdetto onesto:

✅ {PRO_1}
✅ {PRO_2}
✅ {PRO_3}

❌ {CON_1}

💰 Prezzo: {PRICE}
⭐ Rating: {RATING}/10

Vale l'investimento? {VERDICT}

👇 Recensione completa:
{ARTICLE_URL}

#AI #ProductivityTools #MarketingAutomation #Revenue`,

        aiIdea: `💡 Nuova idea AI: {AI_IDEA}

🎯 Problema: {PROBLEM}
💰 Revenue potenziale: {REVENUE_POTENTIAL}
🚀 Difficoltà: {DIFFICULTY}

Cosa ne pensate? Fattibile?

📖 Business plan completo:
{ARTICLE_URL}

#StartupIdea #AI #Innovation #BusinessPlan`
    },
    
    twitter: {
        thread: `1/ 🧵 {PRODUCT} Review Thread

Appena finito test di 30 giorni.
Ecco cosa ho scoperto 👇

2/ ✅ Pro:
• {PRO_1}
• {PRO_2}  
• {PRO_3}

3/ ❌ Contro:
• {CON_1}
• {CON_2}

4/ 💰 Prezzo: {PRICE}
Vale la pena? {VERDICT}

5/ 📖 Review completa:
{ARTICLE_URL}

Fine 🔥`,

        quickTip: `💡 {PRODUCT} Pro Tip:

{TIP_TEXT}

More tips: {ARTICLE_URL}

#AITools #ProductivityHack`
    },
    
    instagram: {
        story: `🚀 REVIEW: {PRODUCT}

⭐ {RATING}/10
💰 {PRICE}

✅ Best: {BEST_FEATURE}
❌ Worst: {WORST_FEATURE}

🔗 Full review: {SHORT_URL}

#AITools #TechReview`,
        
        post: `Just tested {PRODUCT} for 30 days! 📊

Here's my honest take:

✅ {PRO_1}
✅ {PRO_2}
❌ {CON_1}

Rating: {RATING}/10

Full review in my bio 👆

#ProductReview #AITools #Productivity`
    }
};

// 🔧 TEMPLATE FILLER FUNCTION  
function fillTemplate(template, data) {
    let filled = template;
    Object.keys(data).forEach(key => {
        const placeholder = `{${key.toUpperCase()}}`;
        filled = filled.replace(new RegExp(placeholder, 'g'), data[key]);
    });
    return filled;
}

// 📝 GENERATE SOCIAL POSTS
function generateSocialPosts(productData, articleUrl) {
    const posts = {};
    
    Object.keys(SOCIAL_MEDIA_TEMPLATES).forEach(platform => {
        posts[platform] = {};
        Object.keys(SOCIAL_MEDIA_TEMPLATES[platform]).forEach(type => {
            posts[platform][type] = fillTemplate(
                SOCIAL_MEDIA_TEMPLATES[platform][type],
                { ...productData, article_url: articleUrl }
            );
        });
    });
    
    return posts;
}

module.exports = { 
    SOCIAL_MEDIA_TEMPLATES, 
    fillTemplate, 
    generateSocialPosts 
};