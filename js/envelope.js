/* Wax Seal Tap to Open Handler & Transition Logic */

document.addEventListener('DOMContentLoaded', () => {
  const waxSeal = document.getElementById('wax-seal');
  const coverOverlay = document.getElementById('cover-overlay');

  if (waxSeal && coverOverlay) {
    waxSeal.addEventListener('click', () => {
      // Add bursting animation class
      waxSeal.classList.add('bursting');

      // Fade out cover after animation
      setTimeout(() => {
        coverOverlay.classList.add('fade-out');
        document.body.style.overflow = 'auto';

        // Trigger entrance animations for main sections
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
          mainContent.style.opacity = '1';
        }
      }, 700);
    });
  }
});
