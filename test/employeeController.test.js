const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../server');
const Employee = require('../models/Employee');
const User = require('../models/User');

jest.mock('../models/Employee');

describe('Employee Controller', () => {
    let token;
    const uniqueSuffix = Date.now();
    beforeAll(async () => {

        const res = await request(server)
            .post('/api/auth/register')
            .send({
                username: `testuser_${uniqueSuffix}`, // Username único
                email: `testuser_${uniqueSuffix}@example.com`, // Email único
                password: 'password123',
                role: 'admin' // o el rol necesario
            });

        token = res.body.data.token;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await mongoose.connection.close(); // Cierra la conexión de Mongoose
        await server.close(); // Cierra el servidor
    });

    it('debería crear un nuevo empleado', async () => {
        const mockEmployee = {
            _id: `64f129b25d3c6f1b2a5e7c9e`,
            firstName: `John_${uniqueSuffix}`,
            lastName: `Doe_${uniqueSuffix}`,
            position: 'Developer',
            department: "IT",
            hireDate: "2020-01-15T00:00:00.000Z",
        };

        Employee.create.mockResolvedValue(mockEmployee);
        const response = await request(server)
            .post('/api/employees')
            .set('Authorization', `Bearer ${token}`) // Autentica la solicitud con el token generado
            .send({
                _id: `64f129b25d3c6f1b2a5e7c9e`,
                firstName: `John_${uniqueSuffix}`,
                lastName: `Doe_${uniqueSuffix}`,
                position: 'Developer',
                department: "IT",
                hireDate: "2020-01-15T00:00:00.000Z",
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(expect.objectContaining({
            firstName: `John_${uniqueSuffix}`,
            lastName: `Doe_${uniqueSuffix}`,
            position: 'Developer',
            department: "IT",
            hireDate: "2020-01-15T00:00:00.000Z",
        }));
    });

    it('debería devolver error al no encontrar un empleado', async () => {
        Employee.findById.mockResolvedValue(null);

        const response = await request(server)
            .get('/api/employees/64f129b25d3c6f1b235e7c9e')
            .set('Authorization', `Bearer ${token}`); // Autentica la solicitud con el token generado

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Error al obtener el empleado');
    });
});
