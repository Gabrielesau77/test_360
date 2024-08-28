const request = require('supertest');
const mongoose = require('mongoose'); // Importa Mongoose
const server = require('../server'); // Importa el servidor

describe('Auth API', () => {
    afterAll(async () => {
        await mongoose.connection.close(); // Cierra la conexión de Mongoose
        await server.close(); // Cierra el servidor
    });

    // Función para generar un username único
    const generateUniqueUsername = () => `user_${Date.now()}`;

    // Función para generar un email único
    const generateUniqueEmail = () => `user_${Date.now()}@example.com`;

    describe('POST /api/auth/register', () => {
        it('debería registrar un nuevo usuario', async () => {
            const uniqueUsername = generateUniqueUsername();
            const uniqueEmail = generateUniqueEmail();

            const response = await request(server)
                .post('/api/auth/register')
                .send({
                    username: uniqueUsername,  // Username único
                    email: uniqueEmail,        // Email único
                    password: 'password123',
                    role: 'employee'           // Asegúrate de que este campo sea válido y requerido
                });

            console.log('Response:', response.body); // Log para ver la respuesta

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
        });
    });
});
