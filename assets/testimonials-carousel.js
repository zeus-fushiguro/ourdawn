/**
 * Testimonials Carousel
 * Swipeable carousel with autoplay and navigation
 */

class TestimonialsCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = element.querySelector('[data-carousel-track]');
    this.slides = Array.from(element.querySelectorAll('[data-carousel-slide]'));
    this.prevButton = element.querySelector('[data-carousel-prev]');
    this.nextButton = element.querySelector('[data-carousel-next]');
    this.dotsContainer = element.querySelector('[data-carousel-dots]');

    this.currentIndex = 0;
    this.autoplay = element.dataset.autoplay === 'true';
    this.autoplaySpeed = parseInt(element.dataset.autoplaySpeed) * 1000 || 5000;
    this.autoplayInterval = null;

    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    this.createDots();
    this.setupEventListeners();
    this.updateCarousel();

    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  createDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Aller au témoignage ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });

    this.dots = Array.from(this.dotsContainer.querySelectorAll('.carousel-dot'));
  }

  setupEventListeners() {
    // Previous/Next buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    // Touch events
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    this.track.addEventListener('touchend', () => this.handleTouchEnd());

    // Mouse events (for desktop drag)
    this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.track.addEventListener('mouseup', () => this.handleMouseUp());
    this.track.addEventListener('mouseleave', () => this.handleMouseUp());

    // Pause autoplay on hover
    if (this.autoplay) {
      this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  handleTouchMove(e) {
    this.touchEndX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    if (!this.touchStartX || !this.touchEndX) return;

    const difference = this.touchStartX - this.touchEndX;
    const threshold = 50;

    if (Math.abs(difference) > threshold) {
      if (difference > 0) {
        this.next();
      } else {
        this.prev();
      }
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.track.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.endX = e.clientX;
  }

  handleMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.track.style.cursor = 'grab';

    if (!this.startX || !this.endX) return;

    const difference = this.startX - this.endX;
    const threshold = 50;

    if (Math.abs(difference) > threshold) {
      if (difference > 0) {
        this.next();
      } else {
        this.prev();
      }
    }

    this.startX = 0;
    this.endX = 0;
  }

  prev() {
    this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.updateCarousel();
    this.resetAutoplay();
  }

  next() {
    this.currentIndex = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
    this.updateCarousel();
    this.resetAutoplay();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoplay();
  }

  updateCarousel() {
    // Calculate scroll position
    const slideWidth = this.slides[0].offsetWidth;
    const gap = 32; // 2rem gap
    const scrollPosition = this.currentIndex * (slideWidth + gap);

    // Scroll to position
    this.track.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    // Update dots
    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === this.currentIndex);
      });
    }

    // Update buttons state
    if (this.prevButton && this.nextButton) {
      this.prevButton.disabled = this.currentIndex === 0;
      this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
    }
  }

  startAutoplay() {
    if (!this.autoplay) return;

    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    if (!this.autoplay) return;

    this.stopAutoplay();
    this.startAutoplay();
  }
}

// Initialize all testimonial carousels
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('[data-testimonials-carousel]');
  carousels.forEach(carousel => {
    new TestimonialsCarousel(carousel);
  });
});

// Re-initialize after Shopify section load
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const carousel = event.target.querySelector('[data-testimonials-carousel]');
    if (carousel) {
      new TestimonialsCarousel(carousel);
    }
  });
}
