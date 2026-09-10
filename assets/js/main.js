/* YOU-ONE Fastening Systems — site interactions */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var headerEl = document.querySelector('.site-header');

  /* The top bar scrolls away while the header stays sticky, so the panel's top
     edge moves. Measure it instead of assuming a fixed offset. */
  function syncHeaderBottom() {
    if (!headerEl) return;
    var bottom = Math.max(0, Math.round(headerEl.getBoundingClientRect().bottom));
    document.documentElement.style.setProperty('--header-bottom', bottom + 'px');
  }
  syncHeaderBottom();
  window.addEventListener('resize', syncHeaderBottom);
  window.addEventListener('orientationchange', syncHeaderBottom);

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      syncHeaderBottom();
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        toggle.focus();
      }
    });
  }

  /* ---------- Sticky header shadow + back-to-top ---------- */
  var header = headerEl;
  var toTop = document.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Catalog scroll-spy ---------- */
  var spyLinks = document.querySelectorAll('.catalog__nav a');
  if (spyLinks.length) {
    var sections = [];
    spyLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) sections.push({ link: link, el: target });
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(function (l) { l.classList.remove('is-active'); });
        var match = sections.filter(function (s) { return s.el === entry.target; })[0];
        if (match) match.link.classList.add('is-active');
      });
    }, { rootMargin: '-104px 0px -70% 0px' });

    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* ---------- Contact form → prefilled email ---------- */
  var form = document.querySelector('[data-mailto-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };

      var subject = '[Inquiry] ' + (get('issue') || 'General') + ' — ' +
                    (get('company') || get('name') || 'Website enquiry');

      var body = [
        'Name    : ' + get('name'),
        'Company : ' + get('company'),
        'Country : ' + get('country'),
        'Email   : ' + get('email'),
        'Tel     : ' + get('tel'),
        'Fax     : ' + get('fax'),
        'Type    : ' + get('issue'),
        '',
        '--- Message ---',
        get('message'),
        '',
        '(Sent from youonefastening website)'
      ].join('\n');

      var to = form.getAttribute('data-mailto-form') || 'fastener@naver.com';
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      var status = form.querySelector('[data-form-status]');
      if (status) {
        status.textContent = 'Opening your email client… If nothing happens, write to ' + to + ' directly.';
        status.style.color = 'var(--accent)';
      }
    });
  }

  /* ---------- Character counter ---------- */
  var textarea = document.querySelector('[data-counter]');
  if (textarea) {
    var out = document.querySelector(textarea.getAttribute('data-counter'));
    var max = textarea.getAttribute('maxlength') || 500;
    var sync = function () { if (out) out.textContent = textarea.value.length + ' / ' + max; };
    textarea.addEventListener('input', sync);
    sync();
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
