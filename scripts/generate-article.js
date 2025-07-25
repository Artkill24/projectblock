const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Configurazione tipi di contenuto
const CONTENT_TYPES = {
    'article': {
        name: 'Articolo Informativo',
        prompt: 'Scrivi un articolo informativo professionale',
        template: 'article-template.html'
    },
    'affiliate': {
        name: 'Recensione Affiliate',
        prompt: 'Scrivi una recensione dettagliata per prodotto affiliate',
        template: 'affiliate-template.html'
    },
    'ai-idea': {
        name: 'Idea Innovativa AI',
        prompt: 'Sviluppa una idea di business innovativa basata su AI',
        template: 'ai-idea-template.html'
    },
    'comparison': {
        name: 'Confronto Prodotti',
        prompt: 'Crea un confronto dettagliato tra prodotti/servizi',
        template: 'comparison-template.html'
    }
};

// Prodotti affiliate da recensire
const AFFILIATE_PRODUCTS = [
    {
        name: "ChatGPT Plus",
        category: "AI Tools",
        price: "$20/mese",
        commission: "Non disponibile",
        affiliateLink: "https://openai.com/chatgpt/pricing",
        keywords: ["AI", "chatbot", "produttivita", "writing"]
    },
    {
        name: "Notion AI",
        category: "Productivity",
        price: "€8/mese", 
        commission: "30%",
        affiliateLink: "https://affiliate.notion.so/yourcode",
        keywords: ["notion", "AI", "productivity", "database"]
    },
    {
        name: "Canva Pro",
        category: "Design",
        price: "€11.99/mese",
        commission: "40%", 
        affiliateLink: "https://partner.canva.com/yourcode",
        keywords: ["design", "templates", "graphics", "marketing"]
    }
];

// Idee AI da sviluppare
const AI_IDEAS_POOL = [
    "AI Personal Shopping Assistant con analisi trend real-time",
    "Sistema di traduzione vocale multilingue per meeting aziendali", 
    "AI Fitness Coach personalizzato con computer vision",
    "Piattaforma di matchmaking per collaborazioni business con ML",
    "AI Content Moderator per social media con sentiment analysis",
    "Sistema di previsione prezzi crypto basato su news sentiment",
    "AI Email Assistant per rispondere automaticamente a clienti",
    "Piattaforma di ottimizzazione SEO con AI content generation"
];

async function generateContent() {
    try {
        console.log('🚀 Avviando generazione contenuto intelligente...');
        
        // Scegli tipo di contenuto in base al giorno o parametri
        const contentType = chooseContentType();
        console.log(`📝 Tipo selezionato: ${CONTENT_TYPES[contentType].name}`);
        
        let content, metadata;
        
        switch(contentType) {
            case 'affiliate':
                ({ content, metadata } = await generateAffiliateReview());
                break;
            case 'ai-idea':
                ({ content, metadata } = await generateAIIdea());
                break;
            case 'comparison':
                ({ content, metadata } = await generateComparison());
                break;
            default:
                ({ content, metadata } = await generateArticle());
        }
        
        const html = await createContentHTML(content, metadata, contentType);
        await saveContent(html, metadata, contentType);
        await updateContentFeed(metadata, contentType);
        
        console.log('✅ Contenuto generato con successo!');
        console.log(`📂 Tipo: ${contentType} | Slug: ${metadata.slug}`);
        
    } catch (error) {
        console.error('❌ Errore generazione:', error.message);
        await createFallbackContent();
    }
}

function chooseContentType() {
    const dayOfWeek = new Date().getDay();
    const customType = process.env.CONTENT_TYPE;
    
    if (customType && CONTENT_TYPES[customType]) {
        return customType;
    }
    
    // Rotazione automatica basata su giorno settimana
    const schedule = {
        0: 'ai-idea',      // Domenica - Idee innovative
        1: 'article',      // Lunedì - Articoli informativi  
        2: 'affiliate',    // Martedì - Recensioni affiliate
        3: 'article',      // Mercoledì - Articoli
        4: 'comparison',   // Giovedì - Confronti
        5: 'affiliate',    // Venerdì - Affiliate review
        6: 'ai-idea'       // Sabato - Idee AI
    };
    
    return schedule[dayOfWeek] || 'article';
}

