const { sequelize } = require('../config/database');
const Cliente = require('../models/Cliente');

// Dados de exemplo para popular o banco
const clientesExemplo = [
  {
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '11999999999',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234567',
    dataNascimento: '1990-05-15',
    ativo: true
  },
  {
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    telefone: '11888888888',
    endereco: 'Avenida Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310100',
    dataNascimento: '1985-08-22',
    ativo: true
  },
  {
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    telefone: '11777777777',
    endereco: 'Rua Augusta, 456',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01305000',
    dataNascimento: '1992-12-03',
    ativo: true
  },
  {
    nome: 'Ana Costa',
    email: 'ana.costa@email.com',
    telefone: '11666666666',
    endereco: 'Rua Oscar Freire, 789',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01426001',
    dataNascimento: '1988-03-18',
    ativo: true
  },
  {
    nome: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    telefone: '11555555555',
    endereco: 'Rua Haddock Lobo, 321',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01414000',
    dataNascimento: '1995-07-10',
    ativo: false
  }
];

// Função para popular o banco com dados de exemplo
const popularBanco = async () => {
  try {
    console.log('🌱 Iniciando população do banco de dados...');
    
    // Sincronizar banco
    await sequelize.sync({ force: true });
    console.log('✅ Banco de dados sincronizado');
    
    // Inserir clientes de exemplo
    for (const dadosCliente of clientesExemplo) {
      await Cliente.create(dadosCliente);
      console.log(`✅ Cliente "${dadosCliente.nome}" criado`);
    }
    
    console.log(`🎉 Banco populado com sucesso! ${clientesExemplo.length} clientes criados.`);
    
    // Mostrar estatísticas
    const total = await Cliente.count();
    const ativos = await Cliente.count({ where: { ativo: true } });
    const inativos = await Cliente.count({ where: { ativo: false } });
    
    console.log('\n📊 Estatísticas:');
    console.log(`   Total de clientes: ${total}`);
    console.log(`   Clientes ativos: ${ativos}`);
    console.log(`   Clientes inativos: ${inativos}`);
    
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  popularBanco();
}

module.exports = { popularBanco, clientesExemplo };
