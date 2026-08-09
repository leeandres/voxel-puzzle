# 🚀 Guía de Despliegue - The Forgotten Depths

## Opciones de Hosting Gratuito

### Comparativa Rápida

| Plataforma | Ancho de banda | Facilidad | Personalización | Recomendado para |
|------------|---------------|-----------|-----------------|------------------|
| **GitHub Pages** | 100 GB/mes | ⭐⭐⭐ | `username.github.io` | Principiantes |
| **Netlify** | 100 GB/mes | ⭐⭐⭐⭐ | `*.netlify.app` | Proyectos medianos |
| **Cloudflare Pages** | **Ilimitado** | ⭐⭐⭐ | `*.pages.dev` | Juegos pesados |
| **Surge.sh** | Ilimitado | ⭐⭐⭐⭐⭐ | `*.surge.sh` | Prototipos rápidos |

---

## 🎯 Opción 1: GitHub Pages (Recomendada)

### Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Haz clic en **"+"** → **"New repository"**
3. Nombre: `the-forgotten-depths`
4. Selecciona **"Public"**
5. Haz clic en **"Create repository"**

### Paso 2: Subir Archivos

```bash
# En tu carpeta del proyecto
cd C:\app\mine

# Inicializar git
git init
git add .

# Primer commit
git commit -m "Initial commit: The Forgotten Depths game"

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/the-forgotten-depths.git

# Subir código
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **"Source"** selecciona **"Deploy from a branch"**
4. Selecciona **"main"** y carpeta **"/ (root)"**
5. Haz clic en **"Save"**

### Paso 4: Acceder a tu Juego

Tu juego estará disponible en:
```
https://TU_USUARIO.github.io/the-forgotten-depths/
```

---

## 🎯 Opción 2: Netlify (Más Fácil con GUI)

### Paso 1: Crear Cuenta

1. Ve a [netlify.com](https://netlify.com)
2. Regístrate con GitHub/Google

### Paso 2: Desplegar

**Opción A - Drag & Drop:**
1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastra tu carpeta `C:\app\mine` al área de carga
3. ¡Listo! Tu juego está en línea

**Opción B - Desde GitHub:**
1. Conecta tu repositorio de GitHub
2. Selecciona el repositorio
3. Build command: vacío
4. Publish directory: `/` o `.`
5. Haz clic en **"Deploy"**

### Paso 3: Acceder

Tu juego estará en:
```
https://nombre-aleatorio.netlify.app/
```

---

## 🎯 Opción 3: Surge.sh (Más Rápido)

### Paso 1: Instalar Surge

```bash
npm install --global surge
```

### Paso 2: Desplegar

```bash
# Navega a tu carpeta del juego
cd C:\app\mine

# Ejecutar surge
surge
```

### Paso 3: Seguir Instrucciones

1. Ingresa tu email (o crea cuenta nueva)
2. Confirma el dominio (ej: `the-forgotten-depths.surge.sh`)
3. ¡Listo!

Tu juego estará en:
```
https://the-forgotten-depths.surge.sh/
```

---

## 🎯 Opción 4: Cloudflare Pages (Mejor Rendimiento)

### Paso 1: Crear Cuenta Cloudflare

1. Ve a [cloudflare.com](https://cloudflare.com)
2. Regístrate gratis

### Paso 2: Crear Repositorio en GitHub

(Sigue los pasos de GitHub Pages)

### Paso 3: Conectar con Cloudflare

1. En el Dashboard de Cloudflare: **Workers & Pages**
2. **Create application** → **Pages** → **Connect to Git**
3. Selecciona tu repositorio
4. Build settings: vacío (para HTML estático)
5. Output directory: `/`
6. **Save and Deploy**

### Paso 4: Acceder

Tu juego estará en:
```
https://tu-proyecto.pages.dev/
```

---

## 📁 Estructura de Archivos para Despliegue

Asegúrate de que tu carpeta tenga esta estructura:

```
the-forgotten-depths/
├── index.html          # ✅ Archivo principal
├── tutorial.html       # ✅ Tutorial
├── dashboard.html      # ✅ Dashboard
├── login.html          # ✅ Login
├── audio-system.js     # ✅ Sistema de audio
├── audio-controls.html # ✅ Controles de audio
├── NEW_PUZZLES_AND_SECRETS.js  # ✅ Puzzles extra
└── DEPLOYMENT_GUIDE.md # ❌ No necesario (puedes eliminar)
```

---

## ⚠️ Antes de Desplegar

### Elimina archivos innecesarios

```bash
# Elimina archivos de documentación (opcional)
rm GDD_The_Forgotten_Depths.md
rm COOPERATIVE_SYSTEM_DESIGN.md
rm PERFORMANCE_FIXES.md
rm DEPLOYMENT_GUIDE.md
rm firebase-config.js
rm auth-context.js
rm firestore-service.js
```

### Verifica que index.html funcione solo

Abre `index.html` directamente en tu navegador para asegurar que todo funcione.

---

## 🔧 Configuración Adicional

### Personalizar Dominio (Opcional)

Si compras un dominio (ej: `theforgottendepths.com`):

1. **GitHub Pages:** Settings → Pages → Custom domain
2. **Netlify:** Domain settings → Add custom domain
3. **Cloudflare:** Custom domains → Add domain

### HTTPS automático

Todas las plataformas anteriores proveen HTTPS automáticamente.

---

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| Juego no carga | Verifica que `index.html` esté en la raíz |
| Errores de CORS | Asegúrate de que todos los archivos estén en la misma carpeta |
| No se escucha audio | Los navegadores requieren interacción del usuario primero |
| Lentitud | Reduce el tamaño del mundo o desactiva sombras |

---

## 📊 Métricas de Despliegue

Una vez desplegado, verifica:

1. ✅ El juego carga en menos de 3 segundos
2. ✅ Funciona en Chrome, Firefox, Safari
3. ✅ El audio funciona después de hacer clic
4. ✅ Los controles responden correctamente
5. ✅ No hay errores en la consola

---

## 🎉 ¡Listo!

Una vez desplegado, comparte tu juego:

```
¡Juega The Forgotten Depths! 🎮
🔗 https://TU_USUARIO.github.io/the-forgotten-depths/
```

---

## 📱 Nota para Móvil

El juego es jugable en móvil pero los controles táctiles no están implementados aún. Para una mejor experiencia, úsalo en PC.
