const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      });
    }
    next();
  } catch (error) {
    console.error('Erro no middleware de admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar permissões de administrador'
    });
  }
};

module.exports = adminMiddleware; 