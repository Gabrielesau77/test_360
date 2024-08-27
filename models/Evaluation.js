const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    period: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending',
    },
    type: {
        type: String,
        required: true,
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
    responses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Response',
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
