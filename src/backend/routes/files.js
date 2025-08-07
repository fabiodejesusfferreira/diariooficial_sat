// Código Antigo (CommonJS)
/*
const express = require('express');
...
const uploadPath = path.join(__dirname, '../uploads');
...
module.exports = router;
*/

// Código Novo (ES6)
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // Helper para converter URL de arquivo para caminho

// Recriando __dirname para Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Garante que o diretório de uploads exista
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${path.basename(file.originalname, extension)}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('pdfFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Nenhum arquivo foi enviado.' });
  }
  res.status(200).json({
    message: 'Arquivo enviado com sucesso!',
    filename: req.file.filename
  });
});

router.get('/', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Não foi possível listar os arquivos.' });
    }
    const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    res.status(200).json(pdfFiles);
  });
});

export default router;