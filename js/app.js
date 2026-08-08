/* Main Application Coordinator, Swipeable Moments Carousel & FAQ Accordion */

class MomentsCarousel {
  constructor() {
    this.wrapper = document.getElementById('carousel-wrapper');
    this.track = document.querySelector('.carousel-track');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.prevBtn = document.getElementById('carousel-prev');
    this.nextBtn = document.getElementById('carousel-next');
    this.dotsContainer = document.getElementById('carousel-dots');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides ? this.slides.length : 0;
    
    // Touch Swipe Variables
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 40;

    if (this.track && this.totalSlides > 0) {
      this.init();
    }
  }

  init() {
    this.createDots();
    this.update();
    this.bindEvents();

    // Auto slide every 5 seconds
    setInterval(() => this.next(), 5000);
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Touch Swipe Handlers for Mobile & Desktop
    if (this.wrapper) {
      this.wrapper.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.wrapper.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });

      // Mouse drag simulation for desktop
      let isDragging = false;
      this.wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        this.touchStartX = e.clientX;
      });

      this.wrapper.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        this.touchEndX = e.clientX;
        this.handleSwipe();
      });
    }
  }

  handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance < 0) {
        // Swiped Left -> Next
        this.next();
      } else {
        // Swiped Right -> Prev
        this.prev();
      }
    }
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  goTo(index) {
    this.currentIndex = index;
    this.update();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.update();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.update();
  }

  update() {
    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }
}

class FAQAccordion {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    this.items.forEach(item => {
      const header = item.querySelector('.faq-header');
      if (header) {
        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          this.items.forEach(i => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Audio player toggle
  const audioWidget = document.getElementById('audio-widget');
  if (audioWidget) {
    audioWidget.addEventListener('click', () => {
      if (window.soundSystem) {
        window.soundSystem.toggleMusic();
      }
    });
  }

  // Initialize Swipeable Carousel & FAQ Accordion
  new MomentsCarousel();
  new FAQAccordion();
});
