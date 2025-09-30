const { Sequelize } = require('sequelize');

// Configuração do banco de dados para testes
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // Banco em memória para testes
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
});

// Função para configurar o banco de dados de teste
const setupTestDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✅ Banco de dados de teste configurado');
  } catch (error) {
    console.error('❌ Erro ao configurar banco de teste:', error);
    throw error;
  }
};

// Função para limpar o banco de dados de teste
const cleanupTestDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Banco de dados de teste limpo');
  } catch (error) {
    console.error('❌ Erro ao limpar banco de teste:', error);
  }
};

module.exports = {
  sequelize,
  setupTestDatabase,
  cleanupTestDatabase
};
