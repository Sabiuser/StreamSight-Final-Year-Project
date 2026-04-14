// Web Audio API alert beep — no external file needed
let ctx = null;
let lastPlayed = 0;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function playAlertSound(severity = "high") {
  const now = Date.now();
  if (now - lastPlayed < 5000) return; // 5s cooldown
  lastPlayed = now;
  try {
    const ac = getCtx();
    const notes =
      severity === "high"
        ? [
            { f: 880, d: 0.12 },
            { f: 660, d: 0.12 },
            { f: 880, d: 0.25 },
          ]
        : [
            { f: 660, d: 0.18 },
            { f: 550, d: 0.18 },
          ];
    let t = ac.currentTime;
    notes.forEach(({ f, d }) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.frequency.setValueAtTime(f, t);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d);
      osc.start(t);
      osc.stop(t + d);
      t += d + 0.04;
    });
  } catch (e) {
    /* silently fail if autoplay blocked */
  }
}
