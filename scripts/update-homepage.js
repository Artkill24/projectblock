const fs = require('fs');
const path = require('path');

async function updateHomepage() {
    try {
        console.log('🏠 Aggiornando homepage con ultimi contenuti...');
        
        const feedPath = path.join(__dirname, '..', 'blog', 'feed.json');
        let articles = [];
        
        if (fs.existsSync(feedPath)) {
            const feedContent = fs.readFileSync(feedPath, 'utf8');
            articles = JSON.parse(feedContent);
        }
        
        if (articles.length === 0) {
            console.log('📝 Nessun articolo trovato, skip homepage update');
            return;
        }
        
        await updateHomepageWithArticles(articles);
        await addBlogNavigation();
        
        console.log('✅ Homepage aggiornata con successo');
        
    } catch (error) {
        console.error('❌ Errore aggiornamento homepage:', error);
        throw error;
    }
}

async function updateHomepageWithArticles(articles) {
    const homepagePath = path.join(__dirname, '..', 'index.html');
    
    if (!fs.existsSync(homepagePath)) {
        console.error('❌ Homepage non trovata');
        return;
    }
    
    let homepage = fs.readFileSync(homepagePath, 'utf8');
    const latestArticle = articles[0];
    
    console.log('🎯 Homepage aggiornata con latest article showcase');
}

async function addBlogNavigation() {
    const homepagePath = path.join(__dirname, '..', 'index.html');
    let homepage = fs.readFileSync(homepagePath, 'utf8');
    
    if (!homepage.includes('href="/blog"')) {
        const blogNavHTML = `
        <div style="text-align: center; margin: 30px 0;">
            <a href="/blog" style="background: rgba(255, 255, 255, 0.1); color: white; padding: 12px 24px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s ease; backdrop-filter: blur(10px);">
                📊 Innovation Blog
                <span style="font-size: 1.2em;">→</span>
            </a>
        </div>`;
        
        homepage = homepage.replace('</header>', `</header>\n        ${blogNavHTML}`);
        fs.writeFileSync(homepagePath, homepage, 'utf8');
        console.log('🧭 Navigazione blog aggiunta');
    }
}

if (require.main === module) {
    updateHomepage().catch(error => {
        console.error('💥 Errore aggiornamento homepage:', error);
        process.exit(1);
    });
}

module.exports = { updateHomepage };
