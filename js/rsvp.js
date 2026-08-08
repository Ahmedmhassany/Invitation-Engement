/* RSVP Form, Song Suggestions & Guestbook Notes Controller */

// Place your Google Apps Script Web App URL here to receive RSVP submissions directly in Google Sheets:
window.GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxIQXNA4droLQL0i8OLiAIcATObE05Nkn5Zdo9vNFPN7lfuGu4EZOTXrQrNMEmq0el9/exec";

class RSVPManager {
  constructor() {
    this.modal = document.getElementById('rsvp-modal');
    this.form = document.getElementById('inline-rsvp-form') || document.getElementById('rsvp-form');
    this.guestbookContainer = document.getElementById('guestbook-list');
    this.googleSheetUrl = window.GOOGLE_SHEETS_SCRIPT_URL || "";
    
    // Remove dummy data - fetch live responses from Google Sheets
    this.initialWishes = [];

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

  async handleSubmission() {
    const nameInput = document.getElementById('rsvp-name');
    const statusInput = document.querySelector('input[name="attendance"]:checked');
    const guestsInput = document.getElementById('rsvp-guests');
    const songInput = document.getElementById('rsvp-song');
    const wishInput = document.getElementById('rsvp-message');
    const submitBtn = this.form ? this.form.querySelector('button[type="submit"]') : null;

    if (!nameInput || !nameInput.value.trim()) {
      this.showToast('Please enter your full name');
      return;
    }

    const name = nameInput.value.trim();
    const status = statusInput ? statusInput.value : 'attending';
    const guests = guestsInput ? guestsInput.value : '1';
    const song = songInput ? songInput.value.trim() : '';
    const message = wishInput ? wishInput.value.trim() : '';

    // Disable button temporarily during submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
    }

    // 1. Send to Google Sheet if Web App URL is configured
    if (this.googleSheetUrl) {
      try {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('attendance', status === 'attending' ? 'Joyfully Accept' : 'Regretfully Decline');
        formData.append('guests', guests);
        formData.append('song', song);
        formData.append('message', message);
        formData.append('timestamp', new Date().toLocaleString());

        await fetch(this.googleSheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString()
        });
      } catch (err) {
        console.warn('Google Sheet submission warning:', err);
      }
    }

    // 2. Local update if message or song was provided
    if (message || song) {
      this.addWish(name, message, song);
    }

    if (this.form) this.form.reset();

    // Re-enable button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || 'CONFIRM ATTENDANCE & SUBMIT';
    }

    const toastMsg = status === 'attending' 
      ? `Thank you ${name}! Your attendance has been confirmed`
      : `Thank you ${name} for letting us know! You will be missed`;
    
    this.showToast(toastMsg);

    // Re-sync wishes from sheet after 1.5 seconds
    setTimeout(() => this.loadWishes(), 1500);
  }

  async loadWishes() {
    if (this.googleSheetUrl) {
      try {
        const response = await fetch(this.googleSheetUrl);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            this.renderWishes(data);
            return;
          }
        }
      } catch (e) {
        console.log('Fetching live wishes from Google Sheet, falling back to local:', e);
      }
    }

    const stored = localStorage.getItem('ms_guestbook_wishes_v2');
    const wishes = stored ? JSON.parse(stored) : [];
    this.renderWishes(wishes);
  }

  addWish(name, text, song) {
    const stored = localStorage.getItem('ms_guestbook_wishes_v2');
    const wishes = stored ? JSON.parse(stored) : [];

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

    if (!wishes || wishes.length === 0) {
      this.guestbookContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-style: italic; padding: 2rem 1rem;">
          Be the first to leave a message and song suggestion for Mustafa & Salma!
        </div>
      `;
      return;
    }

    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      const wishText = w.text ? `"${this.escapeHtml(w.text)}"` : '';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${this.escapeHtml(w.name)}</span>
          <span class="wish-time">${w.time || 'Recently'}</span>
        </div>
        ${wishText ? `<p class="wish-text">${wishText}</p>` : ''}
        ${w.song ? `<div class="wish-song-badge" style="font-family: var(--font-body); font-size: 0.82rem; color: var(--gold-accent); margin-top: 0.4rem; font-weight: 500;">Suggested Song: ${this.escapeHtml(w.song)}</div>` : ''}
        <button class="wish-heart-btn" onclick="window.rsvpManager.likeWish(${w.id})">
          <svg class="heart-icon-svg" viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> <span>${w.likes || 1}</span>
        </button>
      `;
      this.guestbookContainer.appendChild(card);
    });
  }

  likeWish(id) {
    const stored = localStorage.getItem('ms_guestbook_wishes_v2');
    const wishes = stored ? JSON.parse(stored) : [];

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
