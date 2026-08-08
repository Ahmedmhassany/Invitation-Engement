/* Audio System: Web Audio Synth Chime & Background Music Controller */

class SoundSystem {
  constructor() {
    this.audioCtx = null;
    this.isPlayingMusic = false;
    this.bgAudio = null;
    this.initAudioElement();
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initAudioElement() {
    // Fairouz - Adesh Kan Fi Nas Instrumental by Joe Youhanna
    this.bgAudio = new Audio(encodeURI('assets/Adesh Kan Fi Nas (Fairouz) Instrumental by Joe Youhanna.mp3.mpeg'));
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.4;
  }

  playSealChime() {
    // Disabled entrance chime sound
  }

  playBellNote(freq, duration) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  toggleMusic() {
    this.initContext();
    const widget = document.getElementById('audio-widget');
    
    if (this.isPlayingMusic) {
      this.bgAudio.pause();
      this.isPlayingMusic = false;
      if (widget) widget.classList.remove('audio-playing');
    } else {
      this.bgAudio.play().then(() => {
        this.isPlayingMusic = true;
        if (widget) widget.classList.add('audio-playing');
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  }

  startMusicOnOpen() {
    if (this.isPlayingMusic) return;
    this.initContext();
    const widget = document.getElementById('audio-widget');
    this.bgAudio.play().then(() => {
      this.isPlayingMusic = true;
      if (widget) widget.classList.add('audio-playing');
    }).catch((err) => {
      console.log('Audio autoplay waiting for user interaction:', err);
    });
  }
}

window.soundSystem = new SoundSystem();

// Auto-play music as soon as user interacts anywhere on page
document.addEventListener('click', () => {
  if (window.soundSystem && !window.soundSystem.isPlayingMusic) {
    window.soundSystem.startMusicOnOpen();
  }
}, { once: true });

