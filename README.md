# Employee 360 Evaluation API

¡Bienvenido a la API RESTful de Evaluación 360 Grados para Empleados Remotos! Este proyecto está diseñado para gestionar evaluaciones de desempeño de empleados en una empresa de desarrollo de aplicaciones. Aquí encontrarás instrucciones sencillas para desplegar y usar esta API.

## Características

- **Autenticación**: Manejo de usuarios con roles `admin`, `manager` y `employee` usando JWT.
- **Gestión de Empleados**: CRUD de empleados.
- **Evaluaciones**: Crear y gestionar evaluaciones de desempeño.
- **Preguntas y Respuestas**: Crear y gestionar preguntas para las evaluaciones y registrar respuestas.
- **Notificaciones**: Enviar notificaciones sobre evaluaciones pendientes.

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1. **Clona el repositorio**:

    ```bash
    git clone https://github.com/tu-usuario/employee-360-evaluation.git
    cd employee-360-evaluation
    ```

2. **Instala las dependencias**:

    ```bash
    npm install
    ```

3. **Configura las variables de entorno**:

    Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/employee360db
    JWT_SECRET=tu-secreto-super-seguro
    ```

    - `PORT`: El puerto en el que correrá la API (opcional, por defecto 5000).
    - `MONGO_URI`: La URI de conexión a tu base de datos MongoDB.
    - `JWT_SECRET`: El secreto utilizado para firmar los tokens JWT.

4. **Inicia MongoDB**:

    Si estás utilizando MongoDB en un contenedor Docker, puedes iniciarlo con:

    ```bash
    docker run --name my-mongo-container -d -p 27017:27017 mongo
    ```

    Asegúrate de que MongoDB esté corriendo y accesible en la URI configurada en el archivo `.env`.

5. **Inicia la aplicación**:

    ```bash
    npm run dev
    ```

    La API estará disponible en `http://localhost:5000/api`.

## Documentación de la API

La API está documentada usando Swagger. Puedes acceder a la documentación interactiva en:
http://localhost:5000/api-docs

## Endpoints Principales

- **/api/auth/register**: Registro de usuarios.
- **/api/auth/login**: Inicio de sesión.
- **/api/employees**: CRUD de empleados.
- **/api/evaluations**: Gestión de evaluaciones.
- **/api/questions**: Gestión de preguntas.
- **/api/notifications/notify**: Envío de notificaciones para evaluaciones pendientes.


Creado con ❤️ por Gabriel  Toro