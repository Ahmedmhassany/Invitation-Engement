/* RSVP Form, Guestbook Wishes Wall & Toast Notification Controller */

class RSVPManager {
  constructor() {
    this.modal = document.getElementById('rsvp-modal');
    this.form = document.getElementById('rsvp-form');
    this.guestbookContainer = document.getElementById('guestbook-list');
    
    // Initial wishes referencing Mustafa & Salma
    this.initialWishes = [
      { id: 1, name: 'Omar & Noor', text: 'Sending you endless love and happiness! Can’t wait for the Henna night 🎉', time: '2 hours ago', likes: 14 },
      { id: 2, name: 'Youssef Al-Sayed', text: 'Congratulations Mustafa and Salma! Wishing you a lifetime of joy and togetherness ❤️', time: '5 hours ago', likes: 9 },
      { id: 3, name: 'Amina & Tarek', text: 'So happy for both of you! May your love grow stronger with each passing day ✨', time: '1 day ago', likes: 18 }
    ];

    this.init();
  }

  init() {
    this.loadWishes();
    this.bindEvents();
  }

  bindEvents() {
    // Open RSVP buttons
    document.querySelectorAll('.open-rsvp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    // Close RSVP modal buttons
    document.querySelectorAll('.close-rsvp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Form submit
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmission();
      });
    }

    // Modal overlay click outside
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }
  }

  openModal() {
    if (this.modal) this.modal.classList.add('active');
  }

  closeModal() {
    if (this.modal) this.modal.classList.remove('active');
  }

  handleSubmission() {
    const nameInput = document.getElementById('rsvp-name');
    const statusInput = document.querySelector('input[name="attendance"]:checked');
    const wishInput = document.getElementById('rsvp-message');

    if (!nameInput || !nameInput.value.trim()) {
      this.showToast('Please enter your full name');
      return;
    }

    const name = nameInput.value.trim();
    const status = statusInput ? statusInput.value : 'attending';
    const message = wishInput ? wishInput.value.trim() : '';

    if (message) {
      this.addWish(name, message);
    }

    this.closeModal();
    const form = document.getElementById('inline-rsvp-form') || this.form;
    if (form) form.reset();

    const toastMsg = status === 'attending' 
      ? `Thank you ${name}! Your RSVP has been confirmed ❤️`
      : `Thank you ${name} for letting us know! You will be missed ✨`;
    
    this.showToast(toastMsg);
  }

  loadWishes() {
    const stored = localStorage.getItem('ms_guestbook_wishes');
    const wishes = stored ? JSON.parse(stored) : this.initialWishes;
    this.renderWishes(wishes);
  }

  addWish(name, text) {
    const stored = localStorage.getItem('ms_guestbook_wishes');
    const wishes = stored ? JSON.parse(stored) : [...this.initialWishes];

    const newWish = {
      id: Date.now(),
      name: name,
      text: text,
      time: 'Just now',
      likes: 1
    };

    wishes.unshift(newWish);
    localStorage.setItem('ms_guestbook_wishes', JSON.stringify(wishes));
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
        <button class="wish-heart-btn" onclick="window.rsvpManager.likeWish(${w.id})">
          ❤️ <span>${w.likes}</span>
        </button>
      `;
      this.guestbookContainer.appendChild(card);
    });
  }

  likeWish(id) {
    const stored = localStorage.getItem('ms_guestbook_wishes');
    const wishes = stored ? JSON.parse(stored) : [...this.initialWishes];

    const target = wishes.find(item => item.id === id);
    if (target) {
      target.likes += 1;
      localStorage.setItem('ms_guestbook_wishes', JSON.stringify(wishes));
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
