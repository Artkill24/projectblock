const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY mancante!');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateArticle() {
    try {
        console.log('🚀 Iniziando generazione articolo AI...');
        
        const topic = "Innovazione Aziendale e Digital Transformation 2025";
        console.log(`📝 Topic: ${topic}`);
        
        const content = await generateContentWithAI(topic);
        const metadata = extractMetadata(content);
        const articleHTML = await createArticleHTML(content, metadata);
        
        await saveArticle(articleHTML, metadata);
        await updateBlogFeed(metadata);
        
        console.log('✅ Articolo generato con successo!');
        console.log(`📂 Percorso: blog/${metadata.slug}/index.html`);
        
    } catch (error) {
        console.error('❌ Errore generazione:', error.message);
        await createFallbackArticle();
    }
}

async function generateContentWithAI(topic) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000
            }
        });
        
        const prompt = `Scrivi un articolo professionale di 1200 parole in ITALIANO su: "${topic}"

STRUTTURA RICHIESTA:
# [Titolo ottimizzato SEO - massimo 60 caratteri]

[Introduzione di 2 paragrafi che spiega l'importanza del topic]

## Il Panorama Attuale dell'Innovazione Aziendale
[Sezione con statistiche e trend del mercato]

## Strategie di Implementazione
[Sezione con approcci pratici e metodologie]

## Tecnologie Abilitanti
[Sezione sulle tecnologie chiave per l'innovazione]

## ROI e Benefici per l'Enterprise
[Sezione su metriche e risultati misurabili]

## Conclusioni e Prospettive Future
[Paragrafo finale con call-to-action]

REQUISITI:
- Linguaggio professionale ma accessibile
- Focus su valore business e ROI
- Include esempi concreti quando possibile
- Keywords: innovazione aziendale, digital transformation, enterprise, ROI
- Stile: autorevole ma coinvolgente

Scrivi SOLO il contenuto in markdown, iniziando con il titolo H1.`;

        console.log('🧠 Chiamando Gemini AI...');
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        console.log(`📝 Contenuto generato: ${text.length} caratteri`);
        return text;
        
    } catch (apiError) {
        console.error('❌ Errore API Gemini:', apiError.message);
        throw new Error(`API Error: ${apiError.message}`);
    }
}

function extractMetadata(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? 
        titleMatch[1].replace(/[*_\[\]]/g, '').trim() : 
        'Innovazione Aziendale: Strategie per il Successo 2025';
    
    const slug = title
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
    
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(3, Math.ceil(wordCount / 200));
    
    return {
        title,
        slug,
        excerpt: 'Scopri le strategie più efficaci per implementare l\'innovazione aziendale e accelerare la trasformazione digitale della tua organizzazione.',
        readTime,
        date: new Date().toLocaleDateString('it-IT'),
        keywords: 'innovazione aziendale, digital transformation, enterprise, ROI, tecnologia'
    };
}

