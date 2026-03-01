/**
 * Timer end alerts: audio chime + page title flash.
 * No external audio files or notification permissions required.
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Plays a short two-tone chime using Web Audio API.
 * Works without user gesture if the page was previously interacted with (e.g., user started the timer).
 */
export function playTimerEndSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const playTone = (frequency: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  try {
    ctx.resume().then(() => {
      playTone(880, 0, 0.15);
      playTone(1320, 0.2, 0.2);
    }).catch(() => {
      // Audio blocked (e.g., autoplay policy) — visual cue will still fire
    });
  } catch {
    // Fallback: visual cue only
  }
}

const TITLE_FLASH_DURATION_MS = 4000;
let titleRestoreTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Flashes the page title to draw attention when the timer ends.
 * Works even when the tab is in the background (user sees the tab title change).
 */
export function triggerVisualAlert(nextMode: "work" | "break"): void {
  const originalTitle = document.title;

  const message = nextMode === "break"
    ? "⏰ Time for a break! — UkeDoro"
    : "⏰ Back to focus! — UkeDoro";

  document.title = message;

  if (titleRestoreTimeout) clearTimeout(titleRestoreTimeout);
  titleRestoreTimeout = setTimeout(() => {
    document.title = originalTitle;
    titleRestoreTimeout = null;
  }, TITLE_FLASH_DURATION_MS);
}
