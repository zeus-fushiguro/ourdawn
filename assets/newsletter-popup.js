/**
 * Newsletter Popup
 * Exit intent popup with session management
 */

class NewsletterPopup {
  constructor(element) {
    this.popup = element;
    this.delay = parseInt(element.dataset.delay) * 1000 || 10000;
    this.exitIntent = element.dataset.exitIntent === 'true';
    this.showOnce = element.dataset.showOnce === 'true';
    this.storageKey = 'warmlyst_newsletter_shown';

    this.init();
  }

  init() {
    // Check if popup should be shown
    if (this.showOnce && this.wasShown()) {
      return;
    }

    this.setupEventListeners();

    if (this.exitIntent) {
      this.setupExitIntent();
    } else {
      // Show after delay
      setTimeout(() => this.show(), this.delay);
    }
  }

  setupEventListeners() {
    // Close buttons
    const closeButtons = this.popup.querySelectorAll('[data-popup-close]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close());
    });

    // Form submission
    const form = this.popup.querySelector('[data-newsletter-form]');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.popup.classList.contains('is-visible')) {
        this.close();
      }
    });
  }

  setupExitIntent() {
    let hasTriggered = false;

    document.addEventListener('mouseleave', (e) => {
      // Trigger only when mouse leaves from top
      if (e.clientY < 10 && !hasTriggered) {
        hasTriggered = true;
        this.show();
      }
    });

    // Fallback: show after delay anyway
    setTimeout(() => {
      if (!hasTriggered) {
        this.show();
      }
    }, this.delay);
  }

  show() {
    // Don't show if already shown
    if (this.showOnce && this.wasShown()) {
      return;
    }

    this.popup.classList.add('is-visible');
    document.body.style.overflow = 'hidden';

    // Mark as shown
    this.markAsShown();

    // Track event
    this.trackEvent('popup_shown');
  }

  close() {
    this.popup.classList.remove('is-visible');
    document.body.style.overflow = '';

    // Track event
    this.trackEvent('popup_closed');
  }

  async handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const message = this.popup.querySelector('[data-newsletter-message]');

    // Validation
    if (!this.validateEmail(email)) {
      this.showMessage('Veuillez entrer une adresse e-mail valide.', 'error');
      return;
    }

    // Loading state
    form.classList.add('is-loading');
    message.classList.remove('is-visible');

    try {
      const formData = new FormData(form);

      const response = await fetch('/contact#newsletter-popup', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/javascript'
        }
      });

      if (response.ok) {
        this.showMessage('Merci de votre inscription! Vérifiez votre boîte e-mail pour votre code de réduction.', 'success');
        form.reset();

        // Track conversion
        this.trackEvent('newsletter_signup', { email });

        // Close popup after 3 seconds
        setTimeout(() => this.close(), 3000);

      } else {
        throw new Error('Subscription failed');
      }

    } catch (error) {
      console.error('Newsletter error:', error);
      this.showMessage('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    } finally {
      form.classList.remove('is-loading');
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showMessage(text, type) {
    const message = this.popup.querySelector('[data-newsletter-message]');
    if (!message) return;

    message.textContent = text;
    message.classList.remove('is-success', 'is-error');
    message.classList.add('is-visible', `is-${type}`);
  }

  wasShown() {
    if (this.showOnce) {
      return sessionStorage.getItem(this.storageKey) === 'true';
    }
    return false;
  }

  markAsShown() {
    if (this.showOnce) {
      sessionStorage.setItem(this.storageKey, 'true');
    }
  }

  trackEvent(event, data = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event, {
        event_category: 'Newsletter Popup',
        ...data
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', data);
    }

    // Custom tracking
    if (typeof Shopify !== 'undefined' && Shopify.analytics) {
      Shopify.analytics.publish(event, data);
    }

    console.log('Event tracked:', event, data);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.querySelector('[data-newsletter-popup]');
  if (popup) {
    new NewsletterPopup(popup);
  }
});

// Re-initialize after Shopify section load
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const popup = event.target.querySelector('[data-newsletter-popup]');
    if (popup) {
      new NewsletterPopup(popup);
    }
  });
}
