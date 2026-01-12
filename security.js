/**
 * BIOLOS Security Scanner - JavaScript Implementation
 * Deteção de Vírus e Spam em tempo real
 */

class BiolosSecurityScanner {
    constructor() {
        this.spamKeywords = [
            'ganhe dinheiro rápido',
            'prémio acumulado',
            'clique aqui agora',
            'oferta exclusiva',
            'herança urgente',
            'viagra',
            'bitcoin profit',
            'investimento garantido',
            'você ganhou',
            'confirme sua conta',
            'atualizar dados bancários'
        ];

        this.dangerousExtensions = ['.exe', '.bat', '.scr', '.vbs', '.js', '.jar', '.zip', '.rar'];
        this.initSecurityUI();
    }

    /**
     * Inicializar a interface de segurança
     */
    initSecurityUI() {
        // Criar container de alertas se não existir
        if (!document.getElementById('security-alerts')) {
            const alertContainer = document.createElement('div');
            alertContainer.id = 'security-alerts';
            alertContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                z-index: 10000;
            `;
            document.body.appendChild(alertContainer);
        }
    }

    /**
     * Verificar se o texto contém spam
     */
    checkSpam(text) {
        if (!text) return { isSpam: false, score: 0 };

        let score = 0;
        const textLower = text.toLowerCase();

        for (const keyword of this.spamKeywords) {
            const regex = new RegExp(keyword, 'gi');
            const matches = textLower.match(regex);
            if (matches) {
                score += matches.length;
            }
        }

        return {
            isSpam: score >= 2,
            score: score,
            message: score >= 2 ? '⚠️ ALERTA: Conteúdo identificado como SPAM!' : 'Conteúdo seguro.'
        };
    }

    /**
     * Verificar se o ficheiro é perigoso
     */
    checkVirus(filename) {
        const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
        const isDangerous = this.dangerousExtensions.includes(extension);

        return {
            isVirus: isDangerous,
            extension: extension,
            message: isDangerous ? `🚨 PERIGO: O ficheiro "${filename}" pode conter VÍRUS!` : 'Ficheiro seguro.'
        };
    }

    /**
     * Analisar email completo
     */
    scanEmail(subject, body, attachments = []) {
        const spamResult = this.checkSpam(body + ' ' + subject);
        const virusResults = attachments.map(att => this.checkVirus(att));

        const hasVirus = virusResults.some(v => v.isVirus);
        const isSpam = spamResult.isSpam;

        return {
            status: hasVirus ? 'DANGER' : isSpam ? 'WARNING' : 'SAFE',
            spamAnalysis: spamResult,
            virusAnalysis: virusResults,
            summary: hasVirus ? 'Ação recomendada: Bloquear' : isSpam ? 'Ação recomendada: Mover para Spam' : 'Nenhuma ação necessária'
        };
    }

    /**
     * Mostrar alerta na página
     */
    showAlert(message, type = 'warning') {
        const alertContainer = document.getElementById('security-alerts');
        
        const alert = document.createElement('div');
        alert.style.cssText = `
            padding: 16px;
            margin-bottom: 10px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 600;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        if (type === 'danger') {
            alert.style.cssText += `
                background-color: #f8d7da;
                color: #721c24;
                border: 2px solid #f5c6cb;
            `;
        } else if (type === 'warning') {
            alert.style.cssText += `
                background-color: #fff3cd;
                color: #856404;
                border: 2px solid #ffeeba;
            `;
        } else if (type === 'success') {
            alert.style.cssText += `
                background-color: #d4edda;
                color: #155724;
                border: 2px solid #c3e6cb;
            `;
        }

        alert.textContent = message;
        alertContainer.appendChild(alert);

        // Remover alerta após 5 segundos
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }

    /**
     * Simular deteção de ameaça
     */
    simulateThreatDetection() {
        const threats = [
            { type: 'spam', message: '⚠️ Email de SPAM detetado!' },
            { type: 'virus', message: '🚨 Ficheiro suspeito detetado!' },
            { type: 'phishing', message: '🔒 Tentativa de PHISHING detetada!' }
        ];

        const randomThreat = threats[Math.floor(Math.random() * threats.length)];
        const alertType = randomThreat.type === 'virus' ? 'danger' : 'warning';
        
        this.showAlert(randomThreat.message, alertType);
    }

    /**
     * Analisar página em busca de conteúdo suspeito
     */
    analyzePageContent() {
        const bodyText = document.body.innerText;
        const spamCheck = this.checkSpam(bodyText);

        if (spamCheck.isSpam) {
            this.showAlert('⚠️ Conteúdo potencialmente suspeito detetado nesta página!', 'warning');
        }
    }
}

// Inicializar o scanner de segurança
const biolosSecurity = new BiolosSecurityScanner();

// Analisar página ao carregar
window.addEventListener('load', () => {
    biolosSecurity.analyzePageContent();
});

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
