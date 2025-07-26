const fs = require('fs');
const path = require('path');

const emailCaptureHTML = `
<!-- 🎁 EMAIL CAPTURE POPUP OTTIMIZZATO -->
<div id="emailPopup" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; backdrop-filter: blur(5px);">
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <button onclick="closeEmailPopup()" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        
        <div style="text-align: center;">
            <h2 style="color: #1e293b; margin-bottom: 15px; font-size: 1.8em;">🚀 Sblocca i Segreti del Revenue AI</h2>
            <p style="color: #64748b; margin-bottom: 25px; font-size: 1.1em;">Ricevi GRATIS: "Come Guadagnare €2000+/mese con AI Tools"</p>
            
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h4 style="color: #3b82f6; margin-bottom: 10px;">🎁 Incluso nella Guida:</h4>
                <ul style="text-align: left; color: #374151; line-height: 1.6; list-style: none; padding: 0;">
                    <li>✅ 47 AI Tools che generano revenue reale</li>
                    <li>✅ Strategie affiliate da €5K+/mese</li>
                    <li>✅ Template conversioni testati</li>
                    <li>✅ Accesso community esclusiva ProjectBlock</li>
                </ul>
            </div>
            
            <form onsubmit="submitEmail(event)" style="margin-top: 25px;">
                <input type="email" id="emailInput" placeholder="La tua email migliore..." required style="width: 100%; padding: 15px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1.1em; margin-bottom: 15px;">
                <button type="submit" style="width: 100%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1em; cursor: pointer; transition: all 0.3s ease;">
                    📩 Scarica Guida GRATIS Ora
                </button>
            </form>
            
            <p style="font-size: 0.9em; color: #94a3b8; margin-top: 15px;">💡 Zero spam. Solo strategie profitable. Unsubscribe quando vuoi.</p>
        </div>
    </div>
</div>

<script>
let emailCaptured = localStorage.getItem('projectblock_email_captured') === 'true';
let popupShown = false;

// Show popup after 30 seconds OR 50% scroll
if (!emailCaptured) {
    setTimeout(showEmailPopup, 30000);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50 && !popupShown && !emailCaptured) {
            showEmailPopup();
        }
    });
}

function showEmailPopup() {
    if (emailCaptured || popupShown) return;
    popupShown = true;
    document.getElementById('emailPopup').style.display = 'block';
    
    // Track popup shown
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_popup_shown', {
            'page_location': window.location.href
        });
    }
}

function closeEmailPopup() {
    document.getElementById('emailPopup').style.display = 'none';
}

function submitEmail(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    
    // Save email capture
    localStorage.setItem('projectblock_email_captured', 'true');
    localStorage.setItem('projectblock_user_email', email);
    
    // Track conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'email_capture', {
            'method': 'popup',
            'value': 5.00,
            'currency': 'EUR'
        });
    }
    
    // Success message
    document.querySelector('#emailPopup > div').innerHTML = \`
        <div style="text-align: center; padding: 40px;">
            <h2 style="color: #10b981; margin-bottom: 15px;">🎉 Fantastico!</h2>
            <p style="margin-bottom: 20px; font-size: 1.2em;">La tua guida AI Revenue è in arrivo!</p>
            <p style="color: #64748b; margin-bottom: 25px;">Controlla la tua email nei prossimi 5 minuti</p>
            <button onclick="closeEmailPopup()" style="background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                Continua a Leggere →
            </button>
        </div>
    \`;
    
    setTimeout(closeEmailPopup, 4000);
}
</script>`;

// Add to all templates
const files = ['index.html', 'blog/template.html'];
files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('emailPopup')) {
            content = content.replace('</body>', emailCaptureHTML + '\n</body>');
            fs.writeFileSync(filePath, content);
            console.log(`✅ Email capture aggiunto a ${file}`);
        }
    }
});

console.log('📧 Email capture system attivato!');
