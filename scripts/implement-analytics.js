// scripts/implement-analytics.js
const fs = require('fs');
const path = require('path');

// 🎯 ANALYTICS SETUP COMPLETO
const ANALYTICS_CONFIG = {
    gaId: 'GT-MRM7BGZ', // Il tuo ID Google Analytics
    events: {
        affiliate_click: 'Affiliate Click',
        email_capture: 'Email Captured', 
        content_view: 'Article View',
        cta_click: 'CTA Click',
        social_share: 'Social Share'
    }
};

// 📊 SCRIPT ANALYTICS AVANZATO
const advancedAnalyticsScript = `
<!-- 🎯 PROJECTBLOCK REVENUE TRACKING SYSTEM -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${ANALYTICS_CONFIG.gaId}', {
    // Enhanced E-commerce per tracking revenue
    custom_map: {
      'custom_parameter_1': 'affiliate_product',
      'custom_parameter_2': 'commission_value'
    }
  });

  // 💰 AFFILIATE CLICK TRACKING AVANZATO
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 ProjectBlock Analytics Loading...');
    
    // Track all affiliate links
    document.querySelectorAll('a[href*="semrush"], a[href*="systeme.io"], a[href*="jasper"], a[href*="convertkit"], a[data-affiliate="true"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const productName = this.dataset.product || extractProductFromUrl(this.href);
        const commissionValue = this.dataset.commission || getCommissionByProduct(productName);
        
        // Track affiliate click
        gtag('event', 'affiliate_click', {
          'product_name': productName,
          'commission_potential': commissionValue,
          'link_url': this.href,
          'page_title': document.title,
          'page_location': window.location.href,
          'click_text': this.textContent.trim()
        });
        
        // Enhanced E-commerce event
        gtag('event', 'select_promotion', {
          'creative_name': productName + '_affiliate',
          'creative_slot': 'affiliate_link',
          'promotion_id': productName.toLowerCase(),
          'promotion_name': productName + ' Affiliate'
        });
        
        console.log('💰 Affiliate click tracked:', productName, commissionValue);
        
        // Visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = 'scale(1)', 150);
      });
    });
    
    // 📧 EMAIL CAPTURE TRACKING
    const emailForm = document.getElementById('emailCaptureForm');
    if (emailForm) {
      emailForm.addEventListener('submit', function(e) {
        const email = document.getElementById('emailInput').value;
        
        gtag('event', 'email_capture', {
          'method': 'popup',
          'page_title': document.title,
          'page_location': window.location.href,
          'value': 5.00, // Estimated lifetime value
          'currency': 'EUR'
        });
        
        gtag('event', 'generate_lead', {
          'currency': 'EUR',
          'value': 5.00
        });
        
        console.log('📧 Email capture tracked:', email);
      });
    }
    
    // 👁️ CONTENT ENGAGEMENT TRACKING
    let readTime = 0;
    const startTime = Date.now();
    
    // Track reading time every 30 seconds
    setInterval(() => {
      readTime += 30;
      if (readTime % 60 === 0) { // Every minute
        gtag('event', 'page_view_time', {
          'time_spent': readTime,
          'content_type': getContentType(),
          'page_title': document.title
        });
      }
    }, 30000);
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(() => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        gtag('event', 'scroll', {
          'percent_scrolled': scrollPercent,
          'page_title': document.title
        });
      }
    }, 1000));
    
    // 🎯 CTA BUTTON TRACKING
    document.querySelectorAll('.cta-btn, .primary-btn, .affiliate-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        gtag('event', 'cta_click', {
          'cta_text': this.textContent.trim(),
          'cta_position': getCTAPosition(this),
          'page_title': document.title
        });
      });
    });
    
    console.log('✅ ProjectBlock Analytics Ready!');
  });
  
  // 🔧 UTILITY FUNCTIONS
  function extractProductFromUrl(url) {
    if (url.includes('semrush')) return 'SEMrush';
    if (url.includes('systeme.io')) return 'Systeme.io';
    if (url.includes('jasper')) return 'Jasper AI';
    if (url.includes('convertkit')) return 'ConvertKit';
    if (url.includes('canva')) return 'Canva Pro';
    if (url.includes('clickup')) return 'ClickUp';
    return 'Unknown Product';
  }
  
  function getCommissionByProduct(product) {
    const commissions = {
      'SEMrush': 40.00,
      'Systeme.io': 58.00,
      'Jasper AI': 14.70,
      'ConvertKit': 7.50,
      'Canva Pro': 4.80,
      'ClickUp': 3.00
    };
    return commissions[product] || 0;
  }
  
  function getContentType() {
    if (window.location.href.includes('/blog/')) {
      if (document.querySelector('[data-content-type]')) {
        return document.querySelector('[data-content-type]').dataset.contentType;
      }
      return 'blog_article';
    }
    return 'homepage';
  }
  
  function getCTAPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollPercent = Math.round((window.scrollY + rect.top) / document.body.scrollHeight * 100);
    return \`\${scrollPercent}%_from_top\`;
  }
  
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
</script>

<!-- 🔥 HOTJAR HEATMAP TRACKING -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3574829,hjsv:6}; // Free Hotjar ID - sostituisci con il tuo
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>

<!-- 📱 FACEBOOK PIXEL (opzionale per retargeting) -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'TUO_PIXEL_ID_QUI'); // Sostituisci con il tuo Pixel ID
  fbq('track', 'PageView');
</script>`;

