// tests/authController.test.js
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock de Mongoose y JWT
jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    describe('registerUser', () => {
        it('debería registrar un usuario y devolver un token', async () => {
            const req = {
                body: {
                    username: 'testuser4',
                    email: 'test5@example.com',
                    password: 'password123',
                    role: 'employee'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            User.create.mockResolvedValue({
                _id: 'fakeId',
                username: 'testuser',
                email: 'test@example.com',
                role: 'employee',
                password: 'hashedpassword'
            });

            jwt.sign.mockReturnValue('fakeToken');

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.any(Object)
            }));
        });
    });

    describe('loginUser', () => {
        it('debería permitir a un usuario autenticarse', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            User.findOne.mockResolvedValue({
                _id: 'fakeId',
                username: 'testuser',
                email: 'test@example.com',
                role: 'employee',
                password: 'hashedpassword', // Esto se debe simular como si fuera el password hasheado.
                matchPassword: jest.fn().mockResolvedValue(true)
            });

            jwt.sign.mockReturnValue('fakeToken');

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.any(Object)
            }));
        });
    });
});
