/**
 * FAQ Accordion
 * Vanilla JS accordion with smooth animations
 */

class FAQAccordion {
  constructor(section) {
    this.section = section;
    this.items = Array.from(section.querySelectorAll('[data-faq-item]'));

    this.init();
  }

  init() {
    this.items.forEach(item => {
      const trigger = item.querySelector('[data-faq-trigger]');
      const content = item.querySelector('[data-faq-content]');

      if (trigger && content) {
        // Set initial max-height for open items
        if (item.classList.contains('is-open')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }

        // Click event
        trigger.addEventListener('click', () => this.toggleItem(item, trigger, content));
      }
    });
  }

  toggleItem(item, trigger, content) {
    const isOpen = item.classList.contains('is-open');

    if (isOpen) {
      // Close
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      content.setAttribute('hidden', '');
      content.style.maxHeight = '0';
    } else {
      // Close all other items (optional: remove this for multi-open behavior)
      this.items.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          const otherTrigger = otherItem.querySelector('[data-faq-trigger]');
          const otherContent = otherItem.querySelector('[data-faq-content]');

          otherItem.classList.remove('is-open');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherContent.setAttribute('hidden', '');
          otherContent.style.maxHeight = '0';
        }
      });

      // Open
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      content.removeAttribute('hidden');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const accordions = document.querySelectorAll('[data-faq-accordion]');
  accordions.forEach(accordion => {
    const section = accordion.closest('.faq-accordion-warmlyst');
    if (section) {
      new FAQAccordion(section);
    }
  });
});

// Re-initialize after Shopify section load
if (Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const section = event.target.querySelector('.faq-accordion-warmlyst');
    if (section) {
      new FAQAccordion(section);
    }
  });
}
