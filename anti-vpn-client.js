/**
 * BIOLOS Anti-VPN/Proxy Client - Bloqueio em Tempo Real
 * Detecta e bloqueia acessos via VPN/Proxy INSTANTANEAMENTE
 */

class BiolosAntiVPNClient {
    constructor() {
        this.apiEndpoints = [
            'https://ipapi.co/json/',
            'https://ip-api.com/json/?fields=proxy,hosting',
            'https://api.abuseipdb.com/api/v2/check'
        ];
        this.vpnDetected = false;
        this.checkInProgress = false;
        this.init();
    }

    /**
     * Inicializar o bloqueio
     */
    init() {
        // Executar verificação imediatamente
        this.detectVPN();
    }

    /**
     * Detectar VPN/Proxy usando múltiplas APIs
     */
    async detectVPN() {
        if (this.checkInProgress) return;
        this.checkInProgress = true;

        try {
            // Tentar primeira API (ipapi.co)
            const result = await this.checkWithIpApi();
            
            if (result.isVPN) {
                this.blockAccess(result);
                return;
            }

            // Se a primeira falhar, tentar segunda (ip-api.com)
            const result2 = await this.checkWithIpApiCom();
            
            if (result2.isVPN) {
                this.blockAccess(result2);
                return;
            }

            console.log('✅ IP seguro - Acesso permitido');
        } catch (error) {
            console.error('Erro na verificação de VPN:', error);
            // Em caso de erro, permitir acesso (fallback seguro)
        } finally {
            this.checkInProgress = false;
        }
    }

    /**
     * Verificar com ipapi.co
     */
    async checkWithIpApi() {
        try {
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();

            const isVPN = data.is_vpn === true || data.is_proxy === true;
            
            return {
                isVPN: isVPN,
                ip: data.ip,
                provider: data.org || 'Desconhecido',
                country: data.country_name || 'Desconhecido',
                reason: data.is_vpn ? 'VPN Detectada' : data.is_proxy ? 'Proxy Detectado' : null
            };
        } catch (error) {
            console.warn('ipapi.co não disponível:', error);
            return { isVPN: false };
        }
    }

    /**
     * Verificar com ip-api.com
     */
    async checkWithIpApiCom() {
        try {
            const response = await fetch('https://ip-api.com/json/?fields=query,proxy,hosting,org', {
                method: 'GET'
            });
            const data = await response.json();

            const isVPN = data.proxy === true || data.hosting === true;
            
            return {
                isVPN: isVPN,
                ip: data.query,
                provider: data.org || 'Desconhecido',
                reason: data.proxy ? 'Proxy Detectado' : data.hosting ? 'Data Center Detectado' : null
            };
        } catch (error) {
            console.warn('ip-api.com não disponível:', error);
            return { isVPN: false };
        }
    }

    /**
     * Bloquear acesso à página
     */
    blockAccess(vpnInfo) {
        this.vpnDetected = true;
        
        console.warn('🚫 VPN/PROXY DETECTADO - BLOQUEANDO ACESSO');
        console.warn('IP:', vpnInfo.ip);
        console.warn('Razão:', vpnInfo.reason);
        console.warn('Provider:', vpnInfo.provider);

        // Criar página de bloqueio
        this.showBlockPage(vpnInfo);
    }

