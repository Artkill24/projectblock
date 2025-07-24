const fs = require('fs');
const path = require('path');

async function updateBlogStats() {
    try {
        console.log('📊 Aggiornando statistiche blog...');
        
        const feedPath = path.join(__dirname, '..', 'blog', 'feed.json');
        let articles = [];
        
        if (fs.existsSync(feedPath)) {
            const feedContent = fs.readFileSync(feedPath, 'utf8');
            articles = JSON.parse(feedContent);
        }
        
        const stats = calculateStats(articles);
        
        const statsPath = path.join(__dirname, '..', 'blog', 'stats.json');
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
        
        await updateHomepageStats(stats);
        
        console.log('✅ Statistiche aggiornate:', stats);
        
    } catch (error) {
        console.error('❌ Errore aggiornamento statistiche:', error);
        throw error;
    }
}

function calculateStats(articles) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const totalArticles = articles.length;
    const totalReadTime = articles.reduce((sum, article) => sum + (article.readTime || 5), 0);
    
    const thisMonthArticles = articles.filter(article => {
        const articleDate = new Date(article.date.split('/').reverse().join('-'));
        return articleDate.getMonth() === thisMonth && articleDate.getFullYear() === thisYear;
    }).length;
    
    const keywordCounts = {};
    articles.forEach(article => {
        if (article.keywords && Array.isArray(article.keywords)) {
            article.keywords.forEach(keyword => {
                keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
            });
        }
    });
    
    const topKeywords = Object.entries(keywordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([keyword, count]) => ({ keyword, count }));
        
    const categories = {
        ai: articles.filter(a => a.title?.toLowerCase().includes('ai') || a.title?.toLowerCase().includes('artificial')).length,
        blockchain: articles.filter(a => a.title?.toLowerCase().includes('blockchain') || a.title?.toLowerCase().includes('crypto')).length,
        business: articles.filter(a => a.title?.toLowerCase().includes('business') || a.title?.toLowerCase().includes('enterprise')).length,
        innovation: articles.filter(a => a.title?.toLowerCase().includes('innovation') || a.title?.toLowerCase().includes('digital')).length
    };
    
    return {
        totalArticles,
        totalReadTime,
        thisMonthArticles,
        averageReadTime: Math.round(totalReadTime / (totalArticles || 1)),
        topKeywords,
        categories,
        lastUpdated: now.toISOString(),
        contentQualityScore: calculateQualityScore(articles),
        publishingConsistency: calculateConsistency(articles)
    };
}

function calculateQualityScore(articles) {
    if (articles.length === 0) return 0;
    
    const scores = articles.slice(0, 20).map(article => {
        let score = 0;
        
        const titleLength = article.title?.length || 0;
        if (titleLength >= 45 && titleLength <= 65) score += 20;
        else if (titleLength >= 30) score += 10;
        
        const excerptLength = article.excerpt?.length || 0;
        if (excerptLength >= 150 && excerptLength <= 200) score += 20;
        else if (excerptLength >= 100) score += 10;
        
        const readTime = article.readTime || 0;
        if (readTime >= 5 && readTime <= 15) score += 20;
        else if (readTime >= 3) score += 10;
        
        if (article.keywords && article.keywords.length >= 5) score += 20;
        else if (article.keywords && article.keywords.length >= 3) score += 10;
        
        const slug = article.slug || '';
        if (slug.length >= 20 && slug.length <= 60 && !slug.includes('_')) score += 20;
        
        return Math.min(100, score);
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function calculateConsistency(articles) {
    if (articles.length < 7) return 0;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentArticles = articles.filter(article => {
        const articleDate = new Date(article.date.split('/').reverse().join('-'));
        return articleDate >= thirtyDaysAgo;
    });
    
    const publishingDays = new Set();
    recentArticles.forEach(article => {
        const date = new Date(article.date.split('/').reverse().join('-'));
        publishingDays.add(date.toDateString());
    });
    
    return Math.round((publishingDays.size / 30) * 100);
}

async function updateHomepageStats(stats) {
    const homepagePath = path.join(__dirname, '..', 'index.html');
    
    if (!fs.existsSync(homepagePath)) {
        console.warn('⚠️ Homepage non trovata per aggiornamento stats');
        return;
    }
    
    let homepage = fs.readFileSync(homepagePath, 'utf8');
    
    const statsBarRegex = /<div class="stat-number" id="totalIdeas">(\d+)<\/div>/;
    if (statsBarRegex.test(homepage)) {
        homepage = homepage.replace(statsBarRegex, `<div class="stat-number" id="totalIdeas">${stats.totalArticles}</div>`);
    }
    
    fs.writeFileSync(homepagePath, homepage, 'utf8');
    console.log('📈 Statistiche homepage aggiornate');
}

if (require.main === module) {
    updateBlogStats().catch(error => {
        console.error('💥 Errore aggiornamento statistiche:', error);
        process.exit(1);
    });
}

module.exports = { updateBlogStats };
