const { check, validationResult } = require('express-validator');

// Validaciones para el controlador submitEvaluationResponse
exports.validateSubmitEvaluationResponse = [
    check('evaluationId')
        .notEmpty()
        .withMessage('El ID de la evaluación es obligatorio')
        .isMongoId()
        .withMessage('El ID de la evaluación debe ser un ID válido de MongoDB'),

    check('employeeId')
        .notEmpty()
        .withMessage('El ID del empleado es obligatorio')
        .isMongoId()
        .withMessage('El ID del empleado debe ser un ID válido de MongoDB'),

    check('answers')
        .isArray({ min: 1 })
        .withMessage('Las respuestas son obligatorias y deben estar en un array'),
    
    check('answers.*.questionId')
        .notEmpty()
        .withMessage('El ID de la pregunta es obligatorio')
        .isMongoId()
        .withMessage('El ID de la pregunta debe ser un ID válido de MongoDB'),

    check('answers.*.response')
        .notEmpty()
        .withMessage('La respuesta es obligatoria')
        .isString()
        .withMessage('La respuesta debe ser un texto o un número'),

    // Middleware para manejar los errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];