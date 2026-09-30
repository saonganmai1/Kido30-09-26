// Audio helper using Web Audio API and Web Speech API for TTS and UI sound effects

class AudioService {
  private audioCtx: AudioContext | null = null;
  private musicOsc1: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private musicVolume: number = 0.5;

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = typeof window !== 'undefined' ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null;
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play UI button click chime
   */
  public playClickSound() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio click disabled", e);
    }
  }

  /**
   * Play Star reward / Success chime sound
   */
  public playSuccessSound() {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
      });
    } catch (e) {
      console.warn("Audio success failed", e);
    }
  }

  /**
   * Play Cheering & Clapping / Applause sound effect when a kid completes a practice exercise
   */
  public playApplauseSound() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Synthesize a series of rapid energetic applause/cheering claps
      for (let i = 0; i < 24; i++) {
        const time = now + (i * 0.045) + (Math.random() * 0.02);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(320 + Math.random() * 850, time);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400 + Math.random() * 1600, time);
        filter.Q.setValueAtTime(1.8, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.14 + Math.random() * 0.08, time + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05 + Math.random() * 0.03);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.08);
      }

      // Also trigger victory fanfare along with the applause
      this.playFanfareSound();
    } catch (e) {
      console.warn("Audio applause failed", e);
    }
  }

  /**
   * Play Error / Warning alert sound
   */
  public playErrorSound() {
    try {
      const ctx = this.getContext();
      const notes = [329.63, 261.63, 220.00]; // E4, C4, A3 (descending tone)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.15);
      });
    } catch (e) {
      console.warn("Audio error failed", e);
    }
  }

  /**
   * Play Coin / Star collect sound
   */
  public playCoinSound() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {
      console.warn("Audio coin failed", e);
    }
  }

  /**
   * Play Streak / Fire combo sound
   */
  public playStreakSound() {
    try {
      const ctx = this.getContext();
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.2);
      });
    } catch (e) {
      console.warn("Audio streak failed", e);
    }
  }

  /**
   * Play Victory Fanfare celebratory sound
   */
  public playFanfareSound() {
    try {
      const ctx = this.getContext();
      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.25 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.50, d: 0.4 }, // C6
      ];
      let t = ctx.currentTime;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + note.d);
        t += note.d + 0.03;
      });
    } catch (e) {
      console.warn("Audio fanfare failed", e);
    }
  }

  /**
   * Play Timer alarm sound
   */
  public playTimerAlarm() {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.50, 1046.50]; // C5, E5, G5, C6 x2
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.25);
      });
    } catch (e) {
      console.warn("Audio timer alarm failed", e);
    }
  }

  /**
   * Universal Text-To-Speech Pronunciation helper
   */
  public speakText(text: string, lang: 'en' | 'vi' = 'en') {
    if (lang === 'vi') {
      this.speakVietnamese(text);
    } else {
      this.speakEnglish(text);
    }
  }

  /**
   * English Text-To-Speech Pronunciation
   */
  public speakEnglish(text: string, rate: number = 0.9) {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        utterance.pitch = 1.1; // Friendly pitch for kids
        utterance.onerror = () => {};
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis disabled or blocked", e);
    }
  }

  /**
   * Vietnamese Text-To-Speech Pronunciation
   */
  public speakVietnamese(text: string, rate: number = 0.9) {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = rate;
        utterance.pitch = 1.0;
        utterance.onerror = () => {};
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis disabled or blocked", e);
    }
  }

  /**
   * Toggle Relaxing Ambient Study Music
   */
  public toggleStudyMusic(play?: boolean, onStatusChange?: (playing: boolean) => void) {
    const shouldPlay = play !== undefined ? play : !this.isMusicPlaying;
    if (shouldPlay) {
      this.startStudyMusic();
    } else {
      this.stopStudyMusic();
    }
    if (onStatusChange) onStatusChange(this.isMusicPlaying);
    return this.isMusicPlaying;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.musicGain && this.audioCtx) {
      this.musicGain.gain.setValueAtTime(vol * 0.08, this.audioCtx.currentTime);
    }
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  private startStudyMusic() {
    try {
      if (this.isMusicPlaying) return;
      const ctx = this.getContext();
      
      const osc1 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
      
      // Gentle chord oscillation for peaceful background study ambience
      gain.gain.setValueAtTime(this.musicVolume * 0.05, ctx.currentTime);
      
      osc1.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      this.musicOsc1 = osc1;
      this.musicGain = gain;
      this.isMusicPlaying = true;
    } catch (e) {
      console.warn("Study music error", e);
    }
  }

  private stopStudyMusic() {
    try {
      if (this.musicOsc1) {
        this.musicOsc1.stop();
        this.musicOsc1.disconnect();
        this.musicOsc1 = null;
      }
      this.isMusicPlaying = false;
    } catch (e) {
      console.warn("Stop music error", e);
    }
  }
}

export const audioService = new AudioService();
