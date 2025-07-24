const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const trendingTopics = [
    "Artificial Intelligence ROI enterprise implementation 2025",
    "Machine Learning predictive analytics business transformation",
    "AI automation workplace productivity enterprise solutions",
    "Blockchain enterprise adoption real world use cases",
    "Cryptocurrency payment systems business integration",
    "Web3 business models digital transformation",
    "Digital transformation strategy enterprise leadership",
    "Cybersecurity enterprise risk mitigation strategies",
    "Cloud computing multi-cloud enterprise architecture",
    "Data analytics business intelligence decision making",
    "IoT industrial automation manufacturing optimization",
    "Fintech banking digital transformation customer experience",
    "5G technology enterprise applications edge computing",
    "Quantum computing business applications future impact",
    "Sustainable technology ESG innovation strategies"
];

async function generateArticle() {
    try {
        console.log('🚀 Iniziando generazione articolo AI...');
        
        const topic = process.env.CUSTOM_TOPIC || selectTrendingTopic();
        console.log(`📝 Topic selezionato: ${topic}`);
        
        const content = await generateContentWithAI(topic);
        const metadata = extractMetadata(content, topic);
        console.log(`📊 Metadata estratti: ${metadata.title}`);
        
        const articleHTML = await createArticleHTML(content, metadata);
        await saveArticle(articleHTML, metadata);
        await updateBlogFeed(metadata);
        await updateHomepagePreview(metadata);
        
        console.log('✅ Articolo generato e pubblicato con successo!');
        console.log(`🔗 URL: https://project-block.com/blog/${metadata.slug}/`);
        
    } catch (error) {
        console.error('❌ Errore nella generazione:', error);
        
        if (error.message.includes('API') || error.message.includes('quota')) {
            console.log('�� Creando articolo fallback...');
            await createFallbackArticle();
        }
        
        throw error;
    }
}

function selectTrendingTopic() {
    return trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
}

async function generateContentWithAI(topic) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 4000,
        }
    });
    
    const currentDate = new Date().toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const prompt = `
    Scrivi un articolo professionale e approfondito di 2500-3000 parole in ITALIANO su: "${topic}"
    
    Data di oggi: ${currentDate}
    
    STRUTTURA OBBLIGATORIA:
    # [Titolo H1 - massimo 65 caratteri, accattivante e SEO-friendly]
    
    [Introduzione coinvolgente di 2-3 paragrafi che presenta il problema e perché è importante ORA]
    
    ## [5-6 sezioni principali con titoli H2 specifici e actionable]
    ### [2-3 sottosezioni H3 per ogni H2 con contenuto dettagliato]
    
    ## Key Takeaways Pratici
    [Lista numerata di 8-10 punti actionable che i lettori possono implementare]
    
    ## Conclusioni e Prospettive Future
    [Paragrafo di chiusura con call-to-action verso l'innovazione]
    
    REQUISITI CONTENUTO:
    - Focus su ROI e business value concreto
    - Include dati statistici reali e case studies quando possibile
    - Linguaggio professionale ma accessibile per C-level executives
    - Evita jargon tecnico eccessivo, spiega i concetti complessi
    - Collega ogni sezione al valore per l'enterprise
    - Inserisci esempi pratici e implementazioni reali
    
    STILE E TONO:
    - Autorevole ma conversazionale
    - Basato su ricerca e dati
    - Orientato all'azione e ai risultati
    - Prospettico e visionario
    - Pragmatico nelle raccomandazioni
    
    KEYWORDS DA INCLUDERE NATURALMENTE:
    - innovazione aziendale, trasformazione digitale, ROI tecnologico
    - enterprise solution, competitive advantage, business intelligence
    - automation, scalability, digital strategy, future-ready
    - innovation framework, strategic implementation, performance optimization
    
    L'articolo deve essere pubblicato su ProjectBlock, una piattaforma enterprise per l'innovazione aziendale.
    Scrivi SOLO il contenuto dell'articolo in markdown, iniziando direttamente con il titolo H1.
    `;
    
    console.log('🧠 Generando contenuto con Gemini AI...');
    const result = await model.generateContent(prompt);
    
    if (!result.response) {
        throw new Error('Nessuna risposta dall\'AI');
    }
    
    const content = result.response.text();
    console.log(`📝 Contenuto generato: ${content.length} caratteri`);
    
    return content;
}

