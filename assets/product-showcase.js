/**
 * Product Showcase
 * Handles quick add to cart and wishlist functionality
 */

class ProductShowcase {
  constructor() {
    this.init();
  }

  init() {
    this.setupQuickAdd();
    this.setupWishlist();
  }

  setupQuickAdd() {
    const forms = document.querySelectorAll('.quick-add-form');

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = form.querySelector('.quick-add-button');
        const originalText = button.innerHTML;

        // Loading state
        button.disabled = true;
        button.innerHTML = '<span>Ajout...</span>';

        try {
          const formData = new FormData(form);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const data = await response.json();

            // Success state
            button.innerHTML = '<span>✓ Ajouté!</span>';
            button.style.background = '#10b981';

            // Update cart count if cart drawer exists
            this.updateCartCount();

            // Reset after 2 seconds
            setTimeout(() => {
              button.disabled = false;
              button.innerHTML = originalText;
              button.style.background = '';
            }, 2000);

          } else {
            throw new Error('Failed to add to cart');
          }

        } catch (error) {
          console.error('Error adding to cart:', error);
          button.innerHTML = '<span>Erreur</span>';
          button.style.background = '#dc2626';

          setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
            button.style.background = '';
          }, 2000);
        }
      });
    });
  }

  setupWishlist() {
    const wishlistButtons = document.querySelectorAll('.showcase-card__wishlist');

    wishlistButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = button.closest('.showcase-card');
        const productId = card.dataset.productId;

        // Toggle wishlist state
        button.classList.toggle('is-active');

        // Store in localStorage
        const wishlist = this.getWishlist();
        if (button.classList.contains('is-active')) {
          wishlist.push(productId);
          this.showToast('Ajouté aux favoris');
        } else {
          const index = wishlist.indexOf(productId);
          if (index > -1) {
            wishlist.splice(index, 1);
          }
          this.showToast('Retiré des favoris');
        }

        localStorage.setItem('warmlyst_wishlist', JSON.stringify(wishlist));
      });
    });

    // Initialize wishlist state
    this.initializeWishlistState();
  }

  getWishlist() {
    const stored = localStorage.getItem('warmlyst_wishlist');
    return stored ? JSON.parse(stored) : [];
  }

  initializeWishlistState() {
    const wishlist = this.getWishlist();
    const wishlistButtons = document.querySelectorAll('.showcase-card__wishlist');

    wishlistButtons.forEach(button => {
      const card = button.closest('.showcase-card');
      const productId = card.dataset.productId;

      if (wishlist.includes(productId)) {
        button.classList.add('is-active');
      }
    });
  }

  updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCountElements = document.querySelectorAll('[data-cart-count]');
        cartCountElements.forEach(el => {
          el.textContent = cart.item_count;
        });
      });
  }

  showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'warmlyst-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--color-charcoal);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      z-index: 9999;
      animation: slideInUp 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new ProductShowcase();
});

// Re-initialize after Shopify section load
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', () => {
    new ProductShowcase();
  });
}
