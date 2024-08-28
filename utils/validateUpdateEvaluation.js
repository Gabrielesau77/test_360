const { check, validationResult } = require('express-validator');

// Validaciones para el controlador submitEvaluationResponse
exports.validateUpdateEvaluation = [
    check('period', 'El periodo es requerido').optional().not().isEmpty(),
    check('status', 'El estado es requerido').optional().isIn(['pending', 'in_progress', 'completed']),
    check('type', 'El tipo de evaluación es requerido').optional().not().isEmpty(),
    check('employee', 'El ID del empleado debe ser un ID válido').optional().isMongoId(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
];