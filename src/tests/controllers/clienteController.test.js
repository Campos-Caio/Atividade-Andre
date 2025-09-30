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

// Mock do controller
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
app.post('/api/clientes', ClienteController.criarCliente);
app.put('/api/clientes/:id', ClienteController.atualizarCliente);
app.delete('/api/clientes/:id', ClienteController.excluirCliente);

describe('ClienteController', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await Cliente.destroy({ where: {}, truncate: true });
  });

  describe('POST /api/clientes', () => {
    test('deve criar um cliente com dados válidos', async () => {
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
      expect(response.body.data.nome).toBe(dadosCliente.nome);
      expect(response.body.data.email).toBe(dadosCliente.email);
    });

    test('deve falhar ao criar cliente com email duplicado', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      };

      // Criar primeiro cliente
      await request(app)
        .post('/api/clientes')
        .send(dadosCliente);

      // Tentar criar segundo cliente com mesmo email
      const response = await request(app)
        .post('/api/clientes')
        .send({
          nome: 'Maria Santos',
          email: 'joao@email.com',
          telefone: '11888888888'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email já cadastrado');
    });

    test('deve falhar ao criar cliente com dados inválidos', async () => {
      const dadosCliente = {
        nome: 'J', // Nome muito curto
        email: 'email-invalido',
        telefone: '123' // Telefone muito curto
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(dadosCliente);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dados inválidos');
    });
  });

  describe('GET /api/clientes', () => {
    beforeEach(async () => {
      await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });

      await Cliente.create({
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '11888888888'
      });
    });

    test('deve listar todos os clientes', async () => {
      const response = await request(app)
        .get('/api/clientes');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes).toHaveLength(2);
      expect(response.body.data.pagination.totalItems).toBe(2);
    });

    test('deve listar clientes com paginação', async () => {
      const response = await request(app)
        .get('/api/clientes?page=1&limit=1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes).toHaveLength(1);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });
  });

  describe('GET /api/clientes/:id', () => {
    let cliente;

    beforeEach(async () => {
      cliente = await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });
    });

    test('deve buscar cliente por ID', async () => {
      const response = await request(app)
        .get(`/api/clientes/${cliente.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe('João Silva');
    });

    test('deve retornar 404 para cliente não encontrado', async () => {
      const response = await request(app)
        .get('/api/clientes/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cliente não encontrado');
    });
  });

  describe('PUT /api/clientes/:id', () => {
    let cliente;

    beforeEach(async () => {
      cliente = await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });
    });

    test('deve atualizar cliente', async () => {
      const dadosAtualizacao = {
        nome: 'João Santos',
        telefone: '11777777777'
      };

      const response = await request(app)
        .put(`/api/clientes/${cliente.id}`)
        .send(dadosAtualizacao);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cliente atualizado com sucesso');
      expect(response.body.data.nome).toBe('João Santos');
    });

    test('deve retornar 404 para cliente não encontrado', async () => {
      const response = await request(app)
        .put('/api/clientes/999')
        .send({ nome: 'João Santos' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cliente não encontrado');
    });
  });

  describe('DELETE /api/clientes/:id', () => {
    let cliente;

    beforeEach(async () => {
      cliente = await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });
    });

    test('deve excluir cliente (soft delete)', async () => {
      const response = await request(app)
        .delete(`/api/clientes/${cliente.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cliente excluído com sucesso');

      // Verificar se cliente foi desativado
      const clienteAtualizado = await Cliente.findByPk(cliente.id);
      expect(clienteAtualizado.ativo).toBe(false);
    });

    test('deve retornar 404 para cliente não encontrado', async () => {
      const response = await request(app)
        .delete('/api/clientes/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cliente não encontrado');
    });
  });

  describe('GET /api/clientes/estatisticas', () => {
    beforeEach(async () => {
      await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        ativo: true
      });

      await Cliente.create({
        nome: 'Maria Santos',
        email: 'maria@email.com',
        telefone: '11888888888',
        ativo: false
      });
    });

    test('deve retornar estatísticas dos clientes', async () => {
      const response = await request(app)
        .get('/api/clientes/estatisticas');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(2);
      expect(response.body.data.ativos).toBe(1);
      expect(response.body.data.inativos).toBe(1);
    });
  });
});
