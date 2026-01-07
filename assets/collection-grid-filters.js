/**
 * Collection Grid Filters & Sorting
 * Vanilla JS for dynamic filtering and sorting of products
 */

class CollectionGridFilters {
  constructor(section) {
    this.section = section;
    this.sectionId = section.dataset.sectionId;

    // Elements
    this.filterToggle = section.querySelector('.filter-toggle');
    this.filtersDrawer = section.querySelector('.filters-drawer');
    this.filtersOverlay = section.querySelector('.filters-drawer__overlay');
    this.filtersClose = section.querySelector('.filters-drawer__close');
    this.applyButton = section.querySelector('#applyFilters');
    this.clearButton = section.querySelector('#clearFilters');
    this.clearAllButton = section.querySelector('#clearAllFilters');
    this.resetFromEmptyButton = section.querySelector('#resetFiltersFromEmpty');

    this.sortSelect = section.querySelector(`#SortBy-${this.sectionId}`);
    this.productGrid = section.querySelector('.product-grid');
    this.productItems = Array.from(section.querySelectorAll('.product-grid__item'));

    this.activeFiltersContainer = section.querySelector('#activeFilters');
    this.activeFiltersList = section.querySelector('.active-filters__list');
    this.noResultsContainer = section.querySelector('#noResults');
    this.filterCount = section.querySelector('.filter-count');

    // State
    this.activeFilters = {
      tags: [],
      price: null
    };

    this.init();
  }

