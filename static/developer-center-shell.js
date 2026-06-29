(function () {
  const DEFAULT_MANIFEST = {
    navItems: [
      {key: 'quickstart', label: 'Quick Start Guide', href: '/tools/qsg/index.html', external: true},
      {key: 'hardware', label: 'Hardware', href: '/hardware', external: false},
      {key: 'software', label: 'Software', href: '/software', external: false},
      {key: 'examples', label: 'Examples', href: '/examples/', external: false},
      {key: 'models', label: 'Models', href: 'https://huggingface.co/simaai', external: true},
      {key: 'community', label: 'Community', href: 'https://community.sima.ai', external: true},
    ],
    theme: {
      cookie: 'sima-neat-theme',
      keys: ['theme', 'portal-theme'],
    },
    runtimeConfig: '/developer-center-runtime.json',
    search: null,
  };
  const VALID_THEMES = new Set(['light', 'dark']);
  const SEARCH_SOURCES = [
    {key: 'all', label: 'All'},
    {key: 'hardware', label: 'Hardware'},
    {key: 'software', label: 'Software'},
    {key: 'examples', label: 'Examples'},
  ];
  const MAX_SEARCH_RESULTS = 24;

  function normalizeTheme(value) {
    return VALID_THEMES.has(value) ? value : null;
  }

  function normalizePath(pathname) {
    if (!pathname || pathname === '/') {
      return '/';
    }
    return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  }

  function cookieDomain() {
    const {hostname} = window.location;
    if (hostname === 'localhost' || /^[\d.]+$/.test(hostname)) {
      return '';
    }
    if (hostname.endsWith('.neat.sima.ai') || hostname.endsWith('.neat.paconsultings.com')) {
      const parts = hostname.split('.');
      return parts.length > 3 ? parts.slice(1).join('.') : hostname;
    }
    return '';
  }

  function readCookieTheme(cookieName) {
    const entry = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${cookieName}=`));
    return normalizeTheme(entry ? decodeURIComponent(entry.split('=').slice(1).join('=')) : null);
  }

  function readStoredTheme(keys) {
    for (const key of keys) {
      try {
        const value = normalizeTheme(window.localStorage.getItem(key));
        if (value) return value;
      } catch (_) {
        // Ignore restricted storage modes.
      }
    }
    return null;
  }

  function writeCookieTheme(theme, cookieName) {
    const domain = cookieDomain();
    const domainPart = domain ? `; Domain=.${domain}` : '';
    const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cookieName}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax${securePart}${domainPart}`;
  }

  function writeStoredTheme(theme, keys) {
    keys.forEach((key) => {
      try {
        window.localStorage.setItem(key, theme);
      } catch (_) {
        // Ignore restricted storage modes.
      }
    });
  }

  function applyTheme(theme, manifest) {
    if (!theme) return;
    const themeConfig = manifest.theme || DEFAULT_MANIFEST.theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-choice', theme);
    writeStoredTheme(theme, themeConfig.keys || DEFAULT_MANIFEST.theme.keys);
    writeCookieTheme(theme, themeConfig.cookie || DEFAULT_MANIFEST.theme.cookie);
    window.dispatchEvent(new CustomEvent('developer-center-theme-change', {detail: {theme}}));
  }

  function initialTheme(manifest) {
    const themeConfig = manifest.theme || DEFAULT_MANIFEST.theme;
    return (
      readCookieTheme(themeConfig.cookie || DEFAULT_MANIFEST.theme.cookie) ||
      readStoredTheme(themeConfig.keys || DEFAULT_MANIFEST.theme.keys) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  }

  function activeKey(manifest, configuredActive) {
    if (configuredActive) {
      return configuredActive;
    }
    const pathname = normalizePath(window.location.pathname);
    const match = (manifest.navItems || DEFAULT_MANIFEST.navItems).find(
      (item) => !item.external && normalizePath(item.href) === pathname,
    );
    return match ? match.key : '';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sanitizeHighlighted(value) {
    return escapeHtml(value || '')
      .replace(/&lt;em&gt;/g, '<mark>')
      .replace(/&lt;\/em&gt;/g, '</mark>');
  }

  function normalizeSource(value, url) {
    const source = String(value || '').toLowerCase();
    if (['hardware', 'software', 'examples'].includes(source)) return source;
    const path = normalizePath(url || window.location.pathname);
    if (path.startsWith('/software')) return 'software';
    if (path.startsWith('/examples')) return 'examples';
    if (path.startsWith('/hardware')) return 'hardware';
    return 'hardware';
  }

  function sourceLabel(source) {
    return SEARCH_SOURCES.find((item) => item.key === source)?.label || 'Hardware';
  }

  function hitSection(hit, source) {
    return hit.section || hit.category || hit.hierarchy?.lvl1 || sourceLabel(source);
  }

  function displaySectionLabel(section, source) {
    return section === sourceLabel(source) ? 'Overview' : section;
  }

  function filterKey(source, section) {
    return section ? `${source}:${section}` : source;
  }

  function hitTitle(hit) {
    return (
      hit._highlightResult?.title?.value ||
      hit._highlightResult?.hierarchy?.lvl2?.value ||
      hit._highlightResult?.hierarchy?.lvl1?.value ||
      hit._highlightResult?.hierarchy?.lvl0?.value ||
      hit.title ||
      hit.hierarchy?.lvl2 ||
      hit.hierarchy?.lvl1 ||
      hit.hierarchy?.lvl0 ||
      'Untitled'
    );
  }

  function hitSnippet(hit) {
    return (
      hit._snippetResult?.content?.value ||
      hit._highlightResult?.content?.value ||
      hit.content ||
      ''
    );
  }

  function hitRoute(hit) {
    const candidate = hit.route || hit.url || '/';
    if (candidate.startsWith('/')) return candidate;
    try {
      const url = new URL(candidate);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch (_) {
      return '/';
    }
  }

  function isSearchConfigured(search) {
    return searchIndices(search).length > 0;
  }

  function isConfiguredIndex(index) {
    return Boolean(
      index &&
        index.appId &&
        index.apiKey &&
        index.indexName &&
        index.appId !== 'REPLACE_ME' &&
        index.apiKey !== 'REPLACE_ME' &&
        index.indexName !== 'REPLACE_ME',
    );
  }

  function searchIndices(search) {
    if (!search) return [];
    const indexes = Array.isArray(search.indexes) ? search.indexes : [search];
    return indexes.filter(isConfiguredIndex);
  }

  // Auto-generated API reference entries (Doxygen "File"/"Folder" pages and the generated
  // C++/Python API subtree) dump large symbol listings, so they match many queries and would
  // otherwise crowd out real documentation pages. We sink them below narrative docs in the
  // ranking. Use the raw title (not the highlighted value, which may contain <mark> markup).
  function isApiReferenceHit(hit) {
    const title = String(hit.title || '').trim();
    if (/\s(File|Folder|Directory)$/i.test(title)) return true;
    return /\/reference\/[a-z0-9-]*api\//.test(hitRoute(hit).toLowerCase());
  }

  function mergeRankedHits(responses) {
    const hitGroups = responses.map((payload) => (Array.isArray(payload.hits) ? payload.hits : []));
    const merged = [];
    // Round-robin across indexes to balance sources. No cap here so the tiering below can
    // prefer documentation pages when filling the visible slots.
    for (let index = 0; ; index += 1) {
      let added = false;
      hitGroups.forEach((group) => {
        if (group[index]) {
          merged.push(group[index]);
          added = true;
        }
      });
      if (!added) break;
    }
    // Documentation sections rank first; auto-generated API File/Folder entries sink to the
    // bottom. A stable partition preserves Algolia's relevance order within each tier, and the
    // cap is applied after tiering so docs fill the visible slots before any file entries.
    const sections = merged.filter((hit) => !isApiReferenceHit(hit));
    const files = merged.filter((hit) => isApiReferenceHit(hit));
    return sections.concat(files).slice(0, MAX_SEARCH_RESULTS);
  }

  function renderSearchResults(root, state) {
    const panel = root.querySelector('[data-developer-center-search-panel]');
    if (!panel) return;

    const sourceCounts = new Map(SEARCH_SOURCES.map((source) => [source.key, 0]));
    const categoryCounts = new Map();
    state.hits.forEach((hit) => {
      const source = normalizeSource(hit.source, hit.url || hit.route);
      const section = hitSection(hit, source);
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
      sourceCounts.set('all', (sourceCounts.get('all') || 0) + 1);
      const key = filterKey(source, section);
      categoryCounts.set(key, (categoryCounts.get(key) || 0) + 1);
    });

    const sourceKeys = new Set(SEARCH_SOURCES.map((source) => source.key));
    const activeFilter =
      state.activeFilter === 'all' || sourceKeys.has(state.activeFilter) || categoryCounts.get(state.activeFilter)
        ? state.activeFilter
        : 'all';
    state.activeFilter = activeFilter;
    const visibleHits = state.hits.filter((hit) => {
      if (activeFilter === 'all') return true;
      const source = normalizeSource(hit.source, hit.url || hit.route);
      if (activeFilter === source) return true;
      return activeFilter === filterKey(source, hitSection(hit, source));
    });

    const filterButton = ({key, label, count, className = ''}) => {
      const activeClass = key === activeFilter ? ' developer-center-search-filter-active' : '';
      return `
        <button class="developer-center-search-filter${className}${activeClass}" type="button" data-search-filter="${escapeHtml(key)}">
          <span>${escapeHtml(label)}</span>
          <span class="developer-center-search-count">${count}</span>
        </button>`;
    };
    const sourceTree = SEARCH_SOURCES.map((source) => {
      if (source.key === 'all') {
        return filterButton({key: 'all', label: 'All', count: sourceCounts.get('all') || 0});
      }

      const sourceCount = sourceCounts.get(source.key) || 0;
      const categories = Array.from(categoryCounts)
        .filter(([key]) => key.startsWith(`${source.key}:`))
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, count]) =>
          filterButton({
            key,
            label: displaySectionLabel(key.slice(source.key.length + 1), source.key),
            count,
            className: ' developer-center-search-filter-sub',
          }),
        )
        .join('');

      return `
        <div class="developer-center-search-filter-group">
          ${filterButton({
            key: source.key,
            label: source.label,
            count: sourceCount,
            className: ' developer-center-search-filter-source',
          })}
          ${categories ? `<div class="developer-center-search-filter-children">${categories}</div>` : ''}
        </div>`;
    }).join('');

    let content = '';
    if (state.loading) {
      content = '<div class="developer-center-search-status">Searching...</div>';
    } else if (state.error) {
      content = `<div class="developer-center-search-status developer-center-search-error">${escapeHtml(state.error)}</div>`;
    } else if (state.searchConfigured === false) {
      content = '<div class="developer-center-search-status">Search is unavailable in this local build.</div>';
    } else if (!state.query.trim()) {
      content = '<div class="developer-center-search-status">Search hardware, software, APIs, and examples.</div>';
    } else if (state.hits.length === 0) {
      content = '<div class="developer-center-search-status">No matches found.</div>';
    } else {
      content = `
        <div class="developer-center-search-layout">
          <aside class="developer-center-search-filters" aria-label="Search result filters">${sourceTree}</aside>
          <section class="developer-center-search-results" aria-label="Search results">
            ${
              visibleHits.length
                ? visibleHits
                    .map((hit) => {
                      const source = normalizeSource(hit.source, hit.url || hit.route);
                      const section = hitSection(hit, source);
                      return `
                        <a class="developer-center-search-result" href="${escapeHtml(hitRoute(hit))}">
                          <span class="developer-center-search-title">${sanitizeHighlighted(hitTitle(hit))}</span>
                          <span class="developer-center-search-section">${escapeHtml(displaySectionLabel(section, source))}</span>
                          <span class="developer-center-search-snippet">${sanitizeHighlighted(hitSnippet(hit))}</span>
                        </a>`;
                    })
                    .join('')
                : '<div class="developer-center-search-status">No matches in this section.</div>'
            }
          </section>
        </div>`;
    }

    panel.innerHTML = content;
    panel.querySelectorAll('[data-search-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        state.activeFilter = button.getAttribute('data-search-filter') || 'all';
        renderSearchResults(root, state);
      });
    });
  }

  async function runSearch(manifest, state, root) {
    const search = manifest.search || DEFAULT_MANIFEST.search;
    if (!isSearchConfigured(search)) {
      state.searchConfigured = false;
      state.hits = [];
      state.loading = false;
      state.error = '';
      renderSearchResults(root, state);
      return;
    }
    const query = state.query.trim();
    if (!query) {
      state.hits = [];
      state.loading = false;
      state.error = '';
      renderSearchResults(root, state);
      return;
    }

    const requestId = ++state.requestId;
    state.loading = true;
    state.error = '';
    renderSearchResults(root, state);

    try {
      const indexes = searchIndices(search);
      const requests = indexes.map((index) => ({
        index,
        payload: {
          query,
          hitsPerPage: MAX_SEARCH_RESULTS,
          // Require every query term to match (strict AND). Without this, Algolia's default
          // word-dropping fallback floods multi-word searches (e.g. "llima pull") with loose
          // partial matches. When nothing matches all terms, hits are empty and the UI shows
          // the "No matches found." empty state.
          removeWordsIfNoResults: 'none',
          attributesToHighlight: ['title', 'content', 'hierarchy.lvl0', 'hierarchy.lvl1', 'hierarchy.lvl2'],
          attributesToSnippet: ['content:24'],
        },
      }));
      const responses = await Promise.all(
        requests.map(async ({index, payload}) => {
          const host = `https://${index.appId}-dsn.algolia.net`;
          const response = await fetch(`${host}/1/indexes/${encodeURIComponent(index.indexName)}/query`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Algolia-Application-Id': index.appId,
              'X-Algolia-API-Key': index.apiKey,
            },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            throw new Error(`Search returned ${response.status}`);
          }
          return response.json();
        }),
      );
      if (requestId !== state.requestId) return;
      state.hits = mergeRankedHits(responses);
      state.loading = false;
      state.error = '';
      state.activeFilter = 'all';
      renderSearchResults(root, state);
    } catch (err) {
      if (requestId !== state.requestId) return;
      state.hits = [];
      state.loading = false;
      state.error = err?.message || 'Search request failed.';
      renderSearchResults(root, state);
    }
  }

  function closeSearch(root, state) {
    state.open = false;
    root.querySelector('.developer-center-search')?.classList.remove('developer-center-search-open');
  }

  function openSearch(root, state) {
    state.open = true;
    root.querySelector('.developer-center-search')?.classList.add('developer-center-search-open');
    root.querySelector('[data-developer-center-search-input]')?.focus();
  }

  function mountSearch(root, manifest) {
    const search = manifest.search || DEFAULT_MANIFEST.search;

    const state = {
      activeFilter: 'all',
      error: '',
      hits: [],
      loading: false,
      open: false,
      query: '',
      requestId: 0,
      searchConfigured: isSearchConfigured(search),
      timer: 0,
    };
    const input = root.querySelector('[data-developer-center-search-input]');
    const clearButton = root.querySelector('[data-developer-center-search-clear]');
    const searchRoot = root.querySelector('.developer-center-search');
    if (!input || !searchRoot) return () => {};

    const scheduleSearch = () => {
      window.clearTimeout(state.timer);
      state.timer = window.setTimeout(() => runSearch(manifest, state, root), 150);
    };

    const onInput = () => {
      state.query = input.value;
      if (state.query.trim()) {
        openSearch(root, state);
      }
      scheduleSearch();
    };
    const onFocus = () => {
      openSearch(root, state);
      renderSearchResults(root, state);
    };
    const onClear = () => {
      input.value = '';
      state.query = '';
      state.hits = [];
      state.error = '';
      state.loading = false;
      openSearch(root, state);
      renderSearchResults(root, state);
    };
    const onDocumentMouseDown = (event) => {
      if (!searchRoot.contains(event.target)) {
        closeSearch(root, state);
      }
    };
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const findShortcut = key === 'k' && (event.metaKey || event.ctrlKey) && !event.altKey;
      if (findShortcut) {
        event.preventDefault();
        openSearch(root, state);
      } else if (event.key === 'Escape') {
        closeSearch(root, state);
      }
    };

    input.addEventListener('input', onInput);
    input.addEventListener('focus', onFocus);
    clearButton?.addEventListener('click', onClear);
    document.addEventListener('mousedown', onDocumentMouseDown);
    window.addEventListener('keydown', onKeyDown);
    renderSearchResults(root, state);

    return () => {
      window.clearTimeout(state.timer);
      input.removeEventListener('input', onInput);
      input.removeEventListener('focus', onFocus);
      clearButton?.removeEventListener('click', onClear);
      document.removeEventListener('mousedown', onDocumentMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }

  function render(target, manifest, options) {
    target.__developerCenterShellCleanup?.();

    const theme = normalizeTheme(document.documentElement.getAttribute('data-theme')) || initialTheme(manifest);
    const active = activeKey(manifest, options.active);
    const navItems = manifest.navItems || DEFAULT_MANIFEST.navItems;
    const search = manifest.search || DEFAULT_MANIFEST.search;
    const searchOptions = search || {};
    const searchMarkup = `
        <div class="developer-center-search" role="search">
          <label class="developer-center-search-label" for="developer-center-search-input">Search</label>
          <div class="developer-center-search-control">
            <svg class="developer-center-search-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.5 3a6.5 6.5 0 0 1 5.18 10.43l4.45 4.44-1.42 1.42-4.44-4.45A6.5 6.5 0 1 1 9.5 3Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"></path></svg>
            <input id="developer-center-search-input" data-developer-center-search-input class="developer-center-search-input" type="search" autocomplete="off" spellcheck="false" placeholder="${escapeHtml(searchOptions.placeholder || 'Search Developer Center')}" aria-label="Search Developer Center" />
            <button class="developer-center-search-clear" data-developer-center-search-clear type="button" aria-label="Clear search">×</button>
          </div>
          <div class="developer-center-search-panel" data-developer-center-search-panel></div>
        </div>`;
    const linkForItem = (item) => {
      const activeClass = item.key === active ? ' navbar__link--active' : '';
      const targetAttr = item.external ? ' target="_blank" rel="noreferrer"' : '';
      const externalIcon = item.external
        ? '<svg width="13.5" height="13.5" viewBox="0 0 24 24" aria-label="(opens in new tab)" class="iconExternalLink"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"></path></svg>'
        : '';
      return `<a class="navbar__item navbar__link${activeClass}" data-developer-center-section="${escapeHtml(item.key)}" href="${escapeHtml(item.href)}"${targetAttr}>${escapeHtml(item.label)}${externalIcon}</a>`;
    };
    const desktopItems = navItems
      .map((item) => {
        const link = linkForItem(item);
        return item.external ? link : `<div class="navbar__item">${link}</div>`;
      })
      .join('');

    target.innerHTML = `
      <div class="developer-center-shell">
        <header class="navbar dev-center-navbar">
          <div class="navbar__inner">
            <div class="navbar__items">
              <a class="navbar__brand" href="/" aria-label="Developer Center home">
                <span class="navbar__logo"><img src="/img/sima-logo.png" alt="" /></span>
                <span class="navbar__title">Developer Center</span>
              </a>
              <div class="navbar__items navbar__items--desktop">${desktopItems}</div>
            </div>
            <div class="navbar__items navbar__items--right">
              ${searchMarkup}
              <div class="color-mode-toggle">
                <button class="color-mode-toggle-button" type="button" aria-label="Switch between dark and light mode" title="Switch between dark and light mode">
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" class="color-mode-toggle-icon color-mode-toggle-icon-light"><path fill="currentColor" d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5ZM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1Zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1ZM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1Zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1ZM5.99 4.58a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41L5.99 4.58Zm12.37 12.37a1 1 0 0 0-1.41 1.41l1.06 1.06a1 1 0 0 0 1.41-1.41l-1.06-1.06ZM19.42 5.99a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06ZM7.05 18.36a1 1 0 0 0-1.41-1.41l-1.06 1.06a1 1 0 0 0 1.41 1.41l1.06-1.06Z"></path></svg>
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" class="color-mode-toggle-icon color-mode-toggle-icon-dark"><path fill="currentColor" d="M9.37 5.51A7.4 7.4 0 0 0 16.5 14.9c.68 0 1.35-.09 1.99-.27A7.03 7.03 0 0 1 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49ZM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.4 5.4 0 0 1-4.4 2.26 5.4 5.4 0 0 1-3.14-9.8A9.2 9.2 0 0 0 12 3Z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>`;

    target.querySelector('.color-mode-toggle-button')?.addEventListener('click', () => {
      const current = normalizeTheme(document.documentElement.getAttribute('data-theme')) || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light', manifest);
      render(target, manifest, options);
    });
    const cleanupSearch = mountSearch(target, manifest);
    target.__developerCenterShellCleanup = cleanupSearch;
  }

  async function fetchJson(path, {warn = true} = {}) {
    try {
      const response = await fetch(path, {
        headers: {Accept: 'application/json'},
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error(`${path} returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (warn) {
        console.warn('Unable to load Developer Center JSON.', err);
      }
      return null;
    }
  }

  function mergeManifest(manifest, runtimeConfig) {
    const base = {
      ...DEFAULT_MANIFEST,
      ...(manifest || {}),
    };

    if (!runtimeConfig) {
      return base;
    }

    return {
      ...base,
      search: runtimeConfig.search || base.search || null,
    };
  }

  async function loadManifest() {
    const manifest = await fetchJson('/developer-center-shell.json');
    const runtimePath = manifest?.runtimeConfig || DEFAULT_MANIFEST.runtimeConfig;
    const runtimeConfig = runtimePath ? await fetchJson(runtimePath, {warn: false}) : null;
    return mergeManifest(manifest, runtimeConfig);
  }

  async function mount(targetOrSelector, options = {}) {
    const target =
      typeof targetOrSelector === 'string'
        ? document.querySelector(targetOrSelector)
        : targetOrSelector;
    if (!target) return;

    const manifest = await loadManifest();
    applyTheme(initialTheme(manifest), manifest);
    render(target, manifest, options);
  }

  window.DeveloperCenterShell = {
    mount,
    applyTheme,
  };
})();
