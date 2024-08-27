const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    evaluation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation',
        required: true,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    respondent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answer: {
        type: mongoose.Schema.Types.Mixed, // Puede ser un número (rating) o texto
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Response', responseSchema);
