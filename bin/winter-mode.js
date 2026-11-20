#!/usr/bin/env node
'use strict';

// npx winter-mode init    -> adds winter mode to the project in the current folder
// npx winter-mode remove  -> takes it out again

var fs = require('fs');
var path = require('path');

var PKG = 'winter-mode';
var MARK = 'winter-mode:auto';
var cwd = process.cwd();
var SCRIPT_TAG = '<script src="winter-mode.js" defer></script><!-- ' + MARK + ' -->';

var ENTRY_FILES = [
  'src/main.tsx', 'src/main.jsx', 'src/main.ts', 'src/main.js',
  'src/index.tsx', 'src/index.jsx', 'src/index.ts', 'src/index.js',
  'pages/_app.tsx', 'pages/_app.jsx', 'pages/_app.js',
  'src/pages/_app.tsx', 'src/pages/_app.jsx', 'src/pages/_app.js',
  'app/root.tsx', 'app/root.jsx',
  'main.js', 'index.js'
];
var HTML_FILES = ['index.html', 'public/index.html', 'src/index.html'];
var NEXT_LAYOUTS = ['app/layout.tsx', 'app/layout.jsx', 'app/layout.js', 'src/app/layout.tsx', 'src/app/layout.jsx', 'src/app/layout.js'];

function log(msg) { console.log('❄  ' + msg); }
function rel(p) { return path.relative(cwd, p) || p; }
function find(list) {
  for (var i = 0; i < list.length; i++) {
    var p = path.join(cwd, list[i]);
    if (fs.existsSync(p)) return p;
  }
  return null;
}
function readPkg() {
  try { return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')); } catch (e) { return null; }
}
function hasDep(pkg, name) {
  return !!(pkg && ((pkg.dependencies && pkg.dependencies[name]) || (pkg.devDependencies && pkg.devDependencies[name])));
}

// Puts the import after any leading 'use client' directive and existing imports' header comment.
function addImport(file) {
  var src = fs.readFileSync(file, 'utf8');
  if (src.indexOf(MARK) !== -1) { log(rel(file) + ' already has winter mode.'); return; }
  var line = "import '" + PKG + "/auto'; // " + MARK + '\n';
  var directive = src.match(/^\s*(['"])use (client|strict)\1;?[^\n]*\n/);
  var out = directive ? directive[0] + line + src.slice(directive[0].length) : line + src;
  fs.writeFileSync(file, out);
  log('Added winter mode to ' + rel(file));
}

function addScriptTag(file) {
  var src = fs.readFileSync(file, 'utf8');
  if (src.indexOf(MARK) !== -1) { log(rel(file) + ' already has winter mode.'); return; }
  var dir = path.dirname(file);
  var target = path.join(dir, 'winter-mode.js');
  fs.copyFileSync(path.join(__dirname, '..', 'winter-mode.js'), target);
  var out = /<\/body>/i.test(src) ? src.replace(/<\/body>/i, '\n' + SCRIPT_TAG + '\n</body>') : src + '\n' + SCRIPT_TAG + '\n';
  fs.writeFileSync(file, out);
  log('Copied the script to ' + rel(target) + ' and added it to ' + rel(file));
}

function nextAppRouter(layout) {
  var dir = path.join(cwd, fs.existsSync(path.join(cwd, 'src/app')) ? 'src/components' : 'components');
  var ts = /\.tsx$/.test(layout);
  var comp = path.join(dir, 'WinterMode.' + (ts ? 'tsx' : 'jsx'));
  if (!fs.existsSync(comp)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(comp, [
      "'use client';",
      '// ' + MARK,
      "import { useEffect } from 'react';",
      "import WinterMode from '" + PKG + "';",
      '',
      'export default function WinterModeSnow() {',
      '  useEffect(() => {',
      '    WinterMode.start();',
      '    return () => { WinterMode.stop(); };',
      '  }, []);',
      '  return null;',
      '}',
      ''
    ].join('\n'));
    log('Created ' + rel(comp));
  }
  log('Next.js App Router detected. Render the component once in ' + rel(layout) + ':');
  console.log('\n    import WinterModeSnow from \'@/components/WinterMode\';\n    ...\n    <body>\n      {children}\n      <WinterModeSnow />\n    </body>\n');
}

function init() {
  var pkg = readPkg();
  if (pkg && !hasDep(pkg, PKG) && pkg.name !== PKG) {
    log('Tip: run `npm install ' + PKG + '` first so your bundler can find it.');
  }

  var layout = hasDep(pkg, 'next') && find(NEXT_LAYOUTS);
  if (layout && !find(['pages/_app.tsx', 'pages/_app.jsx', 'pages/_app.js', 'src/pages/_app.tsx', 'src/pages/_app.jsx', 'src/pages/_app.js'])) {
    return nextAppRouter(layout);
  }

  var entry = find(ENTRY_FILES);
  var html = find(HTML_FILES);
  var bundled = pkg && (hasDep(pkg, 'vite') || hasDep(pkg, 'react-scripts') || hasDep(pkg, 'next') ||
    hasDep(pkg, 'webpack') || hasDep(pkg, 'parcel') || hasDep(pkg, '@remix-run/react') || hasDep(pkg, 'vue') ||
    hasDep(pkg, 'react') || hasDep(pkg, 'svelte'));

  if (entry && (bundled || !html)) return addImport(entry);
  if (html) return addScriptTag(html);

  log('Could not find an entry file or index.html in ' + cwd + '.');
  console.log('\nAdd one of these yourself:\n' +
    "  JS/TS entry:  import '" + PKG + "/auto';\n" +
    '  Plain HTML:   <script src="https://unpkg.com/' + PKG + '"></script>\n');
  process.exitCode = 1;
}

function remove() {
  var done = false;
  var files = ENTRY_FILES.concat(HTML_FILES, NEXT_LAYOUTS);
  files.forEach(function (f) {
    var p = path.join(cwd, f);
    if (!fs.existsSync(p)) return;
    var src = fs.readFileSync(p, 'utf8');
    if (src.indexOf(MARK) === -1) return;
    var out = /\.html$/.test(f)
      ? src.split('\n' + SCRIPT_TAG + '\n').join('\n').split(SCRIPT_TAG).join('')
      : src.split('\n').filter(function (l) { return l.indexOf(MARK) === -1; }).join('\n');
    fs.writeFileSync(p, out);
    log('Removed winter mode from ' + rel(p));
    done = true;
    if (/\.html$/.test(f)) {
      var copy = path.join(path.dirname(p), 'winter-mode.js');
      if (fs.existsSync(copy)) { fs.unlinkSync(copy); log('Deleted ' + rel(copy)); }
    }
  });
  ['components/WinterMode.tsx', 'components/WinterMode.jsx', 'src/components/WinterMode.tsx', 'src/components/WinterMode.jsx'].forEach(function (f) {
    var p = path.join(cwd, f);
    if (fs.existsSync(p) && fs.readFileSync(p, 'utf8').indexOf(MARK) !== -1) {
      fs.unlinkSync(p);
      log('Deleted ' + rel(p) + ' (remember to remove <WinterModeSnow /> from your layout)');
      done = true;
    }
  });
  if (!done) log('Winter mode was not found in this project.');
}

function help() {
  console.log([
    '',
    '  ❄  winter-mode',
    '',
    '  Usage:',
    '    npx winter-mode init     Add falling, sticking snow to the website in this folder',
    '    npx winter-mode remove   Take it out again',
    ''
  ].join('\n'));
}

var cmd = process.argv[2];
if (cmd === 'init' || cmd === 'add') init();
else if (cmd === 'remove' || cmd === 'uninstall') remove();
else help();
