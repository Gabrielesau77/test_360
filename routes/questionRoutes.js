const express = require('express');
const { createQuestion, getQuestions, updateQuestion } = require('../controllers/questionController');
const { protect, admin, manager } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, manager, createQuestion)  // Crear pregunta (solo manager)
    .get(protect, getQuestions);  // Listar preguntas

router.route('/:id')
    .put(protect, manager, updateQuestion);  // Actualizar pregunta (solo manager)

module.exports = router;
