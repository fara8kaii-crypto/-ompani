
document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal');

  // Плавное появление элементов при прокрутке.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -35px 0px'
  });

  revealItems.forEach(item => revealObserver.observe(item));

  // Анимированные счётчики.
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const node = entry.target;
      const target = Number(node.dataset.count);
      const start = performance.now();
      const duration = 1500;

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);

        node.textContent =
          Math.round(target * eased) + (target === 120 ? '+' : '');

        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(node);
    });
  }, { threshold: 0.7 });

  counters.forEach(counter => counterObserver.observe(counter));

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');

  // Закреплённая шапка меняет размер при прокрутке.
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Подсветка активного пункта меню.
  const sectionLinks = [...nav.querySelectorAll('a[href^="#"]')];

  const sections = sectionLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = id => {
    sectionLinks.forEach(link => {
      const active = link.getAttribute('href') === '#' + id;

      link.classList.toggle('is-active', active);

      if (active) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActiveLink(visible.target.id);
    }, {
      rootMargin: '-24% 0px -62% 0px',
      threshold: [0, 0.1, 0.25, 0.5]
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Мобильное меню.
  menuButton.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');

    menuButton.classList.toggle('active', opened);
    menuButton.setAttribute('aria-expanded', String(opened));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.classList.remove('active');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  // Закрываем меню при нажатии Escape.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      nav.classList.remove('open');
      menuButton.classList.remove('active');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });

  // Эффект свечения за курсором.
  const glow = document.querySelector('.cursor-glow');

  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      glow.style.left = event.clientX + 'px';
      glow.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  // Текущий год в подвале.
  document.getElementById('year').textContent =
    new Date().getFullYear();

  // Демонстрационная форма заявки.
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();

    if (!name || !phone) {
      status.textContent = 'Пожалуйста, заполните имя и номер телефона.';
      return;
    }

    status.textContent =
      'Спасибо, ' + name +
      '! Форма пока работает в демо-режиме. Подключите Telegram или CRM для получения заявок.';

    form.reset();
  });
});
