const express = require('express');
const router = express.Router();
const { getCourts } = require('../../controllers/courtController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.use(authMiddleware); // Protege todas as rotas admin

router.get('/', getCourts);
// Outras rotas admin específicas para quadras

module.exports = router; 