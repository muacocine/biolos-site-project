# 🔒 BIOLOS Anti-VPN/Proxy Protection System

## Visão Geral

O sistema Anti-VPN/Proxy BIOLOS protege o seu site contra acessos mascarados através de VPNs, Proxies e serviços de Data Center. Quando um utilizador tenta aceder com uma VPN ou Proxy ativado, o acesso é bloqueado e é apresentada uma página de erro profissional.

## Arquitetura

### Componentes

1. **`anti_vpn.py`** - Script Python principal
   - Verifica endereços IP contra bases de dados de VPN/Proxy
   - Utiliza a API `ip-api.com` (gratuita)
   - Retorna informações sobre o tipo de conexão

2. **`app.py`** - Servidor Flask
   - Middleware que verifica cada requisição
   - Cache local para melhor performance
   - API para verificação manual de IPs

3. **`access-denied.html`** - Página de bloqueio
   - Interface profissional
   - Explicação clara do motivo do bloqueio
   - Instruções para o utilizador

4. **`security.js`** - Verificação no cliente (opcional)
   - Análise adicional no navegador
   - Alertas em tempo real

## Instalação

### Pré-requisitos

```bash
pip install flask requests
```

### Configuração

1. **Copiar ficheiros para o servidor:**
   ```bash
   cp anti_vpn.py /seu/servidor/
   cp app.py /seu/servidor/
   cp access-denied.html /seu/servidor/templates/
   ```

2. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Executar o servidor:**
   ```bash
   python app.py
   ```

   Para produção com Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8000 app.py
   ```

## Como Funciona

### Fluxo de Verificação

```
Utilizador acessa o site
    ↓
Middleware intercepta a requisição
    ↓
Extrai o IP do cliente
    ↓
Verifica cache local
    ↓
Se não em cache → Consulta API de VPN
    ↓
Se VPN/Proxy detectado → Redireciona para access-denied.html
    ↓
Se IP seguro → Permite acesso normal
```

### Exemplo de Uso

```python
from anti_vpn import BiolosAntiVPN

anti_vpn = BiolosAntiVPN()

# Verificar um IP
result = anti_vpn.check_ip("8.8.8.8")
print(result)

# Saída esperada:
# {
#     'allowed': False,
#     'reason': 'Data Center/Hosting Detetado',
#     'ip': '8.8.8.8',
#     'action': 'BLOCK'
# }
```

## API Endpoints

### POST `/api/check-vpn`

Verificar se um IP é VPN/Proxy.

**Request:**
```json
{
  "ip": "8.8.8.8"
}
```

**Response:**
```json
{
  "allowed": false,
  "reason": "Data Center/Hosting Detetado",
  "ip": "8.8.8.8",
  "action": "BLOCK"
}
```

### GET `/api/client-info`

Obter informações do cliente.

**Response:**
```json
{
  "ip": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2026-01-12 16:30:00"
}
```

## Configuração Avançada

### Whitelist de IPs

Para permitir IPs específicos mesmo que sejam detectados como VPN:

```python
WHITELIST_IPS = {'1.2.3.4', '5.6.7.8'}

if client_ip in WHITELIST_IPS:
    return None  # Permitir acesso
```

### Blacklist de IPs

Para bloquear IPs específicos:

```python
BLACKLIST_IPS = {'9.9.9.9', '10.10.10.10'}

if client_ip in BLACKLIST_IPS:
    return redirect('/access-denied')
```

### Cache Persistente

Para guardar o cache em ficheiro:

```python
import pickle

def save_cache():
    with open('cache.pkl', 'wb') as f:
        pickle.dump({'blocked': BLOCKED_IPS, 'allowed': ALLOWED_IPS}, f)

def load_cache():
    global BLOCKED_IPS, ALLOWED_IPS
    try:
        with open('cache.pkl', 'rb') as f:
            data = pickle.load(f)
            BLOCKED_IPS = data['blocked']
            ALLOWED_IPS = data['allowed']
    except FileNotFoundError:
        pass
```

## Providers de VPN/Proxy Suportados

O sistema detecta:

- **VPNs comerciais:** NordVPN, ExpressVPN, Surfshark, etc.
- **Proxies:** HTTP, SOCKS, Transparent
- **Data Centers:** AWS, Google Cloud, Azure, DigitalOcean
- **Hosting:** Servidores dedicados e VPS

## Limitações

1. **API Gratuita:** `ip-api.com` tem limite de 45 requisições por minuto
2. **Precisão:** Alguns IPs podem não ser detectados corretamente
3. **Falsos Positivos:** Alguns ISPs legítimos podem ser bloqueados

## Soluções Alternativas

Para melhor precisão, considere APIs pagas:

- **IPQualityScore** - Muito precisa, $0.01 por requisição
- **MaxMind GeoIP2** - Base de dados offline, $50/mês
- **Abuseipdb** - Especializada em IPs maliciosos

## Monitoramento

### Logging

```python
import logging

logging.basicConfig(
    filename='anti_vpn.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
```

### Alertas

```python
def send_alert(ip, reason):
    # Enviar email, SMS ou notificação
    pass
```

## Segurança

- ✅ Verificação em cada requisição
- ✅ Cache local para performance
- ✅ Logging de tentativas bloqueadas
- ✅ Página de erro profissional
- ✅ Suporte a proxies reversos

## Troubleshooting

### Problema: "Erro na verificação, permitindo acesso por padrão"

**Solução:** Verifique a conexão com a API `ip-api.com`

```bash
curl "http://ip-api.com/json/8.8.8.8?fields=status,proxy,hosting"
```

### Problema: IP legítimo bloqueado

**Solução:** Adicione o IP à whitelist

```python
WHITELIST_IPS.add('seu.ip.aqui')
```

## Suporte

Para problemas ou sugestões, contacte: support@biolos.com

---

**BIOLOS Security System** © 2026
