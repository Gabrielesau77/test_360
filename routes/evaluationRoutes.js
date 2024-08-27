const express = require('express');
const { createEvaluation, getEvaluation, getEvaluationById, updateEvaluation, submitEvaluation, calculateScores, assignReviewers, notifyPendingEvaluation } = require('../controllers/evaluationController');
const { protect, admin, manager, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, authorize('manager', 'admin'), createEvaluation)  // Crear evaluación (solo manager o admin)
    .get(protect, getEvaluation);  // Listar evaluaciones

router.route('/:id')
    .get(protect, authorize('manager', 'admin'), getEvaluationById)  // Obtener detalles de una evaluación
    .put(protect, authorize('manager', 'admin'), updateEvaluation);  // Actualizar evaluación (solo manager o admin)

router.route('/:id/submit')
    .post(protect, authorize('manager', 'admin'), submitEvaluation);  // Enviar evaluación completada

router.route('/:id/scores')
    .get(protect, authorize('manager', 'admin'), calculateScores);

router.route('/:id/reviewers')
    .put(protect, authorize('manager', 'admin'), assignReviewers);

router.route('/notify')
    .get(protect, authorize('manager', 'admin'), notifyPendingEvaluation);

module.exports = router;
