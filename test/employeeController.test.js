const { getEmployees, getEmployeeById, createEmployee, updateEmployee } = require('../controllers/employeeController');
const Employee = require('../models/Employee');

// Mock de Mongoose
jest.mock('../models/Employee');

describe('Employee Controller', () => {
    describe('getEmployees', () => {
        it('debería retornar una lista de empleados', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockEmployees = [
                { _id: '1', firstName: 'John', lastName: 'Doe', position: 'Developer' },
                { _id: '2', firstName: 'Jane', lastName: 'Smith', position: 'Designer' }
            ];

            Employee.find.mockResolvedValue(mockEmployees);

            await getEmployees(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockEmployees
            }));
        });
    });

    describe('getEmployeeById', () => {
        it('debería retornar un empleado por ID', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockEmployee = { _id: '1', firstName: 'John', lastName: 'Doe', position: 'Developer' };

            Employee.findById.mockResolvedValue(mockEmployee);

            await getEmployeeById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockEmployee
            }));
        });

        it('debería retornar 404 si el empleado no es encontrado', async () => {
            const req = { params: { id: '1' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Employee.findById.mockResolvedValue(null);

            await getEmployeeById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Empleado no encontrado'
            }));
        });
    });

    describe('createEmployee', () => {
        it('debería crear un nuevo empleado', async () => {
            const req = {
                body: {
                    firstName: 'John',
                    lastName: 'Doe',
                    position: 'Developer',
                    department: 'IT',
                    hireDate: '2023-01-01'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockEmployee = { _id: '1', ...req.body };

            Employee.create.mockResolvedValue(mockEmployee);

            await createEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockEmployee
            }));
        });
    });

    describe('updateEmployee', () => {
        it('debería actualizar un empleado existente', async () => {
            const req = {
                params: { id: '1' },
                body: { position: 'Senior Developer' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockEmployee = { _id: '1', firstName: 'John', lastName: 'Doe', position: 'Senior Developer' };

            Employee.findByIdAndUpdate.mockResolvedValue(mockEmployee);

            await updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: mockEmployee
            }));
        });

        it('debería retornar 404 si el empleado a actualizar no es encontrado', async () => {
            const req = {
                params: { id: '1' },
                body: { position: 'Senior Developer' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Employee.findByIdAndUpdate.mockResolvedValue(null);

            await updateEmployee(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Empleado no encontrado'
            }));
        });
    });
});
