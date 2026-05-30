// calc.js — Calculadora financiera de vivienda
(function () {
  'use strict';

  const SMMLV = 1_750_905;

  // Estado
  let precio = 22_000_000;
  let ahorro  = 300_000;
  let subsidio = 52_527_150;

  function fmt(n) {
    if (n <= 0) return '$0';
    if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(1).replace('.', ',') + 'B';
    if (n >= 1_000_000) return '$' + Math.round(n / 1_000_000).toLocaleString('es-CO') + 'M';
    return '$' + Math.round(n).toLocaleString('es-CO');
  }

  function fmtFull(n) {
    return '$' + Math.round(n).toLocaleString('es-CO');
  }

  // Cuota hipotecaria: PMT a tasa mensual, 240 cuotas
  function pmt(principal, tasaAnual = 0.11, meses = 240) {
    if (principal <= 0) return 0;
    const r = Math.pow(1 + tasaAnual, 1 / 12) - 1;
    return principal * r / (1 - Math.pow(1 + r, -meses));
  }

  function calcular() {
    const subsidioReal = Math.min(subsidio, precio); // subsidio no puede superar precio
    const inicial = precio * 0.10;
    const creditoBruto = precio - subsidioReal - inicial;
    const credito = Math.max(0, creditoBruto);
    const cuota = pmt(credito);
    const tiempoMeses = ahorro > 0 ? Math.ceil(inicial / ahorro) : 999;

    // Update DOM
    setText('r-precio', fmtFull(precio));

    const subEl = document.getElementById('r-subsidio');
    if (subEl) {
      if (subsidioReal > 0 && subsidioReal <= precio) {
        subEl.textContent = '-' + fmtFull(subsidioReal);
        subEl.style.color = 'var(--gr)';
        subEl.parentElement.style.display = 'flex';
      } else {
        subEl.textContent = '$0';
        subEl.parentElement.style.display = 'flex';
      }
    }

    setText('r-inicial', fmtFull(inicial));
    setText('r-credito', credito > 0 ? fmtFull(credito) : '$0');

    const cuotaEl = document.getElementById('r-cuota');
    if (cuotaEl) cuotaEl.textContent = cuota > 0 ? fmtFull(Math.round(cuota)) + ' / mes' : '$0 / mes';

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

    // Actualizar hint en slider
    const sliderHint = document.querySelector('.highlight-row span');
    if (sliderHint) {
      sliderHint.textContent = `⏱ Ahorrando ${fmt(ahorro)}/mes, tienes la cuota inicial en:`;
    }
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  document.addEventListener('DOMContentLoaded', () => {

    // Slider de ahorro
    const slider = document.getElementById('sliderAhorro');
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
        precio = parseInt(btn.dataset.precio, 10);
        calcular();
      });
    });

    // Subsidio
    document.querySelectorAll('.sub-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.sub-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const inp = opt.querySelector('input');
        if (inp) subsidio = parseInt(inp.value, 10);
        calcular();
      });
    });

    // Cálculo inicial
    calcular();
  });

})();
