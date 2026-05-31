// main.js — ArjonaProgresiva

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV scroll ──────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Mobile menu ─────────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  toggle?.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  // Cerrar al hacer clic en un enlace
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // ── Formulario ──────────────────────────────────────────
  const form    = document.getElementById('leadForm');
  const success = document.getElementById('formSuccess');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-form');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const data = {
      nombre:   form.nombre.value,
      telefono: form.telefono.value,
      ciudad:   form.ciudad.value,
      producto: form.producto.value,
      empleo:   form.empleo.value,
      fecha:    new Date().toISOString(),
    };

    // Intento enviar a Netlify Forms (funciona automáticamente en Netlify)
    // Si no está en Netlify, simplemente muestra el éxito
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contacto', ...data }).toString(),
      });
    } catch (_) {
      // fail silently — en local no funciona el endpoint Netlify
    }

    form.style.display = 'none';
    success.style.display = 'block';
    // Nota: el envío por WhatsApp está centralizado en survey.js → handleSubmit
  });

  // ── Intersection Observer — animaciones al hacer scroll ─
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.lot-card, .city-card, .profile, .tip-card, .stage, .finance-step, .program-card')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      observer.observe(el);
    });

  // Cuando son visibles
  document.addEventListener('animationend', () => {}, false);
  const visObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        visObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.lot-card, .city-card, .profile, .tip-card, .stage, .finance-step, .program-card')
    .forEach(el => visObserver.observe(el));

  // ── Smooth ciudad en URL hash ───────────────────────────
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

});
