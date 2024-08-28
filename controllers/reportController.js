const Response = require('../models/Response');
const Evaluation = require('../models/Evaluation');
const Employee = require('../models/Employee');

// 1. Obtener las evaluaciones y puntajes de un empleado específico
exports.getEmployeeReport = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const responses = await Response.find({ employeeId }).populate('evaluationId', 'period type').populate('evaluatorId', 'username');

        if (!responses || responses.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron evaluaciones para este empleado' });
        }

        res.status(200).json({ success: true, data: responses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el reporte del empleado' });
    }
};

// 2. Obtener los detalles de una evaluación específica
exports.getEvaluationReport = async (req, res) => {
    try {
        const { evaluationId } = req.params;
        const responses = await Response.find({ evaluationId }).populate('employeeId', 'firstName lastName').populate('evaluatorId', 'username');

        if (!responses || responses.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron respuestas para esta evaluación' });
        }

        res.status(200).json({ success: true, data: responses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el reporte de la evaluación' });
    }
};

// 3. Obtener un reporte general de todas las evaluaciones y puntajes de todos los empleados
exports.getAllEvaluationsReport = async (req, res) => {
    try {
        const responses = await Response.find().populate('employeeId', 'firstName lastName').populate('evaluationId', 'period type').populate('evaluatorId', 'username');

        if (!responses || responses.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron evaluaciones' });
        }

        res.status(200).json({ success: true, data: responses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el reporte general' });
    }
};

// 4. Obtener un resumen general con promedios de puntajes por evaluación
exports.getSummaryReport = async (req, res) => {
    try {
        const evaluations = await Evaluation.find();

        const summary = await Promise.all(
            evaluations.map(async evaluation => {
                const responses = await Response.find({ evaluationId: evaluation._id });

                const averageScore = responses.reduce((total, response) => total + response.totalScore, 0) / responses.length;

                return {
                    evaluation: evaluation.period + ' - ' + evaluation.type,
                    averageScore: averageScore.toFixed(2)
                };
            })
        );

        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el resumen de reportes' });
    }
};
