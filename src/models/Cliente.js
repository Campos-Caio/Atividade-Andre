const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

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
    allowNull: true,
    validate: {
      len: {
        args: [0, 200],
        msg: 'O endereço deve ter no máximo 200 caracteres'
      }
    }
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'A cidade deve ter no máximo 100 caracteres'
      }
    }
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: true,
    validate: {
      len: {
        args: [2, 2],
        msg: 'O estado deve ter exatamente 2 caracteres'
      }
    }
  },
  cep: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      len: {
        args: [8, 10],
        msg: 'O CEP deve ter entre 8 e 10 caracteres'
      }
    }
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Data de nascimento deve ser uma data válida'
      }
    }
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

// Métodos de instância
Cliente.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // Formatar data de nascimento se existir
  if (values.dataNascimento) {
    // Verificar se é um objeto Date válido
    if (values.dataNascimento instanceof Date && !isNaN(values.dataNascimento)) {
      values.dataNascimento = values.dataNascimento.toISOString().split('T')[0];
    } else if (typeof values.dataNascimento === 'string') {
      // Se já é uma string, manter como está
      values.dataNascimento = values.dataNascimento;
    }
  }
  return values;
};

// Métodos estáticos
Cliente.buscarPorEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

Cliente.buscarAtivos = async function() {
  return await this.findAll({ where: { ativo: true } });
};

Cliente.buscarPorNome = async function(nome) {
  return await this.findAll({
    where: {
      nome: {
        [sequelize.Sequelize.Op.iLike]: `%${nome}%`
      }
    }
  });
};

module.exports = Cliente;
