// `import 'winter-mode/auto'` — starts the snow as soon as the page is ready.
var WinterMode = require('./winter-mode.js');

if (typeof window !== 'undefined') {
  window.WinterMode = WinterMode;
  WinterMode.autoStart();
}

module.exports = WinterMode;