async function generateAffiliateReview() {
    const product = AFFILIATE_PRODUCTS[Math.floor(Math.random() * AFFILIATE_PRODUCTS.length)];
    
    const prompt = `Scrivi una recensione dettagliata e onesta in ITALIANO per: "${product.name}"

INFORMAZIONI PRODOTTO:
- Nome: ${product.name}
- Categoria: ${product.category}  
- Prezzo: ${product.price}
- Commissione affiliate: ${product.commission}

STRUTTURA RICHIESTA:
# Recensione ${product.name}: Vale la Pena nel 2025?

## Cosa è ${product.name}
[Spiegazione del prodotto/servizio]

## Caratteristiche Principali
[Lista delle features chiave]

## Pro e Contro
### ✅ Vantaggi
[Lista vantaggi concreti]

### ❌ Svantaggi  
[Lista svantaggi onesti]

## Prezzi e Piani
[Analisi costi-benefici]

## Alternative da Considerare
[2-3 alternative valide]

## Verdetto Finale
[Valutazione numerica /10 e raccomandazione]

## FAQ
[3-4 domande frequenti]

REQUISITI:
- Tono onesto ma persuasivo
- Include pro E contro reali
- Menziona prezzo e valore
- Ottimizzato per conversioni
- 1000-1200 parole
- Keywords: ${product.keywords.join(', ')}

Scrivi SOLO il contenuto markdown, senza note aggiuntive.`;

    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ 
        model: "gemini-2.0-flash-exp" 
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    const metadata = {
        title: `Recensione ${product.name}: Vale la Pena nel 2025?`,
        slug: `recensione-${product.name.toLowerCase().replace(/\s+/g, '-')}-2025`,
        excerpt: `Recensione completa e onesta di ${product.name}. Scopri pro, contro, prezzi e se vale davvero la pena nel 2025.`,
        readTime: Math.ceil(content.split(' ').length / 200),
        date: new Date().toLocaleDateString('it-IT'),
        keywords: `recensione ${product.name}, ${product.keywords.join(', ')}, affiliate`,
        contentType: 'affiliate', 
        product: product,
        affiliateLink: product.affiliateLink
    };
    
    return { content, metadata };
}

async function generateAIIdea() {
    const idea = AI_IDEAS_POOL[Math.floor(Math.random() * AI_IDEAS_POOL.length)];
    
    const prompt = `Sviluppa completamente questa idea di business AI in ITALIANO: "${idea}"

STRUTTURA RICHIESTA:
# ${idea}: Analisi Business Completa

## Executive Summary
[Riassunto da investitore - problema, soluzione, mercato]

## Problema e Opportunità di Mercato  
[Analisi del problema specifico e dimensioni mercato]

## Soluzione Proposta
[Come l'AI risolve il problema in modo innovativo]

## Tecnologie e Implementazione
[Tech stack dettagliato, API, modelli AI necessari]

## Business Model e Monetizzazione
[Fonti di ricavo, pricing, strategia go-to-market]

## Analisi Competitiva
[Competitor esistenti e vantaggio competitivo]

## Roadmap di Sviluppo
[Timeline 6-12 mesi con milestone specifici]

## Team e Risorse Necessarie
[Competenze richieste, budget iniziale stimato]

## Proiezioni Finanziarie
[Revenue projection anni 1-3, break-even point]

## Rischi e Mitigazioni
[Principali rischi tecnici/business e come gestirli]

## Potenziale di Exit
[Possibili acquirenti, valutazione stimata]

REQUISITI:
- Realismo tecnico e di mercato
- Numeri concreti quando possibile  
- Considera trend attuali AI
- 1200-1500 parole
- Linguaggio da pitch deck

Scrivi SOLO il contenuto markdown.`;

    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ 
        model: "gemini-2.0-flash-exp" 
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    const metadata = {
        title: `${idea}: Analisi Business Completa`,
        slug: `idea-ai-${idea.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 50)}`,
        excerpt: `Analisi completa di business per l'idea AI: ${idea}. Mercato, tecnologie, business model e proiezioni finanziarie.`,
        readTime: Math.ceil(content.split(' ').length / 200),
        date: new Date().toLocaleDateString('it-IT'),
        keywords: `startup AI, ${idea.split(' ').slice(0, 3).join(', ')}, business plan, intelligenza artificiale`,
        contentType: 'ai-idea',
        aiIdea: idea
    };
    
    return { content, metadata };
}

