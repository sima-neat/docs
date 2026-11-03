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
