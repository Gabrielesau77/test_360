const Employee = require('../models/Employee');
const User = require('../models/User');

// Listar todos los empleados
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('evaluators', 'username email');
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los empleados' });
    }
};

// Obtener detalles de un empleado
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('evaluators', 'username email');
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el empleado' });
    }
};

// Crear un nuevo empleado
exports.createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el empleado' });
    }
};

// Actualizar información de un empleado
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el empleado' });
    }
};

// Asignar evaluadores a un empleado para una evaluación
exports.assignEvaluatorsToEmployee = async (req, res) => {
    try {
        const { evaluators } = req.body;  // Array de IDs de usuarios que serán evaluadores
        const employeeId = req.params.id;

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
        }

        // Actualizar los evaluadores del empleado
        employee.evaluators = evaluators;
        await employee.save();

        // Actualizar el campo assignedEmployees en cada usuario evaluador
        await User.updateMany(
            { _id: { $in: evaluators } },
            { $addToSet: { assignedEmployees: employeeId } }
        );
        const employeeDend = await Employee.findById(employeeId).populate('evaluators', 'username email');

        res.status(200).json({
            success: true,
            data: employeeDend
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ver evaluadores de empleado para una evaluación
exports.getEmployeeEvaluators = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('evaluators', 'username email');
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
        }

        res.status(200).json({
            success: true,
            data: employee.evaluators
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
