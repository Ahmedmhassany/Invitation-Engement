/* Real-Time Event Countdown Timer (Target: May 2nd, 2026 20:00:00) */

class CountdownTimer {
  constructor(targetDateStr) {
    this.targetDate = new Date(targetDateStr).getTime();
    this.daysEl = document.getElementById('cd-days');
    this.hoursEl = document.getElementById('cd-hours');
    this.minsEl = document.getElementById('cd-minutes');
    this.secsEl = document.getElementById('cd-seconds');

    if (this.daysEl && this.hoursEl && this.minsEl && this.secsEl) {
      this.update();
      setInterval(() => this.update(), 1000);
    }
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      this.daysEl.textContent = '00';
      this.hoursEl.textContent = '00';
      this.minsEl.textContent = '00';
      this.secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.daysEl.textContent = String(days).padStart(2, '0');
    this.hoursEl.textContent = String(hours).padStart(2, '0');
    this.minsEl.textContent = String(minutes).padStart(2, '0');
    this.secsEl.textContent = String(seconds).padStart(2, '0');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CountdownTimer('2026-05-02T20:00:00');
});
