// survey.js v3 — Encuesta de validación + captura de leads
(function () {
  'use strict';

  const answers = { tipo:'', pago:'', perfil:'', ciudad:'', subsidio_interes:'', origen:'' };
  const TOTAL = 5;

  window.goStep = function (n) {
    document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
    const next = document.getElementById('step' + n);
    if (!next) return;
    next.classList.add('active');
    const survey = document.getElementById('encuesta');
    if (survey) {
      const top = survey.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    updateProgress(n);
    if (n === 5) syncHidden();
    if (n === 6) updateCounter();
  };

  function updateProgress(step) {
    const fill  = document.getElementById('pbFill');
    const label = document.getElementById('pbLabel');
    const wrap  = document.getElementById('progressWrap');
    if (!fill || !label) return;
    if (step >= 6) { if (wrap) wrap.style.display = 'none'; return; }
    fill.style.width = Math.round((step / TOTAL) * 100) + '%';
    label.textContent = 'Paso ' + step + ' de ' + TOTAL;
  }

  function syncHidden() {
    Object.keys(answers).forEach(k => {
      const el = document.getElementById('h_' + k);
      if (el) el.value = answers[k];
    });
  }

  function bindCards(stepId, name, btnId) {
    const step = document.getElementById(stepId);
    if (!step) return;
    step.querySelectorAll('.opt-card, .opt-li').forEach(card => {
      card.addEventListener('click', () => {
        step.querySelectorAll('.opt-card, .opt-li').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const inp = card.querySelector('input[type="radio"]');
        if (inp) { inp.checked = true; answers[name] = inp.value; }
        const btn = document.getElementById(btnId);
        if (btn) btn.disabled = false;
      });
    });
  }

  function bindTags(name) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
      inp.addEventListener('change', () => {
        document.querySelectorAll('.tag-opt').forEach(l => {
          if (l.querySelector(`input[name="${name}"]`)) l.classList.remove('selected');
        });
        const lbl = inp.closest('.tag-opt');
        if (lbl) lbl.classList.add('selected');
        answers[name] = inp.value;
      });
    });
  }

  function initCounter() {
    const base = 48 + Math.floor(Math.random() * 9);
    setCounter(base);
  }

  function setCounter(n) {
    const el  = document.getElementById('foundersCount');
    const sp  = document.getElementById('spotsLeft');
    const bar = document.getElementById('foundersBar');
    if (el)  el.textContent  = Math.min(n, 100);
    if (sp)  sp.textContent  = Math.max(100 - n, 0);
    if (bar) bar.style.width = Math.min(n, 100) + '%';
  }

  function updateCounter() {
    const el = document.getElementById('foundersCount');
    const cur = parseInt(el?.textContent || '53', 10);
    setCounter(Math.min(cur + 1, 100));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btnT = form.querySelector('.btn-text');
    const btnL = form.querySelector('.btn-loading');
    const btn  = document.getElementById('btnSubmit');
    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    if (!nombre || !telefono) return;
    if (btnT) btnT.style.display = 'none';
    if (btnL) btnL.style.display = 'inline';
    if (btn)  btn.disabled = true;

    const payload = new URLSearchParams({
      'form-name': 'contacto', nombre, telefono,
      correo: form.correo?.value.trim() || '',
      tipo: answers.tipo, pago: answers.pago, perfil: answers.perfil,
      ciudad: answers.ciudad, subsidio_interes: answers.subsidio_interes,
      origen: answers.origen, fecha: new Date().toISOString(),
    });

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
    } catch (_) {}

    // WhatsApp — pon tu número aquí: '573XXXXXXXXX'
    const WA = '';
    if (WA) {
      const tipoLabel = {
        lote_200:'Lote 200m²', lote_800:'Lote 800m²',
        vivienda_progresiva:'Vivienda Progresiva', casa_terminada:'Casa Terminada',
      }[answers.tipo] || answers.tipo;
      const msg = encodeURIComponent(
        `🏠 *Nuevo Fundador*\nNombre: ${nombre}\nTel: ${telefono}\n` +
        `Interés: ${tipoLabel}\nCapacidad: ${answers.pago}\n` +
        `Perfil: ${answers.perfil}\nCiudad: ${answers.ciudad}\n` +
        `Subsidio: ${answers.subsidio_interes}\nOrigen: ${answers.origen}`
      );
      setTimeout(() => window.open(`https://wa.me/${WA}?text=${msg}`, '_blank'), 1800);
    }
    goStep(6);
  }

  function initScrollAnim() {
    if (!window.IntersectionObserver) return;
    const targets = document.querySelectorAll('.tip-card,.stage-vd,.opt-card,.opt-li,.calc-card');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 65);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity .45s ease, transform .45s ease';
      obs.observe(el);
    });
  }

  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  function initShare() {
    document.getElementById('btnShare')?.addEventListener('click', () => {
      const url  = window.location.origin + window.location.pathname;
      const text = '¿Buscas casa o lote en Arjona? Regístrate gratis y recibe un bono de $500.000 👇';
      if (navigator.share) {
        navigator.share({ title: 'Proyecto Arjona', text, url }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(url)
          .then(() => alert('¡Enlace copiado! Compártelo por WhatsApp.'))
          .catch(() => prompt('Copia este enlace:', url));
      }
    });
  }

  function handleParams() {
    const tipo = new URLSearchParams(window.location.search).get('tipo');
    if (!tipo) return;
    setTimeout(() => {
      const card = document.querySelector(`[data-val="${tipo}"]`);
      if (card) {
        card.click();
        document.getElementById('encuesta')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 700);
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindCards('step1', 'tipo',   'btn1');
    bindCards('step2', 'pago',   'btn2');
    bindCards('step3', 'perfil', 'btn3');
    bindTags('ciudad');
    bindTags('subsidio_interes');
    bindTags('origen');
    document.getElementById('leadForm')?.addEventListener('submit', handleSubmit);
    initNav();
    initCounter();
    initScrollAnim();
    initShare();
    handleParams();
    updateProgress(1);
  });

})();
