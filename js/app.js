/* Main Application Coordinator, FAQ Accordion & Utilities */

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

  // Initialize FAQ Accordion
  new FAQAccordion();
});
