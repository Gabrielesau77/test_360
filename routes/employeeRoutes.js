// routes/employeeRoutes.js
const express = require('express');
const { getEmployees, getEmployeeById, createEmployee, updateEmployee } = require('../controllers/employeeController');
const { protect, admin, manager, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, authorize('manager', 'admin'), getEmployees)  // Listar empleados
    .post(protect, authorize('manager', 'admin'), createEmployee);  // Crear empleado (solo manager o admin)

router.route('/:id')
    .get(protect, authorize('manager', 'admin'), getEmployeeById)  // Obtener detalles de un empleado
    .put(protect, authorize('manager', 'admin'), updateEmployee);  // Actualizar empleado (solo manager o admin)

module.exports = router;
