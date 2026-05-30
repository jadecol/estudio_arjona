# Proyecto Arjona v3 — Validación de Mercado + Calculadora

Landing de **pre-lanzamiento y validación de demanda** para proyecto inmobiliario VIS.  
Arjona · Turbaco · Cartagena, Bolívar, Colombia.

---

## 🚀 Publicar en Netlify (5 minutos)

### Opción rápida — Drag & Drop
1. Ve a [app.netlify.com](https://app.netlify.com)
2. "Add new site" → "Deploy manually"
3. Arrastra esta carpeta → listo en segundos

### Opción recomendada — GitHub
```bash
git init && git add . && git commit -m "v3 launch"
git remote add origin https://github.com/TU_USUARIO/proyecto-arjona.git
git push -u origin main
```
Netlify → Import from Git → Deploy automático en cada push.

---

## ⚙️ Lo que debes personalizar

### 1. Telegram — obligatorio
Reemplaza en `index.html`:
```
TU_BOT_AQUI   →  NombreDeTuBot
TU_CANAL_AQUI →  NombreDeTuCanal
```

### 2. WhatsApp — opcional (recibir leads al instante)
En `js/survey.js` línea ~60:
```js
const WA = '573XXXXXXXXX'; // tu número colombiano
```
Cuando alguien se registre recibirás un WhatsApp con todos sus datos.

### 3. Recibir leads por email — Netlify Forms
Una vez publicado:
- Netlify → tu sitio → **Forms** → "contacto"
- **Form notifications** → agrega tu correo
- Exportar CSV con todos los registros en cualquier momento

---

## 📁 Estructura
```
/
├── index.html        ← Página completa
├── netlify.toml      ← Config headers + URLs de campaña
├── README.md
├── css/
│   └── styles.css    ← Diseño completo
└── js/
    ├── survey.js     ← Lógica encuesta + formulario + animaciones
    ├── tips.js       ← Tips rotativos (subsidios y ahorro)
    └── calc.js       ← Calculadora financiera interactiva
```

---

## 📊 Datos que captura la encuesta
| Campo | Opciones |
|---|---|
| `tipo` | lote_200, lote_800, vivienda_progresiva, casa_terminada |
| `pago` | menos300, 300_600, 600_1000, mas1000 |
| `perfil` | empleado_oficial, empleado_empresa, independiente, mototaxista, madre_cabeza, otro |
| `ciudad` | Arjona, Turbaco, Cartagena, Cualquiera |
| `subsidio_interes` | si, aprender, no |
| `origen` | alcaldia, educacion, redes, amigo, telegram |

---

## 🔗 URLs de campaña por segmento

| Comparte esta URL | Resultado |
|---|---|
| `/progresiva` | Pre-selecciona Vivienda Progresiva |
| `/lote` | Pre-selecciona Lote 200m² |
| `/lote-grande` | Pre-selecciona Lote 800m² |
| `/casa` | Pre-selecciona Casa Terminada |
| `/arjona` | Pre-selecciona ciudad Arjona |
| `/turbaco` | Pre-selecciona ciudad Turbaco |
| `/alcaldia` | Marca origen Alcaldía |
| `/educacion` | Marca origen Secretaría de Educación |

Ejemplo: comparte `tu-sitio.netlify.app/alcaldia` en la Alcaldía de Arjona → sabrás exactamente cuántos vinieron de ahí.

---

## 🧮 Calculadora financiera
La calculadora en `/calcular` hace:
- PMT real a 20 años, tasa 11% E.A.
- Descuenta subsidio según perfil (0, $35M o $52.5M)
- Calcula cuántos meses necesitas para la cuota inicial según tu ahorro
- Actualiza en tiempo real al mover el slider

---

## 🎨 Colores
```css
--a:  #C2610A  /* Naranja tierra — principal */
--n:  #1C3557  /* Azul marino — secundario  */
--cr: #FAF6F0  /* Crema — fondos claros     */
```

---

## 📱 Compatibilidad
✅ Android · iOS · Chrome · Safari · Firefox  
✅ Celulares 360px+ · Tablets · Escritorio

---
© 2026 · Proyecto Arjona · Arjona, Bolívar · Colombia
