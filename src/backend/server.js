// backend/server.js (versão final sem dotenv)

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importando rotas e middleware
import fileRoutes from './routes/files.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';

// As linhas 'import dotenv' e 'dotenv.config()' foram removidas.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Acessando a variável de ambiente que foi carregada externamente
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/downloads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Servidor do Gerenciador de PDF está funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});