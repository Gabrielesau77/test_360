const express = require('express');
const { createEvaluation, getEvaluation, getEvaluationById, updateEvaluation, notifyPendingEvaluation, submitEvaluationResponse, getEmployeeResponses } = require('../controllers/evaluationController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');
const { validateSubmitEvaluationResponse } = require('../utils/validateSubmitEvaluationResponse');
const { validateUpdateEvaluation } = require('../utils/validateUpdateEvaluation');

const router = express.Router();

router.route('/')
    .post(
        protect,
        authorize('manager', 'admin'),
        [
            check('period', 'El periodo es requerido').not().isEmpty(),
            check('status', 'El estado es requerido').isIn(['activa', 'cancelada']),
            check('type', 'El tipo de evaluación es requerido').not().isEmpty(),
            check('questions', 'El ID del empleado es requerido').isMongoId()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        },
        createEvaluation
    )
    .get(protect, getEvaluation);

router.route('/:id')
    .get(protect, getEvaluationById)
    .put(protect, authorize('manager', 'admin'), validateUpdateEvaluation, updateEvaluation);

router.route('/:id/submit')
    .post(protect, authorize('admin'), validateSubmitEvaluationResponse, submitEvaluationResponse);

router.get('/responses/employee/:employeeId', getEmployeeResponses);

router.route('/notify')
    .get(protect, authorize('admin'), notifyPendingEvaluation);

module.exports = router;