// 🎯 IMPLEMENTAZIONE AUTOMATICA
async function implementAnalytics() {
  console.log('🎯 Implementando Analytics avanzato...');
  
  // 1. Aggiorna template principale
  const templatePath = path.join(__dirname, '..', 'blog', 'template.html');
  if (fs.existsSync(templatePath)) {
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Rimuovi analytics esistenti se presenti
    template = template.replace(/<!-- Google tag[\s\S]*?<\/script>/g, '');
    template = template.replace(/<!-- Google Analytics[\s\S]*?<\/script>/g, '');
    
    // Aggiungi nuovo analytics script
    template = template.replace('</head>', `${advancedAnalyticsScript}\n</head>`);
    
    fs.writeFileSync(templatePath, template);
    console.log('✅ Template aggiornato con analytics avanzato');
  }
  
  // 2. Aggiorna homepage
  const homepagePath = path.join(__dirname, '..', 'index.html');
  if (fs.existsSync(homepagePath)) {
    let homepage = fs.readFileSync(homepagePath, 'utf8');
    
    if (!homepage.includes('gtag')) {
      homepage = homepage.replace('</head>', `${advancedAnalyticsScript}\n</head>`);
      fs.writeFileSync(homepagePath, homepage);
      console.log('✅ Homepage aggiornata con analytics');
    }
  }
  
  // 3. Aggiorna articoli esistenti
  const blogDir = path.join(__dirname, '..', 'blog');
  if (fs.existsSync(blogDir)) {
    const articleDirs = fs.readdirSync(blogDir).filter(dir => 
      fs.statSync(path.join(blogDir, dir)).isDirectory()
    );
    
    for (const articleDir of articleDirs) {
      const articlePath = path.join(blogDir, articleDir, 'index.html');
      if (fs.existsSync(articlePath)) {
        let article = fs.readFileSync(articlePath, 'utf8');
        
        if (!article.includes('gtag')) {
          article = article.replace('</head>', `${advancedAnalyticsScript}\n</head>`);
          fs.writeFileSync(articlePath, article);
          console.log(`✅ Articolo ${articleDir} aggiornato`);
        }
      }
    }
  }
  
  // 4. Crea dashboard analytics
  await createAnalyticsDashboard();
  
  console.log('🎉 Analytics implementation completata!');
}

