# Sistema de Gestión - Producciones Santa Cruz

Este es un sistema web para la gestión de órdenes de producción y generación automática de activos de inventario. Está construido utilizando una arquitectura en capas con un backend transaccional y un frontend moderno.

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Node.js, Express, TypeScript, TypeORM.
*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Axios.
*   **Base de Datos:** MySQL (XAMPP).

---

## 📋 Requisitos Previos

Antes de clonar el proyecto, asegúrate de tener instalado en tu computadora:
1.  [Node.js](https://nodejs.org/) (v18 o superior).
2.  [XAMPP](https://www.apachefriends.org/es/index.html) (para el servidor MySQL).
3.  [Git](https://git-scm.com/).

---

## Guía de Instalación y Configuración

### 1. Configurar la Base de Datos
1. Abre XAMPP e inicia los módulos **Apache** y **MySQL**.
2. Ve a [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Crea una nueva base de datos vacía llamada exactamente: `producciones_scz`.
*Nota: No es necesario crear las tablas manualmente. El ORM (TypeORM) las generará automáticamente al iniciar el backend.*

### 2. Levantar el Backend (Motor API)
Abre una terminal en la carpeta raíz del proyecto y ejecuta:
Bash
npm install
npm run dev
El servidor se iniciará en http://localhost:3001. En la consola verás los queries de TypeORM creando las tablas produccion y activo_inventario.

3. Levantar el Frontend (Interfaz Visual)
Abre una nueva terminal, navega a la carpeta del frontend y ejecuta:

Bash
cd producciones-scz-frontend
npm install
npm run dev
La aplicación web se abrirá en http://localhost:5173.

Cómo probar la Historia de Usuario 4 (Finalizar Producción)
Como la base de datos está recién creada y vacía, necesitas datos de prueba para ver el sistema en acción:

Ve a phpMyAdmin > base de datos producciones_scz > tabla produccion.

Inserta manualmente un registro con los siguientes datos:

PlanoID: 1

SupervisorID: 1

CantidadProducir: 5

Estado: En Proceso

Ve a la aplicación en React (http://localhost:5173). Verás la orden pendiente en la tabla.

Haz clic en "Finalizar". El sistema ejecutará la transacción, generará los 5 códigos de serie únicos y te mostrará el comprobante de éxito.
