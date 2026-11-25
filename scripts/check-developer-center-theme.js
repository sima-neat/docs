// Checks the shared shell's theme choice (sima-neat/docs#199): ?theme=dark|light
// wins over the stored theme and is never stored; the toggle still stores the
// user's choice. Runs static/developer-center-shell.js in a VM with a minimal
// browser stand-in. Usage: npm run check:theme
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const shellSource = fs.readFileSync(path.join(__dirname, '..', 'static', 'developer-center-shell.js'), 'utf8');

/** A fresh browser stand-in with the given URL query, cookie, storage and system theme. */
function browser({search = '', cookie = '', stored = {}, systemDark = false} = {}) {
  const storage = new Map(Object.entries(stored));
  const cookieWrites = [];
  const events = [];
  const attributes = {};
  const listeners = {};
  const target = {
    innerHTML: '',
    childElementCount: 0,
    querySelector: (selector) => (selector === '.color-mode-toggle-button' ? target.toggle : null),
    querySelectorAll: () => [],
    toggle: {addEventListener: (type, fn) => { target.toggle.click = fn; }},
  };
  const document = {
    get cookie() { return cookie; },
    set cookie(value) { cookieWrites.push(value); },
    documentElement: {
      setAttribute: (name, value) => { attributes[name] = value; },
      getAttribute: (name) => attributes[name] ?? null,
      lang: 'en',
    },
    querySelector: () => target,
    addEventListener() {},
  };
  const window = {
    location: {hostname: 'localhost', protocol: 'https:', pathname: '/examples/', search},
    localStorage: {
      getItem: (key) => (storage.has(key) ? storage.get(key) : null),
      setItem: (key, value) => storage.set(key, value),
    },
    matchMedia: () => ({matches: systemDark}),
    addEventListener: (type, fn) => { listeners[type] = fn; },
    removeEventListener() {},
    dispatchEvent: (event) => events.push(event),
  };
  const context = {
    window,
    document,
    URLSearchParams,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    // No manifest file: the shell uses its built-in one.
    fetch: async () => { throw new Error('offline'); },
    console: {warn() {}, error() {}, log() {}},
    setTimeout, clearTimeout,
  };
  window.document = document;
  vm.runInNewContext(shellSource, context);
  return {shell: window.DeveloperCenterShell, storage, cookieWrites, events, attributes, target};
}


/**
 * Docusaurus pages (Hardware, Software) also run src/developerCenter/shell/theme.js, whose
 * observer stores every data-theme change. Sets up globals for it and returns the probes.
 */
function docusaurusPage({search = '', cookie = '', stored = {}} = {}) {
  const storage = new Map(Object.entries(stored));
  const cookieWrites = [];
  const attributes = {};
  const listeners = {};
  const observers = [];
  globalThis.window = {
    location: {hostname: 'localhost', protocol: 'https:', search},
    localStorage: {getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value)},
    addEventListener: (type, fn) => { (listeners[type] ||= []).push(fn); },
  };
  globalThis.document = {
    get cookie() { return cookie; },
    set cookie(value) { cookieWrites.push(value); },
    hidden: false,
    documentElement: {
      setAttribute: (name, value) => { attributes[name] = value; },
      getAttribute: (name) => attributes[name] ?? null,
    },
    addEventListener() {},
  };
  globalThis.MutationObserver = class { constructor(fn) { observers.push(fn); } observe() {} };
  const fire = (type, detail) => (listeners[type] || []).forEach((fn) => fn({detail}));
  return {
    storage, cookieWrites, attributes, fire,
    /** data-theme changes; the observer runs after any event dispatched before it, as in a browser. */
    change(theme, event) {
      attributes['data-theme'] = theme;
      if (event) fire('developer-center-theme-change', event);
      observers.forEach((fn) => fn([]));
    },
  };
}

