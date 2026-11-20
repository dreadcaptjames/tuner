// Pitch detection (YIN algorithm) and note helpers.
// Works in the browser (attaches to window.Pitch) and in Node (module.exports).
(function (root) {
  "use strict";

  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Convert a note name like "E2", "G#4", "Bb3" to a MIDI number.
  function noteToMidi(name) {
    const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(name);
    if (!m) throw new Error("Bad note: " + name);
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1].toUpperCase()];
    const acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
    return (parseInt(m[3], 10) + 1) * 12 + base + acc;
  }

  function midiToFreq(midi, a4 = 440) {
    return a4 * Math.pow(2, (midi - 69) / 12);
  }

  function freqToMidi(freq, a4 = 440) {
    return 69 + 12 * Math.log2(freq / a4);
  }

  function midiToName(midi) {
    const n = Math.round(midi);
    return NOTE_NAMES[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1);
  }

  function centsBetween(freq, target) {
    return 1200 * Math.log2(freq / target);
  }

  // YIN pitch detection. Returns { freq, clarity } or null when no clear pitch.
  // minFreq/maxFreq bound the search range.
  function detectPitch(buf, sampleRate, opts = {}) {
    const minFreq = opts.minFreq || 60;
    const maxFreq = opts.maxFreq || 1400;
    const threshold = opts.threshold || 0.12;
    const minRms = opts.minRms === undefined ? 0.01 : opts.minRms;

    const n = buf.length;
    let rms = 0;
    for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / n);
    if (rms < minRms) return null;

    const tauMin = Math.max(2, Math.floor(sampleRate / maxFreq));
    const tauMax = Math.min(Math.floor(n / 2), Math.ceil(sampleRate / minFreq));
    const w = n - tauMax; // integration window
    if (w <= 0 || tauMax <= tauMin) return null;

    // Difference function
    const d = new Float32Array(tauMax + 1);
    for (let tau = 1; tau <= tauMax; tau++) {
      let sum = 0;
      for (let i = 0; i < w; i++) {
        const diff = buf[i] - buf[i + tau];
        sum += diff * diff;
      }
      d[tau] = sum;
    }

    // Cumulative mean normalized difference
    const cmnd = new Float32Array(tauMax + 1);
    cmnd[0] = 1;
    let running = 0;
    for (let tau = 1; tau <= tauMax; tau++) {
      running += d[tau];
      cmnd[tau] = running > 0 ? (d[tau] * tau) / running : 1;
    }

    // Absolute threshold: first dip below threshold, then walk to its local minimum
    let tau = -1;
    for (let t = tauMin; t <= tauMax; t++) {
      if (cmnd[t] < threshold) {
        while (t + 1 <= tauMax && cmnd[t + 1] < cmnd[t]) t++;
        tau = t;
        break;
      }
    }
    if (tau === -1) {
      // Fall back to global minimum if it's reasonably clear
      let best = tauMin;
      for (let t = tauMin; t <= tauMax; t++) if (cmnd[t] < cmnd[best]) best = t;
      if (cmnd[best] > 0.3) return null;
      tau = best;
    }

    // Parabolic interpolation for sub-sample accuracy
    let betterTau = tau;
    if (tau > 1 && tau < tauMax) {
      const s0 = cmnd[tau - 1], s1 = cmnd[tau], s2 = cmnd[tau + 1];
      const denom = 2 * (2 * s1 - s2 - s0);
      if (denom !== 0) betterTau = tau + (s2 - s0) / denom;
    }

    const freq = sampleRate / betterTau;
    if (freq < minFreq || freq > maxFreq) return null;
    return { freq, clarity: 1 - cmnd[tau], rms };
  }

  const api = { NOTE_NAMES, noteToMidi, midiToFreq, freqToMidi, midiToName, centsBetween, detectPitch };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Pitch = api;
})(typeof window !== "undefined" ? window : globalThis);