async function generateComparison() {
    const comparisons = [
        { products: ["ChatGPT Plus", "Claude Pro"], category: "AI Assistants" },
        { products: ["Notion", "Obsidian"], category: "Note Taking" },
        { products: ["Canva Pro", "Adobe Creative Suite"], category: "Design Tools" }
    ];
    
    const comparison = comparisons[Math.floor(Math.random() * comparisons.length)];
    
    const prompt = `Crea un confronto dettagliato in ITALIANO tra: ${comparison.products.join(' vs ')}

STRUTTURA RICHIESTA:
# ${comparison.products.join(' vs ')}: Il Confronto Definitivo 2025

## Introduzione
[Perché questo confronto è importante]

## Overview Prodotti
### ${comparison.products[0]}
[Descrizione completa prodotto 1]

### ${comparison.products[1]}  
[Descrizione completa prodotto 2]

## Confronto Caratteristiche
[Tabella dettagliata features]

## Prezzi e Piani
[Analisi costi per ogni opzione]

## Performance e Usabilità
[Test pratici e esperienza utente]

## Pro e Contro
### ${comparison.products[0]}
**Pro:** [Lista vantaggi]
**Contro:** [Lista svantaggi]

### ${comparison.products[1]}
**Pro:** [Lista vantaggi] 
**Contro:** [Lista svantaggi]

## Casi d'Uso Specifici
[Quando scegliere uno o l'altro]

## Verdetto Finale
[Raccomandazione basata su profilo utente]

## FAQ Comparison
[Domande comuni sul confronto]

REQUISITI:
- Imparziale ma utile per decisione
- Dati concreti su prezzi/features
- Esempi pratici d'uso
- 1000-1300 parole
- Aiuta nella scelta

Scrivi SOLO il contenuto markdown.`;

    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ 
        model: "gemini-2.0-flash-exp" 
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    const metadata = {
        title: `${comparison.products.join(' vs ')}: Il Confronto Definitivo 2025`,
        slug: `confronto-${comparison.products.join('-vs-').toLowerCase().replace(/\s+/g, '-')}`,
        excerpt: `Confronto completo tra ${comparison.products.join(' e ')}. Caratteristiche, prezzi, pro e contro per aiutarti nella scelta.`,
        readTime: Math.ceil(content.split(' ').length / 200),
        date: new Date().toLocaleDateString('it-IT'),
        keywords: `${comparison.products.join(' vs ')}, confronto, ${comparison.category.toLowerCase()}`,
        contentType: 'comparison',
        products: comparison.products
    };
    
    return { content, metadata };
}

async function generateArticle() {
    // Codice originale per articoli informativi
    const topics = [
        "Trend AI Marketing 2025",
        "Automazione Business con AI", 
        "Strumenti No-Code per Startup",
        "Growth Hacking con Intelligenza Artificiale"
    ];
    
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    // ... resto del codice articolo originale
    const content = "# Contenuto articolo standard...";
    const metadata = {
        title: topic,
        slug: topic.toLowerCase().replace(/\s+/g, '-'),
        excerpt: `Guida completa su ${topic} con strategie pratiche e casi studio.`,
        readTime: 7,
        date: new Date().toLocaleDateString('it-IT'),
        keywords: topic.toLowerCase(),
        contentType: 'article'
    };
    
    return { content, metadata };
}

