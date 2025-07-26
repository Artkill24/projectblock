// scripts/generate-article.js - Enhanced with Revenue Optimization
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load affiliate products
const { HIGH_COMMISSION_PRODUCTS } = require('../config/affiliate-products.js');

// Enhanced content types with revenue focus
const CONTENT_TYPES = {
    'affiliate': {
        name: 'Recensione Affiliate High-Commission',
        prompt: 'Scrivi una recensione onesta e persuasiva',
        focus: 'conversion'
    },
    'comparison': {
        name: 'Confronto Prodotti',
        prompt: 'Crea un confronto dettagliato',
        focus: 'decision-making'
    },
    'ai-idea': {
        name: 'Idea Business AI',
        prompt: 'Sviluppa idea innovativa con business plan',
        focus: 'innovation'
    },
    'revenue-report': {
        name: 'Revenue Report Trasparente',
        prompt: 'Condividi risultati e strategie reali',
        focus: 'trust-building'
    }
};

async function generateRevenueOptimizedContent() {
    try {
        console.log('🚀 Generando contenuto ottimizzato per revenue...');
        
        const contentType = process.env.CONTENT_TYPE || 'affiliate';
        const focusProduct = process.env.FOCUS_PRODUCT || 'SEMrush';
        
        console.log(`📝 Tipo: ${CONTENT_TYPES[contentType].name}`);
        console.log(`🎯 Focus: ${focusProduct}`);
        
        let content, metadata;
        
        switch(contentType) {
            case 'affiliate':
                ({ content, metadata } = await generateAffiliateReview(focusProduct));
                break;
            case 'comparison':
                ({ content, metadata } = await generateComparison());
                break;
            case 'ai-idea':
                ({ content, metadata } = await generateAIIdea());
                break;
            case 'revenue-report':
                ({ content, metadata } = await generateRevenueReport());
                break;
            default:
                ({ content, metadata } = await generateAffiliateReview());
        }
        
        const html = await createConversionOptimizedHTML(content, metadata);
        await saveContent(html, metadata);
        await updateContentFeed(metadata);
        
        console.log('✅ Contenuto revenue-optimized generato!');
        console.log(`📊 Potenziale commissione: €${getCommissionByProduct(focusProduct)}`);
        
    } catch (error) {
        console.error('❌ Errore:', error.message);
    }
}

async function generateAffiliateReview(productName = 'SEMrush') {
    const product = HIGH_COMMISSION_PRODUCTS.find(p => p.name === productName) || HIGH_COMMISSION_PRODUCTS[0];
    
    const prompt = `Scrivi una recensione completa e onesta in ITALIANO per: "${product.name}"

INFORMAZIONI PRODOTTO:
- Nome: ${product.name}
- Categoria: ${product.category}
- Prezzo: ${product.price}
- Commissione: €${product.commission} per vendita

STRUTTURA RICHIESTA (usa ESATTAMENTE questa struttura):
# Recensione ${product.name}: Vale Davvero la Pena nel 2025?

## TL;DR - La Risposta Veloce
[Verdetto in 2-3 righe + CTA immediato]

## Cos'è ${product.name} e Perché Ne Parlano Tutti
[Introduzione coinvolgente del prodotto]

## Le Funzionalità Che Fanno la Differenza
[Lista dettagliata features principali]

## Pro e Contro Dopo 30 Giorni di Test
### ✅ Quello Che Mi Ha Convinto
[Vantaggi concreti e misurabili]

### ❌ I Limiti Da Conoscere
[Svantaggi onesti ma bilanciati]

## Prezzo: Vale l'Investimento?
[Analisi costo-beneficio dettagliata]

## Le Migliori Alternative da Considerare
[2-3 alternative con pro/contro]

## Il Mio Verdetto Finale
[Valutazione /10 e raccomandazione chiara]

## FAQ - Le Domande Più Frequenti
[4-5 FAQ comuni]

REQUISITI SPECIFICI:
- Tono professionale ma accessibile
- Include numeri e dati concreti quando possibile
- Sii onesto sui pro E contro
- Ottimizza per conversioni affiliate
- 1200-1500 parole
- Include keywords: ${product.keywords.join(', ')}
- Aggiungi esempi pratici d'uso
- Menciona ROI e risultati misurabili

Scrivi SOLO il contenuto markdown, senza note aggiuntive.`;

    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ 
        model: "gemini-2.0-flash-exp" 
    });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    const metadata = {
        title: `Recensione ${product.name}: Vale Davvero la Pena nel 2025?`,
        slug: `recensione-${product.name.toLowerCase().replace(/\s+/g, '-')}-2025`,
        excerpt: `Recensione completa di ${product.name} dopo 30 giorni di test. Scopri pro, contro, prezzo e se vale davvero l'investimento nel 2025.`,
        readTime: Math.ceil(content.split(' ').length / 200),
        date: new Date().toLocaleDateString('it-IT'),
        keywords: `recensione ${product.name}, ${product.keywords.join(', ')}, ${product.category.toLowerCase()}`,
        contentType: 'affiliate',
        product: product,
        commission: product.commission,
        affiliateLink: product.affiliateLink
    };
    
    return { content, metadata };
}

