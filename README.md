# ArjonaProgresiva — Landing Page

Landing page de captura de leads para proyecto de **Vivienda Progresiva VIS** en Arjona, Turbaco y Cartagena (Bolívar, Colombia).

## 🚀 Despliegue en Netlify

### Opción A — Drag & Drop (más rápido)
1. Ve a [app.netlify.com](https://app.netlify.com)
2. Arrastra la carpeta completa del proyecto al área de deploy
3. En segundos tendrás una URL pública

### Opción B — GitHub + Netlify (recomendado)
1. Sube el proyecto a un repositorio GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/arjona-progresiva.git
   git push -u origin main
   ```
2. En Netlify → "Add new site" → "Import from Git"
3. Selecciona el repositorio → Deploy

## ⚙️ Configuración antes de publicar

### 1. Bot de Telegram
Reemplaza todas las instancias de `TU_BOT_AQUI` y `TU_CANAL_AQUI` con tu usuario real de Telegram:
```
https://t.me/TU_BOT_AQUI → https://t.me/NombreDeTuBot
```

### 2. WhatsApp (opcional)
En `js/main.js`, línea ~38, agrega tu número:
```js
const WA_NUMBER = '573XXXXXXXXX'; // Número colombiano con prefijo 57
```

### 3. Formulario Netlify Forms
El formulario ya está configurado para usar **Netlify Forms** automáticamente al publicar en Netlify. Recibirás los leads por correo.

Para configurar el correo receptor:
- Ve a Netlify → Site settings → Forms → Form notifications
- Agrega tu email

### 4. Dominio personalizado
En Netlify → Domain settings → Add custom domain
Ejemplo: `arjonaprogresiva.com`

## 📁 Estructura del proyecto

```
arjona-vivienda/
├── index.html          ← Página principal
├── netlify.toml        ← Config Netlify (headers, redirects)
├── README.md           ← Este archivo
├── css/
│   └── styles.css      ← Todos los estilos
├── js/
│   ├── main.js         ← Navegación, formulario, animaciones
│   └── tips.js         ← Base de tips rotativos
└── assets/
    ├── img/            ← Imágenes propias del proyecto (agrega aquí)
    └── icons/          ← Íconos y logos
```

## 🎨 Personalización

### Colores (css/styles.css, líneas 1-20)
```css
--c-amber:  #C2610A;  /* Naranja tierra — color principal */
--c-navy:   #1C3557;  /* Azul marino — secundario */
--c-cream:  #FAF6F0;  /* Crema — fondos claros */
```

### Agregar más tips (js/tips.js)
Agrega objetos al array `TIPS`:
```js
{
  titulo: "Título del tip",
  texto: "Descripción del tip...",
}
```

### Cambiar imágenes
Las imágenes actuales vienen de Unsplash. Para usar fotos reales del proyecto:
1. Guárdalas en `assets/img/`
2. Reemplaza las URLs en `index.html`

## 📊 Analytics (opcional)
Para agregar Google Analytics, pega el script en el `<head>` de `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

## 🤖 Bot de Telegram
Para crear el bot:
1. Habla con [@BotFather](https://t.me/BotFather) en Telegram
2. Usa `/newbot` y sigue las instrucciones
3. Copia el token que te da
4. Usa una plataforma como **n8n**, **Make** o **Botpress** para programar las respuestas

## 📱 Responsive
La página está optimizada para:
- 📱 Celulares (360px+)
- 📱 Tablets (768px+)
- 💻 Pantallas (1024px+)
- 🖥 Escritorio (1440px+)

---
Proyecto de vivienda VIS · Arjona, Bolívar · Colombia · 2026
