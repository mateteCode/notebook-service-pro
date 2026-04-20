# Notebook Service Pro 💻🔧

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Un sistema integral **Full-Stack** diseñado para la gestión profesional de talleres de reparación de equipos informáticos. Permite controlar el ciclo de vida completo de una reparación: desde el ingreso del equipo y la asignación de repuestos en tiempo real, hasta la generación de tickets en PDF y un portal de seguimiento exclusivo para clientes.

🔗 **[Ver Demo en Vivo (Vercel)](#)** _(Reemplazar con tu link de Vercel)_

---

## ✨ Características Principales (Features)

- 🔐 **Autenticación y Autorización (RBAC):** Sistema basado en JWT con protección estricta de rutas. Perfiles configurados: `ADMIN`, `TECHNICIAN`, `STOCK_MANAGER` y `CUSTOMER`.
- 📦 **Gestión de Inventario Dinámica:** Control de stock, alertas de mínimo y asignación de piezas a reparaciones con deducción automática y cálculo de presupuestos en vivo.
- 🛠️ **Trazabilidad de Reparaciones:** Línea de tiempo (Timeline) con estados actualizables e historial de modificaciones.
- 🖨️ **Generación de Comprobantes:** Creación automática de tickets de ingreso/presupuesto optimizados para impresión térmica y guardado como PDF.
- 👤 **Portal del Cliente:** Vista segura de solo lectura donde el cliente puede hacer seguimiento en tiempo real del estado de sus equipos.
- 📊 **Panel de Estadísticas:** Visualización gráfica de fallas comunes y equipos conflictivos usando `Recharts`.

---

## 🏗️ Arquitectura y Tecnologías

El proyecto está dividido en dos aplicaciones principales (Monorepo/Estructura modular):

### Frontend (`/apps/web`)

- **Core:** React 18 + Vite + TypeScript
- **Estilos:** Tailwind CSS
- **Iconografía:** Lucide React
- **Peticiones:** Axios (con interceptores para JWT)
- **Gráficos:** Recharts
- **Despliegue:** Vercel

### Backend (`/apps/api`)

- **Core:** Node.js + Express + TypeScript
- **Base de Datos:** MongoDB (MongoDB Atlas)
- **ODM:** Mongoose (con manejo de relaciones `populate`)
- **Seguridad:** Bcrypt (Hasheo), JSON Web Tokens (JWT), CORS estricto.
- **Arquitectura:** SOLID Principles, Separación por Capas (Controllers, Models, Routes, Services).
- **Despliegue:** Render

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para correr el proyecto en tu entorno de desarrollo.

### 1. Clonar el repositorio

```bash
git clone [https://github.com/tu-usuario/notebook-service-pro.git](https://github.com/tu-usuario/notebook-service-pro.git)
cd notebook-service-pro
```

2. Configurar el Backend
   Bash
   cd apps/api
   npm install
   Crea un archivo .env en apps/api con las siguientes variables:

Fragmento de código
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/service-pro?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_super_segura
Inicia el servidor de desarrollo:

Bash
npm run dev 3. Configurar el Frontend
En una nueva terminal:

Bash
cd apps/web
npm install
Crea un archivo .env en apps/web:

Fragmento de código
VITE_API_URL=http://localhost:3000/api
Inicia el cliente:

Bash
npm run dev
