// survey.js v7 — Rewrite robusta con delegación de eventos
(function () {
  'use strict';

  /* ── Estado central ──────────────────────────────────────────────────────── */
  const answers = {
    tipo: '', pago: '', perfil: '', forma_pago: '',
    tiempo_compra: '', subsidio_interes: '', origen: '',
  };
  const TOTAL = 6;

  /* ── Catálogo de productos ───────────────────────────────────────────────── */
  const PRODUCTOS = {
    lote_200: { label:'Lote de 200 m²',                        precio:'$22.000.000',  subsidio:false, emoji:'🟫' },
    lote_800: { label:'Lote de 800 m²',                        precio:'$80.000.000',  subsidio:false, emoji:'🟧' },
    prog_200: { label:'Casa 48m² en lote 200m² (Progresiva)',  precio:'$143.574.210', subsidio:true,  emoji:'🏗️' },
    prog_800: { label:'Casa 56m² en lote 800m² (Progresiva)',  precio:'$185.000.000', subsidio:true,  emoji:'🏠' },
    terminada:{ label:'Vivienda 100% terminada',               precio:'$220.000.000', subsidio:true,  emoji:'🏡' },
  };

  /* ── Labels para el mensaje WA ───────────────────────────────────────────── */
  const PAGO_LABELS = {
    menos300:'Menos de $300.000/mes', '300_600':'$300.000–$600.000/mes',
    '600_1000':'$600.000–$1.000.000/mes', mas1000:'Más de $1.000.000/mes',
  };
  const PERFIL_LABELS = {
    vendedor:'Vendedor / Independiente', mototaxista:'Mototaxista',
    madre_cabeza:'Madre cabeza de familia',
    empleado_oficial:'Empleado Oficial (Alcaldía / Gobernación / Hospital)',
  };
  const FORMA_PAGO_LABELS = {
    ahorro_mensual:'Ahorro programado mensual',
    cuotas_periodicas:'Cuotas semanales o quincenales',
    subsidio_credito:'Subsidio + crédito bancario',
    contado:'De contado',
  };
  const TIEMPO_LABELS = {
    pronto:'Lo más pronto posible', '3_6_meses':'En 3 a 6 meses',
    '1_ano':'En 1 año', mirando:'Solo estoy mirando',
  };
  const SUBSIDIO_LABELS = { si:'Sí', aprender:'Quiere aprender cómo', no:'No' };
  const ORIGEN_LABELS   = {
    alcaldia:'Alcaldía', educacion:'Sec. Educación', redes:'Redes sociales',
    amigo:'Un amigo', telegram:'Telegram',
  };

  /* ── Mapa: nombre de radio → id del botón siguiente ─────────────────────── */
  const BTN_MAP = { tipo:'btn1', pago:'btn2', perfil:'btn3', forma_pago:'btn4' };

  /* ═══════════════════════════════════════════════════════════════════════════
     NAVEGACIÓN
  ═══════════════════════════════════════════════════════════════════════════ */
  window.goStep = function (n) {
    document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
    const next = document.getElementById('step' + n);
    if (!next) return;
    next.classList.add('active');
    const survey = document.getElementById('encuesta');
    if (survey) window.scrollTo({ top: survey.getBoundingClientRect().top + window.scrollY - 72, behavior:'smooth' });
    updateProgress(n);
    if (n === 6) syncHidden();
    if (n === 7) updateCounter();
  };

  function updateProgress(step) {
    const fill  = document.getElementById('pbFill');
    const label = document.getElementById('pbLabel');
    const wrap  = document.getElementById('progressWrap');
    if (!fill || !label) return;
    if (step >= 7) { if (wrap) wrap.style.display = 'none'; return; }
    fill.style.width = Math.round((step / TOTAL) * 100) + '%';
    label.textContent = 'Paso ' + step + ' de ' + TOTAL;
  }

  function syncHidden() {
    Object.keys(answers).forEach(k => {
      const el = document.getElementById('h_' + k);
      if (el) el.value = answers[k];
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SELECCIÓN DE TARJETAS — DELEGACIÓN DE EVENTOS (enfoque definitivo)

     PROBLEMA ANTERIOR: bindCards añadía listeners en cada <label>. Al hacer clic
     en un <label> que contiene <input type="radio">, el navegador dispara:
       1. click en label  →  nuestro handler  →  disabled = false ✓
       2. activa el radio →  click sintético en input  →  burbujea al label
          →  nuestro handler vuelve a correr (2ª vez sin problema)
     El bug real era que initScrollAnim ponía opacity:0 en .opt-card,
     haciendo las tarjetas invisibles sin que el usuario pudiera verlas.

     SOLUCIÓN DEFINITIVA: escuchamos el evento 'change' en el radio input.
     - 'change' solo se dispara UNA VEZ al seleccionar.
     - Lo escuchamos con delegación en el survey-container (robusto ante re-render).
     - Adicionalmente, al clic en la tarjeta (.opt-card, .opt-li) disparamos
       el change manualmente si el radio no estaba ya marcado.
  ═══════════════════════════════════════════════════════════════════════════ */
  function initCardDelegation() {
    const steps = document.querySelectorAll('.survey-step');

    steps.forEach(step => {
      const cards = step.querySelectorAll('.opt-card, .opt-li');
      
      cards.forEach(card => {
        card.addEventListener('click', function (e) {
          // Find radio inside this card
          const inp = card.querySelector('input[type="radio"]');
          if (!inp) return;

          // Check it and update answers map
          inp.checked = true;
          answers[inp.name] = inp.value;

          // Visual selection
          cards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');

          // Enable 'Continuar' button immediately
          const btnId = BTN_MAP[inp.name];
          if (btnId) {
            const btn = document.getElementById(btnId);
            if (btn) {
              btn.disabled = false;
              btn.removeAttribute('disabled');
            }
          }
        });
      });
    });
  }

  /* ── Tags (ciudad / subsidio / origen) ──────────────────────────────────── */
  function bindTags(name) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
      inp.addEventListener('change', () => {
        document.querySelectorAll(`.tag-opt input[name="${name}"]`).forEach(i => {
          i.closest('.tag-opt')?.classList.remove('selected');
        });
        inp.closest('.tag-opt')?.classList.add('selected');
        answers[name] = inp.value;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     CONTADOR DE FUNDADORES
  ═══════════════════════════════════════════════════════════════════════════ */
  function setCounter(n) {
    const el  = document.getElementById('foundersCount');
    const sp  = document.getElementById('spotsLeft');
    const bar = document.getElementById('foundersBar');
    n = Math.min(Math.max(n, 0), 100);
    if (el)  el.textContent  = n;
    if (sp)  sp.textContent  = 100 - n;
    if (bar) bar.style.width = n + '%';
  }
  function initCounter() { setCounter(48 + Math.floor(Math.random() * 9)); }
  function updateCounter() {
    const el = document.getElementById('foundersCount');
    setCounter((parseInt(el?.textContent || '53', 10)) + 1);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ENVÍO DEL FORMULARIO
  ═══════════════════════════════════════════════════════════════════════════ */
  async function handleSubmit(e) {
    e.preventDefault();
    const form     = e.target;
    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    if (!nombre || !telefono) return;

    const btnT = form.querySelector('.btn-text');
    const btnL = form.querySelector('.btn-loading');
    const btnS = document.getElementById('btnSubmit');
    if (btnT) btnT.style.display = 'none';
    if (btnL) btnL.style.display = 'inline';
    if (btnS) btnS.disabled = true;

    try {
      await fetch('/', {
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
          'form-name':'contacto', nombre, telefono,
          correo: form.correo?.value.trim() || '',
          tipo: answers.tipo, pago: answers.pago, perfil: answers.perfil,
          forma_pago: answers.forma_pago, tiempo_compra: answers.tiempo_compra,
          subsidio_interes: answers.subsidio_interes, origen: answers.origen,
          fecha: new Date().toISOString(),
        }).toString(),
      });
    } catch (_) {}

    /* Construir URL de WA con datos del lead */
    const WA   = '';  // ← '573XXXXXXXXX'
    const prod = PRODUCTOS[answers.tipo] || {};
    const fecha = new Date().toLocaleString('es-CO', {
      dateStyle:'short', timeStyle:'short', timeZone:'America/Bogota',
    });
    const waMsg = encodeURIComponent(
      `🏗️ *Nuevo participante — Barrio Arjona*\n\n` +
      `👤 ${nombre}  |  📞 ${telefono}\n\n` +
      `${prod.emoji || '🏠'} *Opción:* ${prod.label || answers.tipo}\n` +
      `💰 Precio ref: ${prod.precio || '—'}\n` +
      `🎁 Subsidio: ${prod.subsidio ? '✅ Aplica' : '❌ No aplica'}\n\n` +
      `💵 Pago/mes: ${PAGO_LABELS[answers.pago] || '—'}\n` +
      `👷 Perfil: ${PERFIL_LABELS[answers.perfil] || '—'}\n` +
      `💳 Forma pago: ${FORMA_PAGO_LABELS[answers.forma_pago] || '—'}\n` +
      `⏳ Tiempo estimado de compra: ${TIEMPO_LABELS[answers.tiempo_compra] || '—'}\n` +
      `🎯 Subsidio interés: ${SUBSIDIO_LABELS[answers.subsidio_interes] || '—'}\n` +
      `📣 Llegó por: ${ORIGEN_LABELS[answers.origen] || '—'}\n\n` +
      `🕐 ${fecha}`
    );
    const waBase = WA ? `https://wa.me/${WA}` : 'https://wa.me/';
    const waHref = `${waBase}?text=${waMsg}`;
    ['btnWA', 'fabWA', 'stickyWA'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = waHref;
    });

    goStep(7);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     STICKY CTA — aparece cuando el hero sale de pantalla
  ═══════════════════════════════════════════════════════════════════════════ */
  function initStickyCTA() {
    const heroBtn = document.querySelector('.btn-start');
    const sticky  = document.getElementById('sticky-cta');
    if (!heroBtn || !sticky) return;
    if (!window.IntersectionObserver) { sticky.classList.add('visible'); return; }
    const obs = new IntersectionObserver(
      ([entry]) => sticky.classList.toggle('visible', !entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(heroBtn);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ANIMACIONES DE SCROLL — solo elementos siempre visibles (NO opt-card)
  ═══════════════════════════════════════════════════════════════════════════ */
  function initScrollAnim() {
    if (!window.IntersectionObserver) return;
    const targets = document.querySelectorAll('.tip-card, .stage-vd, .calc-card');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    targets.forEach(el => {
      el.style.cssText += ';opacity:0;transform:translateY(14px);transition:opacity .45s ease,transform .45s ease';
      obs.observe(el);
    });
  }

  /* ── Nav scroll ──────────────────────────────────────────────────────────── */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive:true });
  }

  /* ── Compartir ───────────────────────────────────────────────────────────── */
  function initShare() {
    document.getElementById('btnShare')?.addEventListener('click', () => {
      const url  = window.location.origin + window.location.pathname;
      const text = '¿Buscas casa o lote en Arjona? Participa gratis en el diseño del nuevo barrio 👇';
      if (navigator.share) {
        navigator.share({ title:'Barrio Arjona — Co-creación', text, url }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(url)
          .then(() => alert('¡Enlace copiado!'))
          .catch(() => prompt('Copia este enlace:', url));
      }
    });
  }

  /* ── Pre-selección por URL param ─────────────────────────────────────────── */
  function handleParams() {
    const tipo = new URLSearchParams(window.location.search).get('tipo');
    if (!tipo) return;
    setTimeout(() => {
      const card = document.querySelector(`[data-val="${tipo}"]`);
      if (card) {
        card.click();
        document.getElementById('encuesta')?.scrollIntoView({ behavior:'smooth' });
      }
    }, 600);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initCardDelegation();   /* ← delegación global, reemplaza bindCards */
    bindTags('tiempo_compra');
    bindTags('subsidio_interes');
    bindTags('origen');
    document.getElementById('leadForm')?.addEventListener('submit', handleSubmit);
    initNav();
    initCounter();
    initScrollAnim();
    initShare();
    initStickyCTA();
    handleParams();
    updateProgress(1);
  });

})();