// 📊 DASHBOARD ANALYTICS REAL-TIME
async function createAnalyticsDashboard() {
  const dashboardHTML = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Analytics Dashboard - ProjectBlock</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 20px; }
        .dashboard { max-width: 1400px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .metric-card { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 16px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); }
        .metric-value { font-size: 2.5em; font-weight: 700; color: #10b981; margin-bottom: 10px; }
        .metric-label { color: rgba(255,255,255,0.8); font-size: 1.1em; }
        .metric-change { font-size: 0.9em; margin-top: 5px; }
        .positive { color: #10b981; }
        .negative { color: #ef4444; }
        .chart-container { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 16px; margin: 20px 0; }
        .goal-item { background: rgba(59, 130, 246, 0.1); padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .status-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 10px; }
        .status-active { background: #10b981; }
        .status-inactive { background: #ef4444; }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>📊 ProjectBlock Analytics Dashboard</h1>
            <p>Real-time revenue & conversion tracking</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value" id="dailyRevenue">€0</div>
                <div class="metric-label">Revenue Oggi</div>
                <div class="metric-change positive" id="revenueChange">+0%</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value" id="affiliateClicks">0</div>
                <div class="metric-label">Click Affiliate</div>
                <div class="metric-change positive" id="clicksChange">+0</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value" id="emailCaptures">0</div>
                <div class="metric-label">Email Catturate</div>
                <div class="metric-change positive" id="emailChange">+0</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value" id="conversionRate">0%</div>
                <div class="metric-label">Conversion Rate</div>
                <div class="metric-change positive" id="conversionChange">+0%</div>
            </div>
        </div>
        
        <div class="chart-container">
            <h2>🎯 Goals Tracking</h2>
            <div id="goalsContainer">
                <div class="goal-item">
                    <span class="status-indicator status-active"></span>
                    <strong>Email Capture</strong> - €5.00
                    <br><small>User subscribes to newsletter</small>
                </div>
                <div class="goal-item">
                    <span class="status-indicator status-active"></span>
                    <strong>Affiliate Click - High Value</strong> - €2.00
                    <br><small>Click on affiliate link >€30 commission</small>
                </div>
                <div class="goal-item">
                    <span class="status-indicator status-active"></span>
                    <strong>Content Engagement</strong> - €0.50
                    <br><small>User reads for 2+ minutes</small>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <h2>💰 Affiliate Performance</h2>
            <div id="affiliatePerformance">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 8px;">
                        <h4>SEMrush</h4>
                        <p>Clicks: <span id="semrushClicks">0</span></p>
                        <p>Revenue: €<span id="semrushRevenue">0</span></p>
                    </div>
                    <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 8px;">
                        <h4>Systeme.io</h4>
                        <p>Clicks: <span id="systemeClicks">0</span></p>
                        <p>Revenue: €<span id="systemeRevenue">0</span></p>
                    </div>
                    <div style="background: rgba(168, 85, 247, 0.1); padding: 20px; border-radius: 8px;">
                        <h4>Jasper AI</h4>
                        <p>Clicks: <span id="jasperClicks">0</span></p>
                        <p>Revenue: €<span id="jasperRevenue">0</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Simulate real-time data (integrate with Google Analytics Reporting API)
        function updateDashboard() {
            // Demo data - sostituisci con dati reali da GA4
            document.getElementById('dailyRevenue').textContent = '€' + (Math.random() * 500 + 100).toFixed(0);
            document.getElementById('affiliateClicks').textContent = Math.floor(Math.random() * 50 + 10);
            document.getElementById('emailCaptures').textContent = Math.floor(Math.random() * 20 + 5);
            document.getElementById('conversionRate').textContent = (Math.random() * 5 + 1).toFixed(1) + '%';
        }
        
        // Update every 30 seconds
        setInterval(updateDashboard, 30000);
        updateDashboard();
        
        console.log('📊 Analytics Dashboard loaded');
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'analytics-dashboard.html'), dashboardHTML);
  console.log('✅ Analytics dashboard creato');
}

// 🚀 ESECUZIONE
if (require.main === module) {
  implementAnalytics().then(() => {
    console.log('');
    console.log('🎉 ANALYTICS SETUP COMPLETATO!');
    console.log('📊 DASHBOARD: http://localhost:8000/analytics-dashboard.html');
    console.log('🎯 GOOGLE ANALYTICS: https://analytics.google.com');
    console.log('💰 PROSSIMO: Setup Goals in GA4 per tracking conversioni');
  });
}

module.exports = { implementAnalytics, ANALYTICS_CONFIG };
