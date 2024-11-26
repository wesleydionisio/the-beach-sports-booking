const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');    
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rotas protegidas de usuário
router.use(authMiddleware);
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

// Rotas administrativas
router.use(adminMiddleware);
router.get('/', userController.listUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;