// survey.js v6 — Bug fixes: bindCards dual-listener + anim sin opt-card
(function () {
  'use strict';

  const answers = {
    tipo: '', pago: '', perfil: '', forma_pago: '',
    ciudad: '', subsidio_interes: '', origen: '',
  };
  const TOTAL = 6;

  // ── Catálogo de productos ─────────────────────────────────────────────────
  const PRODUCTOS = {
    lote_200: { label: 'Lote de 200 m²',                        precio: '$22.000.000',  subsidio: false, emoji: '🟫' },
    lote_800: { label: 'Lote de 800 m²',                        precio: '$80.000.000',  subsidio: false, emoji: '🟧' },
    prog_200: { label: 'Casa 48m² en lote 200m² (Progresiva)',  precio: '$143.574.210', subsidio: true,  emoji: '🏗️' },
    prog_800: { label: 'Casa 56m² en lote 800m² (Progresiva)',  precio: '$185.000.000', subsidio: true,  emoji: '🏠' },
    terminada:{ label: 'Vivienda 100% terminada',               precio: '$220.000.000', subsidio: true,  emoji: '🏡' },
  };

  // ── Labels legibles ───────────────────────────────────────────────────────
  const PAGO_LABELS = {
    menos300:  'Menos de $300.000/mes',
    '300_600': '$300.000 – $600.000/mes',
    '600_1000':'$600.000 – $1.000.000/mes',
    mas1000:   'Más de $1.000.000/mes',
  };
  const PERFIL_LABELS = {
    vendedor:         'Vendedor / Independiente',
    mototaxista:      'Mototaxista',
    madre_cabeza:     'Madre cabeza de familia',
    empleado_oficial: 'Empleado Oficial (Alcaldía / Gobernación / Hospital)',
  };
  const FORMA_PAGO_LABELS = {
    ahorro_mensual:   'Ahorro programado mensual',
    cuotas_periodicas:'Cuotas semanales o quincenales',
    subsidio_credito: 'Subsidio del gobierno + crédito bancario',
    contado:          'De contado',
  };
  const SUBSIDIO_LABELS = {
    si: 'Sí, le interesa', aprender: 'Quiere aprender cómo', no: 'No le interesa',
  };
  const ORIGEN_LABELS = {
    alcaldia: 'Alcaldía', educacion: 'Sec. Educación', redes: 'Redes sociales',
    amigo: 'Un amigo', telegram: 'Telegram',
  };

  // ── Navegación entre pasos ────────────────────────────────────────────────
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

  // ── Binding de tarjetas — DUAL LISTENER (click + radio change) ────────────
  // FIX: initScrollAnim ponía opacity:0 en opt-card/opt-li. Solución:
  // 1. Removemos opt-card/opt-li de initScrollAnim (ver abajo).
  // 2. Usamos AMBOS: click en la tarjeta Y change en el radio,
  //    con un handler compartido para evitar doble-ejecución.
  function bindCards(stepId, name, btnId) {
    const step = document.getElementById(stepId);
    if (!step) return;

    function activate(value, selectedCard) {
      step.querySelectorAll('.opt-card, .opt-li').forEach(c => c.classList.remove('selected'));
      if (selectedCard) selectedCard.classList.add('selected');
      answers[name] = value;
      const btn = document.getElementById(btnId);
      if (btn) { btn.disabled = false; btn.classList.add('btn-ready'); }
    }

    // Listener en la tarjeta completa (label → clic visual)
    step.querySelectorAll('.opt-card, .opt-li').forEach(card => {
      card.addEventListener('click', () => {
        const inp = card.querySelector('input[type="radio"]');
        if (!inp) return;
        inp.checked = true;
        activate(inp.value, card);
      });
    });

    // Fallback: escuchar `change` en el radio directamente
    // (cubre casos donde el clic en el label no burbujea al handler de arriba)
    step.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(inp => {
      inp.addEventListener('change', () => {
        const card = inp.closest('.opt-card, .opt-li');
        activate(inp.value, card);
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

  // ── Contador de fundadores ────────────────────────────────────────────────
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

  // ── Envío del formulario ──────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const form   = e.target;
    const btnT   = form.querySelector('.btn-text');
    const btnL   = form.querySelector('.btn-loading');
    const btn    = document.getElementById('btnSubmit');
    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    if (!nombre || !telefono) return;
    if (btnT) btnT.style.display = 'none';
    if (btnL) btnL.style.display = 'inline';
    if (btn)  btn.disabled = true;

    const payload = new URLSearchParams({
      'form-name': 'contacto', nombre, telefono,
      correo:           form.correo?.value.trim() || '',
      tipo:             answers.tipo,
      pago:             answers.pago,
      perfil:           answers.perfil,
      forma_pago:       answers.forma_pago,
      ciudad:           answers.ciudad,
      subsidio_interes: answers.subsidio_interes,
      origen:           answers.origen,
      fecha:            new Date().toISOString(),
    });

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
    } catch (_) {}

    // ── Construir mensaje WA enriquecido ────────────────────────────────────
    const WA = ''; // ← pon tu número aquí: '573XXXXXXXXX'

    const prod    = PRODUCTOS[answers.tipo] || {};
    const emoji   = prod.emoji  || '🏠';
    const label   = prod.label  || answers.tipo;
    const precio  = prod.precio || '—';
    const subText = prod.subsidio ? '✅ Sí aplica' : '❌ No aplica';

    const fecha = new Date().toLocaleString('es-CO', {
      dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Bogota',
    });

    const waMsg = encodeURIComponent(
      `🏗️ *Nuevo participante — Barrio Arjona*\n\n` +
      `👤 Nombre: ${nombre}\n` +
      `📞 WhatsApp: ${telefono}\n\n` +
      `${emoji} *Opción de interés:*\n` +
      `   ${label}\n` +
      `💰 Precio ref: ${precio}\n` +
      `🎁 Subsidio aplica: ${subText}\n\n` +
      `💵 Capacidad de pago: ${PAGO_LABELS[answers.pago] || answers.pago || '—'}\n` +
      `👷 Perfil: ${PERFIL_LABELS[answers.perfil] || answers.perfil || '—'}\n` +
      `💳 Forma de pago: ${FORMA_PAGO_LABELS[answers.forma_pago] || answers.forma_pago || '—'}\n` +
      `📍 Ciudad buscada: ${answers.ciudad || '—'}\n` +
      `🎯 Subsidio interés: ${SUBSIDIO_LABELS[answers.subsidio_interes] || answers.subsidio_interes || '—'}\n` +
      `📣 Cómo llegó: ${ORIGEN_LABELS[answers.origen] || answers.origen || '—'}\n\n` +
      `🕐 ${fecha}`
    );

    // Actualizar botones WA del paso de éxito y FAB
    [document.getElementById('btnWA'), document.getElementById('fabWA')].forEach(el => {
      if (!el) return;
      const base = WA ? `https://wa.me/${WA}` : 'https://wa.me/';
      el.href = `${base}?text=${waMsg}`;
    });

    goStep(7);
  }

  // ── Animaciones de scroll — OJO: excluye opt-card y opt-li ───────────────
  // MOTIVO DEL BUG: IntersectionObserver con threshold:.08 no disparaba para
  // tarjetas de pasos ocultos (display:none), dejándolas en opacity:0.
  // Al mostrar el paso, las tarjetas eran invisibles → sin feedback visual al clic.
  function initScrollAnim() {
    if (!window.IntersectionObserver) return;
    // Solo animamos elementos que siempre están en el DOM visible (no dentro de pasos)
    const targets = document.querySelectorAll('.tip-card, .stage-vd, .calc-card');
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
      const text = '¿Buscas casa o lote en Arjona? Participa gratis en el diseño del nuevo barrio 👇';
      if (navigator.share) {
        navigator.share({ title: 'Barrio Arjona — Co-creación', text, url }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(url)
          .then(() => alert('¡Enlace copiado! Compártelo por WhatsApp o Telegram.'))
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

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    bindCards('step1', 'tipo',       'btn1');
    bindCards('step2', 'pago',       'btn2');
    bindCards('step3', 'perfil',     'btn3');
    bindCards('step4', 'forma_pago', 'btn4');
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
