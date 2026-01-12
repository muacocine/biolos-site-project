/**
 * BIOLOS ULTRA PROTECTION - Blindagem Total
 * Bloqueio máximo contra cópia, download e inspeção
 */

(function() {
    'use strict';

    // ============================================
    // FASE 1: Bloqueio Imediato (Antes de tudo)
    // ============================================

    // Bloquear clique direito GLOBALMENTE
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }, true);

    // Bloquear mousedown para clique direito
    document.addEventListener('mousedown', function(e) {
        if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // Bloquear mouseup para clique direito
    document.addEventListener('mouseup', function(e) {
        if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);

    // ============================================
    // FASE 2: Bloqueio de Atalhos de Teclado
    // ============================================

    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        // Ctrl+C
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
        // Ctrl+X
        if (e.ctrlKey && e.keyCode === 88) {
            e.preventDefault();
            return false;
        }
        // Ctrl+A
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            return false;
        }
        // Ctrl+P
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            return false;
        }
    }, true);

    // ============================================
    // FASE 3: Bloqueio de Seleção de Texto
    // ============================================

    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    }, true);

    document.addEventListener('select', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // ============================================
    // FASE 4: Bloqueio de Copy/Cut/Paste
    // ============================================

    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    document.addEventListener('paste', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // ============================================
    // FASE 5: Bloqueio de Drag & Drop
    // ============================================

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    document.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);

    // ============================================
    // FASE 6: Proteção de Imagens
    // ============================================

    function protectAllImages() {
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            // Remover atributos que permitem download
            img.removeAttribute('download');
            img.removeAttribute('href');
            
            // Desativar eventos
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            }, true);

            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            }, true);

            img.addEventListener('mousedown', function(e) {
                if (e.button === 2) {
                    e.preventDefault();
                    return false;
                }
            }, true);

            // Aplicar estilos de proteção
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.style.msUserSelect = 'none';
            img.style.mozUserSelect = 'none';
            img.style.pointerEvents = 'none';
            img.style.webkitUserDrag = 'none';
            img.style.webkitTouchCallout = 'none';
            img.draggable = false;
        });
    }

    // Proteger imagens ao carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectAllImages);
    } else {
        protectAllImages();
    }

    // Observar novas imagens
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'IMG') {
                        protectAllImages();
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ============================================
    // FASE 7: Bloqueio de Impressão
    // ============================================

    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        return false;
    }, true);

    // ============================================
    // FASE 8: Proteção de Atributos
    // ============================================

    // Bloquear atributos de download em links
    const links = document.querySelectorAll('a');
    links.forEach(function(link) {
        link.removeAttribute('download');
        link.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, true);
    });

    // ============================================
    // FASE 9: Aplicar CSS de Bloqueio
    // ============================================

    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-user-drag: none !important;
            -webkit-touch-callout: none !important;
        }
        
        body {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
        }
        
        img {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-user-drag: none !important;
            pointer-events: none !important;
            -webkit-touch-callout: none !important;
        }
        
        ::selection {
            background: transparent !important;
            color: inherit !important;
        }
        
        ::-moz-selection {
            background: transparent !important;
            color: inherit !important;
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // FASE 10: Camada de Proteção Invisível
    // ============================================

    const protectionLayer = document.createElement('div');
    protectionLayer.id = 'biolos-protection-layer';
    protectionLayer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        pointer-events: none;
        background: transparent;
    `;

    document.body.appendChild(protectionLayer);

    // ============================================
    // FASE 11: Monitoramento Contínuo
    // ============================================

    setInterval(function() {
        // Re-proteger imagens a cada segundo
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
            if (img.style.pointerEvents !== 'none') {
                img.style.pointerEvents = 'none';
                img.draggable = false;
            }
        });

        // Verificar se DevTools está aberto
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
            console.warn('DevTools detectado');
        }
    }, 500);

    console.log('✅ BIOLOS ULTRA PROTECTION ativado');

})();
