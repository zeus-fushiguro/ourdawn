/**
 * Featured Products Slider
 * Vanilla JS slider with swipe support
 */

class FeaturedProductsSlider {
  constructor(section) {
    this.section = section;
    this.slider = section.querySelector('[data-slider]');
    this.track = section.querySelector('[data-slider-track]');
    this.slides = Array.from(section.querySelectorAll('[data-slider-slide]'));
    this.prevButton = section.querySelector('.slider-nav--prev');
    this.nextButton = section.querySelector('.slider-nav--next');
    this.dotsContainer = section.querySelector('[data-slider-dots]');

    this.currentIndex = 0;
    this.slidesPerView = this.getSlidesPerView();
    this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);

    this.autoplay = this.slider.dataset.autoplay === 'true';
    this.autoplaySpeed = parseInt(this.slider.dataset.autoplaySpeed) * 1000 || 5000;
    this.autoplayInterval = null;

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    // Navigation buttons
    if (this.prevButton && this.nextButton) {
      this.prevButton.addEventListener('click', () => this.prev());
      this.nextButton.addEventListener('click', () => this.next());
    }

    // Dots navigation
    if (this.dotsContainer) {
      this.createDots();
    }

    // Touch/swipe
    this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.slider.addEventListener('touchend', () => this.handleTouchEnd());

    // Mouse drag (desktop)
    this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.slider.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.slider.addEventListener('mouseup', () => this.handleMouseUp());
    this.slider.addEventListener('mouseleave', () => this.handleMouseUp());

    // Resize
    window.addEventListener('resize', () => this.handleResize());

    // Autoplay
    if (this.autoplay) {
      this.startAutoplay();
      this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
      this.slider.addEventListener('mouseleave', () => this.startAutoplay());
    }

    // Initial update
    this.updateSlider();
  }

  getSlidesPerView() {
    if (window.innerWidth >= 990) return 4;
    if (window.innerWidth >= 750) return 3;
    return 2;
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateSlider();
  }

  updateSlider() {
    // Calculate transform
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(this.track).gap) || 24;
    const offset = -(slideWidth + gap) * this.currentIndex;

    this.track.style.transform = `translateX(${offset}px)`;

    // Update navigation buttons
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.maxIndex;
    }

    // Update dots
    this.updateDots();
  }

  createDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = '';
    const numDots = this.maxIndex + 1;

    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Aller au groupe ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }

    this.updateDots();
  }

  updateDots() {
    if (!this.dotsContainer) return;

    const dots = this.dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  handleTouchMove(e) {
    this.touchEndX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    const threshold = 50; // Minimum swipe distance in pixels
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.touchStartX = e.clientX;
    this.slider.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.touchEndX = e.clientX;
  }

  handleMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.slider.style.cursor = 'grab';

    const threshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  handleResize() {
    const newSlidesPerView = this.getSlidesPerView();
    if (newSlidesPerView !== this.slidesPerView) {
      this.slidesPerView = newSlidesPerView;
      this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
      this.createDots();
      this.updateSlider();
    }
  }

  startAutoplay() {
    if (!this.autoplay) return;

    this.autoplayInterval = setInterval(() => {
      if (this.currentIndex >= this.maxIndex) {
        this.goToSlide(0);
      } else {
        this.next();
      }
    }, this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.featured-products-slider');
  sliders.forEach(slider => new FeaturedProductsSlider(slider));
});

// Re-initialize after Shopify section load
if (Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const slider = event.target.querySelector('.featured-products-slider');
    if (slider) {
      new FeaturedProductsSlider(slider);
    }
  });
}
