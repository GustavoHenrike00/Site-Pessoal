/**
 * ===== CONFIGURAÇÕES E CONSTANTES =====
 */
const CONFIG = {
  breakpoints: {
    mobile: 768
  },
  selectors: {
    menuToggle: '#menu-toggle',
    navMenu: '#nav-menu',
    overlay: '#menu-overlay',
    navLinks: '.nav-links a'
  }
};

/**
 * ===== UTILITÁRIOS =====
 */
const Utils = {
  // Verifica se é mobile
  isMobile: () => window.innerWidth <= CONFIG.breakpoints.mobile,
  
  // Fecha o menu
  closeMenu: () => {
    const navMenu = document.querySelector(CONFIG.selectors.navMenu);
    const overlay = document.querySelector(CONFIG.selectors.overlay);
    const menuToggle = document.querySelector(CONFIG.selectors.menuToggle);
    const icon = menuToggle?.querySelector('i');
    
    if (navMenu) navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (icon) icon.className = 'fas fa-bars'; // Volta para hambúrguer
    document.body.style.overflow = '';
  },
  
  // Abre o menu
  openMenu: () => {
    const navMenu = document.querySelector(CONFIG.selectors.navMenu);
    const overlay = document.querySelector(CONFIG.selectors.overlay);
    const menuToggle = document.querySelector(CONFIG.selectors.menuToggle);
    const icon = menuToggle?.querySelector('i');
    
    if (navMenu) navMenu.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (icon) icon.className = 'fas fa-times'; // Muda para X
    document.body.style.overflow = 'hidden';
  },
  
  // Alterna o menu (abre/fecha)
  toggleMenu: () => {
    const navMenu = document.querySelector(CONFIG.selectors.navMenu);
    
    if (navMenu?.classList.contains('active')) {
      Utils.closeMenu();
    } else {
      Utils.openMenu();
    }
  },
  
  // Debounce para eventos de resize
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

/**
 * ===== MENU MOBILE =====
 */
const MobileMenu = {
  elements: null,
  
  init: function() {
    this.cacheElements();
    if (!this.elements) return;
    this.bindEvents();
  },
  
  cacheElements: function() {
    this.elements = {
      menuToggle: document.querySelector(CONFIG.selectors.menuToggle),
      navMenu: document.querySelector(CONFIG.selectors.navMenu),
      overlay: document.querySelector(CONFIG.selectors.overlay),
      navLinks: document.querySelectorAll(CONFIG.selectors.navLinks)
    };
  },
  
  bindEvents: function() {
    const { menuToggle, navMenu, overlay, navLinks } = this.elements;
    
    // Botão único: abre e fecha o menu
    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        Utils.toggleMenu();
      });
    }
    
    // Fechar com overlay
    if (overlay) {
      overlay.addEventListener('click', () => Utils.closeMenu());
    }
    
    // Fechar ao clicar em links
    navLinks.forEach(link => {
      link.addEventListener('click', () => Utils.closeMenu());
    });
    
    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        Utils.closeMenu();
      }
    });
    
    // Gestos de swipe (mobile)
    if (Utils.isMobile()) {
      this.initSwipeGesture();
    }
  },
  
  initSwipeGesture: function() {
    let touchstartX = 0;
    let touchendX = 0;
    
    document.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      this.handleSwipe(touchstartX, touchendX);
    });
  },
  
  handleSwipe: function(startX, endX) {
    const swipeThreshold = 100;
    const navMenu = document.querySelector(CONFIG.selectors.navMenu);
    
    if (startX - endX > swipeThreshold && navMenu?.classList.contains('active')) {
      Utils.closeMenu();
    }
  }
};

/**
 * ===== ANIMAÇÕES =====
 */
const Animations = {
  init: function() {
    this.initFadeInAnimation();
  },
  
  initFadeInAnimation: function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
  }
};

/**
 * ===== EFEITOS DE DESKTOP =====
 */
const DesktopEffects = {
  init: function() {
    if (Utils.isMobile()) return;
    this.initCardEffects();
    this.initParallax();
  },
  
  initCardEffects: function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        const img = this.querySelector('.portfolio-image i');
        if (img) img.style.transform = 'scale(1.1)';
      });
      
      item.addEventListener('mouseleave', function() {
        const img = this.querySelector('.portfolio-image i');
        if (img) img.style.transform = 'scale(1)';
      });
    });
  },
  
  initParallax: function() {
    window.addEventListener('scroll', () => {
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        heroImage.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
    });
  }
};

/**
 * ===== SCROLL SUAVE =====
 */
const SmoothScroll = {
  init: function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
};

/**
 * ===== INICIALIZAÇÃO =====
 */
document.addEventListener('DOMContentLoaded', () => {
  MobileMenu.init();
  Animations.init();
  DesktopEffects.init();
  SmoothScroll.init();
});

// Fecha menu e volta ícone ao redimensionar para desktop
window.addEventListener('resize', Utils.debounce(() => {
  if (!Utils.isMobile()) {
    Utils.closeMenu();
    
    // Garante que o ícone volte a ser hambúrguer
    const menuToggle = document.querySelector(CONFIG.selectors.menuToggle);
    const icon = menuToggle?.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
  }
}, 250));