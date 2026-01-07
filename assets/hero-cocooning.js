/**
 * Hero Cocooning - Enhanced Interactions
 * Parallax effect on scroll + smooth scroll indicator
 */

class HeroCocooning extends HTMLElement {
  constructor() {
    super();
    this.hero = this;
    this.media = this.querySelector('.hero-cocooning__image');
    this.scrollIndicator = this.querySelector('.hero-cocooning__scroll-indicator');

    this.init();
  }

  init() {
    // Parallax effect on scroll (desktop only)
    if (window.innerWidth >= 750 && this.media && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.initParallax();
    }

    // Smooth scroll on indicator click
    if (this.scrollIndicator) {
      this.initScrollIndicator();
    }

    // Header sticky effect
    this.initStickyHeader();
  }

  initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateParallax() {
    const heroRect = this.hero.getBoundingClientRect();
    const scrolled = window.pageYOffset;
    const heroTop = heroRect.top + scrolled;
    const heroHeight = heroRect.height;

    // Only apply parallax when hero is in viewport
    if (scrolled < heroTop + heroHeight) {
      const offset = (scrolled - heroTop) * 0.3; // Parallax factor
      this.media.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
  }

  initScrollIndicator() {
    this.scrollIndicator.addEventListener('click', (e) => {
      e.preventDefault();
      const heroBottom = this.hero.getBoundingClientRect().bottom;
      const scrollTarget = window.pageYOffset + heroBottom;

      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    });

    // Hide scroll indicator after first scroll
    let scrolled = false;
    window.addEventListener('scroll', () => {
      if (!scrolled && window.pageYOffset > 100) {
        scrolled = true;
        this.scrollIndicator.style.opacity = '0';
        this.scrollIndicator.style.pointerEvents = 'none';
      }
    }, { once: true });
  }

  initStickyHeader() {
    const header = document.querySelector('.header-wrapper');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }
}

// Register custom element
if (!customElements.get('hero-cocooning-section')) {
  customElements.define('hero-cocooning-section', HeroCocooning);
}

// Fallback initialization for non-custom-element browsers
document.addEventListener('DOMContentLoaded', () => {
  const heroes = document.querySelectorAll('.hero-cocooning');
  heroes.forEach(hero => {
    if (!hero.initialized) {
      // Manual initialization
      const heroInstance = {
        hero,
        media: hero.querySelector('.hero-cocooning__image'),
        scrollIndicator: hero.querySelector('.hero-cocooning__scroll-indicator')
      };

      // Apply basic enhancements
      if (heroInstance.scrollIndicator) {
        heroInstance.scrollIndicator.addEventListener('click', (e) => {
          e.preventDefault();
          const heroBottom = hero.getBoundingClientRect().bottom;
          window.scrollTo({
            top: window.pageYOffset + heroBottom,
            behavior: 'smooth'
          });
        });
      }

      hero.initialized = true;
    }
  });
});
