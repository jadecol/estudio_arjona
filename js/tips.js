// tips.js — Base de tips rotativos para subsidios y ahorro
const TIPS = [
  {
    titulo: "Abre una Cuenta de Ahorro Programado en el FNA",
    texto: "Ahorra lo que puedas cada mes durante 6 meses y ya puedes solicitar crédito hipotecario con tasas preferenciales. Aplica para empleados, independientes y mototaxistas.",
  },
  {
    titulo: "Solicita el subsidio Mi Casa Ya antes de firmar",
    texto: "El subsidio Mi Casa Ya se debe tramitar antes de que el proyecto tenga escrituración. Habla con nosotros y te acompañamos con toda la documentación sin costo.",
  },
  {
    titulo: "¿Qué documentos necesitas para el crédito?",
    texto: "Cédula, certificado laboral o declaración de renta (si eres independiente), extractos bancarios de 3 meses y carta de aprobación del subsidio. Empieza a organizarlos hoy.",
  },
  {
    titulo: "El historial en Datacrédito no es un obstáculo",
    texto: "Hay entidades como el FNA y algunas cooperativas que financian aunque no tengas historial perfecto. La clave es demostrar ingresos estables, no tener un puntaje alto.",
  },
  {
    titulo: "Empleados oficiales tienen ventaja real",
    texto: "Si trabajas en la Alcaldía, la Gobernación, una IPS o colegio público, puedes pedir que te descuenten la cuota por nómina. Esto te da acceso a mejores tasas y menos trámites.",
  },
  {
    titulo: "¿Por qué comprar en Arjona y no en Cartagena?",
    texto: "En Arjona consigues lotes de 200m² o más por el mismo precio que un apartamento pequeño en Cartagena. Además puedes ampliar la casa a tu ritmo sin pagar administración.",
  },
  {
    titulo: "Vivienda Progresiva: primero vivir, luego crecer",
    texto: "El primer piso listo para habitar te permite salir de arrendamiento ya. El segundo piso lo construyes cuando tengas más recursos. La estructura ya está preparada.",
  },
  {
    titulo: "¿Cómo ahorrar la cuota inicial en 12 meses?",
    texto: "Si necesitas $14M de cuota inicial, ahorrando $1.2M/mes lo consigues en 12 meses. Una cuenta de ahorros digital (Nequi, Daviplata) con meta programada te ayuda a no gastarlo.",
  },
  {
    titulo: "El subsidio VIPA puede cubrir el 100%",
    texto: "Para hogares con ingresos hasta 2 SMMLV, el programa VIPA puede cubrir hasta el valor total de la vivienda. Si no tienes ingresos formales, el bot te explica cómo postularte.",
  },
];

// Muestra 6 tips al azar (o los que hay si son menos)
function renderTips() {
  const container = document.getElementById('tipsGrid');
  if (!container) return;

  // Mezclar y tomar los primeros 6
  const shuffled = [...TIPS].sort(() => Math.random() - 0.5).slice(0, 6);

  container.innerHTML = shuffled.map((t, i) => `
    <div class="tip-card">
      <div class="tip-num">Tip ${String(i + 1).padStart(2, '0')}</div>
      <h4>${t.titulo}</h4>
      <p>${t.texto}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderTips);
