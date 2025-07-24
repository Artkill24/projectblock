const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const trendingTopics = [
    "Artificial Intelligence ROI enterprise implementation 2025",
    "Machine Learning predictive analytics business transformation", 
    "AI automation workplace productivity enterprise solutions",
    "Blockchain enterprise adoption real world use cases",
    "Digital transformation strategy enterprise leadership"
];

async function generateArticle() {
    try {
        console.log('🚀 Iniziando generazione articolo AI...');
        const topic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
        console.log(`📝 Topic selezionato: ${topic}`);
        
        const content = await generateContentWithAI(topic);
        const metadata = extractMetadata(content, topic);
        const articleHTML = await createArticleHTML(content, metadata);
        
        await saveArticle(articleHTML, metadata);
        await updateBlogFeed(metadata);
        
        console.log('✅ Articolo generato con successo!');
        
    } catch (error) {
        console.error('❌ Errore:', error);
        await createFallbackArticle();
    }
}

async function generateContentWithAI(topic) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = `Scrivi un articolo professionale di 1500 parole in ITALIANO su: "${topic}"

STRUTTURA:
# [Titolo SEO-friendly]
[Introduzione 2-3 paragrafi]
## [4 sezioni principali H2]
### [Sottosezioni H3]
## Conclusioni

REQUISITI:
- Focus su business value e ROI
- Linguaggio professionale
- Keywords: innovazione, enterprise, digital transformation
- Articolo completo e dettagliato

Scrivi SOLO il contenuto markdown.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
}

function extractMetadata(content, originalTopic) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/[*_\[\]]/g, '').trim() : 'Innovazione Aziendale 2025';
    
    const slug = title.toLowerCase()
        .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '').substring(0, 50);
    
    const excerpt = 'Scopri le strategie più avanzate per l\'innovazione aziendale e la trasformazione digitale.';
    const readTime = 8;
    
    return {
        title, slug, excerpt, readTime,
        date: new Date().toLocaleDateString('it-IT'),
        keywords: 'innovazione, tecnologia, business, enterprise'
    };
}

async function createArticleHTML(content, metadata) {
    const templatePath = path.join(__dirname, '..', 'blog', 'template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    const htmlContent = content
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<)/gm, '<p>')
        .replace(/$/gm, '</p>')
        .replace(/<p><\/p>/g, '');
    
    return template
        .replace(/{{TITLE}}/g, metadata.title)
        .replace(/{{SLUG}}/g, metadata.slug)
        .replace(/{{EXCERPT}}/g, metadata.excerpt)
        .replace(/{{DATE}}/g, metadata.date)
        .replace(/{{READ_TIME}}/g, metadata.readTime)
        .replace(/{{KEYWORDS}}/g, metadata.keywords)
        .replace(/{{CONTENT}}/g, htmlContent)
        .replace(/{{TITLE_SHORT}}/g, metadata.title.substring(0, 40))
        .replace(/{{DATE_ISO}}/g, new Date().toISOString());
}

async function saveArticle(htmlContent, metadata) {
    const articleDir = path.join(__dirname, '..', 'blog', metadata.slug);
    fs.mkdirSync(articleDir, { recursive: true });
    fs.writeFileSync(path.join(articleDir, 'index.html'), htmlContent, 'utf8');
    console.log(`💾 Articolo salvato: blog/${metadata.slug}/`);
}

async function updateBlogFeed(metadata) {
    const feedPath = path.join(__dirname, '..', 'blog', 'feed.json');
    let feed = [];
    
    if (fs.existsSync(feedPath)) {
        try {
            feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
        } catch (error) {
            feed = [];
        }
    }
    
    const articleEntry = {
        title: metadata.title,
        slug: metadata.slug,
        excerpt: metadata.excerpt,
        date: metadata.date,
        readTime: metadata.readTime
    };
    
    feed.unshift(articleEntry);
    feed = feed.slice(0, 50);
    
    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log('📰 Feed aggiornato');
}

async function createFallbackArticle() {
    console.log('🔄 Creando articolo fallback...');
    
    const fallbackContent = `# Innovazione Aziendale: Strategie per il Successo 2025

L'innovazione aziendale rappresenta oggi un fattore critico per la competitività delle organizzazioni moderne.

## Il Panorama dell'Innovazione

Le tecnologie emergenti stanno ridefinendo i modelli di business tradizionali.

## Strategie di Implementazione

Un approccio strutturato include valutazione dei rischi e pianificazione strategica.

## Conclusioni

L'innovazione non è più un'opzione ma una necessità strategica per il futuro.`;

    const metadata = {
        title: "Innovazione Aziendale: Strategie per il Successo 2025",
        slug: "innovazione-aziendale-strategie-successo-2025",
        excerpt: "Scopri le strategie più efficaci per implementare l'innovazione aziendale.",
        readTime: 5,
        date: new Date().toLocaleDateString('it-IT'),
        keywords: "innovazione, business, digital transformation"
    };
    
    const articleHTML = await createArticleHTML(fallbackContent, metadata);
    await saveArticle(articleHTML, metadata);
    await updateBlogFeed(metadata);
    
    console.log('✅ Articolo fallback creato');
}

if (require.main === module) {
    generateArticle().catch(error => {
        console.error('💥 Errore fatale:', error);
        process.exit(1);
    });
}
