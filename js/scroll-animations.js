/* Lightweight Fast GSAP ScrollTrigger Animations with Auto-Clear (Ensures 100% High-Contrast Visibility) */

class LuxuryScrollSystem {
  constructor() {
    this.initGSAP();
  }

  initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Card Entrance Animation
    const heroElements = document.querySelectorAll('#home .subtitle-uppercase, #home .names-display, #home .event-date-text, #home .heart-icon-small');
    if (heroElements.length) {
      gsap.from(heroElements, {
        opacity: 0,
        y: 25,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }

    // 2. Section Headings & Gold Dividers
    document.querySelectorAll('.section-heading, .gold-divider').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });

    // 3. Countdown Ticker Boxes
    const countdownBoxes = document.querySelectorAll('.countdown-box');
    if (countdownBoxes.length) {
      gsap.from(countdownBoxes, {
        scrollTrigger: {
          trigger: '.countdown-grid',
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }

    // 4. Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -25,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });

    // 5. When & Where 2-Column Split
    const detailsSection = document.querySelector('#details .desktop-2col-grid');
    if (detailsSection) {
      gsap.from(detailsSection.children, {
        scrollTrigger: {
          trigger: detailsSection,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }

    // 6. MOMENTS Carousel Wrapper
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
      gsap.from(carouselWrapper, {
        scrollTrigger: {
          trigger: carouselWrapper,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }

    // 7. GOOD TO KNOW FAQ Items
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      gsap.from(faqItems, {
        scrollTrigger: {
          trigger: '.faq-list',
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }

    // 8. Inline RSVP & Guestbook Wall
    const rsvpGrid = document.querySelector('#rsvp .desktop-2col-grid');
    if (rsvpGrid) {
      gsap.from(rsvpGrid.children, {
        scrollTrigger: {
          trigger: rsvpGrid,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }

    // Refresh ScrollTrigger after DOM load
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const initScroll = () => {
    setTimeout(() => {
      window.luxuryScrollSystem = new LuxuryScrollSystem();
    }, 100);
  };

  const waxSeal = document.getElementById('wax-seal');
  if (waxSeal) {
    waxSeal.addEventListener('click', () => {
      setTimeout(initScroll, 400);
    });
  } else {
    initScroll();
  }
});