function extractMetadata(content, originalTopic) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? 
        titleMatch[1].replace(/[*_\[\]]/g, '').trim() : 
        generateFallbackTitle(originalTopic);
    
    const slug = generateSlug(title);
    const excerpt = extractExcerpt(content);
    const readTime = estimateReadTime(content);
    
    const now = new Date();
    const date = now.toLocaleDateString('it-IT');
    const dateISO = now.toISOString();
    
    const keywords = extractKeywords(originalTopic, content);
    
    return {
        title,
        titleShort: title.length > 40 ? title.substring(0, 37) + '...' : title,
        slug,
        excerpt,
        readTime,
        date,
        dateISO,
        keywords: keywords.join(', '),
        originalTopic
    };
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
}

function extractExcerpt(content) {
    const lines = content.split('\n');
    let firstParagraph = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#') || line === '' || line.startsWith('*')) {
            continue;
        }
        
        if (line.length > 100) {
            firstParagraph = line;
            break;
        }
    }
    
    if (!firstParagraph) {
        const cleanContent = content
            .replace(/#{1,6}\s+.+$/gm, '')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .trim();
        
        const sentences = cleanContent.split('. ');
        firstParagraph = sentences.slice(0, 2).join('. ');
    }
    
    const excerpt = firstParagraph
        .replace(/[*_#\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
        
    return excerpt.length > 160 ? 
        excerpt.substring(0, 157) + '...' : 
        excerpt;
}

function estimateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function extractKeywords(topic, content) {
    const baseKeywords = [
        'innovazione', 'tecnologia', 'business', 'enterprise',
        'digital transformation', 'automation', 'ROI'
    ];
    
    const topicKeywords = topic
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 3);
    
    return [...new Set([...baseKeywords, ...topicKeywords])].slice(0, 8);
}

function generateFallbackTitle(topic) {
    const templates = [
        `${topic.split(' ')[0]} 2025: Strategie per l'Innovazione Aziendale`,
        `Come ${topic} Sta Trasformando il Business Enterprise`,
        `Guida Completa a ${topic} per Leader Aziendali`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

async function createArticleHTML(content, metadata) {
    const templatePath = path.join(__dirname, '..', 'blog', 'template.html');
    
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template non trovato: ${templatePath}`);
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    const htmlContent = convertMarkdownToHTML(content);
    
    const replacements = {
        '{{TITLE}}': metadata.title,
        '{{TITLE_SHORT}}': metadata.titleShort,
        '{{EXCERPT}}': metadata.excerpt,
        '{{SLUG}}': metadata.slug,
        '{{DATE}}': metadata.date,
        '{{DATE_ISO}}': metadata.dateISO,
        '{{READ_TIME}}': metadata.readTime,
        '{{KEYWORDS}}': metadata.keywords,
        '{{CONTENT}}': htmlContent
    };
    
    for (const [placeholder, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return template;
}

function convertMarkdownToHTML(markdown) {
    return markdown
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
        .replace(/## Key Takeaways Pratici\s*\n([\s\S]*?)(?=\n##|\n$)/g, (match, content) => {
            const listItems = content
                .split('\n')
                .filter(line => line.trim().match(/^\d+\./))
                .map(line => `<li>${line.replace(/^\d+\.\s*/, '')}</li>`)
                .join('');
            
            return `
                <div class="key-takeaways">
                    <h3>🎯 Key Takeaways Pratici</h3>
                    <ul>${listItems}</ul>
                </div>
            `;
        })
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|o|d])/gm, '<p>')
        .replace(/(?<!<\/[h|u|o|d]>)$/gm, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[h|u|o|d])/g, '$1')
        .replace(/(<\/[h|u|o|d]>)<\/p>/g, '$1');
}

async function saveArticle(htmlContent, metadata) {
    const articleDir = path.join(__dirname, '..', 'blog', metadata.slug);
    const articlePath = path.join(articleDir, 'index.html');
    
    fs.mkdirSync(articleDir, { recursive: true });
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
            console.warn('⚠️ Errore lettura feed, creando nuovo:', error.message);
            feed = [];
        }
    }
    
    const articleEntry = {
        title: metadata.title,
        slug: metadata.slug,
        excerpt: metadata.excerpt,
        date: metadata.date,
        readTime: metadata.readTime,
        keywords: metadata.keywords.split(', ').slice(0, 5)
    };
    
    feed = feed.filter(article => article.slug !== metadata.slug);
    feed.unshift(articleEntry);
    feed = feed.slice(0, 100);
    
    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log('📰 Feed JSON aggiornato');
}

async function updateHomepagePreview(metadata) {
    const homepagePath = path.join(__dirname, '..', 'index.html');
    
    if (!fs.existsSync(homepagePath)) {
        console.warn('⚠️ Homepage non trovata, skip update');
        return;
    }
    
    let homepage = fs.readFileSync(homepagePath, 'utf8');
    
    const latestArticleHTML = `
        <!-- Latest AI Article - Auto-generated -->
        <div class="latest-article-showcase" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%); padding: 40px; border-radius: 24px; margin: 40px 0; box-shadow: 0 20px 60px rgba(0,0,0,0.1); border: 1px solid rgba(255, 255, 255, 0.2); position: relative; overflow: hidden;">
            <div style="position: relative; z-index: 2;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 10px 20px; border-radius: 25px; font-size: 0.85em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                            🤖 ULTIMO INSIGHT AI
                        </div>
                        <div style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 14px; border-radius: 20px; font-size: 0.8em; font-weight: 600;">
                            📅 ${metadata.date}
                        </div>
                    </div>
                </div>
                
                <h3 style="color: #1e293b; font-size: 1.8em; font-weight: 800; margin-bottom: 20px; line-height: 1.3;">
                    ${metadata.title}
                </h3>
                
                <p style="color: #475569; line-height: 1.7; margin-bottom: 30px; font-size: 1.1em;">
                    ${metadata.excerpt}
                </p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                    <div style="display: flex; align-items: center; gap: 20px; color: #64748b; font-size: 0.95em;">
                        <span>⏱️ ${metadata.readTime} min lettura</span>
                        <span>📊 Innovation Insights</span>
                    </div>
                    
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <a href="/blog/${metadata.slug}/" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s ease; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);">
                            <span>Leggi Insight</span>
                            <span style="font-size: 1.3em;">→</span>
                        </a>
                        
                        <a href="/blog" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 16px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; border: 2px solid rgba(59, 130, 246, 0.2);">
                            📚 Tutti gli Articoli
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Latest AI Article -->`;
    
    homepage = homepage.replace(/<!-- Latest AI Article - Auto-generated -->[\s\S]*?<!-- End Latest AI Article -->/g, '');
    homepage = homepage.replace('</header>', `</header>\n        ${latestArticleHTML}`);
    
    fs.writeFileSync(homepagePath, homepage, 'utf8');
    console.log('🏠 Homepage aggiornata con preview ultimo articolo');
}

async function createFallbackArticle() {
    console.log('🔄 Creando articolo fallback...');
    
    const fallbackContent = `# Innovazione Aziendale: Strategie per il Successo nel 2025

L'innovazione aziendale rappresenta oggi più che mai un fattore critico per la competitività e la crescita sostenibile delle organizzazioni. In un contesto di rapida trasformazione digitale, le aziende che sanno adattarsi e innovare riescono a mantenere un vantaggio competitivo significativo.

## Il Panorama dell'Innovazione Moderna

Le tecnologie emergenti stanno ridefinendo i modelli di business tradizionali. Dall'intelligenza artificiale alla blockchain, dalle soluzioni cloud ai sistemi di automazione, ogni settore è chiamato a ripensare i propri processi e strategie.

### Tecnologie Abilitanti

Le principali tecnologie che guidano l'innovazione includono:
- Intelligenza Artificiale e Machine Learning
- Automazione dei processi (RPA)
- Analisi predittiva e Business Intelligence
- Soluzioni cloud ibride e multi-cloud
- Internet of Things (IoT) industriale

## Key Takeaways Pratici

1. Iniziate con progetti pilota a basso rischio per testare nuove tecnologie
2. Investite nella formazione del personale per facilitare l'adozione
3. Stabilite metriche chiare per misurare il successo dell'innovazione
4. Collaborate con partner tecnologici esperti per accelerare l'implementazione
5. Mantenete un approccio agile e iterativo ai progetti di innovazione

## Conclusioni e Prospettive Future

L'innovazione aziendale non è più un'opzione ma una necessità strategica. Le organizzazioni che investono oggi nelle tecnologie emergenti saranno quelle che guideranno i mercati del futuro.`;

    const metadata = {
        title: "Innovazione Aziendale: Strategie per il Successo nel 2025",
        titleShort: "Innovazione Aziendale: Strategie 2025",
        slug: "innovazione-aziendale-strategie-successo-2025",
        excerpt: "Scopri le strategie più efficaci per implementare l'innovazione aziendale e mantenere un vantaggio competitivo nel panorama tecnologico del 2025.",
        readTime: 5,
        date: new Date().toLocaleDateString('it-IT'),
        dateISO: new Date().toISOString(),
        keywords: "innovazione, business, digital transformation, enterprise, ROI, automazione",
        originalTopic: "fallback"
    };
    
    const articleHTML = await createArticleHTML(fallbackContent, metadata);
    await saveArticle(articleHTML, metadata);
    await updateBlogFeed(metadata);
    await updateHomepagePreview(metadata);
    
    console.log('✅ Articolo fallback creato con successo');
}

if (require.main === module) {
    generateArticle().catch(error => {
        console.error('�� Errore fatale:', error);
        process.exit(1);
    });
}

module.exports = { generateArticle };
EOFcat > scripts/generate-article.js << 'EOF'
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const trendingTopics = [
    "Artificial Intelligence ROI enterprise implementation 2025",
    "Machine Learning predictive analytics business transformation",
    "AI automation workplace productivity enterprise solutions",
    "Blockchain enterprise adoption real world use cases",
    "Cryptocurrency payment systems business integration",
    "Web3 business models digital transformation",
    "Digital transformation strategy enterprise leadership",
    "Cybersecurity enterprise risk mitigation strategies",
    "Cloud computing multi-cloud enterprise architecture",
    "Data analytics business intelligence decision making",
    "IoT industrial automation manufacturing optimization",
    "Fintech banking digital transformation customer experience",
    "5G technology enterprise applications edge computing",
    "Quantum computing business applications future impact",
    "Sustainable technology ESG innovation strategies"
];

async function generateArticle() {
    try {
        console.log('🚀 Iniziando generazione articolo AI...');
        
        const topic = process.env.CUSTOM_TOPIC || selectTrendingTopic();
        console.log(`📝 Topic selezionato: ${topic}`);
        
        const content = await generateContentWithAI(topic);
        const metadata = extractMetadata(content, topic);
        console.log(`📊 Metadata estratti: ${metadata.title}`);
        
        const articleHTML = await createArticleHTML(content, metadata);
        await saveArticle(articleHTML, metadata);
        await updateBlogFeed(metadata);
        await updateHomepagePreview(metadata);
        
        console.log('✅ Articolo generato e pubblicato con successo!');
        console.log(`🔗 URL: https://project-block.com/blog/${metadata.slug}/`);
        
    } catch (error) {
        console.error('❌ Errore nella generazione:', error);
        
        if (error.message.includes('API') || error.message.includes('quota')) {
            console.log('�� Creando articolo fallback...');
            await createFallbackArticle();
        }
        
        throw error;
    }
}

