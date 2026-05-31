// tips.js v5 — Tips personalizados para Arjona: mototaxistas, madres cabeza, independientes, empleados oficiales
const TIPS = [
  {
    t: 'Mototaxista: sí puedes tener casa propia',
    p: 'Aunque trabajas de forma informal, puedes acceder a crédito si demuestras ingresos constantes con extractos de Nequi, Bancolombia o un ahorro en el FNA de mínimo 6 meses. Consúltanos cómo organizarlo paso a paso.',
  },
  {
    t: 'Madre cabeza de familia: tienes prioridad en los subsidios',
    p: 'Si eres cabeza de hogar, tienes acceso preferencial al subsidio Mi Casa Ya (hasta $52.5M que no se devuelven) y en algunos casos al programa VIPA, donde el gobierno puede cubrir casi toda la vivienda.',
  },
  {
    t: 'Empleado oficial: la cuota sale directa del sueldo',
    p: 'Si trabajas en la Alcaldía, Gobernación, hospital o colegio público, puedes autorizar descuento en nómina. Eso te abre puertas a mejores tasas de interés y sin trámites complicados de crédito.',
  },
  {
    t: 'Vendedor independiente: así demuestras tus ingresos',
    p: 'No necesitas contrato ni nómina. Con 3 meses de extractos bancarios o carta de contador, el FNA y cooperativas te pueden financiar igual. Lo importante es mostrar movimiento de dinero constante.',
  },
  {
    t: 'Ahorra con el FNA desde hoy, aunque sea poco',
    p: 'Con solo $100.000 al mes en el Fondo Nacional del Ahorro ya estás construyendo historial. En 6 meses tienes acceso a crédito hipotecario con tasas más bajas que cualquier banco comercial.',
  },
  {
    t: 'Cuota inicial en pagos chiquitos durante la obra',
    p: 'En etapa de preventa puedes ir pagando la cuota inicial mensualmente mientras construimos. No necesitas tener todo el dinero de un solo golpe. Entrar desde el inicio es tu mejor ventaja.',
  },
  {
    t: '¿Qué es el subsidio Mi Casa Ya y quién aplica?',
    p: 'Es plata del gobierno (hasta $52.5M) que no se devuelve. Aplica si tus ingresos son menores a 8 salarios mínimos, no tienes vivienda propia y pagas arriendo. Registro gratis en vivienda.gov.co.',
  },
  {
    t: 'Lote 200m²: la entrada más accesible al barrio',
    p: 'Con $22M ya tienes tu lote escriturado. Construyes cuando puedas, como quieras, sin cuota de administración. Es la opción ideal para quien quiere empezar sin una deuda bancaria grande.',
  },
  {
    t: 'Cajacopi o Comfamiliar: subsidio extra que pocos usan',
    p: 'Si estás afiliado a Comfamiliar o Cajacopi, tienen programas de vivienda propios que se suman al subsidio nacional. Muy poca gente los solicita. Podrías llevarte doble beneficio sin saberlo.',
  },
  {
    t: 'Datacrédito no es un obstáculo definitivo',
    p: 'Si tienes deudas pequeñas, el FNA y algunas cooperativas te financian de todas formas. Lo más importante es demostrar ingresos estables, no tener un puntaje perfecto. Consúltanos tu caso.',
  },
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
