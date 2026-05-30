# Proyecto Arjona — Landing de Validación de Mercado

Landing page de **pre-lanzamiento y validación de demanda** para proyecto inmobiliario VIS en Arjona, Turbaco y Cartagena, Bolívar.

## 🎯 Objetivo de la página
Identificar qué quiere el mercado **antes** de lanzar:
- ¿Prefieren lote 200m², lote 800m², vivienda progresiva o casa terminada?
- ¿Cuánto pueden pagar mensualmente?
- ¿Qué perfil de comprador se interesa?
- Capturar datos para llamarles cuando el proyecto abra.
- Generar lista de **fundadores** con bono de $500.000.

---

## 🚀 Publicar en Netlify (5 minutos)

### Opción A — Drag & Drop
1. Ve a [app.netlify.com](https://app.netlify.com) → "Add new site" → "Deploy manually"
2. Arrastra la carpeta completa del proyecto
3. ¡Listo! Tendrás una URL tipo `amazing-project-123.netlify.app`

### Opción B — GitHub (recomendado para actualizaciones)
```bash
git init
git add .
git commit -m "lanzamiento inicial"
git remote add origin https://github.com/tu-usuario/proyecto-arjona.git
git push -u origin main
```
Luego en Netlify → "Import from Git" → selecciona el repo → Deploy.

---

## ⚙️ Configuración obligatoria

### 1. Bot / Canal de Telegram
Reemplaza en `index.html` todas las instancias de:
```
TU_BOT_AQUI   → nombre de tu bot (ej: ProyectoArjonaBot)
TU_CANAL_AQUI → nombre de tu canal (ej: ArjonaVivienda)
```

### 2. WhatsApp para notificaciones (opcional)
En `js/survey.js` línea ~71:
```js
const WA = '573XXXXXXXXX'; // Tu número con prefijo 57
```
Cuando alguien se registre recibirás un mensaje automático en WhatsApp.

### 3. Recibir leads por correo (Netlify Forms)
Una vez publicado en Netlify:
1. Ve a tu site → **Forms** → verás el formulario "contacto"
2. Click en **"Form notifications"** → agrega tu correo
3. Cada lead llegará a tu bandeja de entrada

### 4. Exportar leads
En Netlify → Forms → Descargar CSV con todos los registros.

---

## 📁 Estructura
```
/
├── index.html          ← Página completa
├── netlify.toml        ← Config headers + redirects
├── README.md
├── css/
│   └── styles.css      ← Todo el diseño
└── js/
    ├── survey.js       ← Lógica encuesta + formulario
    └── tips.js         ← Tips rotativos (subsidios y ahorro)
```

---

## 📊 Datos que captura la encuesta

| Campo      | Opciones                                                     |
|------------|--------------------------------------------------------------|
| `tipo`     | lote_200, lote_800, vivienda_progresiva, casa_terminada       |
| `pago`     | menos300, 300_600, 600_1000, mas1000                         |
| `perfil`   | empleado_oficial, empleado_empresa, independiente, mototaxista, madre_cabeza, otro |
| `ciudad`   | Arjona, Turbaco, Cartagena, Cualquiera                       |
| `subsidio` | si_subsidio, quiero_saber, no_subsidio                       |
| `origen`   | alcaldia, educacion, redes, amigo, telegram                  |

Todos los campos llegan en el CSV de Netlify Forms junto al nombre y teléfono.

---

## 🔗 URLs de campaña

Usa estas URLs para segmentar tus campañas por ciudad o tipo:

| URL                        | Destino                          |
|----------------------------|----------------------------------|
| `/progresiva`              | Pre-selecciona Vivienda Progresiva |
| `/lote`                    | Pre-selecciona Lote 200m²         |
| `/arjona`                  | Pre-selecciona ciudad Arjona      |
| `/turbaco`                 | Pre-selecciona ciudad Turbaco     |

Ejemplo: comparte `tu-sitio.netlify.app/progresiva` en el grupo de Telegram y sabrás cuántos vinieron por ese link.

---

## 🎨 Colores y personalización

```css
/* css/styles.css — variables al inicio */
--amber:  #C2610A;  /* Naranja tierra — principal */
--navy:   #1C3557;  /* Azul marino — secundario  */
--cream:  #FAF6F0;  /* Crema — fondos claros     */
```

---

## 📱 Compatibilidad
✅ Celulares Android e iOS  ✅ Tablets  ✅ Escritorio  
✅ Chrome · Safari · Firefox · Edge

---
© 2026 · Proyecto Arjona · Arjona, Bolívar · Colombia
