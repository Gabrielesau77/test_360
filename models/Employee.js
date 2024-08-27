const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    hireDate: {
        type: Date,
        required: true,
    },
    evaluations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evaluation',
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);
