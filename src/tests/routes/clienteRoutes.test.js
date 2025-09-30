const request = require('supertest');
const express = require('express');
const { sequelize, setupTestDatabase, cleanupTestDatabase } = require('../setup');
const { DataTypes } = require('sequelize');

// Definir modelo Cliente para testes
const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome é obrigatório' },
      len: { args: [2, 100], msg: 'O nome deve ter entre 2 e 100 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Email deve ter um formato válido' },
      notEmpty: { msg: 'O email é obrigatório' }
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O telefone é obrigatório' },
      len: { args: [10, 20], msg: 'O telefone deve ter entre 10 e 20 caracteres' }
    }
  },
  endereco: { type: DataTypes.STRING(200), allowNull: true },
  cidade: { type: DataTypes.STRING(100), allowNull: true },
  estado: { type: DataTypes.STRING(2), allowNull: true },
  cep: { type: DataTypes.STRING(10), allowNull: true },
  dataNascimento: { type: DataTypes.DATEONLY, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false }
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Middleware de validação
const validarDadosCliente = (req, res, next) => {
  const { nome, email, telefone } = req.body;
  
  if (!nome || !email || !telefone) {
    return res.status(400).json({
      success: false,
      message: 'Nome, email e telefone são obrigatórios'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }

  next();
};

// Controller mock
const ClienteController = {
  async listarClientes(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Cliente.findAndCountAll({
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
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async buscarClientePorId(req, res) {
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
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async criarCliente(req, res) {
    try {
      const dadosCliente = req.body;

      const clienteExistente = await Cliente.findOne({ where: { email: dadosCliente.email } });
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
        message: 'Erro interno do servidor'
      });
    }
  },

  async atualizarCliente(req, res) {
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

      if (dadosAtualizacao.email && dadosAtualizacao.email !== cliente.email) {
        const clienteExistente = await Cliente.findOne({ where: { email: dadosAtualizacao.email } });
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
        message: 'Erro interno do servidor'
      });
    }
  },

  async excluirCliente(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }

      await cliente.update({ ativo: false });

      res.status(200).json({
        success: true,
        message: 'Cliente excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async restaurarCliente(req, res) {
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
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async obterEstatisticas(req, res) {
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
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

// Configurar app de teste
const app = express();
app.use(express.json());

// Rotas de teste (ordem importa - rotas específicas antes das dinâmicas)
app.get('/api/clientes/estatisticas', ClienteController.obterEstatisticas);
app.get('/api/clientes', ClienteController.listarClientes);
app.get('/api/clientes/:id', ClienteController.buscarClientePorId);
app.post('/api/clientes', validarDadosCliente, ClienteController.criarCliente);
app.put('/api/clientes/:id', ClienteController.atualizarCliente);
app.delete('/api/clientes/:id', ClienteController.excluirCliente);
app.patch('/api/clientes/:id/restaurar', ClienteController.restaurarCliente);

describe('Rotas de Cliente', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await Cliente.destroy({ where: {}, truncate: true });
  });

  describe('Validação de dados', () => {
    test('deve rejeitar requisição sem nome', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .send({
          email: 'joao@email.com',
          telefone: '11999999999'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nome, email e telefone são obrigatórios');
    });

    test('deve rejeitar requisição sem email', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .send({
          nome: 'João Silva',
          telefone: '11999999999'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nome, email e telefone são obrigatórios');
    });

    test('deve rejeitar requisição sem telefone', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .send({
          nome: 'João Silva',
          email: 'joao@email.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Nome, email e telefone são obrigatórios');
    });

    test('deve rejeitar email com formato inválido', async () => {
      const response = await request(app)
        .post('/api/clientes')
        .send({
          nome: 'João Silva',
          email: 'email-invalido',
          telefone: '11999999999'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Formato de email inválido');
    });
  });

  describe('Rotas GET', () => {
    beforeEach(async () => {
      await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });
    });

    test('GET /api/clientes deve retornar lista de clientes', async () => {
      const response = await request(app)
        .get('/api/clientes');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes).toHaveLength(1);
    });

    test('GET /api/clientes/estatisticas deve retornar estatísticas', async () => {
      const response = await request(app)
        .get('/api/clientes/estatisticas');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(1);
      expect(response.body.data.ativos).toBe(1);
    });

    test('GET /api/clientes/:id deve retornar cliente específico', async () => {
      const cliente = await Cliente.findOne();
      const response = await request(app)
        .get(`/api/clientes/${cliente.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe('João Silva');
    });
  });

  describe('Rotas POST', () => {
    test('POST /api/clientes deve criar novo cliente', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(dadosCliente);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cliente criado com sucesso');
    });
  });

  describe('Rotas PUT', () => {
    let cliente;

    beforeEach(async () => {
      cliente = await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });
    });

    test('PUT /api/clientes/:id deve atualizar cliente', async () => {
      const response = await request(app)
        .put(`/api/clientes/${cliente.id}`)
        .send({ nome: 'João Santos' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cliente atualizado com sucesso');
    });
  });

  describe('Rotas DELETE', () => {
    let cliente;

    beforeEach(async () => {
      cliente = await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });
    });

    test('DELETE /api/clientes/:id deve excluir cliente', async () => {
      const response = await request(app)
        .delete(`/api/clientes/${cliente.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cliente excluído com sucesso');
    });
  });

  describe('Rotas PATCH', () => {
    let cliente;

    beforeEach(async () => {
      cliente = await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        ativo: false
      });
    });

    test('PATCH /api/clientes/:id/restaurar deve restaurar cliente', async () => {
      const response = await request(app)
        .patch(`/api/clientes/${cliente.id}/restaurar`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cliente restaurado com sucesso');
    });
  });
});
