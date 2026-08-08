/* 3D Coverflow Gallery & Photo Lightbox Controller with Unified Touch & Drag Swiping */

class Smooth3DSlideshow {
  constructor() {
    this.wrapper = document.getElementById('carousel-wrapper');
    this.track = document.querySelector('.carousel-track');
    this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
    
    if (!this.wrapper || !this.track || this.slides.length === 0) return;
    
    this.active = 0;
    this.n = this.slides.length;
    
    // Coverflow properties
    this.gap = 0.55; // percentage spacing based on card width
    this.tilt = 12;
    this.sideTilt = 4;
    this.depth = 180;
    this.scaleStep = 0.15;
    this.opacity = 100; // 100% visibility (no dimming of inactive cards)
    this.maxVisible = 2;
    this.autoplay = true;
    this.autoplayDelay = 3500;
    this.autoplayInterval = null;
    this.lock = false;
    
    this.init();
  }
  
  init() {
    // 1. Setup wrappers and track dimensions
    this.wrapper.classList.add('coverflow-3d-wrapper');
    this.track.classList.add('coverflow-3d-track');
    
    // 2. Add dim overlays to all slides
    this.slides.forEach((slide, index) => {
      slide.classList.add('coverflow-3d-slide');
      
      const overlay = document.createElement('div');
      overlay.className = 'slide-dim-overlay';
      slide.appendChild(overlay);
      
      // Make slides clickable
      slide.addEventListener('click', (e) => {
        // Prevent action if dragged
        if (this.wasDragged) {
          this.wasDragged = false;
          return;
        }
        if (this.lock) return;
        if (index === this.active) {
          this.showLightbox(slide.querySelector('img').src);
        } else {
          this.setActive(index);
          this.resetAutoplay();
        }
      });
    });
    
    // 3. Bind Swipe & Drag events
    this.bindSwipeAndDragEvents();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.step(-1);
        this.resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        this.step(1);
        this.resetAutoplay();
      }
    });
    
    // 4. Initial layout render
    this.update();
    
    // 5. Start autoplay
    this.startAutoplay();
  }
  
  setActive(index) {
    if (this.lock) return;
    this.lock = true;
    this.active = index;
    this.update();
    setTimeout(() => {
      this.lock = false;
    }, 600); // Settles after transition settling lock
  }
  
  step(dir) {
    const nextIndex = (((this.active + dir) % this.n) + this.n) % this.n;
    this.setActive(nextIndex);
  }
  
  update() {
    const dimVal = 1 - (this.opacity / 100);
    
    this.slides.forEach((slide, i) => {
      let rel = i - this.active;
      // Loop wrapping calculation
      if (rel > this.n / 2) rel -= this.n;
      if (rel < -this.n / 2) rel += this.n;
      
      const ax = Math.abs(rel);
      const visible = ax <= this.maxVisible;
      const isActive = rel === 0;
      
      if (visible) {
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'auto';
      } else {
        slide.style.opacity = '0';
        slide.style.pointerEvents = 'none';
      }
      
      // Coverflow 3D equations
      const cardWidth = slide.offsetWidth || 360;
      const sc = Math.max(0.4, 1 - ax * this.scaleStep);
      const tx = rel * cardWidth * this.gap;
      const tz = -ax * this.depth;
      const ry = -rel * this.tilt;
      const rz = rel * this.sideTilt;
      
      slide.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
      
      // Dim overlay control
      const overlay = slide.querySelector('.slide-dim-overlay');
      if (overlay) {
        overlay.style.opacity = isActive ? '0' : dimVal;
      }
      
      // CSS active class helper
      if (isActive) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }
  
  startAutoplay() {
    if (!this.autoplay) return;
    this.autoplayInterval = setInterval(() => {
      this.step(1);
    }, this.autoplayDelay);
  }
  
  resetAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.startAutoplay();
    }
  }
  
  bindSwipeAndDragEvents() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    this.wasDragged = false;
    
    // Unified Touch Start
    this.wrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.wasDragged = false;
    }, { passive: true });
    
    // Unified Touch Move
    this.wrapper.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const deltaX = Math.abs(startX - currentX);
      if (deltaX > 10) {
        this.wasDragged = true;
      }
    }, { passive: true });
    
    // Unified Touch End
    this.wrapper.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - currentX;
      if (Math.abs(diff) > 40 && currentX !== 0) { // swipe threshold
        if (diff > 0) {
          this.step(1);
        } else {
          this.step(-1);
        }
        this.resetAutoplay();
      }
      currentX = 0;
    }, { passive: true });
    
    // Unified Mouse Drag Start (Desktop)
    this.wrapper.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      currentX = startX;
      isDragging = true;
      this.wasDragged = false;
      this.wrapper.style.cursor = 'grabbing';
      // Prevent standard text/image dragging selection
      e.preventDefault();
    });
    
    // Unified Mouse Drag Move (Desktop)
    this.wrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      const deltaX = Math.abs(startX - currentX);
      if (deltaX > 10) {
        this.wasDragged = true;
      }
    });
    
    // Unified Mouse Drag End (Desktop)
    this.wrapper.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      this.wrapper.style.cursor = 'grab';
      
      const diff = startX - currentX;
      if (Math.abs(diff) > 40 && currentX !== startX) {
        if (diff > 0) {
          this.step(1);
        } else {
          this.step(-1);
        }
        this.resetAutoplay();
      }
    });
    
    // Reset mouse drag if cursor leaves wrapper
    this.wrapper.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        this.wrapper.style.cursor = 'grab';
      }
    });
    
    // Initial wrapper cursor styling
    this.wrapper.style.cursor = 'grab';
  }
  
  showLightbox(src) {
    const modal = document.getElementById('gallery-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    if (modal && lightboxImg) {
      lightboxImg.src = src;
      modal.classList.add('active');
    }
  }
}

// Instantiate Slideshow and set Lightbox close trigger on load
document.addEventListener('DOMContentLoaded', () => {
  new Smooth3DSlideshow();
  
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
        modal.classList.remove('active');
      }
    });
  }
});
