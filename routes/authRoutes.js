const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.post(
    '/register',
    [
        check('username', 'El nombre de usuario es requerido').not().isEmpty(),
        check('email', 'El correo electrónico es requerido').isEmail(),
        check('password', 'La contraseña es requerida y debe tener al menos 6 caracteres').isLength({ min: 6 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
    registerUser
);

router.post(
    '/login',
    [
        check('email', 'El correo electrónico es requerido').isEmail(),
        check('password', 'La contraseña es requerida').not().isEmpty()
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    },
    loginUser
);

module.exports = router;