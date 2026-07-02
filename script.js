/* =================================================================
   Alex Rivera — DevOps Portfolio · interactions
   Vanilla JS, no dependencies.

   Modules
   01  Helpers & feature detection
   02  Preloader
   03  Custom magnetic cursor
   04  Smooth scroll (lerp) + parallax + progress
   05  Split text (lines / words)
   06  Scroll reveal (IntersectionObserver)
   07  Count-up stats
   08  Nav: hide-on-scroll, active link, mobile menu
   09  Theme toggle
   10  Card 3D tilt + spotlight
   11  Misc (year, back-to-top)
   ================================================================= */
(function () {
  'use strict';

  /* ---------- 01 · Helpers & feature detection ------------------ */
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const lerp  = (a, b, t) => a + (b - a) * t;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isDesktop = !isTouch && window.innerWidth > 720;

  const html = document.documentElement;

  /* ---------- 02 · Preloader ------------------------------------ */
  function initPreloader() {
    const pre   = $('#preloader');
    const bar   = $('#preloaderBar');
    const count = $('#preloaderCount');
    if (!pre) { document.body.classList.add('loaded'); startHero(); return; }

    if (prefersReduced) {
      pre.classList.add('is-done');
      document.body.classList.add('loaded');
      startHero();
      return;
    }

    let progress = 0;
    const tick = () => {
      // ease toward 100, slowing near the end
      progress += Math.max(0.5, (100 - progress) * 0.12);
      if (progress > 99.4) progress = 100;
      if (bar)   bar.style.width = progress + '%';
      if (count) count.textContent = Math.round(progress);
      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          pre.classList.add('is-done');
          document.body.classList.add('loaded');
          startHero();
        }, 260);
      }
    };
    requestAnimationFrame(tick);
  }

  /* Reveal the hero headline once the preloader clears */
  function startHero() {
    const heroLines = $$('.hero__title .split-inner');
    heroLines.forEach((el, i) => {
      el.style.transitionDelay = (0.08 * i) + 's';
      requestAnimationFrame(() => { el.style.transform = 'none'; });
    });
    // Kick reveal on any hero element already in view
    $$('.hero [data-reveal]').forEach((el, i) => {
      const d = parseFloat(el.dataset.revealDelay || 0) + 0.2;
      el.style.transitionDelay = d + 's';
      requestAnimationFrame(() => el.classList.add('is-in'));
    });
  }

  /* ---------- 03 · Custom magnetic cursor ----------------------- */
  function initCursor() {
    if (!isDesktop || prefersReduced) return;
    const cursor = $('.cursor');
    const dot    = $('.cursor__dot');
    const ring   = $('.cursor__ring');
    const ringLabel = ring.querySelector ? ring : null;
    if (!cursor) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my;   // dot (fast)
    let rx = mx, ry = my;   // ring (trailing)

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.classList.remove('is-hidden');
    }, { passive: true });

    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('is-down'));

    const render = () => {
      dx = lerp(dx, mx, 0.9);
      dy = lerp(dy, my, 0.9);
      rx = lerp(rx, mx, 0.18);
      ry = lerp(ry, my, 0.18);
      dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Interactive + labelled targets
    $$('a, button, [data-magnetic], [data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        const label = el.dataset.cursor;
        if (label) {
          cursor.classList.add('is-label');
          ring.setAttribute('data-label', label);
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover', 'is-label');
        ring.removeAttribute('data-label');
      });
    });
  }

  /* ---------- Magnetic pull for [data-magnetic] ----------------- */
  function initMagnetic() {
    if (!isDesktop || prefersReduced) return;
    $$('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength || 0.35);
      let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;

      const move = (e) => {
        const r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * strength;
        ty = (e.clientY - (r.top + r.height / 2)) * strength;
        if (!raf) raf = requestAnimationFrame(loop);
      };
      const loop = () => {
        cx = lerp(cx, tx, 0.2); cy = lerp(cy, ty, 0.2);
        el.style.transform = `translate(${cx}px, ${cy}px)`;
        if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) {
          raf = requestAnimationFrame(loop);
        } else { raf = null; }
      };
      const reset = () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      };
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', reset);
    });
  }

  /* ---------- 04 · Smooth scroll (lerp) ------------------------- */
  // Translates #smooth-content while body is fixed; falls back to native
  // scrolling on touch / reduced-motion.
  let scrollY = 0;         // exposed for other modules
  let smoothActive = false;

  function initSmoothScroll() {
    const wrapper = $('#smooth-wrapper');
    const content = $('#smooth-content');
    if (!wrapper || !content || isTouch || prefersReduced) {
      // Native scroll path
      window.addEventListener('scroll', () => { scrollY = window.scrollY; onScroll(); }, { passive: true });
      onScroll();
      return;
    }

    smoothActive = true;
    document.body.classList.add('smooth-active');

    let current = 0, target = 0;
    const setHeight = () => { document.body.style.height = content.getBoundingClientRect().height + 'px'; };
    setHeight();
    window.addEventListener('resize', setHeight);
    // Recompute once fonts/images settle
    window.addEventListener('load', setHeight);
    setTimeout(setHeight, 600);

    window.addEventListener('scroll', () => { target = window.scrollY; }, { passive: true });

    const render = () => {
      current = lerp(current, target, 0.085);
      if (Math.abs(target - current) < 0.05) current = target;
      content.style.transform = `translate3d(0, ${-current}px, 0)`;
      scrollY = current;
      onScroll();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Anchor links: use native scrollTo so target syncs
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = $(id);
        if (!t) return;
        e.preventDefault();
        const top = t.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMenu();
      });
    });
  }

  /* Parallax + progress bar, called every frame/scroll */
  const parallaxEls = () => $$('[data-parallax]');
  let _parallax = [];
  function onScroll() {
    const y = smoothActive ? scrollY : window.scrollY;
    const doc = document.documentElement;
    const max = (doc.scrollHeight - window.innerHeight) || 1;
    const p = clamp(y / max, 0, 1);
    const bar = $('#scrollProgress');
    if (bar) bar.style.transform = `scaleX(${p})`;

    _parallax.forEach(({ el, speed }) => {
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });

    handleNavScroll(y);
  }

  /* ---------- 05 · Split text ----------------------------------- */
  // Wrap words/lines so each can slide up behind an overflow-hidden mask.
  function splitText() {
    $$('[data-split]').forEach((el) => {
      const mode = el.dataset.split;
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = '1';

      if (mode === 'words') {
        const words = el.textContent.trim().split(/\s+/);
        el.textContent = '';
        words.forEach((w, i) => {
          const wrap = document.createElement('span');
          wrap.className = 'split-word';
          const inner = document.createElement('span');
          inner.className = 'split-inner';
          inner.textContent = w;
          inner.style.transitionDelay = (i * 0.04) + 's';
          wrap.appendChild(inner);
          el.appendChild(wrap);
          el.appendChild(document.createTextNode(' '));
        });
      } else { // lines — wrap whole content as one sliding block
        const inner = document.createElement('span');
        inner.className = 'split-inner';
        while (el.firstChild) inner.appendChild(el.firstChild);
        const line = document.createElement('span');
        line.className = 'split-line';
        line.appendChild(inner);
        el.appendChild(line);
      }
    });
  }

  /* ---------- 06 · Scroll reveal -------------------------------- */
  function initReveal() {
    const revealEls = $$('[data-reveal]:not(.hero [data-reveal])');
    const splitEls  = $$('[data-split]');

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-in'));
      splitEls.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.dataset.revealDelay || 0);
        if (delay) el.style.transitionDelay = delay + 's';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => io.observe(el));

    // Split elements reveal their inner slides when in view
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io2.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    splitEls.forEach((el) => { if (!el.closest('.hero')) io2.observe(el); });
  }

  /* ---------- 07 · Count-up stats ------------------------------- */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    const run = (el) => {
      const target   = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || 0, 10);
      const suffix   = el.dataset.suffix || '';
      const dur      = 1600;
      if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }

      let startTs = null;
      const step = (ts) => {
        if (!startTs) startTs = ts;
        const prog = clamp((ts - startTs) / dur, 0, 1);
        // easeOutExpo
        const eased = prog === 1 ? 1 : 1 - Math.pow(2, -10 * prog);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach((el) => io.observe(el));
  }

  /* ---------- 08 · Nav ------------------------------------------ */
  let lastY = 0;
  const nav = $('#nav');
  function handleNavScroll(y) {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', y > 40);
    // hide when scrolling down past the hero, show when scrolling up
    if (y > lastY && y > 600) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    lastY = y;
  }

  function initScrollSpy() {
    const links = $$('.nav__link');
    const map = new Map();
    links.forEach((l) => {
      const id = l.getAttribute('href');
      const sec = id && id.length > 1 ? $(id) : null;
      if (sec) map.set(sec, l);
    });
    if (!map.size || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { threshold: 0.4, rootMargin: '-20% 0px -40% 0px' });
    map.forEach((_l, sec) => io.observe(sec));
  }

  /* Mobile menu */
  const burger = $('#navBurger');
  const menu   = $('#mobileMenu');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (burger) { burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  }
  function initMenu() {
    if (!burger || !menu) return;
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    });
    $$('.menu__link', menu).forEach((l) => l.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- 09 · Theme toggle --------------------------------- */
  function initTheme() {
    const btn = $('#themeToggle');
    if (!btn) return;
    // Resolve initial (respect saved pref, else system)
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    html.setAttribute('data-theme', saved);

    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- 10 · Card 3D tilt + spotlight --------------------- */
  function initTilt() {
    const cards = $$('[data-tilt]');
    cards.forEach((card) => {
      // Spotlight coords (used by ::before) — works on all devices
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * 100;
        const py = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', px + '%');
        card.style.setProperty('--my', py + '%');

        if (!isDesktop || prefersReduced) return;
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- 11 · Misc ----------------------------------------- */
  function initMisc() {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    const backTop = $('#backTop');
    if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Register parallax targets (orbs drift slightly with scroll)
    _parallax = [
      { sel: '.orb--1', speed: 0.08 },
      { sel: '.orb--2', speed: 0.05 },
      { sel: '.orb--3', speed: 0.11 },
    ].map(({ sel, speed }) => ({ el: $(sel), speed })).filter((o) => o.el && !prefersReduced && !isTouch);
  }

  /* ---------- Boot ---------------------------------------------- */
  function boot() {
    splitText();       // must run before reveal so inners exist
    initMisc();
    initTheme();
    initCursor();
    initMagnetic();
    initSmoothScroll();
    initReveal();
    initCounters();
    initScrollSpy();
    initMenu();
    initTilt();
    initPreloader();   // last: triggers hero reveal
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
