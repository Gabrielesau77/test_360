const Question = require('../models/Question');

// Crear una nueva pregunta
exports.createQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({ success: true, data: question });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear la pregunta' });
    }
};

// Listar todas las preguntas
exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las preguntas' });
    }
};

// Actualizar una pregunta
exports.updateQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!question) {
            return res.status(404).json({ success: false, message: 'Pregunta no encontrada' });
        }

        res.status(200).json({ success: true, data: question });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la pregunta' });
    }
};
