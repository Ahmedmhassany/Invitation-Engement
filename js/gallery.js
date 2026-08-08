/* Photo Gallery Lightbox Viewer */

class GalleryLightbox {
  constructor() {
    this.modal = document.getElementById('gallery-modal');
    this.lightboxImg = document.getElementById('lightbox-image');
    this.init();
  }

  init() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && this.modal && this.lightboxImg) {
          this.lightboxImg.src = img.src;
          this.modal.classList.add('active');
        }
      });
    });

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal || e.target.classList.contains('modal-close-btn')) {
          this.modal.classList.remove('active');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GalleryLightbox();
});
