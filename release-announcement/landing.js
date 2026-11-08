const stages = {
  develop: {kicker: 'BUILD WITH PALETTE NEAT', title: 'Move from intent to implementation.', description: 'Use Palette Neat’s agentic environment and developer tools to write, debug and orchestrate your application.', from: 'Your idea', to: 'Your application', tags: ['Agentic development', 'C++ & Python', 'Developer tools'], url: 'https://developer.sima.ai/software/getting-started/dev-environment/install-the-environment', link: 'Explore development tools'},
  compile: {kicker: 'PREPARE YOUR MODEL', title: 'Turn your model into a deployable building block.', description: 'Compile, optimize and package models for Modalix with the model compiler and toolchain in your development environment.', from: 'Your model', to: 'Modalix-ready model', tags: ['Model compilation', 'Optimization', 'Packaging'], url: 'https://developer.sima.ai/software', link: 'Explore the software documentation'},
  run: {kicker: 'BRING YOUR APPLICATION TO LIFE', title: 'Connect intelligence to the real world.', description: 'Use the execution libraries to orchestrate inference and bring your application to Modalix, with familiar Model, Graph and Run APIs.', from: 'Your application', to: 'Modalix', tags: ['Execution libraries', 'Runtime APIs', 'Device deployment'], url: 'https://developer.sima.ai/examples', link: 'Explore application examples'},
  understand: {kicker: 'MEASURE. OBSERVE. REFINE.', title: 'See what your application is doing.', description: 'Explore Insight, benchmarking and system telemetry to understand your real workload and guide your next improvement.', from: 'Your workload', to: 'System insight', tags: ['Insight', 'Benchmarking', 'Telemetry'], url: '3.0.0/#performance', link: 'Explore the performance story'}
};
const stageKeys = Object.keys(stages);
const stageButtons = [...document.querySelectorAll('[data-stage]')];
let selectedStage = 0;
function selectStage(key, focus = false) {
  selectedStage = stageKeys.indexOf(key);
  const data = stages[key];
  stageButtons.forEach(button => {
    const active = button.dataset.stage === key;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focus) button.focus();
  });
  document.querySelector('#workflow-panel').setAttribute('aria-labelledby', 'stage-' + key);
  document.querySelector('#workflow-kicker').textContent = data.kicker;
  document.querySelector('#workflow-counter').textContent = '0' + (selectedStage + 1) + ' / 04';
  document.querySelector('#workflow-name').textContent = data.title;
  document.querySelector('#workflow-description').textContent = data.description;
  document.querySelector('#workflow-art').innerHTML = `<span class="art-token">${data.from}</span><span class="flow-connector">→</span><span class="art-token token-strong">${data.to}</span>`;
  document.querySelector('#workflow-tags').innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
  const link = document.querySelector('#workflow-link');
  link.href = data.url;
  link.innerHTML = data.link + ' <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>';
}
stageButtons.forEach(button => {
  button.addEventListener('click', () => selectStage(button.dataset.stage));
  button.addEventListener('keydown', event => {
    let next = selectedStage;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (next + 1) % stageKeys.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (next + stageKeys.length - 1) % stageKeys.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = stageKeys.length - 1;
    else return;
    event.preventDefault();
    selectStage(stageKeys[next], true);
  });
});

// The website-owned JSON is the only source of component versions in the map.
const releaseMap = document.querySelector('#release-map');
const releaseMapOpen = document.querySelector('#release-map-open');
const releaseMapStatus = document.querySelector('#release-map-status');
let releaseMapLoading = false;
async function loadReleaseMap() {
  if (releaseMapLoading) return;
  releaseMapLoading = true;
  releaseMapStatus.textContent = 'Loading bundled releases…';
  try {
    const response = await fetch('release-map.json?v=20261107', {cache: 'no-store'});
    if (!response.ok) throw new Error('Release map unavailable');
    const data = await response.json();
    if (data.schema_version !== 1 || !data.components?.length || !data.releases?.length) throw new Error('Invalid release map');
    const columns = document.createElement('tr');
    ['Release date', ...data.components.map(component => component.label)].forEach(label => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      columns.append(cell);
    });
    const rows = document.createDocumentFragment();
    const releases = [...data.releases].sort((a, b) => b.release_date.localeCompare(a.release_date));
    const dateFormat = new Intl.DateTimeFormat('en-US', {month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC'});
    releases.forEach(release => {
      const row = document.createElement('tr');
      const dateCell = document.createElement('td');
      const link = document.createElement('a');
      const announcement = new URL(release.announcement, location.href);
      if (announcement.origin !== location.origin || !announcement.pathname.startsWith(new URL('.', location.href).pathname)) throw new Error('Invalid announcement URL');
      link.href = announcement.href;
      link.textContent = dateFormat.format(new Date(release.release_date + 'T00:00:00Z'));
      const label = document.createElement('small');
      label.textContent = 'Bundle ' + release.id;
      dateCell.append(link, label);
      row.append(dateCell);
      data.components.forEach(component => {
        const versions = release.versions[component.id];
        if (versions === null && release.status === 'draft') {
          const cell = document.createElement('td');
          cell.textContent = 'To confirm';
          row.append(cell);
          return;
        }
        if (!Array.isArray(versions) || !versions.length || versions.some(version => typeof version !== 'string')) throw new Error('Invalid component versions');
        const cell = document.createElement('td');
        versions.forEach((version, index) => {
          if (index) cell.append(document.createElement('br'));
          cell.append(document.createTextNode(version));
        });
        row.append(cell);
      });
      rows.append(row);
    });
    document.querySelector('#release-map-columns').replaceChildren(columns);
    document.querySelector('#release-map-rows').replaceChildren(rows);
    document.querySelector('.release-map-table').hidden = false;
    releaseMapStatus.textContent = releases.length + ' bundled release' + (releases.length === 1 ? '' : 's');
  } catch {
    releaseMapStatus.textContent = 'The release map could not be loaded. Close and reopen it to retry, or view the JSON below.';
  } finally {
    releaseMapLoading = false;
  }
}
releaseMapOpen.addEventListener('click', () => {
  releaseMap.showModal();
  loadReleaseMap();
});
document.querySelector('#release-map-close').addEventListener('click', () => releaseMap.close());
releaseMap.addEventListener('click', event => {
  if (event.target !== releaseMap) return;
  const bounds = releaseMap.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) releaseMap.close();
});
releaseMap.addEventListener('close', () => releaseMapOpen.focus());
