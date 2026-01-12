import requests
import json

class BiolosAntiVPN:
    """
    Sistema Anti-VPN e Anti-Proxy BIOLOS.
    Protege o site contra acessos mascarados.
    """
    
    def __init__(self, api_key=None):
        # API gratuita para demonstração (ip-api.com)
        self.api_url = "http://ip-api.com/json/"
        self.fields = "?fields=status,message,proxy,hosting,query"

    def check_ip(self, ip_address):
        """
        Verifica se um endereço IP é uma VPN, Proxy ou Hosting (Data Center).
        """
        try:
            response = requests.get(f"{self.api_url}{ip_address}{self.fields}")
            data = response.json()
            
            if data.get("status") == "fail":
                return {
                    "allowed": False,
                    "reason": "IP Inválido ou erro na consulta",
                    "details": data.get("message")
                }
            
            is_proxy = data.get("proxy", False)
            is_hosting = data.get("hosting", False)
            
            if is_proxy or is_hosting:
                return {
                    "allowed": False,
                    "reason": "VPN/Proxy Detetado" if is_proxy else "Data Center/Hosting Detetado",
                    "ip": data.get("query"),
                    "action": "BLOCK"
                }
            
            return {
                "allowed": True,
                "reason": "IP Residencial/Móvel Seguro",
                "ip": data.get("query"),
                "action": "ALLOW"
            }
            
        except Exception as e:
            # Em caso de erro na API, por segurança podemos optar por bloquear ou permitir
            return {
                "allowed": True, 
                "error": str(e),
                "message": "Erro na verificação, permitindo acesso por padrão."
            }

    def protect_page(self, client_ip):
        """
        Lógica principal para proteger a página.
        """
        result = self.check_ip(client_ip)
        
        if not result["allowed"]:
            print(f"🚨 ACESSO BLOQUEADO: {client_ip} ({result['reason']})")
            return False
        
        print(f"✅ ACESSO PERMITIDO: {client_ip}")
        return True

if __name__ == "__main__":
    # Exemplo de teste com IPs conhecidos
    anti_vpn = BiolosAntiVPN()
    
    # Teste 1: IP que provavelmente é uma VPN/Proxy (ex: IP do Google)
    print("Testando IP do Google (Data Center)...")
    print(anti_vpn.check_ip("8.8.8.8"))
    
    # Teste 2: IP local (pode falhar na API pública, mas ilustra o fluxo)
    print("\nTestando IP Local...")
    print(anti_vpn.check_ip("127.0.0.1"))
