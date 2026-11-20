# Tuner.

A beautifully redesigned, privacy-first browser tuner for guitar, banjo, and mandolin. Real-time pitch detection meets a studio-inspired interface with **seven selectable themes**. No accounts, build step, dependencies, or audio uploads.

**Live app:** https://dreadcaptjames.github.io/tuner/

## App icon

The app uses a custom tuning-meter and stringed-instrument icon in the Penny color palette, available as SVG and PNG icons for browser tabs, iPad home screens, and Android installation.

## What it does

- **Seven saved appearances:** Analog '77 (vintage amber), Midnight (blue console), Neon Stage (electric pink), Paper & Ink (warm light mode), Forest Room (sage green), Chrome (cool silver), and Penny (deep teal, dusty blue, warm cream, copper, warm taupe, and charcoal navy). Choose a theme in the *Choose your aesthetic* gallery; it is remembered on that device.
- **Live tuning meter:** Oversized note, frequency readout, ±50¢ precision scale, color-coded needle, and flat/sharp guidance. A string is marked in tune within ±5 cents.
- **Three instruments:** Guitar, banjo, and mandolin, with standard and alternate tunings, including tenor banjo, mandola, and octave mandolin.
- **Auto or locked strings:** The closest string is selected automatically. Tap a string to lock it; tap again for auto.
- **Reference tones:** Optionally play the target pitch when tapping a string.
- **A4 calibration:** Adjustable from 415–466 Hz; the default is 440 Hz.
- **On-device audio:** The microphone is analyzed locally with YIN pitch detection and smoothed frequency readings. No audio is sent to a server.
- **Mobile and offline friendly:** Responsive layout, touch-friendly controls, installable home-screen icons, and an offline app shell. A screen wake lock is requested during tuning when supported.

## Using the tuner

1. Open [the tuner](https://dreadcaptjames.github.io/tuner/).
2. Choose Guitar, Banjo, or Mandolin, then a tuning. Adjust A4 if needed.
3. Press **Start tuning** and grant microphone permission.
4. Play one string at a time. Follow the meter until it reads **In tune** and the string marks as complete.
5. Optionally tap a string to lock its target, or enable reference tones.
6. Scroll to **Choose your aesthetic** to switch looks instantly.

On iPad or iPhone, open in Safari and use **Share → Add to Home Screen**. On Android, use Chrome's **Install app** or **Add to Home screen** menu.

## Development

The app is plain HTML, CSS, and JavaScript. Run a local server with:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Microphone access requires a secure origin (HTTPS or localhost). GitHub Pages serves the root of the `main` branch.

## Tunings

| Instrument | Options |
| --- | --- |
| Guitar | Standard, Drop D, Half step down, Whole step down, DADGAD, Open G, Open D, Open E, Drop C |
| Banjo | Open G, Double C, Standard C, Open D, Sawmill, Open A, Tenor standard, Tenor Irish |
| Mandolin | Standard, Cross A, Open G, Mandola, Octave mandolin |

Tunings are defined in `index.html`; the pitch engine is in `pitch.js`. Theme palettes and theme cards are also defined in `index.html`. The service worker in `sw.js` handles shell caching and network-first navigation.
