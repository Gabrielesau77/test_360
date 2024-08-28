const Evaluation = require("../models/Evaluation");
const Question = require("../models/Question");
const Response = require('../models/Response');

// Crear una nueva evaluación
exports.createEvaluation = async (req, res) => {
    try {
        const { employeeId, period, type, questions } = req.body;
        // Verificar si todas las preguntas existen en la base de datos
        const foundQuestions = await Question.find({ _id: { $in: questions } });
        if (foundQuestions.length !== questions.length) {
            return res.status(400).json({ success: false, message: 'Una o más preguntas no existen' });
        }
        // Crear la evaluación con las preguntas relacionadas
        const evaluation = new Evaluation({
            employeeId,
            period,
            type,
            questions
        });

        await evaluation.save();

        res.status(201).json({ success: true, data: evaluation });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al crear la evaluación' });
    }
};

// Listar todas las evaluaciones
exports.getEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.find().populate('questions');
        res.status(200).json({ success: true, data: evaluation });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error al obtener las evaluaciones' });
    }
};

// Obtener detalles de una evaluación
exports.getEvaluationById = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id).populate('questions.questionId', 'text type options');
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
exports.submitEvaluationResponse = async (req, res) => {
    try {
        const { evaluationId, employeeId, answers } = req.body;
        const evaluatorId = req.user.id;

        // Verificar si la evaluación existe
        const evaluation = await Evaluation.findById(evaluationId);
        if (!evaluation) {
            return res.status(404).json({ success: false, message: 'Evaluación no encontrada' });
        }

        let totalPoints = 0;
        let numberOfQuestions = 0;

        // Calcular el puntaje total basado en las respuestas
        answers.forEach(answer => {
                totalPoints +=  parseFloat(answer.response);
                numberOfQuestions++;
        });
        const totalScore = numberOfQuestions > 0 ? totalPoints / numberOfQuestions : 0;

        // Crear y guardar la respuesta en el modelo Response
        const response = await Response.create({
            employeeId,
            evaluatorId,
            evaluationId,
            answers,
            totalScore
        });

        res.status(201).json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al enviar las respuestas de la evaluación' });
    }
};
// ver las respuestas de la evaluacion de un empleado
exports.getEmployeeResponses = async (req, res) => {
    try {
        const { employeeId } = req.params;

        // Buscar todas las respuestas asociadas al empleado
        const responses = await Response.find({ employeeId }).populate('evaluationId').populate('evaluatorId', 'username email').populate('answers.questionId', 'text');

        if (!responses || responses.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron respuestas para este empleado' });
        }

        res.status(200).json({ success: true, data: responses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las respuestas del empleado' });
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