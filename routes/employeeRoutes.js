const express = require('express');
const { getEmployees, getEmployeeById, createEmployee, updateEmployee, assignEvaluatorsToEmployee, getEmployeeEvaluators } = require('../controllers/employeeController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.route('/')
    .get(protect, getEmployees)
    .post(
        protect,
        authorize('manager', 'admin'),
        [
            check('firstName', 'El nombre es requerido').not().isEmpty(),
            check('lastName', 'El apellido es requerido').not().isEmpty(),
            check('position', 'El puesto es requerido').not().isEmpty(),
            check('department', 'El departamento es requerido').not().isEmpty(),
            check('hireDate', 'La fecha de contratación es requerida').isISO8601()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        },
        createEmployee
    );

router.route('/:id')
    .get(protect, getEmployeeById)
    .put(
        protect,
        authorize('manager', 'admin'),
        [
            check('firstName', 'El nombre es requerido').optional().not().isEmpty(),
            check('lastName', 'El apellido es requerido').optional().not().isEmpty(),
            check('position', 'El puesto es requerido').optional().not().isEmpty(),
            check('department', 'El departamento es requerido').optional().not().isEmpty(),
            check('hireDate', 'La fecha de contratación debe ser válida').optional().isISO8601()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        },
        updateEmployee
    );

// Asignar evaluadores a un empleado
router.route('/assign-evaluators/:id')
    .post(protect, authorize('manager', 'admin'), assignEvaluatorsToEmployee);
// ver evaluadores de un empleado
router.route('/get-Employee-evaluators/:id')
    .post(protect, authorize('manager', 'admin'), getEmployeeEvaluators);


module.exports = router;