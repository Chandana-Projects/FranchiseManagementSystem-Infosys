// Web Audio API Synthesizer with Audio Control & State Persistence

let isMutedState: boolean | null = null;
let masterVolume: number = 1.0;

export function isAudioMuted(): boolean {
  if (typeof window === "undefined") return false;
  if (isMutedState === null) {
    const saved = localStorage.getItem("fops_audio_muted");
    isMutedState = saved === "true";
  }
  return isMutedState;
}

export function setAudioMuted(muted: boolean): boolean {
  isMutedState = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("fops_audio_muted", String(muted));
    window.dispatchEvent(new CustomEvent("fops-audio-state-changed", { detail: { muted, volume: masterVolume } }));
  }
  if (!muted) {
    playTechChime("success", true);
  }
  return isMutedState;
}

export function toggleAudioMute(): boolean {
  const next = !isAudioMuted();
  return setAudioMuted(next);
}

export function getAudioVolume(): number {
  if (typeof window === "undefined") return 1.0;
  const saved = localStorage.getItem("fops_audio_volume");
  if (saved !== null) {
    const parsed = parseFloat(saved);
    if (!isNaN(parsed)) masterVolume = parsed;
  }
  return masterVolume;
}

export function setAudioVolume(vol: number) {
  masterVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== "undefined") {
    localStorage.setItem("fops_audio_volume", String(masterVolume));
    window.dispatchEvent(new CustomEvent("fops-audio-state-changed", { detail: { muted: isAudioMuted(), volume: masterVolume } }));
  }
}

export function playTechChime(
  type: "click" | "nav" | "alert" | "success" = "click",
  bypassMute: boolean = false
) {
  if (typeof window === "undefined") return;
  if (isAudioMuted() && !bypassMute) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    const vol = getAudioVolume();

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      gain.gain.setValueAtTime(0.08 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "nav") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.06 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "alert") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.1 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.1 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    // Ignore audio autoplay restrictions gracefully
  }
}

export function playNotificationSFX() {
  playTechChime("alert");
}

