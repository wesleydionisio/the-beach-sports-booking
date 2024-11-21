// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Erro detalhado:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    params: req.params,
    query: req.query,
    body: req.body
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err.details
    } : undefined
  });
};

module.exports = errorHandler;