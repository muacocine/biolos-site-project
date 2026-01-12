import re
import os

class BiolosSecurity:
    """
    Sistema de Segurança BIOLOS para análise de Vírus e Spam.
    """
    
    def __init__(self):
        # Padrões comuns de spam
        self.spam_keywords = [
            r'ganhe dinheiro rápido',
            r'prémio acumulado',
            r'clique aqui agora',
            r'oferta exclusiva',
            r'herança urgente',
            r'viagra',
            r'bitcoin profit',
            r'investimento garantido'
        ]
        
        # Extensões de ficheiros potencialmente perigosas (vírus)
        self.dangerous_extensions = ['.exe', '.bat', '.scr', '.vbs', '.js', '.jar']

    def check_spam(self, text):
        """Analisa se o texto contém padrões de spam."""
        score = 0
        for pattern in self.spam_keywords:
            if re.search(pattern, text, re.IGNORECASE):
                score += 1
        
        is_spam = score >= 2
        return {
            "is_spam": is_spam,
            "spam_score": score,
            "message": "⚠️ ALERTA: Conteúdo identificado como SPAM!" if is_spam else "Conteúdo seguro."
        }

    def check_virus(self, filename):
        """Verifica se o ficheiro tem uma extensão perigosa."""
        _, extension = os.path.splitext(filename.lower())
        is_dangerous = extension in self.dangerous_extensions
        
        return {
            "is_virus": is_dangerous,
            "extension": extension,
            "message": f"🚨 PERIGO: O ficheiro {filename} pode conter VÍRUS!" if is_dangerous else "Ficheiro seguro."
        }

    def scan_email(self, subject, body, attachments=[]):
        """Realiza uma análise completa do email."""
        spam_result = self.check_spam(body)
        virus_results = [self.check_virus(att) for att in attachments]
        
        has_virus = any(v['is_virus'] for v in virus_results)
        
        return {
            "status": "DANGER" if has_virus or spam_result['is_spam'] else "SAFE",
            "spam_analysis": spam_result,
            "virus_analysis": virus_results,
            "summary": "Ação recomendada: Bloquear" if has_virus else "Ação recomendada: Mover para Spam" if spam_result['is_spam'] else "Nenhuma ação necessária"
        }

if __name__ == "__main__":
    # Exemplo de uso
    scanner = BiolosSecurity()
    
    test_email = {
        "subject": "Ganhe dinheiro agora!",
        "body": "Clique aqui agora para receber o seu prémio acumulado de bitcoin profit!",
        "attachments": ["premio.exe"]
    }
    
    result = scanner.scan_email(test_email['subject'], test_email['body'], test_email['attachments'])
    
    print("--- RELATÓRIO DE SEGURANÇA BIOLOS ---")
    print(f"Status Geral: {result['status']}")
    print(f"Análise de Spam: {result['spam_analysis']['message']}")
    for v in result['virus_analysis']:
        print(f"Análise de Vírus: {v['message']}")
    print(f"Conclusão: {result['summary']}")
