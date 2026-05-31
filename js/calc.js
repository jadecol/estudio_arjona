// calc.js v4 — Calculadora financiera de vivienda (5 productos)
(function () {
  'use strict';

  // ── Catálogo de productos ─────────────────────────────────────────────────
  const CATALOG = {
    lote_200: { nombre: 'Lote 200m²',              precio: 22_000_000,  esLote: true,  subsidioMax: 0           },
    lote_800: { nombre: 'Lote 800m²',              precio: 80_000_000,  esLote: true,  subsidioMax: 0           },
    prog_200: { nombre: 'Casa 48m² / Lote 200m²',  precio: 143_574_210, esLote: false, subsidioMax: 52_527_150  },
    prog_800: { nombre: 'Casa 56m² / Lote 800m²',  precio: 185_000_000, esLote: false, subsidioMax: 52_527_150  },
    terminada:{ nombre: 'Vivienda terminada',       precio: 220_000_000, esLote: false, subsidioMax: 35_018_100  },
  };

  // ── Estado ────────────────────────────────────────────────────────────────
  let tipoId   = 'lote_200';
  let ahorro   = 300_000;
  let subsidio = 0; // para lotes siempre es 0

  // ── Helpers ───────────────────────────────────────────────────────────────
  function fmt(n) {
    if (n <= 0) return '$0';
    if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(1).replace('.', ',') + 'B';
    if (n >= 1_000_000)     return '$' + Math.round(n / 1_000_000).toLocaleString('es-CO') + 'M';
    return '$' + Math.round(n).toLocaleString('es-CO');
  }

  function fmtFull(n) {
    return '$' + Math.round(n).toLocaleString('es-CO');
  }

  // PMT a tasa mensual equivalente, 240 cuotas (20 años), tasa 11% E.A.
  function pmt(principal, tasaAnual = 0.11, meses = 240) {
    if (principal <= 0) return 0;
    const r = Math.pow(1 + tasaAnual, 1 / 12) - 1;
    return principal * r / (1 - Math.pow(1 + r, -meses));
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setVisible(id, visible) {
    const el = document.getElementById(id);
    if (el) el.style.display = visible ? '' : 'none';
  }

  // ── Cálculo principal ─────────────────────────────────────────────────────
  function calcular() {
    const prod       = CATALOG[tipoId] || CATALOG.lote_200;
    const precio     = prod.precio;
    const esLote     = prod.esLote;

    // Para lotes: el "precio total" es lo que hay que ahorrar (sin hipoteca).
    // Para vivienda: cuota inicial = 10%, el resto es crédito.
    const cuotaInicialPct = esLote ? 1.0 : 0.10; // lotes: precio total; vivienda: 10%
    const subsidioReal    = esLote ? 0 : Math.min(subsidio, precio);
    const inicial         = precio * cuotaInicialPct;
    const creditoBruto    = esLote ? 0 : Math.max(0, precio - subsidioReal - inicial);
    const cuota           = esLote ? 0 : pmt(creditoBruto);

    // Tiempo para reunir la cuota inicial (o el precio total si es lote)
    const metaAhorro  = esLote ? precio : inicial;
    const tiempoMeses = ahorro > 0 ? Math.ceil(metaAhorro / ahorro) : 999;

    // ── Actualizar DOM ───────────────────────────────────────────────────────
    setText('r-precio', fmtFull(precio));

    // Fila subsidio: solo para viviendas
    const subRow = document.getElementById('r-subsidio')?.closest('.result-row, .green-row');
    if (subRow) subRow.style.display = esLote ? 'none' : 'flex';
    const subEl = document.getElementById('r-subsidio');
    if (subEl) {
      if (!esLote && subsidioReal > 0) {
        subEl.textContent = '-' + fmtFull(subsidioReal);
        subEl.style.color = 'var(--gr)';
      } else {
        subEl.textContent = '$0';
      }
    }

    // Fila cuota inicial
    const inicialRow = document.getElementById('r-inicial')?.closest('.result-row');
    if (inicialRow) {
      const lbl = inicialRow.querySelector('span');
      if (lbl) lbl.textContent = esLote ? 'Precio total' : 'Cuota inicial (10%)';
    }
    setText('r-inicial', fmtFull(inicial));

    // Fila crédito: solo para viviendas
    const creditoRow = document.getElementById('r-credito')?.closest('.result-row');
    if (creditoRow) creditoRow.style.display = esLote ? 'none' : 'flex';
    setText('r-credito', creditoBruto > 0 ? fmtFull(creditoBruto) : '$0');

    // Fila cuota mensual: solo para viviendas
    const cuotaRow = document.getElementById('r-cuota')?.closest('.result-row, .big-row');
    if (cuotaRow) cuotaRow.style.display = esLote ? 'none' : 'flex';
    const cuotaEl = document.getElementById('r-cuota');
    if (cuotaEl) cuotaEl.textContent = cuota > 0 ? fmtFull(Math.round(cuota)) + ' / mes' : '$0 / mes';

    // Divisor: ocultar si es lote
    const divider = document.querySelector('.result-divider');
    if (divider) divider.style.display = esLote ? 'none' : '';

    // Fila tiempo de ahorro — siempre visible, texto adaptado
    const tiempoEl = document.getElementById('r-tiempo');
    if (tiempoEl) {
      if (tiempoMeses === 999) {
        tiempoEl.textContent = '—';
      } else if (tiempoMeses === 1) {
        tiempoEl.textContent = '1 mes';
      } else if (tiempoMeses <= 12) {
        tiempoEl.textContent = tiempoMeses + ' meses';
      } else {
        const a = Math.floor(tiempoMeses / 12);
        const m = tiempoMeses % 12;
        tiempoEl.textContent = a + ' año' + (a > 1 ? 's' : '') + (m > 0 ? ' ' + m + ' mes' + (m > 1 ? 'es' : '') : '');
      }
    }

    // Hint del slider — texto adaptado para lote vs vivienda
    const sliderHint = document.querySelector('.highlight-row span');
    if (sliderHint) {
      const meta = esLote ? `para el ${prod.nombre}` : 'para la cuota inicial';
      sliderHint.textContent = `⏱ Ahorrando ${fmt(ahorro)}/mes, tienes ${meta} en:`;
    }

    // Sección de subsidio: ocultar selector si es lote
    const subsidioSection = document.getElementById('calcSubsidioSection');
    if (subsidioSection) subsidioSection.style.display = esLote ? 'none' : '';
  }

  // ── Inicialización DOM ────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {

    // Slider de ahorro
    const slider    = document.getElementById('sliderAhorro');
    const sliderVal = document.getElementById('sliderVal');
    slider?.addEventListener('input', () => {
      ahorro = parseInt(slider.value, 10);
      sliderVal.textContent = fmtFull(ahorro) + ' / mes';
      calcular();
    });

    // Tipo de propiedad
    document.querySelectorAll('.calc-tipo-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.calc-tipo-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tipoId = btn.dataset.id;

        // Resetear subsidio al máximo disponible para este producto
        const prod = CATALOG[tipoId] || {};
        subsidio   = prod.subsidioMax || 0;

        // Sincronizar selector de subsidio visualmente
        document.querySelectorAll('.sub-opt').forEach(o => {
          o.classList.remove('selected');
          const inp = o.querySelector('input');
          if (inp && parseInt(inp.value, 10) === subsidio) {
            o.classList.add('selected');
            inp.checked = true;
          }
        });

        calcular();
      });
    });

    // Selector de subsidio
    document.querySelectorAll('.sub-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.sub-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const inp = opt.querySelector('input');
        if (inp) subsidio = parseInt(inp.value, 10);
        calcular();
      });
    });

    // Estado inicial: primer botón activo es lote_200
    tipoId   = 'lote_200';
    subsidio = 0;
    calcular();
  });

})();