async function createArticleHTML(content, metadata) {
    const templatePath = path.join(__dirname, '..', 'blog', 'template.html');
    
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template non trovato: ${templatePath}`);
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    
    const htmlContent = content
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n\n+/g, '</p><p>')
        .replace(/^(?!<)/gm, '<p>')
        .replace(/$/gm, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<h[1-6])/g, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    
    return template
        .replace(/{{TITLE}}/g, metadata.title)
        .replace(/{{TITLE_SHORT}}/g, metadata.title.substring(0, 40))
        .replace(/{{SLUG}}/g, metadata.slug)
        .replace(/{{EXCERPT}}/g, metadata.excerpt)
        .replace(/{{DATE}}/g, metadata.date)
        .replace(/{{DATE_ISO}}/g, new Date().toISOString())
        .replace(/{{READ_TIME}}/g, metadata.readTime)
        .replace(/{{KEYWORDS}}/g, metadata.keywords)
        .replace(/{{CONTENT}}/g, htmlContent);
}

async function saveArticle(htmlContent, metadata) {
    const articleDir = path.join(__dirname, '..', 'blog', metadata.slug);
    const articlePath = path.join(articleDir, 'index.html');
    
    if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
    }
    
    fs.writeFileSync(articlePath, htmlContent, 'utf8');
    console.log(`💾 Articolo salvato: ${articlePath}`);
}

async function updateBlogFeed(metadata) {
    const feedPath = path.join(__dirname, '..', 'blog', 'feed.json');
    let feed = [];
    
    if (fs.existsSync(feedPath)) {
        try {
            const feedContent = fs.readFileSync(feedPath, 'utf8');
            feed = JSON.parse(feedContent);
        } catch (error) {
            console.warn('⚠️ Errore parsing feed, creando nuovo feed');
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
    
    feed = feed.filter(article => article.slug !== metadata.slug);
    feed.unshift(articleEntry);
    feed = feed.slice(0, 30);
    
    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log('📰 Feed JSON aggiornato');
}

async function createFallbackArticle() {
    console.log('🔄 Creando articolo di fallback...');
    
    const fallbackContent = `# Innovazione Aziendale: Guida Strategica 2025

L'innovazione aziendale rappresenta oggi il pilastro fondamentale per il successo e la crescita sostenibile delle organizzazioni moderne. In un panorama competitivo sempre più dinamico, le aziende devono abbracciare strategie innovative per mantenere il loro vantaggio competitivo.

Nel 2025, la trasformazione digitale continua a ridefinire i modelli di business tradizionali, creando nuove opportunità e sfide per le organizzazioni di ogni dimensione.

## Il Panorama Attuale dell'Innovazione Aziendale

Le tecnologie emergenti stanno accelerando il ritmo del cambiamento aziendale. Dall'intelligenza artificiale alla blockchain, dalle soluzioni cloud all'automazione avanzata, ogni settore industriale si trova ad affrontare una rivoluzione tecnologica senza precedenti.

Le statistiche mostrano che le aziende che investono consistentemente in innovazione ottengono performance superiori del 30% rispetto ai loro competitor tradizionali.

## Strategie di Implementazione

Per implementare con successo l'innovazione aziendale, è essenziale adottare un approccio strutturato che includa:

- Valutazione delle competenze interne e identificazione dei gap tecnologici
- Sviluppo di una roadmap strategica con obiettivi chiari e misurabili
- Creazione di partnership strategiche con fornitori tecnologici specializzati
- Investimento nella formazione e nello sviluppo delle competenze del personale

## Tecnologie Abilitanti

Le principali tecnologie che guidano l'innovazione aziendale includono l'intelligenza artificiale per l'automazione dei processi decisionali, il cloud computing per la scalabilità e flessibilità operativa, e l'Internet of Things per la connettività intelligente degli asset aziendali.

## ROI e Benefici per l'Enterprise

Gli investimenti in innovazione generano ritorni misurabili attraverso l'incremento dell'efficienza operativa, la riduzione dei costi, il miglioramento dell'esperienza cliente e l'accelerazione del time-to-market per nuovi prodotti e servizi.

## Conclusioni e Prospettive Future

L'innovazione aziendale non rappresenta più un'opzione strategica, ma una necessità imprescindibile per la sopravvivenza nel mercato moderno. Le organizzazioni che investono oggi nelle tecnologie e nei processi innovativi saranno quelle destinate a guidare i rispettivi settori nel futuro.

Il successo nell'innovazione richiede una combinazione di visione strategica, investimenti mirati e una cultura organizzativa orientata al cambiamento continuo.`;

    const metadata = {
        title: "Innovazione Aziendale: Guida Strategica 2025",
        slug: "innovazione-aziendale-guida-strategica-2025",
        excerpt: "Scopri le strategie più efficaci per implementare l'innovazione aziendale e accelerare la trasformazione digitale della tua organizzazione.",
        readTime: 6,
        date: new Date().toLocaleDateString('it-IT'),
        keywords: "innovazione aziendale, digital transformation, enterprise, ROI, tecnologia"
    };
    
    try {
        const articleHTML = await createArticleHTML(fallbackContent, metadata);
        await saveArticle(articleHTML, metadata);
        await updateBlogFeed(metadata);
        console.log('✅ Articolo fallback creato con successo');
    } catch (error) {
        console.error('❌ Errore creazione fallback:', error.message);
    }
}

if (require.main === module) {
    generateArticle().catch(error => {
        console.error('💥 Errore fatale:', error.message);
        process.exit(1);
    });
}

module.exports = { generateArticle };
