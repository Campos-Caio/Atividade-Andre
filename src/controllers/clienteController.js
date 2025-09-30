const Cliente = require('../models/Cliente');
const { Op } = require('sequelize');

class ClienteController {
  // Listar todos os clientes
  static async listarClientes(req, res) {
    try {
      const { page = 1, limit = 10, nome, ativo } = req.query;
      const offset = (page - 1) * limit;

      // Construir filtros
      const where = {};
      
      if (nome) {
        where.nome = {
          [Op.iLike]: `%${nome}%`
        };
      }
      
      if (ativo !== undefined) {
        where.ativo = ativo === 'true';
      }

      const { count, rows } = await Cliente.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nome', 'ASC']]
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        success: true,
        data: {
          clientes: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar cliente por ID
  static async buscarClientePorId(req, res) {
    try {
      const { id } = req.params;
      
      const cliente = await Cliente.findByPk(id);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: cliente
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Criar novo cliente
  static async criarCliente(req, res) {
    try {
      const dadosCliente = req.body;

      // Verificar se email já existe
      const clienteExistente = await Cliente.buscarPorEmail(dadosCliente.email);
      if (clienteExistente) {
        return res.status(400).json({
          success: false,
          message: 'Email já cadastrado'
        });
      }

      const novoCliente = await Cliente.create(dadosCliente);

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso',
        data: novoCliente
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar cliente
  static async atualizarCliente(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;

      const cliente = await Cliente.findByPk(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      // Verificar se email já existe em outro cliente
      if (dadosAtualizacao.email && dadosAtualizacao.email !== cliente.email) {
        const clienteExistente = await Cliente.buscarPorEmail(dadosAtualizacao.email);
        if (clienteExistente && clienteExistente.id !== parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: 'Email já cadastrado'
          });
        }
      }

      await cliente.update(dadosAtualizacao);
      await cliente.reload();

      res.status(200).json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: cliente
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Excluir cliente (soft delete)
  static async excluirCliente(req, res) {
    try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      // Soft delete - marcar como inativo
      await cliente.update({ ativo: false });

      res.status(200).json({
        success: true,
        message: 'Cliente excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Restaurar cliente (reativar)
  static async restaurarCliente(req, res) {
    try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      await cliente.update({ ativo: true });

      res.status(200).json({
        success: true,
        message: 'Cliente restaurado com sucesso',
        data: cliente
      });
    } catch (error) {
      console.error('Erro ao restaurar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Estatísticas dos clientes
  static async obterEstatisticas(req, res) {
    try {
      const totalClientes = await Cliente.count();
      const clientesAtivos = await Cliente.count({ where: { ativo: true } });
      const clientesInativos = await Cliente.count({ where: { ativo: false } });

      res.status(200).json({
        success: true,
        data: {
          total: totalClientes,
          ativos: clientesAtivos,
          inativos: clientesInativos
        }
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = ClienteController;
