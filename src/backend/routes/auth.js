// Código Novo (ES6)
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const isEmailCorrect = email === ADMIN_EMAIL;
    const isPasswordCorrect = bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isEmailCorrect || !isPasswordCorrect) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
        { email: ADMIN_EMAIL, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    res.status(200).json({ token });
});

export default router;