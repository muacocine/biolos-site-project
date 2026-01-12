/**
 * BIOLOS Complete Protection System
 * Bloqueia: Cópia de texto, Download de imagens, Inspeção de código, Atalhos de teclado
 */

(function() {
    'use strict';

    class BiolosProtection {
        constructor() {
            this.initProtections();
        }

        /**
         * Inicializar todas as proteções
         */
        initProtections() {
            this.blockContextMenu();
            this.blockKeyboardShortcuts();
            this.blockTextSelection();
            this.blockImageDownload();
            this.blockDeveloperTools();
            this.blockDragDrop();
            this.protectContent();
            this.monitorDevTools();
        }

        /**
         * 1. Bloquear o menu de contexto (clique direito)
         */
        blockContextMenu() {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showWarning('Clique direito desativado por segurança');
                return false;
            });

            // Também bloquear em imagens
            document.addEventListener('mousedown', (e) => {
                if (e.button === 2) {
                    e.preventDefault();
                    return false;
                }
            });
        }

        /**
         * 2. Bloquear atalhos de teclado perigosos
         */
        blockKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // F12 - Abrir DevTools
                if (e.key === 'F12') {
                    e.preventDefault();
                    this.showWarning('Ferramentas de desenvolvedor desativadas');
                    return false;
                }

                // Ctrl+Shift+I - Inspecionar elemento
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                    e.preventDefault();
                    this.showWarning('Inspetor de elementos desativado');
                    return false;
                }

                // Ctrl+Shift+C - Seletor de elementos
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    this.showWarning('Seletor de elementos desativado');
                    return false;
                }

                // Ctrl+Shift+J - Console
                if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                    e.preventDefault();
                    this.showWarning('Console desativado');
                    return false;
                }

                // Ctrl+U - Ver código fonte
                if (e.ctrlKey && e.key === 'u') {
                    e.preventDefault();
                    this.showWarning('Visualização de código fonte desativada');
                    return false;
                }

                // Ctrl+S - Guardar página
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.showWarning('Guardar página desativado');
                    return false;
                }

                // Ctrl+C - Copiar
                if (e.ctrlKey && e.key === 'c') {
                    e.preventDefault();
                    this.showWarning('Cópia de conteúdo desativada');
                    return false;
                }

                // Ctrl+X - Cortar
                if (e.ctrlKey && e.key === 'x') {
                    e.preventDefault();
                    this.showWarning('Corte de conteúdo desativado');
                    return false;
                }

                // Ctrl+A - Selecionar tudo
                if (e.ctrlKey && e.key === 'a') {
                    e.preventDefault();
                    this.showWarning('Seleção de conteúdo desativada');
                    return false;
                }

                // Ctrl+P - Imprimir
                if (e.ctrlKey && e.key === 'p') {
                    e.preventDefault();
                    this.showWarning('Impressão desativada');
                    return false;
                }
            });
        }

        /**
         * 3. Bloquear seleção de texto
         */
        blockTextSelection() {
            // Desativar seleção via CSS
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';

            // Bloquear evento de seleção
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });

            // Bloquear mousedown para seleção
            document.addEventListener('mousedown', (e) => {
                if (e.detail > 1) {
                    e.preventDefault();
                    return false;
                }
            });

            // Bloquear copy
            document.addEventListener('copy', (e) => {
                e.preventDefault();
                this.showWarning('Cópia de conteúdo não permitida');
                return false;
            });

            // Bloquear cut
            document.addEventListener('cut', (e) => {
                e.preventDefault();
                return false;
            });
        }

        /**
         * 4. Bloquear download de imagens
         */
        blockImageDownload() {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                // Desativar clique direito em imagens
                img.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.showWarning('Download de imagens bloqueado');
                    return false;
                });

                // Desativar arrastamento
                img.addEventListener('dragstart', (e) => {
                    e.preventDefault();
                    return false;
                });

                // Desativar mousedown para seleção
                img.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    return false;
                });

                // Adicionar atributo para evitar download
                img.setAttribute('draggable', 'false');
                img.style.pointerEvents = 'none';
                img.style.userSelect = 'none';
            });

            // Observar novas imagens adicionadas dinamicamente
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.tagName === 'IMG') {
                                this.protectImage(node);
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        /**
         * Proteger uma imagem individual
         */
        protectImage(img) {
            img.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showWarning('Download de imagens bloqueado');
                return false;
            });

            img.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });

            img.setAttribute('draggable', 'false');
            img.style.pointerEvents = 'none';
        }

        /**
         * 5. Bloquear ferramentas de desenvolvedor
         */
        blockDeveloperTools() {
            // Detectar se DevTools está aberto
            let devtools = { open: false, orientation: null };

            const threshold = 160;

            setInterval(() => {
                if (window.outerHeight - window.innerHeight > threshold ||
                    window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools.open) {
                        devtools.open = true;
                        this.onDevToolsOpen();
                    }
                } else {
                    if (devtools.open) {
                        devtools.open = false;
                        this.onDevToolsClose();
                    }
                }
            }, 500);

            // Bloquear console.log e outras funções
            this.blockConsole();
        }

        /**
         * Quando DevTools abre
         */
        onDevToolsOpen() {
            console.warn('🚨 Ferramentas de desenvolvedor detectadas!');
            this.showWarning('Acesso às ferramentas de desenvolvedor não é permitido');
            
            // Opcional: redirecionar para página de bloqueio
            // window.location.href = '/access-denied';
        }

        /**
         * Quando DevTools fecha
         */
        onDevToolsClose() {
            console.log('✅ Ferramentas de desenvolvedor fechadas');
        }

        /**
         * Bloquear console
         */
        blockConsole() {
            const noop = () => {};
            
            console.log = noop;
            console.warn = noop;
            console.error = noop;
            console.info = noop;
            console.debug = noop;
            console.trace = noop;
            console.time = noop;
            console.timeEnd = noop;
        }

        /**
         * 6. Bloquear drag and drop
         */
        blockDragDrop() {
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });

            document.addEventListener('dragover', (e) => {
                e.preventDefault();
                return false;
            });

            document.addEventListener('drop', (e) => {
                e.preventDefault();
                return false;
            });
        }

        /**
         * 7. Proteger conteúdo
         */
        protectContent() {
            // Adicionar camada invisível sobre imagens
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';
                
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.zIndex = '9999';
                overlay.style.cursor = 'not-allowed';
                
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                wrapper.appendChild(overlay);
            });

            // Desativar seleção em todo o documento
            document.body.style.webkitTouchCallout = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.userSelect = 'none';
        }

        /**
         * 8. Monitorar DevTools
         */
        monitorDevTools() {
            // Verificação adicional para DevTools
            const check = () => {
                const start = performance.now();
                debugger; // Pausa se DevTools está aberto
                const end = performance.now();
                
                if (end - start > 100) {
                    this.onDevToolsOpen();
                }
            };

            // Executar verificação periodicamente
            setInterval(check, 1000);
        }

        /**
         * Mostrar aviso ao utilizador
         */
        showWarning(message) {
            console.warn('🔒 BIOLOS Protection:', message);
            
            // Criar notificação visual
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                z-index: 999999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = '🔒 ' + message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    // Inicializar proteção quando o DOM está pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new BiolosProtection();
        });
    } else {
        new BiolosProtection();
    }

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

})();
