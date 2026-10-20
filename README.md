# 🧠 Backend Inteligente Multi-Alumno (Listo para desplegar en Render)

Este proyecto es un backend **100% independiente** diseñado como respaldo en la nube para el curso **MERN + Git**.
Si en la universidad están bloqueados los puertos de MongoDB (`27017`), los alumnos no necesitan levantar `server/` ni conectarse a MongoDB localmente: solo conectan su Frontend (`client/`) a este backend desplegado.

---

## ✨ ¿Cómo funciona?

1. **No tienes que cambiar ni una sola línea del Frontend (`inventario-app/client`) ni de `codigo-paso-a-paso`:**
   * En `inventario-app/client/src/services/api.ts` (y en todos los pasos de `codigo-paso-a-paso`), el código **ya viene escrito de fábrica así**:
     ```ts
     const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
     ```
2. **Lo único que hace el alumno en su Frontend (`client/.env`):**
   * Crea un archivo `.env` dentro de la carpeta **`client/`** con su nombre al final de la URL:
     ```env
     VITE_API_URL=https://inventario-app-backend-intelligent.onrender.com/api/inventario-db-liam/
     ```
   * *(Funciona igual si le ponen `/` al final o si no se la ponen, porque el servidor limpia barras dobles `//` automáticamente).*
3. **Auto-Seed Automático (No necesitan correr `npm run seed`):**
   * La primera vez que `liam` abre su React (`GET /api/inventario-db-liam/products`), el servidor detecta que la colección `inventario_db_liam` es nueva y **le inserta automáticamente los 5 productos de prueba** antes de responder.
   * Si en cualquier momento un alumno borra todos sus productos y quiere restaurar los 5 originales, solo abre en su navegador:
     `https://inventario-app-backend-intelligent.onrender.com/api/inventario-db-liam/seed`

---

## 🚀 Cómo desplegar este Backend Inteligente en Render.com (con tu cuenta secundaria)

1. Sube esta carpeta `backend-inteligente-render` a un repositorio nuevo en GitHub o GitLab.
2. En [Render.com](https://render.com), crea un nuevo **Web Service** conectado a ese repositorio:
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`
3. En la sección **Environment Variables** de Render, agrega únicamente:
   * `MONGO_URI` = `mongodb+srv://usuario:password@cluster0.xxxxxx.mongodb.net/inventario_curso` *(usando una de las cuentas secundarias que creaste para no exponer tu cuenta personal)*.
4. ¡Listo! Copia la URL que te dé Render (ej. `https://inventario-app-backend-intelligent.onrender.com`) y compártela con tus alumnos si la red de la universidad bloquea MongoDB.
