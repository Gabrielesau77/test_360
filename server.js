// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const questionRoutes = require('./routes/questionRoutes');
const swaggerDocs = require('./swagger');

dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos MongoDB
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/questions', questionRoutes);

// Integrar Swagger
swaggerDocs(app, process.env.PORT || 5000);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
