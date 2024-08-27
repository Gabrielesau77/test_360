const Evaluation = require("../models/Evaluation");
const Response = require('../models/Response');

// Crear una nueva evaluación
exports.createEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.create(req.body);
        res.status(201).json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear la evaluación' });
    }
};

// Listar todas las evaluaciones
exports.getEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.find().populate('employee').populate('questions');
        res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al obtener las evaluaciones' });
    }
};

// Obtener detalles de una evaluación
exports.getEvaluationById = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id).populate('employee').populate('questions');
        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
        }
        res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener la evaluación' });
    }
};

// Actualizar evaluación
exports.updateEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
        }

        res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la evaluación' });
    }
};

// Enviar evaluación completada
exports.submitEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id);

        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
        }

        evaluation.status = 'completed';
        await evaluation.save();

        res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al enviar la evaluación' });
    }
};

// Calcular puntuaciones de evaluación
exports.calculateScores = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id).populate('questions');
        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
        }

        // Filtrar preguntas de tipo "rating"
        const ratingQuestions = evaluation.questions.filter(q => q.type === 'rating');

        // Obtener las respuestas de la evaluación
        const responses = await Response.find({ evaluation: evaluation._id, question: { $in: ratingQuestions.map(q => q._id) } });

        // Calcular el promedio de puntuaciones
        let totalScore = 0;
        responses.forEach(response => {
            totalScore += parseInt(response.answer, 10);
        });

        const averageScore = responses.length > 0 ? (totalScore / responses.length) : 0;

        res.status(200).json({ success: true, data: { averageScore } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al calcular las puntuaciones de la evaluación' });
    }
};

// Asignar evaluadores a un empleado para una evaluación
exports.assignReviewers = async (req, res) => {
    try {
        const { reviewerIds } = req.body;

        const evaluation = await Evaluation.findById(req.params.id);
        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
        }

        const reviewers = await User.find({ _id: { $in: reviewerIds }, role: 'employee' });
        if (reviewers.length !== reviewerIds.length) {
            return res.status(400).json({ success: false, message: 'Algunos evaluadores no existen o no son empleados' });
        }

        evaluation.reviewers = reviewerIds;
        await evaluation.save();

        res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al asignar evaluadores' });
    }
};

exports.notifyPendingEvaluation = async (req, res) => {
    try {
        const pendingEvaluation = await Evaluation.find({ status: 'pending' }).populate('employee');

        // Simular el envío de notificaciones 
        // aca se debe conectar con el evento que se desea usar ejmp correo, push notification, entre otros como no se dijo en el doc llegue hasta aqui
        pendingEvaluation.forEach(evaluation => {
            console.log(`Notificación enviada a ${evaluation.employee.firstName} ${evaluation.employee.lastName} para la evaluación ${evaluation._id}`);
        });

        res.status(200).json({ success: true, message: 'Notificaciones enviadas' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al enviar notificaciones' });
    }
};