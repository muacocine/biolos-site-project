"""
BIOLOS Anti-VPN/Proxy Protection Server
Servidor Flask com proteção contra acessos via VPN e Proxy
"""

from flask import Flask, render_template, request, redirect, jsonify
from anti_vpn import BiolosAntiVPN
import logging

app = Flask(__name__)
anti_vpn = BiolosAntiVPN()

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lista de IPs bloqueados (cache local para melhor performance)
BLOCKED_IPS = set()
ALLOWED_IPS = set()

def get_client_ip(request):
    """
    Obter o IP real do cliente, considerando proxies.
    """
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    else:
        return request.remote_addr

@app.before_request
def check_vpn():
    """
    Middleware para verificar VPN/Proxy antes de permitir acesso.
    """
    # IPs que não precisam de verificação (localhost, etc)
    if request.remote_addr in ['127.0.0.1', 'localhost']:
        return None
    
    client_ip = get_client_ip(request)
    
    # Verificar cache local
    if client_ip in BLOCKED_IPS:
        logger.warning(f"🚫 Acesso bloqueado (cache): {client_ip}")
        return redirect(f'/access-denied?ip={client_ip}')
    
    if client_ip in ALLOWED_IPS:
        return None
    
    # Verificar com o sistema Anti-VPN
    result = anti_vpn.check_ip(client_ip)
    
    if not result.get("allowed", True):
        BLOCKED_IPS.add(client_ip)
        logger.warning(f"🚫 VPN/Proxy Detetado: {client_ip} - {result.get('reason')}")
        return redirect(f'/access-denied?ip={client_ip}')
    else:
        ALLOWED_IPS.add(client_ip)
        logger.info(f"✅ Acesso Permitido: {client_ip}")
    
    return None

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

@app.route('/settings')
def settings():
    """Página de definições"""
    return render_template('settings.html')

@app.route('/security-demo')
def security_demo():
    """Página de demonstração de segurança"""
    return render_template('security-demo.html')

@app.route('/access-denied')
def access_denied():
    """Página de acesso bloqueado"""
    client_ip = request.args.get('ip', 'Desconhecido')
    return render_template('access-denied.html', ip=client_ip)

@app.route('/api/check-vpn', methods=['POST'])
def api_check_vpn():
    """
    API para verificar se um IP é VPN/Proxy
    """
    data = request.get_json()
    ip = data.get('ip')
    
    if not ip:
        return jsonify({'error': 'IP não fornecido'}), 400
    
    result = anti_vpn.check_ip(ip)
    return jsonify(result)

@app.route('/api/client-info')
def api_client_info():
    """
    API para obter informações do cliente
    """
    client_ip = get_client_ip(request)
    user_agent = request.headers.get('User-Agent', 'Desconhecido')
    
    return jsonify({
        'ip': client_ip,
        'user_agent': user_agent,
        'timestamp': str(__import__('datetime').datetime.now())
    })

@app.errorhandler(404)
def not_found(error):
    """Página 404"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(error):
    """Página 500"""
    logger.error(f"Erro no servidor: {error}")
    return render_template('500.html'), 500

if __name__ == '__main__':
    # Para desenvolvimento
    app.run(debug=True, host='0.0.0.0', port=5000)
    
    # Para produção, usar Gunicorn:
    # gunicorn -w 4 -b 0.0.0.0:8000 app.py
