/**
 * Web Audio Synthesizer untuk Monadian SFX Block Blast (Juicy, Bubbly & Tactile)
 * 100% prosedural tanpa download asset eksternal.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.isMuted;
  }

  /**
   * BGM Cyber Arcade Prosedural Santai (112 BPM, Pentatonik)
   * 100% sintetis Web Audio API tanpa download aset.
   */
  public startBGM() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    const notes = [
      261.63, 329.63, 392.00, 523.25, // C chord
      220.00, 261.63, 329.63, 440.00, // Am chord
      174.61, 220.00, 261.63, 349.23, // F chord
      196.00, 246.94, 293.66, 392.00, // G chord
    ];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.ctx || !this.isBgmPlaying || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[noteIdx % notes.length], now);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);

      noteIdx++;
    };

    if (typeof window !== 'undefined') {
      this.bgmInterval = window.setInterval(playNextNote, 240);
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval && typeof window !== 'undefined') {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  /**
   * SFX saat balok disentuh/diangkat (Juicy Bubble Pop)
   */
  public playPickup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.06);
  }

  /**
   * SFX saat balok berhasil mendarat (Satisfying Woody Pop / Snap)
   */
  public playDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Layer 1: Low punch
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(260, now);
    osc1.frequency.exponentialRampToValueAtTime(90, now + 0.08);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    // Layer 2: Click
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(650, now);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.04);
    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.08);
    osc2.stop(now + 0.08);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  }

  /**
   * SFX saat garis meledak (Joyful Resonant Chime + Pop)
   */
  public playLineClear(lines: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = lines > 1 ? [392.00, 523.25, 659.25, 783.99] : [523.25, 659.25];

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.18);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 20, 50]);
    }
  }

  /**
   * SFX Combo bertingkat (Ascending High Octave Arpeggio)
   */
  public playCombo(streak: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const baseNotes = [329.63, 392.00, 523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    const noteIdx = Math.min(streak + 1, baseNotes.length - 1);
    const freq = baseNotes[noteIdx];

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.08, now + 0.25);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.28);
  }

  /**
   * SFX Tembakan Sabotase (Laser Zap + Thud)
   */
  public playSabotage() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.18);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(60);
    }
  }

  /**
   * SFX Kemenangan (Victory Royale Fanfare)
   */
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    const now = this.ctx.currentTime;
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.3, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  }

  /**
   * SFX Kekalahan / Game Over
   */
  public playDefeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const tones = [440, 370, 311, 261];
    const now = this.ctx.currentTime;
    tones.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.25, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.25);
    });
  }
}

export const sounds = new SoundEngine();
