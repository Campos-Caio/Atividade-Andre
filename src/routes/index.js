const express = require('express');
const router = express.Router();
const clienteRoutes = require('./clienteRoutes');

// Rota de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rotas da API
router.use('/clientes', clienteRoutes);

// Rota raiz da API
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Cadastro de Clientes',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      clientes: {
        listar: 'GET /api/clientes',
        buscar: 'GET /api/clientes/:id',
        criar: 'POST /api/clientes',
        atualizar: 'PUT /api/clientes/:id',
        excluir: 'DELETE /api/clientes/:id',
        restaurar: 'PATCH /api/clientes/:id/restaurar',
        estatisticas: 'GET /api/clientes/estatisticas'
      }
    }
  });
});

module.exports = router;
