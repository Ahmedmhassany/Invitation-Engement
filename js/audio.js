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
    // Royalty-free acoustic wedding song stream/synthesized ambient music
    this.bgAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=acoustic-wedding-love-story-112876.mp3');
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.4;
  }

  playSealChime() {
    this.initContext();
    if (!this.audioCtx) return;

    // Elegant harp chord synthesizer (C Major / E G C E notes)
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playBellNote(freq, 1.2);
      }, index * 90);
    });
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
    this.initContext();
    const widget = document.getElementById('audio-widget');
    this.bgAudio.play().then(() => {
      this.isPlayingMusic = true;
      if (widget) widget.classList.add('audio-playing');
    }).catch(() => {
      // Audio autoplay policy fallback
    });
  }
}

window.soundSystem = new SoundSystem();
