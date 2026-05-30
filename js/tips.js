// tips.js v3 — Tips rotativos de subsidios y ahorro
const TIPS = [
  { t:'Ahorra con el FNA desde ya', p:'Abre una cuenta en el Fondo Nacional del Ahorro y ahorra lo que puedas cada mes. Con solo 6 meses de ahorro puedes solicitar crédito hipotecario con tasas más bajas que cualquier banco.' },
  { t:'¿Qué es Mi Casa Ya y cómo aplico?', p:'Mi Casa Ya te da hasta $30 millones para la cuota inicial y reduce tu tasa de interés. Aplica si tus ingresos son menores a 8 salarios mínimos. No se devuelve.' },
  { t:'Empleados oficiales tienen ventaja real', p:'Si trabajas en la Alcaldía, Secretaría de Educación o un hospital público, pueden descontarte la cuota mensual directamente del sueldo. Eso te abre las puertas a mejores créditos.' },
  { t:'Los documentos que debes tener listos', p:'Cédula, certificado laboral o declaración de renta (si eres independiente) y extractos bancarios de los últimos 3 meses. Empieza a organizarlos hoy, antes de que el proyecto abra.' },
  { t:'Datacrédito no es un obstáculo', p:'Si tienes deudas pequeñas, el FNA y algunas cooperativas te financian igual. Lo importante es demostrar ingresos estables, no tener un puntaje perfecto. Consúltanos.' },
  { t:'La Vivienda Progresiva aplica para subsidio', p:'Una vivienda de 48m² cuesta menos de 135 salarios mínimos, por eso aplica al subsidio VIS. Eso significa hasta $52 millones del gobierno que NO se devuelven.' },
  { t:'Cuota inicial en cuotas cómodas', p:'En etapa de preventa puedes pagar la cuota inicial en mensualidades pequeñas mientras la casa se construye. No necesitas tener todo el dinero de una sola vez.' },
  { t:'¿Qué es el VIPA?', p:'Para hogares con ingresos hasta 2 salarios mínimos, el programa VIPA puede cubrir casi el valor total de la vivienda. Si eres madre cabeza de hogar o mototaxista, pregúntanos si clasificas.' },
  { t:'Compra en Arjona, no en Cartagena', p:'Por el mismo precio de un apartamento pequeño en Cartagena consigues un lote de 200m² en Arjona, a 15 minutos. Sin cuota de administración. Puedes ampliar y construir como quieras.' },
  { t:'Caja de compensación familiar', p:'Si estás afiliado a Comfamiliar o Cajacopi, revisa sus programas de vivienda. Muchas cajas dan subsidios adicionales que se suman al del gobierno nacional.' },
];
document.addEventListener('DOMContentLoaded', () => {
  const g = document.getElementById('tipsGrid');
  if (!g) return;
  const show = [...TIPS].sort(() => Math.random() - .5).slice(0, 6);
  g.innerHTML = show.map((tip, i) => `
    <div class="tip-card">
      <div class="tip-n">Tip ${String(i+1).padStart(2,'0')}</div>
      <h4>${tip.t}</h4>
      <p>${tip.p}</p>
    </div>`).join('');
});
