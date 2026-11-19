(() => {
  const carousel = document.querySelector('.insight-carousel');
  const slides = [...carousel.querySelectorAll('.insight-slide')];
  const buttons = [...carousel.querySelectorAll('[data-insight-slide]')];
  const names = buttons.map(button => button.textContent.trim());
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  let current = 0;
  let animations = [];
  let generation = 0;
  const resetMagnifiers = [];
  function settle() {
    resetMagnifiers.forEach(reset => reset());
    generation++;
    animations.forEach(animation => animation.cancel());
    animations = [];
    slides.forEach(slide => slide.classList.remove('is-leaving'));
  }
  function select(index, focus = false, direction = 0, animate = true) {
    const next = (index + slides.length) % slides.length;
    const previous = current;
    settle();
    current = next;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.inert = i !== current;
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === current));
      if (i === current && focus) button.focus();
    });
    carousel.querySelector('#insight-slide-status').textContent = `${current + 1} / ${slides.length} · ${names[current]}`;
    if (!animate || previous === current || reducedMotion.matches || !slides[current].animate) return;
    const movement = direction || (current > previous ? 1 : -1);
    const outgoing = slides[previous];
    outgoing.classList.add('is-leaving');
    const token = generation;
    const exit = outgoing.animate([
      {transform: 'translateX(0)', opacity: 1},
      {transform: `translateX(${-movement * 10}%)`, opacity: 0}
    ], {duration: 280, easing: ease, fill: 'both'});
    const enter = slides[current].animate([
      {transform: `translateX(${movement * 12}%)`, opacity: 0},
      {transform: 'translateX(0)', opacity: 1}
    ], {duration: 440, easing: ease, fill: 'both'});
    animations.push(exit, enter);
    slides[current].querySelectorAll('figcaption > div').forEach((caption, i) => {
      animations.push(caption.animate([
        {transform: 'translateY(14px)', opacity: 0},
        {transform: 'translateY(0)', opacity: 1}
      ], {duration: 340, delay: 80 + i * 55, easing: ease, fill: 'both'}));
    });
    Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (token === generation) settle();
    }).catch(() => {});
  }
  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = current + 1;
      else if (event.key === 'ArrowLeft') next = current - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = slides.length - 1;
      else return;
      event.preventDefault();
      select(next, true, event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0);
    });
  });
  carousel.querySelector('#insight-prev').addEventListener('click', () => select(current - 1, false, -1));
  carousel.querySelector('#insight-next').addEventListener('click', () => select(current + 1, false, 1));
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) settle(); });
  // Keep the original full-size link; the lens is a non-interactive overlay.
  const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  carousel.querySelectorAll('.insight-image').forEach(link => {
    const img = link.querySelector('img');
    const lens = document.createElement('span');
    lens.className = 'insight-lens';
    lens.hidden = true;
    lens.setAttribute('aria-hidden', 'true');
    link.append(lens);
    link.setAttribute('aria-describedby', 'insight-zoom-help');
    let active = false;
    let loaded = false;
    let failed = false;
    let highResolution;
    let hoverTimer;
    let point = {x: .5, y: .5};
    function hide() {
      clearTimeout(hoverTimer);
      hoverTimer = undefined;
      active = false;
      lens.hidden = true;
    }
    resetMagnifiers.push(hide);
    function draw() {
      if (!active || !loaded || !img.naturalWidth || !link.closest('.is-active')) return;
      const scale = Math.min(link.clientWidth / img.naturalWidth, link.clientHeight / img.naturalHeight);
      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;
      const left = (link.clientWidth - width) / 2;
      const top = (link.clientHeight - height) / 2;
      const diameter = Math.min(280, link.clientWidth * .45, link.clientHeight * .8);
      const radius = diameter / 2;
      const x = point.x * width;
      const y = point.y * height;
      const zoom = 2.5;
      lens.style.width = lens.style.height = `${diameter}px`;
      lens.style.left = `${Math.max(radius, Math.min(link.clientWidth - radius, left + x)) - radius}px`;
      lens.style.top = `${Math.max(radius, Math.min(link.clientHeight - radius, top + y)) - radius}px`;
      lens.style.backgroundSize = `${width * zoom}px ${height * zoom}px`;
      lens.style.backgroundPosition = `${radius - x * zoom}px ${radius - y * zoom}px`;
      lens.hidden = false;
    }
    function show() {
      if (failed) return;
      active = true;
      if (!highResolution) {
        highResolution = new Image();
        highResolution.onload = () => {
          loaded = true;
          lens.style.backgroundImage = `url("${highResolution.src}")`;
          draw();
        };
        highResolution.onerror = () => { failed = true; hide(); };
        highResolution.src = link.href;
      }
      draw();
    }
    link.addEventListener('pointermove', event => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      const bounds = img.getBoundingClientRect();
      const scale = Math.min(bounds.width / img.naturalWidth, bounds.height / img.naturalHeight);
      const width = img.naturalWidth * scale;
      const height = img.naturalHeight * scale;
      if (!width || !height) return;
      const x = event.clientX - bounds.left - (bounds.width - width) / 2;
      const y = event.clientY - bounds.top - (bounds.height - height) / 2;
      if (x < 0 || y < 0 || x > width || y > height) { hide(); return; }
      point = {x: x / width, y: y / height};
      if (active) draw();
      else if (hoverTimer === undefined) {
        hoverTimer = setTimeout(() => {
          hoverTimer = undefined;
          if (link.closest('.is-active')) show();
        }, 2000);
      }
    });
    link.addEventListener('pointerleave', hide);
    link.addEventListener('blur', hide);
    link.addEventListener('click', hide);
    link.addEventListener('keydown', event => {
      if (event.key === 'Escape') { hide(); return; }
      const steps = {ArrowLeft: [-.08, 0], ArrowRight: [.08, 0], ArrowUp: [0, -.08], ArrowDown: [0, .08]};
      if (!steps[event.key]) return;
      event.preventDefault();
      clearTimeout(hoverTimer);
      hoverTimer = undefined;
      point = {x: Math.max(0, Math.min(1, point.x + steps[event.key][0])), y: Math.max(0, Math.min(1, point.y + steps[event.key][1]))};
      show();
    });
    window.addEventListener('resize', hide);
    window.addEventListener('blur', hide);
  });
  carousel.classList.add('is-enhanced');
  select(0, false, 0, false);
  carousel.querySelector('.insight-slide-picker').hidden = false;
  carousel.querySelector('.insight-carousel-controls').hidden = false;
})();
