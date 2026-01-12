// BIOLOS Theme Manager - Dark/Light Mode Controller

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'biolos-theme';
    this.THEME_LIGHT = 'light';
    this.THEME_DARK = 'dark';
    this.init();
  }

  init() {
    // Carregar tema guardado ou usar padrão (light)
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || this.THEME_LIGHT;
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    if (theme !== this.THEME_LIGHT && theme !== this.THEME_DARK) {
      theme = this.THEME_LIGHT;
    }
    
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    // Disparar evento para notificar mudança de tema
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  getTheme() {
    return localStorage.getItem(this.STORAGE_KEY) || this.THEME_LIGHT;
  }

  toggleTheme() {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === this.THEME_LIGHT ? this.THEME_DARK : this.THEME_LIGHT;
    this.setTheme(newTheme);
    return newTheme;
  }

  isDarkMode() {
    return this.getTheme() === this.THEME_DARK;
  }
}

// Inicializar o gerenciador de temas globalmente
const themeManager = new ThemeManager();

// Listener para mudanças de tema
window.addEventListener('themeChanged', (event) => {
  console.log('Tema alterado para:', event.detail.theme);
});