function selectTrendingTopic() {
    return trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
}

async function generateContentWithAI(topic) {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 4000,
        }
    });
    
    const currentDate = new Date().toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const prompt = `
    Scrivi un articolo professionale e approfondito di 2500-3000 parole in ITALIANO su: "${topic}"
    
    Data di oggi: ${currentDate}
    
    STRUTTURA OBBLIGATORIA:
    # [Titolo H1 - massimo 65 caratteri, accattivante e SEO-friendly]
    
    [Introduzione coinvolgente di 2-3 paragrafi che presenta il problema e perché è importante ORA]
    
    ## [5-6 sezioni principali con titoli H2 specifici e actionable]
    ### [2-3 sottosezioni H3 per ogni H2 con contenuto dettagliato]
    
    ## Key Takeaways Pratici
    [Lista numerata di 8-10 punti actionable che i lettori possono implementare]
    
    ## Conclusioni e Prospettive Future
    [Paragrafo di chiusura con call-to-action verso l'innovazione]
    
    REQUISITI CONTENUTO:
    - Focus su ROI e business value concreto
    - Include dati statistici reali e case studies quando possibile
    - Linguaggio professionale ma accessibile per C-level executives
    - Evita jargon tecnico eccessivo, spiega i concetti complessi
    - Collega ogni sezione al valore per l'enterprise
    - Inserisci esempi pratici e implementazioni reali
    
    STILE E TONO:
    - Autorevole ma conversazionale
    - Basato su ricerca e dati
    - Orientato all'azione e ai risultati
    - Prospettico e visionario
    - Pragmatico nelle raccomandazioni
    
    KEYWORDS DA INCLUDERE NATURALMENTE:
    - innovazione aziendale, trasformazione digitale, ROI tecnologico
    - enterprise solution, competitive advantage, business intelligence
    - automation, scalability, digital strategy, future-ready
    - innovation framework, strategic implementation, performance optimization
    
    L'articolo deve essere pubblicato su ProjectBlock, una piattaforma enterprise per l'innovazione aziendale.
    Scrivi SOLO il contenuto dell'articolo in markdown, iniziando direttamente con il titolo H1.
    `;
    
    console.log('🧠 Generando contenuto con Gemini AI...');
    const result = await model.generateContent(prompt);
    
    if (!result.response) {
        throw new Error('Nessuna risposta dall\'AI');
    }
    
    const content = result.response.text();
    console.log(`📝 Contenuto generato: ${content.length} caratteri`);
    
    return content;
}

