/**
 * Efeito sonoro tátil sintetizado via Web Audio API (sem arquivos externos).
 */
class SoundService {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public playClick(type: 'num' | 'op' | 'crit' | 'equal' = 'num') {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let freq = 600;
      let duration = 0.035;

      if (type === 'op') {
        freq = 820;
        duration = 0.045;
      } else if (type === 'crit') {
        freq = 380;
        duration = 0.05;
      } else if (type === 'equal') {
        freq = 1040;
        duration = 0.06;
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Falha silenciosa em navegadores com restrição de áudio
    }
  }
}

export const soundService = new SoundService();
