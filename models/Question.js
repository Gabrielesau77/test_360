const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['rating', 'text'],
        required: true,
    },
    options: [String], // Opciones en caso de preguntas de tipo rating
}, {
    timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);
