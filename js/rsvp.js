/* RSVP Form, Song Suggestions & Guestbook Notes Controller */

class RSVPManager {
  constructor() {
    this.modal = document.getElementById('rsvp-modal');
    this.form = document.getElementById('inline-rsvp-form') || document.getElementById('rsvp-form');
    this.guestbookContainer = document.getElementById('guestbook-list');
    
    // Initial notes referencing Mustafa & Salma with song recommendations
    this.initialWishes = [
      { id: 1, name: 'Omar & Noor', text: 'Sending you endless love and happiness! Can’t wait for the engagement party', song: 'El Bakht - Wegz', time: '2 hours ago', likes: 14 },
      { id: 2, name: 'Youssef Al-Sayed', text: 'Congratulations Mustafa and Salma! Wishing you a lifetime of joy', song: 'Amr Diab - Tamally Maak', time: '5 hours ago', likes: 9 },
      { id: 3, name: 'Amina & Tarek', text: 'So excited to celebrate with you both!', song: 'Cairokee - Ya El Mydan', time: '1 day ago', likes: 18 }
    ];

    this.init();
  }

  init() {
    this.loadWishes();
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmission();
      });
    }
  }

  handleSubmission() {
    const nameInput = document.getElementById('rsvp-name');
    const statusInput = document.querySelector('input[name="attendance"]:checked');
    const songInput = document.getElementById('rsvp-song');
    const wishInput = document.getElementById('rsvp-message');

    if (!nameInput || !nameInput.value.trim()) {
      this.showToast('Please enter your full name / برجاء كتابة الاسم الرباعي');
      return;
    }

    const name = nameInput.value.trim();
    const status = statusInput ? statusInput.value : 'attending';
    const song = songInput ? songInput.value.trim() : '';
    const message = wishInput ? wishInput.value.trim() : '';

    if (message || song) {
      this.addWish(name, message, song);
    }

    if (this.form) this.form.reset();

    const toastMsg = status === 'attending' 
      ? `Thank you ${name}! Your attendance has been confirmed`
      : `Thank you ${name} for letting us know! You will be missed`;
    
    this.showToast(toastMsg);
  }

  loadWishes() {
    const stored = localStorage.getItem('ms_guestbook_wishes_v2');
    const wishes = stored ? JSON.parse(stored) : this.initialWishes;
    this.renderWishes(wishes);
  }

  addWish(name, text, song) {
    const stored = localStorage.getItem('ms_guestbook_wishes_v2');
    const wishes = stored ? JSON.parse(stored) : [...this.initialWishes];

    const newWish = {
      id: Date.now(),
      name: name,
      text: text || 'Congratulations to the happy couple!',
      song: song ? `${song}` : '',
      time: 'Just now',
      likes: 1
    };

    wishes.unshift(newWish);
    localStorage.setItem('ms_guestbook_wishes_v2', JSON.stringify(wishes));
    this.renderWishes(wishes);
  }

  renderWishes(wishes) {
    if (!this.guestbookContainer) return;
    this.guestbookContainer.innerHTML = '';

    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${this.escapeHtml(w.name)}</span>
          <span class="wish-time">${w.time}</span>
        </div>
        <p class="wish-text">"${this.escapeHtml(w.text)}"</p>
        ${w.song ? `<div class="wish-song-badge" style="font-family: var(--font-body); font-size: 0.82rem; color: var(--gold-accent); margin-top: 0.4rem; font-weight: 500;">Suggested Song: ${this.escapeHtml(w.song)}</div>` : ''}
        <button class="wish-heart-btn" onclick="window.rsvpManager.likeWish(${w.id})">
          <svg class="heart-icon-svg" viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> <span>${w.likes}</span>
        </button>
      `;
      this.guestbookContainer.appendChild(card);
    });
  }

  likeWish(id) {
    const stored = localStorage.getItem('ms_guestbook_wishes_v2');
    const wishes = stored ? JSON.parse(stored) : [...this.initialWishes];

    const target = wishes.find(item => item.id === id);
    if (target) {
      target.likes += 1;
      localStorage.setItem('ms_guestbook_wishes_v2', JSON.stringify(wishes));
      this.renderWishes(wishes);
    }
  }

  showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.rsvpManager = new RSVPManager();
});
