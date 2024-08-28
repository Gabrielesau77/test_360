const express = require('express');
const {
    getEmployeeReport,
    getEvaluationReport,
    getAllEvaluationsReport,
    getSummaryReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');


const router = express.Router();

router.get('/employee/:employeeId', protect, authorize('manager', 'admin'), getEmployeeReport); // Reporte de un empleado específico
router.get('/evaluation/:evaluationId', protect, authorize('manager', 'admin'), getEvaluationReport); // Reporte de una evaluación específica
router.get('/all', protect, authorize('manager', 'admin'), getAllEvaluationsReport); // Reporte general de todas las evaluaciones
router.get('/summary', protect, authorize('manager', 'admin'), getSummaryReport); // Resumen de reportes con promedios

module.exports = router;