async function generateAIIdea() {
    const ideas = [
        "AI Personal Shopping Assistant con analisi trend real-time",
        "Sistema di traduzione vocale multilingue per meeting aziendali", 
        "AI Fitness Coach personalizzato con computer vision",
        "Piattaforma di matchmaking per collaborazioni business con ML"
    ];
    
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    
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

function getCommissionByProduct(productName) {
    const product = HIGH_COMMISSION_PRODUCTS.find(p => p.name === productName);
    return product ? product.commission : 0;
}

async function createConversionOptimizedHTML(content, metadata) {
    const templatePath = path.join(__dirname, '..', 'blog', 'template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Convert markdown to HTML with conversion optimizations
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
    
    // Add affiliate CTAs if it's an affiliate review
    let finalContent = htmlContent;
    if (metadata.contentType === 'affiliate' && metadata.affiliateLink) {
        const affiliateCTAs = `
        <!-- Early CTA -->
        <div style="background: linear-gradient(135deg, #fef3c7, #fbbf24); border: 2px solid #f59e0b; border-radius: 16px; padding: 25px; margin: 30px 0; text-align: center;">
            <h3 style="color: #92400e; margin-bottom: 10px;">🎯 TL;DR - Vuoi la risposta veloce?</h3>
            <p style="color: #78350f; margin-bottom: 15px;"><strong>${metadata.product.name} vale ogni centesimo se fai sul serio con ${metadata.product.category.toLowerCase()}</strong></p>
            <a href="${metadata.affiliateLink}" target="_blank" rel="nofollow" data-affiliate="true" data-product="${metadata.product.name}" data-commission="${metadata.commission}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; transition: all 0.3s ease;">
                🚀 Prova ${metadata.product.name} Gratis
            </a>
        </div>
        
        <!-- Mid-content CTA -->
        <div style="background: linear-gradient(135deg, #dbeafe, #3b82f6); border-radius: 16px; padding: 25px; margin: 40px 0; text-align: center;">
            <h3 style="color: #1e40af; margin-bottom: 10px;">💡 Il Mio Consiglio da Utente</h3>
            <p style="color: #1e3a8a; margin-bottom: 15px;">Dopo 30 giorni di test, ${metadata.product.name} è nel mio toolkit quotidiano</p>
            <div style="display: flex; justify-content: center; gap: 15px; margin: 15px 0; flex-wrap: wrap;">
                <span style="background: rgba(16, 185, 129, 0.1); color: #059669; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; font-weight: 600;">✅ 30 giorni garanzia</span>
                <span style="background: rgba(16, 185, 129, 0.1); color: #059669; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; font-weight: 600;">✅ Cancellazione 1-click</span>
                <span style="background: rgba(16, 185, 129, 0.1); color: #059669; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; font-weight: 600;">✅ Support 24/7</span>
            </div>
            <a href="${metadata.affiliateLink}" target="_blank" rel="nofollow" data-affiliate="true" data-product="${metadata.product.name}" data-commission="${metadata.commission}" style="display: inline-block; background: white; color: #1d4ed8; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                🎯 Inizia Trial Gratuito
            </a>
        </div>`;
        
        // Insert CTAs in strategic positions
        const contentParts = finalContent.split('</h2>');
        if (contentParts.length >= 3) {
            // Insert first CTA after second h2
            contentParts[1] += '</h2>' + affiliateCTAs.split('<!-- Mid-content CTA -->')[0];
            // Insert second CTA after fourth h2 (if exists)
            if (contentParts.length >= 5) {
                contentParts[3] += '</h2>' + affiliateCTAs.split('<!-- Mid-content CTA -->')[1];
            }
            finalContent = contentParts.join('</h2>');
        }
    }
    
    // Replace template placeholders
    const html = template
        .replace(/{{TITLE}}/g, metadata.title)
        .replace(/{{SLUG}}/g, metadata.slug)
        .replace(/{{EXCERPT}}/g, metadata.excerpt)
        .replace(/{{DATE}}/g, metadata.date)
        .replace(/{{read_TIME}}/g, metadata.readTime)
        .replace(/{{KEYWORDS}}/g, metadata.keywords)
        .replace(/{{CONTENT}}/g, finalContent);
    
    return html;
}

async function saveContent(html, metadata) {
    const contentDir = path.join(__dirname, '..', 'blog', metadata.slug);
    const contentPath = path.join(contentDir, 'index.html');
    
    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }
    
    fs.writeFileSync(contentPath, html, 'utf8');
    console.log(`💾 Contenuto salvato: ${contentPath}`);
}

async function updateContentFeed(metadata) {
    const feedPath = path.join(__dirname, '..', 'blog', 'feed.json');
    let feed = [];
    
    if (fs.existsSync(feedPath)) {
        try {
            feed = JSON.parse(fs.readFileSync(feedPath, 'utf8'));
        } catch (error) {
            feed = [];
        }
    }
    
    feed = feed.filter(item => item.slug !== metadata.slug);
    feed.unshift(metadata);
    feed = feed.slice(0, 50);
    
    fs.writeFileSync(feedPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log('📰 Feed aggiornato');
}

if (require.main === module) {
    generateRevenueOptimizedContent().catch(console.error);
}

module.exports = { generateRevenueOptimizedContent };
