const express = require('express');
const { createEvaluation, getEvaluation, getEvaluationById, updateEvaluation, submitEvaluation, calculateScores, assignReviewers, notifyPendingEvaluation } = require('../controllers/evaluationController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.route('/')
    .post(
        protect,
        authorize('manager', 'admin'),
        [
            check('period', 'El periodo es requerido').not().isEmpty(),
            check('status', 'El estado es requerido').isIn(['pending', 'in_progress', 'completed']),
            check('type', 'El tipo de evaluación es requerido').not().isEmpty(),
            check('employee', 'El ID del empleado es requerido').isMongoId()
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
    .put(
        protect,
        authorize('manager', 'admin'),
        [
            check('period', 'El periodo es requerido').optional().not().isEmpty(),
            check('status', 'El estado es requerido').optional().isIn(['pending', 'in_progress', 'completed']),
            check('type', 'El tipo de evaluación es requerido').optional().not().isEmpty(),
            check('employee', 'El ID del empleado debe ser un ID válido').optional().isMongoId()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        },
        updateEvaluation
    );

router.route('/:id/submit')
    .post(protect, submitEvaluation);

router.route('/:id/scores')
    .get(protect, calculateScores);

router.route('/:id/reviewers')
    .put(
        protect,
        authorize('manager', 'admin'),
        [
            check('reviewerIds', 'Debe proporcionar un array de IDs de evaluadores').isArray(),
            check('reviewerIds.*', 'Cada ID de evaluador debe ser un ID válido').isMongoId()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        },
        assignReviewers
    );

router.route('/notify')
    .get(protect, authorize('admin'), (req, res) => {
        next();
    }, notifyPendingEvaluation);

module.exports = router;