// Resto delle funzioni (createContentHTML, saveContent, etc.)
async function createContentHTML(content, metadata, contentType) {
    const templateName = CONTENT_TYPES[contentType]?.template || 'template.html';
    const templatePath = path.join(__dirname, '..', 'blog', templateName);
    
    // Se template specifico non esiste, usa quello generale
    const finalTemplatePath = fs.existsSync(templatePath) ? 
        templatePath : 
        path.join(__dirname, '..', 'blog', 'template.html');
    
    const template = fs.readFileSync(finalTemplatePath, 'utf8');
    
    // Processamento HTML del contenuto
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
    
    let html = template
        .replace(/{{TITLE}}/g, metadata.title)
        .replace(/{{SLUG}}/g, metadata.slug)
        .replace(/{{EXCERPT}}/g, metadata.excerpt)
        .replace(/{{DATE}}/g, metadata.date)
        .replace(/{{read_TIME}}/g, metadata.readTime)
        .replace(/{{KEYWORDS}}/g, metadata.keywords)
        .replace(/{{CONTENT}}/g, htmlContent);
    
    // Aggiungi elementi specifici per affiliate
    if (contentType === 'affiliate' && metadata.affiliateLink) {
        const affiliateCTA = `
        <div class="affiliate-cta" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 16px; text-align: center; margin: 40px 0;">
            <h3 style="margin-bottom: 15px; color: white;">🚀 Prova ${metadata.product.name}</h3>
            <p style="margin-bottom: 25px; opacity: 0.9;">Inizia oggi con ${metadata.product.name} e scopri tutti i vantaggi</p>
            <a href="${metadata.affiliateLink}" target="_blank" rel="nofollow" class="affiliate-btn" style="background: white; color: #059669; padding: 16px 32px; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1em; text-decoration: none; display: inline-block; transition: all 0.3s ease;">
                Prova Gratis ${metadata.product.name} →
            </a>
            <div style="margin-top: 15px; font-size: 0.9em; opacity: 0.8;">
                💰 Link affiliato - Supporti il nostro lavoro senza costi extra
            </div>
        </div>`;
        
        html = html.replace('{{CONTENT}}', htmlContent + affiliateCTA);
    }
    
    return html;
}

async function saveContent(html, metadata, contentType) {
    const contentDir = path.join(__dirname, '..', 'blog', metadata.slug);
    const contentPath = path.join(contentDir, 'index.html');
    
    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }
    
    fs.writeFileSync(contentPath, html, 'utf8');
    console.log(`💾 ${CONTENT_TYPES[contentType].name} salvato: ${contentPath}`);
}

async function updateContentFeed(metadata, contentType) {
    const feedPath = path.join(__dirname, '..', 'blog', 'feed.json');
    let feed = [];
    
    if (fs.existsSync(feedPath)) {
        try {
            feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
        } catch (error) {
            console.warn('⚠️ Errore parsing feed, creando nuovo');
            feed = [];
        }
    }
    
    const contentEntry = {
        title: metadata.title,
        slug: metadata.slug,
        excerpt: metadata.excerpt,
        date: metadata.date,
        readTime: metadata.readTime,
        contentType: contentType,
        ...(metadata.product && { product: metadata.product }),
        ...(metadata.affiliateLink && { affiliateLink: metadata.affiliateLink })
    };
    
    // Rimuovi duplicati e aggiungi nuovo contenuto
    feed = feed.filter(item => item.slug !== metadata.slug);
    feed.unshift(contentEntry);
    feed = feed.slice(0, 50); // Mantieni ultimi 50 contenuti
    
    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log(`📰 Feed aggiornato con ${CONTENT_TYPES[contentType].name}`);
}

async function createFallbackContent() {
    console.log('🔄 Creando contenuto di fallback...');
    // Implementa fallback semplice
}

// Esecuzione
if (require.main === module) {
    generateContent().catch(error => {
        console.error('💥 Errore fatale:', error.message);
        process.exit(1);
    });
}

module.exports = { generateContent, CONTENT_TYPES, AFFILIATE_PRODUCTS };
