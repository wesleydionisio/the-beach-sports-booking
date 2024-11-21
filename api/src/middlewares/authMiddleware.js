// src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(`Headers de autorização recebidos: ${authHeader}`); // Log para depuração

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    console.log(`Token extraído: ${token}`); // Log para depuração

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      console.log(`Token decodificado: ${JSON.stringify(decoded)}`); // Log para depuração
      req.user = await User.findById(decoded.id).select('-senha'); // Excluir a senha
      console.log('=== Auth Middleware ===');
      console.log('Headers:', req.headers);
      if (!req.user) {
        console.log('Usuário não encontrado após decodificação do token.');
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }
      console.log(`Usuário autenticado: ${req.user.nome} (ID: ${req.user.id})`);
      next();
    } catch (err) {
      console.error('Token inválido:', err);
      res.status(401).json({ message: 'Token inválido. Acesso negado.' });
      console.error('Erro na autenticação:', error);
      res.status(401).json({ message: 'Token inválido' });
    }
  } else {
    console.log('Cabeçalho de autorização ausente ou malformado.');
    res.status(401).json({ message: 'Autenticação necessária.' });
  }
};

module.exports = authMiddleware;