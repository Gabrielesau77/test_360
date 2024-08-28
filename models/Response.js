const mongoose = require('mongoose');


const responseSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    evaluatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    evaluationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation',
        required: true
    },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            response: {
                type: String, // Esto puede ser un número si son respuestas tipo rating o un texto
                required: true
            }
        }
    ],
    totalScore: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Response', responseSchema);
