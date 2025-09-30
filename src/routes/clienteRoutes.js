const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');

// Middleware de validação básica
const validarDadosCliente = (req, res, next) => {
  const { nome, email, telefone } = req.body;
  
  if (!nome || !email || !telefone) {
    return res.status(400).json({
      success: false,
      message: 'Nome, email e telefone são obrigatórios'
    });
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  next();
};

// ROTAS DA API

// GET /api/clientes - Listar todos os clientes
router.get('/', ClienteController.listarClientes);

// GET /api/clientes/estatisticas - Obter estatísticas dos clientes
router.get('/estatisticas', ClienteController.obterEstatisticas);

// GET /api/clientes/:id - Buscar cliente por ID
router.get('/:id', ClienteController.buscarClientePorId);

// POST /api/clientes - Criar novo cliente
router.post('/', validarDadosCliente, ClienteController.criarCliente);

// PUT /api/clientes/:id - Atualizar cliente
router.put('/:id', ClienteController.atualizarCliente);

// DELETE /api/clientes/:id - Excluir cliente (soft delete)
router.delete('/:id', ClienteController.excluirCliente);

// PATCH /api/clientes/:id/restaurar - Restaurar cliente
router.patch('/:id/restaurar', ClienteController.restaurarCliente);

module.exports = router;
