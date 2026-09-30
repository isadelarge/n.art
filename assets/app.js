(() => {
  const { WHATSAPP, CATS, MSG } = window.NART;
  // Sempre abre no topo, inclusive ao recarregar (exceto link para uma seção, como #historia)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);
  const $ = (s, el = document) => el.querySelector(s);
  const ALL = CATS.flatMap((c) => c.projects);
  // Links enviados ao cliente sempre abrem a página só de projetos
  const base = new URL('projetos.html', location.href).href.split(/[?#]/)[0];

  // Fotos do Unsplash recebem largura; fotos locais passam direto
  const sized = (src, w) => (src.includes('images.unsplash.com') ? `${src}&w=${w}` : src);
  const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const photoUrl = (p) => `${base}?foto=${p.id}`;
  const catUrl = (c) => (c ? `${base}?ambiente=${c.slug}` : base);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const srcset = (src) => (src.includes('images.unsplash.com')
    ? `srcset="${sized(src, 600)} 600w, ${sized(src, 900)} 900w, ${sized(src, 1300)} 1300w"` : '');
  const esc = (s) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // Mensagem pronta do projeto + link da foto, para a equipe saber qual modelo é
  const projectLink = (p) => waLink(`${p.msg}\n${photoUrl(p)}`);

  // ---------- Estado inicial pela URL ----------
  const params = new URLSearchParams(location.search);
  const startPhoto = ALL.find((p) => p.id === (params.get('foto') || '').toUpperCase());
  let current = startPhoto ? startPhoto.cat : CATS.find((c) => c.slug === params.get('ambiente')) || null;
  if (current) document.body.classList.add('is-shared');

  // ---------- Links gerais do WhatsApp ----------
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(MSG[a.dataset.wa] || MSG.geral);
  });

  // ---------- Filtros ----------
  const chipsEl = $('[data-chips]');
  const pad = (n) => String(n).padStart(2, '0');
  const chip = (c) => `<button class="chip" role="tab" data-chip="${c ? c.slug : ''}" aria-selected="false">${c ? c.name : 'Todos'}<small>${pad(c ? c.projects.length : ALL.length)}</small></button>`;
  chipsEl.innerHTML = chip(null) + CATS.map(chip).join('');
  const onChip = (e) => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    select(CATS.find((c) => c.slug === b.dataset.chip) || null, e.currentTarget !== chipsEl);
  };
  chipsEl.addEventListener('click', onChip);
  $('[data-more-chips]').addEventListener('click', onChip);

  // ---------- Galeria ----------
  const grid = $('[data-grid]');
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -40px 0px' });

  const list = () => (current ? current.projects : ALL);
  // Cada foto de cada projeto vira um slide da tela cheia
  const slides = () => list().flatMap((p) => p.photos.map((src, k) => ({ p, src, k })));

  function render() {
    const items = list();
    grid.innerHTML = items.map((p, i) => `
      <article class="card">
        <button class="card__media" data-open="${i}" aria-label="Ampliar foto: ${esc(p.title)}">
          <img src="${sized(p.src, 900)}" ${srcset(p.src)}
            sizes="(max-width: 620px) 100vw, (max-width: 1080px) 50vw, 33vw" alt="${esc(p.alt)}" loading="${i < 3 ? 'eager' : 'lazy'}">
          <span class="card__veil" aria-hidden="true"><span class="card__open"><svg class="i"><use href="#i-zoom"/></svg>Ver ${p.photos.length > 1 ? `${p.photos.length} fotos` : 'foto'}</span></span>
        </button>
        <div class="card__body">
          <p class="card__meta"><span class="card__tag">${esc(p.tag)}</span></p>
          <h3 class="card__title">${esc(p.title)}</h3>
          <p class="card__details">${esc(p.details)}</p>
          <a class="card__cta" href="${projectLink(p)}" target="_blank" rel="noopener">
            <svg class="i"><use href="#i-wa"/></svg><span class="card__cta-full">${esc(p.cta)}</span><span class="card__cta-short">Orçamento</span><svg class="i card__arrow"><use href="#i-r"/></svg></a>
        </div>
      </article>`).join('');
    grid.querySelectorAll('.card').forEach((el) => io.observe(el));

    $('[data-g-title]').textContent = current ? current.name : 'Todos os projetos';
    const count = $('[data-g-count]');
    if (count) count.textContent = plural(items.length, 'projeto', 'projetos');

    chipsEl.querySelectorAll('[data-chip]').forEach((b) => {
      const on = b.dataset.chip === (current ? current.slug : '');
      b.setAttribute('aria-selected', on);
      // Centraliza a aba ativa só na faixa de filtros, sem rolar a página
      if (on) chipsEl.scrollTo({ left: b.offsetLeft - (chipsEl.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' });
    });

    // Em link compartilhado, oferece as outras categorias no fim
    $('[data-more]').hidden = !(document.body.classList.contains('is-shared') && current);
    $('[data-more-chips]').innerHTML = CATS.filter((c) => c !== current).map(chip).join('');
  }

  function select(cat, scroll) {
    current = cat;
    history.replaceState(null, '', cat ? `?ambiente=${cat.slug}` : location.pathname);
    render();
    if (scroll) $('#galeria').scrollIntoView({ behavior: 'smooth' });
  }

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) openLb(slides().findIndex((s) => s.p === list()[Number(b.dataset.open)]));
  });

  // ---------- Enviar link da categoria ----------
  const toast = $('[data-toast]');
  let toastT;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('is-on'), 2600);
  };

  $('[data-share]').addEventListener('click', async () => {
    const url = catUrl(current);
    const text = current
      ? `Separei alguns projetos de ${current.name.toLowerCase()} que fizemos na N.ART. Dá uma olhada:`
      : 'Veja alguns projetos de móveis planejados que fizemos na N.ART:';
    if (navigator.share) {
      try { await navigator.share({ title: 'N.ART Móveis Planejados', text, url }); } catch (_) { /* cancelado */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      say(current ? `Link de ${current.name} copiado` : 'Link do catálogo copiado');
    } catch (_) {
      prompt('Copie o link:', url);
    }
  });

  // ---------- Foto ampliada ----------
  const lb = $('[data-lb]');
  const fig = $('[data-lb-fig]');
  const img = document.createElement('img');
  img.draggable = false;
  fig.appendChild(img);
  let idx = 0;
  let lastFocus = null;

  function showLb() {
    const all = slides();
    const { p, src, k } = all[idx];
    img.classList.add('is-loading');
    img.onload = () => img.classList.remove('is-loading');
    img.src = sized(src, 2000);
    img.alt = p.photos.length > 1 ? `${p.alt}, foto ${k + 1}` : p.alt;
    $('[data-lb-tag]').textContent = p.tag;
    $('[data-lb-pos]').textContent = p.photos.length > 1 ? `Foto ${k + 1} de ${p.photos.length}` : '';
    $('[data-lb-title]').textContent = p.title;
    $('[data-lb-details]').textContent = p.details;
    $('[data-lb-cta]').textContent = p.cta;
    $('[data-lb-wa]').href = projectLink(p);
    // Pontinhos: posição dentro das fotos do projeto
    const dots = $('[data-lb-dots]');
    dots.innerHTML = p.photos.length > 1
      ? p.photos.map((_, j) => `<button class="lb__dot${j === k ? ' is-on' : ''}" data-dot="${idx - k + j}" tabindex="-1"></button>`).join('')
      : '';
    history.replaceState(null, '', `?foto=${p.id}`);
    new Image().src = sized(all[(idx + 1) % all.length].src, 2000);
  }

  function openLb(i) {
    idx = i;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.classList.add('is-locked');
    void lb.offsetWidth; // garante a transição de entrada
    lb.classList.add('is-open');
    showLb();
    $('[data-lb-close]').focus();
  }

  function closeLb() {
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    setTimeout(() => { lb.hidden = true; }, 300);
    history.replaceState(null, '', current ? `?ambiente=${current.slug}` : location.pathname);
    if (lastFocus) lastFocus.focus();
  }

  const step = (d) => { const n = slides().length; idx = (idx + d + n) % n; showLb(); };

  $('[data-lb-close]').addEventListener('click', closeLb);
  $('[data-lb-dots]').addEventListener('click', (e) => {
    const d = e.target.closest('[data-dot]');
    if (d) { idx = Number(d.dataset.dot); showLb(); }
  });
  $('[data-lb-prev]').addEventListener('click', () => step(-1));
  $('[data-lb-next]').addEventListener('click', () => step(1));
  $('[data-lb-stage]').addEventListener('click', (e) => { if (e.target === e.currentTarget || e.target === fig) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'Tab') {
      const f = [...lb.querySelectorAll('button, a[href]')].filter((el) => el.offsetParent);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Arrastar para os lados no celular
  let x0 = null;
  const stage = $('[data-lb-stage]');
  stage.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  });

  // ---------- Horário ----------
  // Segunda a quinta das 8h às 18h, sexta das 8h às 17h30
  const now = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date());
  const wd = now.find((p) => p.type === 'weekday').value;
  const min = Number(now.find((p) => p.type === 'hour').value) * 60 + Number(now.find((p) => p.type === 'minute').value);
  const close = { Mon: 18 * 60, Tue: 18 * 60, Wed: 18 * 60, Thu: 18 * 60, Fri: 17 * 60 + 30 }[wd];
  const open = Boolean(close) && min >= 8 * 60 && min < close;
  const status = $('[data-status]');
  status.textContent = open ? 'Aberto agora' : 'Fechado agora';
  status.classList.toggle('is-open', open);
  $('[data-year]').textContent = new Date().getFullYear();

  // ---------- Entrada suave das seções ----------
  const rio = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
  }), { rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => rio.observe(el));

  // ---------- Botão flutuante some quando outro botão de WhatsApp está na tela ----------
  const waBlocks = document.querySelectorAll('.hero, .promise .btn--wa, .custom .btn--wa, .footer [data-wa].btn');
  const onScreen = new Set();
  const fio = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? onScreen.add(en.target) : onScreen.delete(en.target)));
    document.body.classList.toggle('fab-off', onScreen.size > 0);
  });
  waBlocks.forEach((el) => fio.observe(el));

  // ---------- Navbar some ao descer e volta ao subir ----------
  let lastY = scrollY;
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      const lbOpen = document.body.classList.contains('is-locked');
      if (!lbOpen && Math.abs(y - lastY) > 6) {
        document.body.classList.toggle('nav-hidden', y > lastY && y > 120);
        lastY = y;
      }
      if (y <= 120) document.body.classList.remove('nav-hidden');
      ticking = false;
    });
  }, { passive: true });

  // ---------- Início ----------
  render();
  if (startPhoto) openLb(slides().findIndex((s) => s.p === startPhoto));
})();
