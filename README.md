# Tuner

A browser-based chromatic tuner for **guitar, banjo and mandolin**. It's a static page with no build step and no dependencies, and it runs entirely on your device.

## Use it

**Live app:** https://dreadcaptjames.github.io/tuner/

Open the link on your phone and add it to your home screen. It then opens full-screen like a normal app and works offline.
- **iPhone/iPad (Safari):** Share → Add to Home Screen
- **Android (Chrome):** ⋮ menu → Install app (or Add to Home screen)

Pick an instrument and tuning, tap **Start tuning**, allow the microphone, and play one string at a time. The needle shows how many cents you're off. Green (within ±5¢) means you're in tune. The screen stays awake while you're tuning.

- **Auto mode** (default): the tuner picks the string closest to the note it hears.
- **Lock a string**: tap a string button to tune just that string, even when it's far off. Tap it again to go back to auto.
- **Reference tone**: tick "Play reference tone on tap" to hear each string's target pitch.
- **A4 calibration**: change the 440 Hz reference (415–466 Hz).

### Run it locally

`python3 -m http.server` and then open http://localhost:8000. The microphone only works over `https://` or `localhost`.

## Deployment

GitHub Pages publishes the `main` branch automatically (Settings → Pages → Deploy from a branch → `main`, root). Push to `main` and the live app updates within a minute or two.

## Tunings

| Instrument | Tunings |
|---|---|
| Guitar | Standard, Drop D, Half step down, Whole step down, DADGAD, Open G, Open D, Open E, Drop C |
| Banjo | Open G, Double C, Standard C, Open D, Sawmill, Open A, Tenor standard (CGDA), Tenor Irish (GDAE) |
| Mandolin | Standard (GDAE), Cross A, Open G, Mandola (CGDA), Octave mandolin |

To add a tuning, edit the `TUNINGS` table in `index.html`.

## How it works

`pitch.js` uses the YIN pitch-detection algorithm with parabolic interpolation. On synthetic test tones with strong overtones it reads within about 0.2 cents. The readings are smoothed with a short median filter so the needle stays steady.