  init() {
    // Filter drawer events
    if (this.filterToggle) {
      this.filterToggle.addEventListener('click', () => this.openFilters());
    }

    if (this.filtersClose) {
      this.filtersClose.addEventListener('click', () => this.closeFilters());
    }

    if (this.filtersOverlay) {
      this.filtersOverlay.addEventListener('click', () => this.closeFilters());
    }

    if (this.applyButton) {
      this.applyButton.addEventListener('click', () => {
        this.applyFilters();
        this.closeFilters();
      });
    }

    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => this.clearFilters());
    }

    if (this.clearAllButton) {
      this.clearAllButton.addEventListener('click', () => this.clearFilters());
    }

    if (this.resetFromEmptyButton) {
      this.resetFromEmptyButton.addEventListener('click', () => this.clearFilters());
    }

    // Sorting
    if (this.sortSelect) {
      this.sortSelect.addEventListener('change', (e) => this.sortProducts(e.target.value));
    }

    // ESC key to close drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.filtersDrawer.getAttribute('aria-hidden') === 'false') {
        this.closeFilters();
      }
    });
  }

  openFilters() {
    this.filtersDrawer.setAttribute('aria-hidden', 'false');
    this.filterToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeFilters() {
    this.filtersDrawer.setAttribute('aria-hidden', 'true');
    this.filterToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  applyFilters() {
    // Get selected tag filters
    const tagCheckboxes = this.section.querySelectorAll('input[name="tag"]:checked');
    this.activeFilters.tags = Array.from(tagCheckboxes).map(cb => cb.value);

    // Get selected price filter
    const priceRadio = this.section.querySelector('input[name="price"]:checked');
    this.activeFilters.price = priceRadio ? priceRadio.value : null;

    // Filter products
    this.filterProducts();

    // Update UI
    this.updateActiveFilters();
    this.updateFilterCount();
  }

  filterProducts() {
    let visibleCount = 0;

    this.productItems.forEach(item => {
      const shouldShow = this.shouldShowProduct(item);

      if (shouldShow) {
        item.hidden = false;
        item.classList.remove('filtered-out');
        visibleCount++;
      } else {
        item.hidden = true;
        item.classList.add('filtered-out');
      }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
      this.noResultsContainer.hidden = false;
    } else {
      this.noResultsContainer.hidden = true;
    }
  }

  shouldShowProduct(item) {
    const productTags = item.dataset.productTags ? item.dataset.productTags.toLowerCase().split(',') : [];
    const productPrice = parseFloat(item.dataset.productPrice) / 100; // Convert cents to euros

    // Check tag filter
    if (this.activeFilters.tags.length > 0) {
      const hasMatchingTag = this.activeFilters.tags.some(filterTag =>
        productTags.some(productTag => productTag.trim() === filterTag.toLowerCase())
      );
      if (!hasMatchingTag) return false;
    }

    // Check price filter
    if (this.activeFilters.price) {
      if (this.activeFilters.price === '0-25' && productPrice >= 25) return false;
      if (this.activeFilters.price === '25-50' && (productPrice < 25 || productPrice >= 50)) return false;
      if (this.activeFilters.price === '50-100' && (productPrice < 50 || productPrice >= 100)) return false;
      if (this.activeFilters.price === '100' && productPrice < 100) return false;
    }

    return true;
  }

  updateActiveFilters() {
    if (!this.activeFiltersList) return;

    this.activeFiltersList.innerHTML = '';

    const hasFilters = this.activeFilters.tags.length > 0 || this.activeFilters.price;

    if (hasFilters) {
      // Add tag filters
      this.activeFilters.tags.forEach(tag => {
        const tagInput = this.section.querySelector(`input[name="tag"][value="${tag}"]`);
        const tagLabel = tagInput ? tagInput.nextElementSibling.textContent : tag;
        this.activeFiltersList.innerHTML += this.createActiveFilterHTML(tagLabel, 'tag', tag);
      });

      // Add price filter
      if (this.activeFilters.price) {
        const priceInput = this.section.querySelector(`input[name="price"][value="${this.activeFilters.price}"]`);
        const priceLabel = priceInput ? priceInput.nextElementSibling.textContent : this.activeFilters.price;
        this.activeFiltersList.innerHTML += this.createActiveFilterHTML(priceLabel, 'price', this.activeFilters.price);
      }

      this.activeFiltersContainer.hidden = false;

      // Add remove listeners
      this.activeFiltersList.querySelectorAll('.active-filter__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = e.currentTarget.dataset.type;
          const value = e.currentTarget.dataset.value;
          this.removeFilter(type, value);
        });
      });
    } else {
      this.activeFiltersContainer.hidden = true;
    }
  }

  createActiveFilterHTML(label, type, value) {
    return `
      <div class="active-filter">
        <span>${label}</span>
        <button
          type="button"
          class="active-filter__remove"
          data-type="${type}"
          data-value="${value}"
          aria-label="Retirer le filtre ${label}"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;
  }

  removeFilter(type, value) {
    if (type === 'tag') {
      this.activeFilters.tags = this.activeFilters.tags.filter(t => t !== value);
      const checkbox = this.section.querySelector(`input[name="tag"][value="${value}"]`);
      if (checkbox) checkbox.checked = false;
    } else if (type === 'price') {
      this.activeFilters.price = null;
      const radio = this.section.querySelector(`input[name="price"][value=""]`);
      if (radio) radio.checked = true;
    }

    this.filterProducts();
    this.updateActiveFilters();
    this.updateFilterCount();
  }

  clearFilters() {
    // Reset state
    this.activeFilters.tags = [];
    this.activeFilters.price = null;

    // Uncheck all checkboxes and radios
    this.section.querySelectorAll('input[name="tag"]').forEach(cb => cb.checked = false);
    const defaultPriceRadio = this.section.querySelector('input[name="price"][value=""]');
    if (defaultPriceRadio) defaultPriceRadio.checked = true;

    // Show all products
    this.productItems.forEach(item => {
      item.hidden = false;
      item.classList.remove('filtered-out');
    });

    // Hide no results
    if (this.noResultsContainer) {
      this.noResultsContainer.hidden = true;
    }

    // Update UI
    this.updateActiveFilters();
    this.updateFilterCount();
  }

  updateFilterCount() {
    if (!this.filterCount) return;

    const count = this.activeFilters.tags.length + (this.activeFilters.price ? 1 : 0);
    this.filterCount.dataset.count = count;
  }

  sortProducts(sortValue) {
    const items = Array.from(this.productItems);

    items.sort((a, b) => {
      switch (sortValue) {
        case 'price-ascending':
          return parseFloat(a.dataset.productPrice) - parseFloat(b.dataset.productPrice);

        case 'price-descending':
          return parseFloat(b.dataset.productPrice) - parseFloat(a.dataset.productPrice);

        case 'title-ascending':
          return a.querySelector('.card-product__title-link').textContent.localeCompare(
            b.querySelector('.card-product__title-link').textContent
          );

        case 'title-descending':
          return b.querySelector('.card-product__title-link').textContent.localeCompare(
            a.querySelector('.card-product__title-link').textContent
          );

        case 'created-descending':
          return parseInt(b.dataset.productCreated) - parseInt(a.dataset.productCreated);

        case 'created-ascending':
          return parseInt(a.dataset.productCreated) - parseInt(b.dataset.productCreated);

        case 'best-selling':
        case 'manual':
        default:
          // Keep original order
          return 0;
      }
    });

    // Reorder DOM elements
    items.forEach(item => this.productGrid.appendChild(item));

    // Trigger reflow animation
    this.productGrid.style.opacity = '0.7';
    setTimeout(() => {
      this.productGrid.style.opacity = '1';
    }, 150);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const collectionSections = document.querySelectorAll('.collection-grid-warmlyst');
  collectionSections.forEach(section => {
    new CollectionGridFilters(section);
  });
});

// Re-initialize after Shopify section load (theme editor)
if (Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    if (event.target.querySelector('.collection-grid-warmlyst')) {
      const section = event.target.querySelector('.collection-grid-warmlyst');
      new CollectionGridFilters(section);
    }
  });
}
