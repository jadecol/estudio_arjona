// survey.js — Lógica de encuesta interactiva + captura de leads

(function () {
  'use strict';

  // ── Estado de la encuesta ──────────────────────────────────────────────────
  const answers = { tipo: '', pago: '', perfil: '', ciudad: '', subsidio: '', origen: '' };
  const TOTAL_STEPS = 5;

  // ── Navegación entre pasos ─────────────────────────────────────────────────
  window.goStep = function (n) {
    document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
    const next = document.getElementById('step' + n);
    if (next) {
      next.classList.add('active');
      next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    updateProgress(n);
    if (n === 5) syncHiddenFields();
  };

  function updateProgress(step) {
    const fill  = document.getElementById('progressFill');
    const label = document.getElementById('progressLabel');
    const wrap  = document.getElementById('progressWrap');
    if (!fill || !label) return;
    if (step >= 6) { if (wrap) wrap.style.display = 'none'; return; }
    const pct = Math.round((step / TOTAL_STEPS) * 100);
    fill.style.width = pct + '%';
    label.textContent = 'Paso ' + step + ' de ' + TOTAL_STEPS;
  }

  // ── Sincroniza respuestas en campos hidden del form ────────────────────────
  function syncHiddenFields() {
    ['tipo', 'pago', 'perfil', 'ciudad', 'subsidio', 'origen'].forEach(k => {
      const el = document.getElementById('h_' + k);
      if (el) el.value = answers[k];
    });
  }

  // ── Selección de opciones tipo card ───────────────────────────────────────
  function bindCardOptions(stepId, name, nextBtnId) {
    const step = document.getElementById(stepId);
    if (!step) return;
    step.querySelectorAll('.opt-card, .opt-list-item').forEach(card => {
      card.addEventListener('click', () => {
        step.querySelectorAll('.opt-card, .opt-list-item').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const inp = card.querySelector('input[type="radio"]');
        if (inp) { inp.checked = true; answers[name] = inp.value; }
        const btn = document.getElementById(nextBtnId);
        if (btn) btn.disabled = false;
      });
    });
  }

  // ── Selección de tag options (ciudad, subsidio, origen) ───────────────────
  function bindTagOptions(name) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
      inp.addEventListener('change', () => {
        document.querySelectorAll(`label[data-val]`).forEach(l => {
          if (l.querySelector(`input[name="${name}"]`)) l.classList.remove('selected');
        });
        const label = inp.closest('label');
        if (label) label.classList.add('selected');
        answers[name] = inp.value;
        checkStep4();
      });
    });
  }

  function checkStep4() {
    const btn = document.getElementById('btn4');
    if (btn) btn.disabled = false; // paso 4 no es obligatorio completar todo
  }

  // ── Inicializar bindings ───────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {

    bindCardOptions('step1', 'tipo',   'btn1');
    bindCardOptions('step2', 'pago',   'btn2');
    bindCardOptions('step3', 'perfil', 'btn3');
    bindTagOptions('ciudad');
    bindTagOptions('subsidio');
    bindTagOptions('origen');

    // Nav scroll
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Contador de fundadores animado
    animateCounter();

    // Formulario submit
    const form = document.getElementById('leadForm');
    const btnS = document.getElementById('btnSubmit');
    form?.addEventListener('submit', handleSubmit);

    // Botón compartir
    document.getElementById('btnShare')?.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Participa y recibe un bono de $500.000',
          text: '¿Buscas casa o lote en Arjona? Regístrate y recibe un bono especial.',
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(window.location.href);
        alert('¡Enlace copiado! Compártelo con quien busque vivienda.');
      }
    });

    // Animar cards al hacer scroll
    initScrollAnimations();

    // Pre-selección si viene de URL (?tipo=vivienda_progresiva)
    const params = new URLSearchParams(window.location.search);
    const preType = params.get('tipo');
    if (preType) {
      const targetCard = document.querySelector(`[data-val="${preType}"]`);
      if (targetCard) {
        targetCard.click();
        document.getElementById('encuesta')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // ── Manejo del formulario ─────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = document.getElementById('btnSubmit');
    const text = btn.querySelector('.btn-text');
    const load = btn.querySelector('.btn-loading');

    // Validación básica
    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    if (!nombre || !telefono) return;

    text.style.display = 'none';
    load.style.display = 'inline';
    btn.disabled = true;

    const payload = new URLSearchParams({
      'form-name': 'contacto',
      nombre,
      telefono,
      correo:   form.correo?.value.trim() || '',
      tipo:     answers.tipo,
      pago:     answers.pago,
      perfil:   answers.perfil,
      ciudad:   answers.ciudad,
      subsidio: answers.subsidio,
      origen:   answers.origen,
      fecha:    new Date().toISOString(),
    });

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
    } catch (_) {
      // En local no hay endpoint Netlify — continuar igual
    }

    // También intentar WhatsApp si número configurado
    const WA = ''; // ← pon tu número: '573XXXXXXXXX'
    if (WA) {
      const tipo_txt = {
        lote_200:           'Lote 200m²',
        lote_800:           'Lote 800m²',
        vivienda_progresiva:'Vivienda Progresiva',
        casa_terminada:     'Casa terminada',
      }[answers.tipo] || answers.tipo;
      const msg = encodeURIComponent(
        `Hola, me registré en el Proyecto Arjona.\n` +
        `Nombre: ${nombre}\nTeléfono: ${telefono}\n` +
        `Interés: ${tipo_txt}\nCiudad: ${answers.ciudad || 'No indicó'}\n` +
        `Bono fundador activo ✅`
      );
      setTimeout(() => window.open(`https://wa.me/${WA}?text=${msg}`, '_blank'), 1500);
    }

    // Actualizar contador
    const cnt = document.getElementById('foundersCount');
    if (cnt) {
      const prev = parseInt(cnt.textContent, 10);
      cnt.textContent = Math.min(prev + 1, 100);
    }
    updateFoundersBar(parseInt(document.getElementById('foundersCount')?.textContent || '54', 10));

    goStep(6);
  }

  // ── Contador fundadores ───────────────────────────────────────────────────
  function animateCounter() {
    // Simula que el contador ya tiene gente (entre 45-60)
    const base = 48 + Math.floor(Math.random() * 8);
    const el = document.getElementById('foundersCount');
    const sp = document.getElementById('spotsLeft');
    if (el) el.textContent = base;
    if (sp) sp.textContent = 100 - base;
    updateFoundersBar(base);
  }

  function updateFoundersBar(n) {
    const bar = document.getElementById('foundersBar');
    if (bar) bar.style.width = Math.min(n, 100) + '%';
  }

  // ── Animaciones al scroll ─────────────────────────────────────────────────
  function initScrollAnimations() {
    const targets = document.querySelectorAll(
      '.tip-card, .stage-d, .opt-card, .opt-list-item, .program-card'
    );
    if (!window.IntersectionObserver) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .45s ease, transform .45s ease';
      obs.observe(el);
    });
  }

})();
