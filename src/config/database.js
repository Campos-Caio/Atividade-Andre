const { Sequelize } = require('sequelize');
const path = require('path');

// Configuração do banco de dados SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/clientes.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
  }
};

// Função para sincronizar o banco de dados
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao sincronizar o banco de dados:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