async function checkDocusaurusThemeSync() {
  const {initializeDeveloperCenterThemeSync} = await import('../src/developerCenter/shell/theme.js');

  // ?theme shows that theme at once and the shell's non-persistent apply isn't stored (Codex on #206).
  {
    const page = docusaurusPage({...STORED_LIGHT, search: '?theme=dark'});
    page.attributes['data-theme'] = 'light'; // Docusaurus' own script set the stored theme first.
    initializeDeveloperCenterThemeSync();
    assert.equal(page.attributes['data-theme'], 'dark', 'Docusaurus page shows ?theme at once');
    page.change('dark', {theme: 'dark', persist: false});
    page.fire('focus');
    assert.equal(page.attributes['data-theme'], 'dark', 'focus does not bring the stored theme back');
    assert.deepEqual(page.cookieWrites, [], 'no cookie written for ?theme');
    assert.equal(page.storage.get('theme'), 'light', 'localStorage left as it was');
  }
  // The same when the shell applies ?theme over a different theme.
  {
    const page = docusaurusPage({...STORED_LIGHT, search: '?theme=dark'});
    initializeDeveloperCenterThemeSync();
    page.change('light');
    page.cookieWrites.length = 0;
    page.storage.set('theme', 'light');
    page.change('dark', {theme: 'dark', persist: false});
    assert.deepEqual(page.cookieWrites, [], 'shell non-persistent apply is not stored by the observer');
    assert.equal(page.storage.get('theme'), 'light');
  }
  // The user's toggles on a ?theme page are stored, both ways.
  {
    const page = docusaurusPage({...STORED_LIGHT, search: '?theme=dark'});
    initializeDeveloperCenterThemeSync();
    page.change('dark', {theme: 'dark', persist: false});
    page.change('light');
    assert.equal(page.cookieWrites.length, 1, 'toggle to light is stored');
    page.change('dark');
    assert.equal(page.cookieWrites.length, 2, 'toggle back to the URL theme is stored too');
    assert.equal(page.storage.get('theme'), 'dark');
  }
  // Without ?theme nothing changes: the cookie applies and every change is stored.
  {
    const page = docusaurusPage({cookie: 'sima-neat-theme=dark', stored: {theme: 'light'}});
    initializeDeveloperCenterThemeSync();
    assert.equal(page.attributes['data-theme'], 'dark');
    assert.equal(page.storage.get('theme'), 'dark');
    page.change('light', {theme: 'light', persist: true});
    assert.equal(page.cookieWrites.length, 1);
  }
}

const themeEvents = (b) => b.events.filter((event) => event.type === 'developer-center-theme-change').map(({detail}) => ({theme: detail.theme, persist: detail.persist}));
const STORED_LIGHT = {cookie: 'sima-neat-theme=light', stored: {theme: 'light', 'portal-theme': 'light'}};

(async () => {
  // ?theme wins over the cookie, localStorage and the system preference, and isn't stored.
  for (const theme of ['dark', 'light']) {
    const b = browser({...STORED_LIGHT, search: `?theme=${theme}`, systemDark: theme === 'light'});
    await b.shell.mount(b.target);
    assert.equal(b.attributes['data-theme'], theme, `?theme=${theme} is shown`);
    assert.deepEqual(b.cookieWrites, [], `?theme=${theme} writes no cookie`);
    assert.equal(b.storage.get('theme'), 'light', `?theme=${theme} leaves localStorage as it was`);
    assert.equal(b.storage.get('portal-theme'), 'light');
    assert.deepEqual(themeEvents(b), [{theme, persist: false}], 'the event says not to store it');
  }

  // Other query parameters (the Model Browser's) don't get in the way.
  {
    const b = browser({...STORED_LIGHT, search: '?branch=main&model=yolov8n&theme=dark&variant=w8a8'});
    await b.shell.mount(b.target);
    assert.equal(b.attributes['data-theme'], 'dark');
    assert.deepEqual(b.cookieWrites, []);
  }

  // Invalid values are ignored: the stored theme applies, as without the parameter.
  for (const search of ['?theme=blue', '?theme=Dark', '?theme=']) {
    const b = browser({...STORED_LIGHT, search, systemDark: true});
    await b.shell.mount(b.target);
    assert.equal(b.attributes['data-theme'], 'light', `${search} is ignored`);
  }

  // Without the parameter, behaviour is unchanged: cookie, then localStorage, then the system; stored as before.
  {
    const b = browser({cookie: 'sima-neat-theme=dark', stored: {theme: 'light'}});
    await b.shell.mount(b.target);
    assert.equal(b.attributes['data-theme'], 'dark', 'the cookie wins');
    assert.equal(b.storage.get('theme'), 'dark');
    assert.equal(b.cookieWrites.length, 1);
    assert.deepEqual(themeEvents(b), [{theme: 'dark', persist: true}]);
  }
  {
    const b = browser({stored: {'portal-theme': 'dark'}});
    await b.shell.mount(b.target);
    assert.equal(b.attributes['data-theme'], 'dark', 'localStorage next');
  }
  {
    const b = browser({systemDark: true});
    await b.shell.mount(b.target);
    assert.equal(b.attributes['data-theme'], 'dark', 'then the system preference');
  }

  // The toggle on a ?theme= page is the user's choice: it is stored.
  {
    const b = browser({...STORED_LIGHT, search: '?theme=dark'});
    await b.shell.mount(b.target);
    b.target.toggle.click();
    assert.equal(b.attributes['data-theme'], 'light');
    assert.equal(b.storage.get('theme'), 'light');
    assert.equal(b.cookieWrites.length, 1, 'the toggle writes the cookie');
    assert.deepEqual(themeEvents(b).at(-1), {theme: 'light', persist: true});
  }

  // applyTheme stays compatible: without options it stores, as before.
  {
    const b = browser();
    b.shell.applyTheme('dark', {});
    assert.equal(b.storage.get('theme'), 'dark');
    assert.equal(b.cookieWrites.length, 1);
  }

  await checkDocusaurusThemeSync();

  console.log('Developer Center theme checks passed.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
