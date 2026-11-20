# ❄️ winter-mode

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![NPM Package](https://img.shields.io/badge/npm-package-orange.svg)](https://github.com/esachdev28/npm_package)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://esachdev28.github.io/moodify-app/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-none-success.svg)](package.json)

Turn any website or web app into an interactive **winter wonderland**. Snow falls realistically across the screen and **piles up dynamically on top of every letter, headline, image, card, and button** on your page.

Hover over any snowy word to shake the snow off it with realistic particle physics!

---

## 🌟 Features

- 🌨️ **True Text & Surface Collision**: Snow settles precisely on the letter contours (tall letters like `H` accumulate snow higher than `o`).
- 🔘 **Component-Aware**: Automatically coats buttons, images, inputs, and custom cards (`[data-winter-surface]`).
- 🖱️ **Interactive Shake**: Move the mouse or cursor over settled snow to knock it off.
- 📜 **Scroll-Resilient**: Snow sticks to text and surfaces as the user scrolls, and new content entering the viewport gets snowed on smoothly.
- 🧊 **Atmospheric Effects**: Frosty glow on text, subtle frosted vignette along the viewport edges, and an accumulating bottom snow drift.
- ⚡ **Ultra Lightweight & Fast**: ~12 kB packed, 0 dependencies, rendered on hardware-accelerated HTML5 Canvas with spatial collision buckets.
- 🛡️ **Non-Intrusive**: Uses `pointer-events: none` on the canvas so buttons, inputs, links, and text selection remain completely clickable and interactive.
- ♿ **Accessible**: Respects `prefers-reduced-motion` to ensure comfort for all visitors.
- 📘 **TypeScript Ready**: Complete TypeScript definition files (`index.d.ts`, `auto.d.ts`) included out of the box.

---

## 🚀 Live Demo & Example Project

See `winter-mode` in action integrated into a live production web application:

- **Live Deployed Demo**: [https://esachdev28.github.io/moodify-app/](https://esachdev28.github.io/moodify-app/)
- **Demo Project Repository**: [https://github.com/esachdev28/moodify-app](https://github.com/esachdev28/moodify-app)
- **Package Repository**: [https://github.com/esachdev28/npm_package](https://github.com/esachdev28/npm_package)

---

## 📦 Installation

Install directly via GitHub:

```bash
npm install github:esachdev28/npm_package
```

Or if installed from npm:

```bash
npm install winter-mode
```

---

## 🎯 Quick Start

### 1. Auto-Start (Zero Configuration)

If you are using a bundler (Vite, Webpack, Create React App, Next.js, Parcel):

```javascript
import 'winter-mode/auto';
```

Snow will immediately begin falling and settling as soon as the DOM is ready.

---

### 2. Programmatic Control (Recommended)

Import `WinterMode` and control the animation lifecycle:

```javascript
import WinterMode from 'winter-mode';

// Start with custom options
WinterMode.start({
  flakes: 180,
  speed: 1.2,
  wind: 0.3,
  crystals: true,
  stick: true
});

// Toggle on/off dynamically (e.g. from a navbar toggle button)
WinterMode.toggle();

// Brush off all currently accumulated snow
WinterMode.clear();

// Stop snow effect and remove canvas
WinterMode.stop();

// Check if currently running
if (WinterMode.isRunning()) {
  console.log("Winter is active! ❄️");
}
```

---

### 3. React Integration

```jsx
import React, { useEffect } from 'react';
import WinterMode from 'winter-mode';

export default function SnowEffect({ active = true }) {
  useEffect(() => {
    if (active) {
      WinterMode.start({ flakes: 150 });
    } else {
      WinterMode.stop();
    }
    return () => {
      WinterMode.stop();
    };
  }, [active]);

  return null;
}
```

---

### 4. Plain HTML / CDN

Add via `<script>` tag:

```html
<!-- Load and auto-start immediately -->
<script src="https://unpkg.com/winter-mode@1.0.0/winter-mode.js"></script>

<!-- Or with custom configuration via data attributes -->
<script 
  src="https://unpkg.com/winter-mode@1.0.0/winter-mode.js" 
  data-flakes="200" 
  data-ground="true"
  data-wind="0.4">
</script>

<!-- Or load without auto-starting -->
<script src="https://unpkg.com/winter-mode@1.0.0/winter-mode.js" data-autostart="false"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    WinterMode.start({ flakes: 150 });
  });
</script>
```

---

### 5. CLI Assistant

The package includes an automated CLI helper to quickly wire up winter mode into your project:

```bash
# Automatically finds your entry file and injects winter-mode
npx winter-mode init

# To cleanly remove it
npx winter-mode remove
```

| Framework / Setup | What `init` does |
| --- | --- |
| **Vite / CRA / Vue / Svelte** | Injects `import 'winter-mode/auto'` into `src/main.*` or `src/index.*` |
| **Next.js (App Router)** | Creates a client component in `components/WinterMode.jsx` |
| **Plain HTML Site** | Copies the script next to `index.html` and links it in `<head>` |

---

## ⚙️ Options Reference

You can pass an options object to `WinterMode.start(options)` or `WinterMode.toggle(options)`:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `flakes` | `number` | `140` | Flake count on standard 1440×900 viewport (scales automatically with screen size). |
| `speed` | `number` | `1` | Falling speed multiplier. |
| `wind` | `number` | `0.25` | Horizontal wind velocity (negative blows left, positive blows right). |
| `minSize` | `number` | `0.8` | Minimum snowflake radius in pixels. |
| `maxSize` | `number` | `4` | Maximum snowflake radius in pixels. |
| `crystals` | `boolean` | `true` | Render large flakes as intricate 6-armed snow crystals. |
| `stick` | `boolean` | `true` | Enable snow accumulating on top of text and page elements. |
| `stickSpeed` | `number` | `1` | Accumulation rate speed factor. |
| `maxPile` | `number` | `10` | Maximum height (px) of snow cap on headlines (scales down for small text). |
| `surfaces` | `string` | `'img,button,input,select,textarea,video,hr,[data-winter-surface]'` | CSS selector for non-text DOM elements snow can settle onto. |
| `ground` | `boolean` | `true` | Build up a soft snowdrift along the bottom edge of the screen. |
| `groundMax` | `number` | `22` | Maximum height in pixels of the bottom snowdrift. |
| `frost` | `boolean` | `true` | Subtle icy glow filter applied to text elements. |
| `tint` | `boolean` | `true` | Soft frosted vignette vignette around screen borders. |
| `shake` | `boolean` | `true` | Shakes off accumulated snow when mouse hovers over words. |
| `zIndex` | `number` | `2147483000` | Canvas layer z-index. |
| `maxWords` | `number` | `1500` | Safety cap for maximum tracked DOM words for peak performance. |
| `reducedMotion` | `string` | `'reduce'` | Behavior when user requests reduced motion (`'reduce'`, `'ignore'`, `'off'`). |

---

## 🧪 Local Verification & Tests

To verify the package build and exports locally:

```bash
# Run export and syntax tests
npm test

# Run local preview demo server
npm run demo
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

**Ekta Sachdev**
- GitHub: [@esachdev28](https://github.com/esachdev28)
- Email: [esachdev5@gmail.com](mailto:esachdev5@gmail.com)
