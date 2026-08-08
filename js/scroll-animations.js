/* Lightweight Fast GSAP ScrollTrigger Animations (Zero Scroll Lag, Native Browser Scrolling) */

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
        y: 35,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.2
      });
    }

    // 2. Section Headings & Gold Dividers Fade & Scale
    document.querySelectorAll('.section-heading, .gold-divider').forEach(el => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.9,
        ease: 'power2.out'
      });
    });

    // 3. Countdown Ticker Boxes Staggered Scale-Up
    const countdownBoxes = document.querySelectorAll('.countdown-box');
    if (countdownBoxes.length) {
      gsap.from(countdownBoxes, {
        scrollTrigger: {
          trigger: '.countdown-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        scale: 0.94,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }

    // 4. Timeline Items Stagger Slide-In
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: -30,
        duration: 0.9,
        ease: 'power2.out'
      });
    });

    // 5. When & Where 2-Column Split Entrance
    const detailsSection = document.querySelector('#details .desktop-2col-grid');
    if (detailsSection) {
      gsap.from(detailsSection.children, {
        scrollTrigger: {
          trigger: detailsSection,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }

    // 6. MOMENTS Carousel Wrapper Scale & Reveal
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
      gsap.from(carouselWrapper, {
        scrollTrigger: {
          trigger: carouselWrapper,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 1,
        ease: 'power2.out'
      });
    }

    // 7. GOOD TO KNOW FAQ Items Staggered Fade Up
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      gsap.from(faqItems, {
        scrollTrigger: {
          trigger: '.faq-list',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 25,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }

    // 8. Inline RSVP & Congratulations Wall 2-Column Entrance
    const rsvpGrid = document.querySelector('#rsvp .desktop-2col-grid');
    if (rsvpGrid) {
      gsap.from(rsvpGrid.children, {
        scrollTrigger: {
          trigger: rsvpGrid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }
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
      setTimeout(initScroll, 500);
    });
  } else {
    initScroll();
  }
});
