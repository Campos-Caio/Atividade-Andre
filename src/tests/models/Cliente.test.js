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
      notEmpty: {
        msg: 'O nome é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'O nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email deve ter um formato válido'
      },
      notEmpty: {
        msg: 'O email é obrigatório'
      }
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O telefone é obrigatório'
      },
      len: {
        args: [10, 20],
        msg: 'O telefone deve ter entre 10 e 20 caracteres'
      }
    }
  },
  endereco: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  cep: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'clientes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

describe('Modelo Cliente', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    await Cliente.destroy({ where: {}, truncate: true });
  });

  describe('Criação de cliente', () => {
    test('deve criar um cliente com dados válidos', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567',
        dataNascimento: '1990-01-01'
      };

      const cliente = await Cliente.create(dadosCliente);

      expect(cliente).toBeDefined();
      expect(cliente.id).toBeDefined();
      expect(cliente.nome).toBe(dadosCliente.nome);
      expect(cliente.email).toBe(dadosCliente.email);
      expect(cliente.telefone).toBe(dadosCliente.telefone);
      expect(cliente.ativo).toBe(true);
    });

    test('deve falhar ao criar cliente sem nome', async () => {
      const dadosCliente = {
        email: 'joao@email.com',
        telefone: '11999999999'
      };

      await expect(Cliente.create(dadosCliente)).rejects.toThrow();
    });

    test('deve falhar ao criar cliente sem email', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        telefone: '11999999999'
      };

      await expect(Cliente.create(dadosCliente)).rejects.toThrow();
    });

    test('deve falhar ao criar cliente sem telefone', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        email: 'joao@email.com'
      };

      await expect(Cliente.create(dadosCliente)).rejects.toThrow();
    });

    test('deve falhar ao criar cliente com email inválido', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        email: 'email-invalido',
        telefone: '11999999999'
      };

      await expect(Cliente.create(dadosCliente)).rejects.toThrow();
    });

    test('deve falhar ao criar cliente com nome muito curto', async () => {
      const dadosCliente = {
        nome: 'J',
        email: 'joao@email.com',
        telefone: '11999999999'
      };

      await expect(Cliente.create(dadosCliente)).rejects.toThrow();
    });

    test('deve falhar ao criar cliente com telefone muito curto', async () => {
      const dadosCliente = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '123'
      };

      await expect(Cliente.create(dadosCliente)).rejects.toThrow();
    });
  });

  describe('Validações de email único', () => {
    test('deve falhar ao criar cliente com email duplicado', async () => {
      const dadosCliente1 = {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      };

      const dadosCliente2 = {
        nome: 'Maria Santos',
        email: 'joao@email.com',
        telefone: '11888888888'
      };

      await Cliente.create(dadosCliente1);
      await expect(Cliente.create(dadosCliente2)).rejects.toThrow();
    });
  });

  describe('Busca de clientes', () => {
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

    test('deve buscar todos os clientes', async () => {
      const clientes = await Cliente.findAll();
      expect(clientes).toHaveLength(2);
    });

    test('deve buscar cliente por ID', async () => {
      // Primeiro criar um cliente para buscar (usando email único)
      const clienteCriado = await Cliente.create({
        nome: 'Pedro Oliveira',
        email: 'pedro@email.com',
        telefone: '11777777777'
      });
      
      const cliente = await Cliente.findByPk(clienteCriado.id);
      expect(cliente).toBeDefined();
      expect(cliente.nome).toBe('Pedro Oliveira');
    });

    test('deve buscar cliente por email', async () => {
      const cliente = await Cliente.findOne({ where: { email: 'joao@email.com' } });
      expect(cliente).toBeDefined();
      expect(cliente.nome).toBe('João Silva');
    });
  });

  describe('Atualização de cliente', () => {
    let cliente;

    beforeEach(async () => {
      cliente = await Cliente.create({
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '11999999999'
      });
    });

    test('deve atualizar dados do cliente', async () => {
      await cliente.update({ nome: 'João Santos' });
      await cliente.reload();

      expect(cliente.nome).toBe('João Santos');
    });

    test('deve desativar cliente', async () => {
      await cliente.update({ ativo: false });
      await cliente.reload();

      expect(cliente.ativo).toBe(false);
    });
  });
});