function extractMetadata(content, originalTopic) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? 
        titleMatch[1].replace(/[*_\[\]]/g, '').trim() : 
        generateFallbackTitle(originalTopic);
    
    const slug = generateSlug(title);
    const excerpt = extractExcerpt(content);
    const readTime = estimateReadTime(content);
    
    const now = new Date();
    const date = now.toLocaleDateString('it-IT');
    const dateISO = now.toISOString();
    
    const keywords = extractKeywords(originalTopic, content);
    
    return {
        title,
        titleShort: title.length > 40 ? title.substring(0, 37) + '...' : title,
        slug,
        excerpt,
        readTime,
        date,
        dateISO,
        keywords: keywords.join(', '),
        originalTopic
    };
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
}

function extractExcerpt(content) {
    const lines = content.split('\n');
    let firstParagraph = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('#') || line === '' || line.startsWith('*')) {
            continue;
        }
        
        if (line.length > 100) {
            firstParagraph = line;
            break;
        }
    }
    
    if (!firstParagraph) {
        const cleanContent = content
            .replace(/#{1,6}\s+.+$/gm, '')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .trim();
        
        const sentences = cleanContent.split('. ');
        firstParagraph = sentences.slice(0, 2).join('. ');
    }
    
    const excerpt = firstParagraph
        .replace(/[*_#\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
        
    return excerpt.length > 160 ? 
        excerpt.substring(0, 157) + '...' : 
        excerpt;
}

function estimateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function extractKeywords(topic, content) {
    const baseKeywords = [
        'innovazione', 'tecnologia', 'business', 'enterprise',
        'digital transformation', 'automation', 'ROI'
    ];
    
    const topicKeywords = topic
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 3);
    
    return [...new Set([...baseKeywords, ...topicKeywords])].slice(0, 8);
}

function generateFallbackTitle(topic) {
    const templates = [
        `${topic.split(' ')[0]} 2025: Strategie per l'Innovazione Aziendale`,
        `Come ${topic} Sta Trasformando il Business Enterprise`,
        `Guida Completa a ${topic} per Leader Aziendali`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

async function createArticleHTML(content, metadata) {
    const templatePath = path.join(__dirname, '..', 'blog', 'template.html');
    
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template non trovato: ${templatePath}`);
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    const htmlContent = convertMarkdownToHTML(content);
    
    const replacements = {
        '{{TITLE}}': metadata.title,
        '{{TITLE_SHORT}}': metadata.titleShort,
        '{{EXCERPT}}': metadata.excerpt,
        '{{SLUG}}': metadata.slug,
        '{{DATE}}': metadata.date,
        '{{DATE_ISO}}': metadata.dateISO,
        '{{READ_TIME}}': metadata.readTime,
        '{{KEYWORDS}}': metadata.keywords,
        '{{CONTENT}}': htmlContent
    };
    
    for (const [placeholder, value] of Object.entries(replacements)) {
        template = template.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return template;
}

function convertMarkdownToHTML(markdown) {
    return markdown
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        .replace(/^-\s+(.+)$/gm, '<li>$1</li>')
        .replace(/## Key Takeaways Pratici\s*\n([\s\S]*?)(?=\n##|\n$)/g, (match, content) => {
            const listItems = content
                .split('\n')
                .filter(line => line.trim().match(/^\d+\./))
                .map(line => `<li>${line.replace(/^\d+\.\s*/, '')}</li>`)
                .join('');
            
            return `
                <div class="key-takeaways">
                    <h3>🎯 Key Takeaways Pratici</h3>
                    <ul>${listItems}</ul>
                </div>
            `;
        })
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[h|u|o|d])/gm, '<p>')
        .replace(/(?<!<\/[h|u|o|d]>)$/gm, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[h|u|o|d])/g, '$1')
        .replace(/(<\/[h|u|o|d]>)<\/p>/g, '$1');
}

async function saveArticle(htmlContent, metadata) {
    const articleDir = path.join(__dirname, '..', 'blog', metadata.slug);
    const articlePath = path.join(articleDir, 'index.html');
    
    fs.mkdirSync(articleDir, { recursive: true });
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
            console.warn('⚠️ Errore lettura feed, creando nuovo:', error.message);
            feed = [];
        }
    }
    
    const articleEntry = {
        title: metadata.title,
        slug: metadata.slug,
        excerpt: metadata.excerpt,
        date: metadata.date,
        readTime: metadata.readTime,
        keywords: metadata.keywords.split(', ').slice(0, 5)
    };
    
    feed = feed.filter(article => article.slug !== metadata.slug);
    feed.unshift(articleEntry);
    feed = feed.slice(0, 100);
    
    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log('📰 Feed JSON aggiornato');
}

async function updateHomepagePreview(metadata) {
    const homepagePath = path.join(__dirname, '..', 'index.html');
    
    if (!fs.existsSync(homepagePath)) {
        console.warn('⚠️ Homepage non trovata, skip update');
        return;
    }
    
    let homepage = fs.readFileSync(homepagePath, 'utf8');
    
    const latestArticleHTML = `
        <!-- Latest AI Article - Auto-generated -->
        <div class="latest-article-showcase" style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%); padding: 40px; border-radius: 24px; margin: 40px 0; box-shadow: 0 20px 60px rgba(0,0,0,0.1); border: 1px solid rgba(255, 255, 255, 0.2); position: relative; overflow: hidden;">
            <div style="position: relative; z-index: 2;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 10px 20px; border-radius: 25px; font-size: 0.85em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                            🤖 ULTIMO INSIGHT AI
                        </div>
                        <div style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 14px; border-radius: 20px; font-size: 0.8em; font-weight: 600;">
                            📅 ${metadata.date}
                        </div>
                    </div>
                </div>
                
                <h3 style="color: #1e293b; font-size: 1.8em; font-weight: 800; margin-bottom: 20px; line-height: 1.3;">
                    ${metadata.title}
                </h3>
                
                <p style="color: #475569; line-height: 1.7; margin-bottom: 30px; font-size: 1.1em;">
                    ${metadata.excerpt}
                </p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                    <div style="display: flex; align-items: center; gap: 20px; color: #64748b; font-size: 0.95em;">
                        <span>⏱️ ${metadata.readTime} min lettura</span>
                        <span>📊 Innovation Insights</span>
                    </div>
                    
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <a href="/blog/${metadata.slug}/" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s ease; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);">
                            <span>Leggi Insight</span>
                            <span style="font-size: 1.3em;">→</span>
                        </a>
                        
                        <a href="/blog" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 16px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; border: 2px solid rgba(59, 130, 246, 0.2);">
                            📚 Tutti gli Articoli
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Latest AI Article -->`;
    
    homepage = homepage.replace(/<!-- Latest AI Article - Auto-generated -->[\s\S]*?<!-- End Latest AI Article -->/g, '');
    homepage = homepage.replace('</header>', `</header>\n        ${latestArticleHTML}`);
    
    fs.writeFileSync(homepagePath, homepage, 'utf8');
    console.log('🏠 Homepage aggiornata con preview ultimo articolo');
}

async function createFallbackArticle() {
    console.log('🔄 Creando articolo fallback...');
    
    const fallbackContent = `# Innovazione Aziendale: Strategie per il Successo nel 2025

L'innovazione aziendale rappresenta oggi più che mai un fattore critico per la competitività e la crescita sostenibile delle organizzazioni. In un contesto di rapida trasformazione digitale, le aziende che sanno adattarsi e innovare riescono a mantenere un vantaggio competitivo significativo.

## Il Panorama dell'Innovazione Moderna

Le tecnologie emergenti stanno ridefinendo i modelli di business tradizionali. Dall'intelligenza artificiale alla blockchain, dalle soluzioni cloud ai sistemi di automazione, ogni settore è chiamato a ripensare i propri processi e strategie.

### Tecnologie Abilitanti

Le principali tecnologie che guidano l'innovazione includono:
- Intelligenza Artificiale e Machine Learning
- Automazione dei processi (RPA)
- Analisi predittiva e Business Intelligence
- Soluzioni cloud ibride e multi-cloud
- Internet of Things (IoT) industriale

## Key Takeaways Pratici

1. Iniziate con progetti pilota a basso rischio per testare nuove tecnologie
2. Investite nella formazione del personale per facilitare l'adozione
3. Stabilite metriche chiare per misurare il successo dell'innovazione
4. Collaborate con partner tecnologici esperti per accelerare l'implementazione
5. Mantenete un approccio agile e iterativo ai progetti di innovazione

## Conclusioni e Prospettive Future

L'innovazione aziendale non è più un'opzione ma una necessità strategica. Le organizzazioni che investono oggi nelle tecnologie emergenti saranno quelle che guideranno i mercati del futuro.`;

    const metadata = {
        title: "Innovazione Aziendale: Strategie per il Successo nel 2025",
        titleShort: "Innovazione Aziendale: Strategie 2025",
        slug: "innovazione-aziendale-strategie-successo-2025",
        excerpt: "Scopri le strategie più efficaci per implementare l'innovazione aziendale e mantenere un vantaggio competitivo nel panorama tecnologico del 2025.",
        readTime: 5,
        date: new Date().toLocaleDateString('it-IT'),
        dateISO: new Date().toISOString(),
        keywords: "innovazione, business, digital transformation, enterprise, ROI, automazione",
        originalTopic: "fallback"
    };
    
    const articleHTML = await createArticleHTML(fallbackContent, metadata);
    await saveArticle(articleHTML, metadata);
    await updateBlogFeed(metadata);
    await updateHomepagePreview(metadata);
    
    console.log('✅ Articolo fallback creato con successo');
}

if (require.main === module) {
    generateArticle().catch(error => {
        console.error('�� Errore fatale:', error);
        process.exit(1);
    });
}

module.exports = { generateArticle };
