// Web Audio API Procedural Sound Synthesizer for CodeQuest
// Zero external mp3 dependencies - works 100% reliably in any browser

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private lastStepTime = 0;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;

  // Battle Theme State
  private themeInterval: any = null;
  public isThemePlaying: boolean = false;
  private themeMasterGain: GainNode | null = null;
  private themeStep: number = 0;

  constructor() {
    this.isMuted = localStorage.getItem('codequest_muted') === 'true';
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('codequest_muted', String(this.isMuted));
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx ? this.ctx.currentTime : 0);
    }
    if (this.themeMasterGain) {
      this.themeMasterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, this.ctx ? this.ctx.currentTime : 0);
    }
    return this.isMuted;
  }

  // ==========================================
  // EPIC PUBG / FREE FIRE STYLE BATTLE THEME
  // ==========================================
  public startBattleTheme() {
    if (this.isThemePlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isThemePlaying = true;
    this.themeStep = 0;

    this.themeMasterGain = this.ctx.createGain();
    this.themeMasterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime);
    this.themeMasterGain.connect(this.ctx.destination);

    // 126 BPM = ~119ms per 16th note
    const stepMs = 119;

    const bassNotes = [
      73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 110.00, 87.31,
      73.42, 73.42, 87.31, 73.42, 116.54, 110.00, 98.00, 87.31
    ];

    const melodySteps: { [step: number]: number } = {
      0: 293.66,  // D4
      4: 349.23,  // F4
      8: 392.00,  // G4
      12: 440.00, // A4
      16: 523.25, // C5
      20: 440.00, // A4
      24: 392.00, // G4
      28: 349.23  // F4
    };

    this.themeInterval = setInterval(() => {
      if (!this.ctx || !this.isThemePlaying) return;
      const now = this.ctx.currentTime;
      const step16 = this.themeStep % 32;

      // 1. KICK DRUM
      if (step16 % 4 === 0) {
        this.playDrumKick(now);
      }

      // 2. SNARE
      if (step16 % 8 === 4) {
        this.playDrumSnare(now);
      }

      // 3. HI-HAT
      this.playDrumHiHat(now, step16 % 2 === 0 ? 0.04 : 0.02);

      // 4. BASSLINE SYNTH
      const bassFreq = bassNotes[this.themeStep % bassNotes.length];
      this.playBassNote(now, bassFreq);

      // 5. HEROIC LEAD MELODY
      if (melodySteps[step16]) {
        this.playLeadNote(now, melodySteps[step16]);
      }

      this.themeStep++;
    }, stepMs);
  }

  public stopBattleTheme() {
    this.isThemePlaying = false;
    if (this.themeInterval) {
      clearInterval(this.themeInterval);
      this.themeInterval = null;
    }
    if (this.themeMasterGain && this.ctx) {
      this.themeMasterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    }
  }

  public toggleBattleTheme(): boolean {
    if (this.isThemePlaying) {
      this.stopBattleTheme();
    } else {
      this.startBattleTheme();
    }
    return this.isThemePlaying;
  }

  // Drum Synthesizers for Theme
  private playDrumKick(now: number) {
    if (!this.ctx || !this.themeMasterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.themeMasterGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  private playDrumSnare(now: number) {
    if (!this.ctx || !this.themeMasterGain) return;
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(this.themeMasterGain);
    osc.start(now);
    osc.stop(now + 0.1);

    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.themeMasterGain);
    noise.start(now);
    noise.stop(now + 0.12);
  }

  private playDrumHiHat(now: number, vol: number) {
    if (!this.ctx || !this.themeMasterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.themeMasterGain);
    noise.start(now);
    noise.stop(now + 0.04);
  }

  private playBassNote(now: number, freq: number) {
    if (!this.ctx || !this.themeMasterGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.1);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.themeMasterGain);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  private playLeadNote(now: number, freq: number) {
    if (!this.ctx || !this.themeMasterGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.006, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(1000, now + 0.38);

    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.themeMasterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.42);
    osc2.stop(now + 0.42);
  }

  // ==========================================
  // GAME 1: MAZE ROBOT SOUNDS (PER LEVEL)
  // ==========================================

  // Distinct robot movement sound for Level 1, Level 2, and Level 3
  public playMazeStep(level: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (level === 1) {
      // Level 1: Playful high 8-bit chip blip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    } else if (level === 2) {
      // Level 2: Deeper hydraulic servo click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    } else {
      // Level 3: Resonant quantum phase pulse
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Pitch-escalating gem collect sound by gem count and level
  public playGemPickup(gemCount: number, level: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Scale notes based on level
    const scales: { [lvl: number]: number[] } = {
      1: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50], // C Maj Pentatonic
      2: [659.25, 739.99, 830.61, 987.77, 1108.73, 1318.51], // E Maj Sparkle
      3: [880.00, 987.77, 1174.66, 1318.51, 1567.98, 1760.00] // A Maj High Crystal
    };

    const notes = scales[level] || scales[1];
    const freq = notes[Math.min(gemCount, notes.length - 1)];

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.5, now); // Fifth harmonic

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.28);
    osc2.stop(now + 0.28);
  }

  // Triumphal Fanfare tailored to each maze level
  public playMazeWin(level: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords: { [lvl: number]: number[] } = {
      1: [523.25, 659.25, 783.99, 1046.50], // Level 1: Bright C Major
      2: [587.33, 739.99, 880.00, 1174.66], // Level 2: Victorious D Major
      3: [659.25, 830.61, 987.77, 1318.51]  // Level 3: Majestic E Major
    };

    const notes = chords[level] || chords[1];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const st = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(st);
      osc.stop(st + 0.45);
    });
  }

  // ==========================================
  // GAME 2: BUG HUNTER SOUNDS (PER WAVE)
  // ==========================================

  // Laser zap tuned to wave intensity
  public playBugZap(wave: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (wave === 1) {
      // Wave 1: Crisp high-pitch electric laser tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (wave === 2) {
      // Wave 2: Plasma beam sizzle
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      // Wave 3: Quantum disintegrator zap (Deep bass crack + saw whip)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(1800, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(280, now);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.15);
    }
  }

  // Wave Victory Jingle
  public playWaveVictory(wave: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 440 + wave * 60;
    const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const st = now + idx * 0.07;
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, st);
      gain.gain.setValueAtTime(0.18, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(st);
      osc.stop(st + 0.35);
    });
  }

  // ==========================================
  // GAME 3: STACK TOWER SOUNDS (LIFO)
  // ==========================================

  // PUSH: Pneumatic hydraulic cylinder slide & lock
  public playStackPush() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.1); // Ascending slide

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // POP: Spring-loaded recoil ejection snap
  public playStackPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.09); // Descending pop snap

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // ==========================================
  // GENERAL & CINEMATIC SOUNDS
  // ==========================================

  // Cinematic Impact Bass Drop (When player presses "START GAME")
  public playGameStartImpact() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(220, now);
    boomOsc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

    boomGain.gain.setValueAtTime(0.7, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 1.2);

    const laserOsc = this.ctx.createOscillator();
    const laserGain = this.ctx.createGain();
    laserOsc.type = 'sawtooth';
    laserOsc.frequency.setValueAtTime(1800, now);
    laserOsc.frequency.exponentialRampToValueAtTime(100, now + 0.25);

    laserGain.gain.setValueAtTime(0.4, now);
    laserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    laserOsc.connect(laserGain);
    laserGain.connect(this.ctx.destination);
    laserOsc.start(now);
    laserOsc.stop(now + 0.25);
  }

  // Atmospheric Jungle & River Ambience Generator
  public startJungleAmbience() {
    if (this.isAmbientPlaying || this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.isAmbientPlaying = true;
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.06, now);

      const windOsc = this.ctx.createOscillator();
      const windFilter = this.ctx.createBiquadFilter();
      windOsc.type = 'sine';
      windOsc.frequency.setValueAtTime(65, now);
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(140, now);

      windOsc.connect(windFilter);
      windFilter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      windOsc.start();
    } catch {}
  }

  // UI Click sound
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Positive victory sound
  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.setValueAtTime(659.25, now + 0.08);
    osc1.frequency.setValueAtTime(783.99, now + 0.16);
    osc1.frequency.setValueAtTime(1046.50, now + 0.24);

    osc2.frequency.setValueAtTime(261.63, now);
    osc2.frequency.setValueAtTime(329.63, now + 0.08);
    osc2.frequency.setValueAtTime(392.00, now + 0.16);
    osc2.frequency.setValueAtTime(523.25, now + 0.24);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  }

  // Level Up fanfare
  public playLevelUp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = this.ctx!.currentTime + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Error buzz
  public playError() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Match countdown tick
  public playCountdown() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Deep ancient stone door grinding / rumble
  public playStoneRumble() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.linearRampToValueAtTime(35, now + 2.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(240, now);
    filter.frequency.linearRampToValueAtTime(90, now + 2.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.2);
  }

  // TRICKY SOUND: Eerie ancient chime / mystical FM pulse
  public playTrickyChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const carrier = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const masterGain = this.ctx.createGain();

    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(432, now);
    carrier.frequency.exponentialRampToValueAtTime(324, now + 1.2);

    modulator.type = 'sawtooth';
    modulator.frequency.setValueAtTime(27.5, now);
    modulator.frequency.exponentialRampToValueAtTime(14, now + 1.2);

    modGain.gain.setValueAtTime(350, now);
    modGain.gain.exponentialRampToValueAtTime(10, now + 1.2);

    masterGain.gain.setValueAtTime(0.2, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    carrier.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    modulator.start(now);
    carrier.start(now);
    modulator.stop(now + 1.4);
    carrier.stop(now + 1.4);
  }

  // TRICKY SOUND: Ancient Deep Gong / Alarm
  public playAncientGong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(82.41, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(116.54, now);
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(164.81, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 2.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);
    osc3.stop(now + 2.5);
  }

  // TRICKY SOUND: Shimmering Celestial Crystal Arpeggio
  public playCrystalCollect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const st = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, st + 0.35);

      gain.gain.setValueAtTime(0.15, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(st);
      osc.stop(st + 0.35);
    });
  }

  // TRICKY SOUND: Cute High-Tech Chirp for AI Companion Drone "BYTE"
  public playDroneChirp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [1200, 1800, 2400];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const st = now + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);
      osc.frequency.exponentialRampToValueAtTime(freq + 400, st + 0.05);

      gain.gain.setValueAtTime(0.1, st);
      gain.gain.exponentialRampToValueAtTime(0.01, st + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(st);
      osc.stop(st + 0.05);
    });
  }

  // Ethereal ancient rune hum
  public playRuneHum() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.linearRampToValueAtTime(440, now + 1.2);

    osc2.frequency.setValueAtTime(222, now);
    osc2.frequency.linearRampToValueAtTime(442, now + 1.2);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
  }

  // Footstep audio on jungle soil
  public playFootstep(isRunning: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = Date.now();
    const cooldown = isRunning ? 260 : 420;
    if (now - this.lastStepTime < cooldown) return;
    this.lastStepTime = now;

    const audioNow = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 30, audioNow);
    osc.frequency.exponentialRampToValueAtTime(40, audioNow + 0.06);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioNow);

    gain.gain.setValueAtTime(isRunning ? 0.09 : 0.05, audioNow);
    gain.gain.exponentialRampToValueAtTime(0.001, audioNow + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(audioNow);
    osc.stop(audioNow + 0.06);
  }
}

export const sound = new SoundEngine();
