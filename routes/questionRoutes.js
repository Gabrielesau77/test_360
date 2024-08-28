const express = require('express');
const { createQuestion, getQuestions, updateQuestion } = require('../controllers/questionController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.route('/')
    .post(
        protect,
        authorize('manager', 'admin'),
        [
            check('text', 'El texto de la pregunta es requerido').not().isEmpty(),
            check('type', 'El tipo de pregunta es requerido').isIn(['rating', 'text']),
            check('options', 'Las opciones deben ser un array').optional().isArray()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        },
        createQuestion
    )
    .get(protect, getQuestions);

router.route('/:id')
    .put(
        protect,
        authorize('manager', 'admin'),
        [
            check('text', 'El texto de la pregunta es requerido').optional().not().isEmpty(),
            check('type', 'El tipo de pregunta es requerido').optional().isIn(['rating', 'text']),
            check('options', 'Las opciones deben ser un array').optional().isArray()
        ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }
            next();
        },
        updateQuestion
    );

module.exports = router;