    /**
     * Mostrar página de bloqueio
     */
    showBlockPage(vpnInfo) {
        // Limpar o conteúdo da página
        document.documentElement.innerHTML = '';
        document.body.innerHTML = '';

        // Criar HTML de bloqueio
        const blockHTML = `
            <!DOCTYPE html>
            <html lang="pt-PT">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Acesso Bloqueado - BIOLOS</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        padding: 20px;
                    }
                    
                    .container {
                        max-width: 600px;
                        text-align: center;
                    }
                    
                    .error-card {
                        background: #ffffff;
                        border-radius: 16px;
                        padding: 40px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        animation: slideUp 0.5s ease;
                    }
                    
                    .error-icon {
                        font-size: 80px;
                        margin-bottom: 20px;
                        animation: shake 0.5s ease-in-out;
                    }
                    
                    .error-card h1 {
                        color: #dc3545;
                        font-size: 32px;
                        margin: 0 0 16px 0;
                    }
                    
                    .error-card p {
                        color: #666;
                        font-size: 16px;
                        line-height: 1.6;
                        margin: 12px 0;
                    }
                    
                    .reason-box {
                        background: rgba(220, 53, 69, 0.1);
                        border-left: 4px solid #dc3545;
                        padding: 16px;
                        margin: 24px 0;
                        text-align: left;
                        border-radius: 8px;
                    }
                    
                    .reason-box h3 {
                        color: #dc3545;
                        margin: 0 0 8px 0;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    
                    .reason-box p {
                        margin: 4px 0;
                        font-size: 14px;
                        color: #333;
                    }
                    
                    .info-box {
                        background: #f8f9fa;
                        border: 1px solid #dee2e6;
                        border-radius: 8px;
                        padding: 16px;
                        margin: 20px 0;
                        text-align: left;
                    }
                    
                    .info-box h4 {
                        color: #38b6ff;
                        margin: 0 0 8px 0;
                        font-size: 14px;
                    }
                    
                    .info-box ul {
                        margin: 0;
                        padding-left: 20px;
                        font-size: 13px;
                        color: #666;
                    }
                    
                    .info-box li {
                        margin-bottom: 6px;
                    }
                    
                    .button-group {
                        display: flex;
                        gap: 12px;
                        margin-top: 32px;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    
                    .btn {
                        padding: 12px 24px;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                        transition: all 0.3s ease;
                    }
                    
                    .btn-primary {
                        background-color: #38b6ff;
                        color: white;
                    }
                    
                    .btn-primary:hover {
                        background-color: #2a9fd9;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(56, 182, 255, 0.3);
                    }
                    
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #dee2e6;
                        font-size: 12px;
                        color: #999;
                    }
                    
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-10px); }
                        75% { transform: translateX(10px); }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="error-card">
                        <div class="error-icon">🚫</div>
                        
                        <h1>ACESSO BLOQUEADO</h1>
                        <p>O seu acesso foi bloqueado por razões de segurança.</p>
                        
                        <div class="reason-box">
                            <h3>🔒 Razão do Bloqueio</h3>
                            <p><strong>VPN/Proxy Detectado:</strong> ${vpnInfo.reason}</p>
                            <p><strong>IP:</strong> ${vpnInfo.ip}</p>
                            <p><strong>Provider:</strong> ${vpnInfo.provider}</p>
                        </div>
                        
                        <div class="info-box">
                            <h4>Por que bloqueamos VPNs?</h4>
                            <ul>
                                <li>Proteção contra fraudes e atividades maliciosas</li>
                                <li>Conformidade com políticas de segurança</li>
                                <li>Prevenção de acesso não autorizado</li>
                                <li>Proteção de dados dos utilizadores</li>
                            </ul>
                        </div>
                        
                        <div class="info-box">
                            <h4>O que pode fazer:</h4>
                            <ul>
                                <li>Desative a sua VPN ou Proxy</li>
                                <li>Utilize a sua ligação direta à Internet</li>
                                <li>Tente novamente após desativar o serviço</li>
                                <li>Entre em contacto com o suporte se acredita que isto é um erro</li>
                            </ul>
                        </div>
                        
                        <div class="button-group">
                            <button class="btn btn-primary" onclick="location.reload()">Tentar Novamente</button>
                        </div>
                        
                        <div class="footer">
                            <p><strong>BIOLOS Security System</strong> - Proteção Anti-VPN/Proxy Ativa</p>
                            <p>Hora do Bloqueio: ${new Date().toLocaleString('pt-PT')}</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Substituir o conteúdo da página
        document.documentElement.innerHTML = blockHTML;
    }
}

// Inicializar o bloqueio ANTES de qualquer outro script
const biolosAntiVPN = new BiolosAntiVPNClient();
