# Sistema de Cadastro de Clientes - Node.js

Uma aplicação Node.js completa para cadastro e gerenciamento de clientes, desenvolvida seguindo o padrão MVC (Model-View-Controller) com banco de dados integrado e testes unitários.

## 🚀 Características

- **Padrão MVC**: Arquitetura bem estruturada e organizada
- **Banco de Dados**: SQLite com Sequelize ORM
- **API REST**: Endpoints completos para operações CRUD
- **Interface Web**: Interface moderna e responsiva para gerenciar clientes
- **Validações**: Validação robusta de dados de entrada
- **Testes**: Cobertura completa com Jest
- **Segurança**: Middlewares de segurança (Helmet, Rate Limiting, CORS)
- **Documentação**: API bem documentada

## 📋 Funcionalidades

### Clientes
- ✅ Cadastrar novo cliente
- ✅ Listar clientes (com paginação e filtros)
- ✅ Buscar cliente por ID
- ✅ Atualizar dados do cliente
- ✅ Excluir cliente (soft delete)
- ✅ Restaurar cliente excluído
- ✅ Estatísticas dos clientes

### Campos do Cliente
- Nome (obrigatório)
- Email (obrigatório, único)
- Telefone (obrigatório)
- Endereço (opcional)
- Cidade (opcional)
- Estado (opcional)
- CEP (opcional)
- Data de Nascimento (opcional)
- Status (ativo/inativo)

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Jest** - Framework de testes
- **Supertest** - Testes de API
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Controle de taxa de requisições
- **HTML/CSS/JavaScript** - Interface web moderna e responsiva

## 🌐 Interface Web

A aplicação inclui uma interface web completa e moderna para gerenciar clientes:

### **Recursos da Interface:**
- 📊 **Dashboard** com estatísticas em tempo real
- 📋 **Tabela responsiva** com listagem de clientes
- 🔍 **Filtros** por nome e status
- 📄 **Paginação** para grandes volumes de dados
- ➕ **Formulários** para adicionar/editar clientes
- 👁️ **Visualização** detalhada de clientes
- 🗑️ **Exclusão/Restauração** de clientes
- 📱 **Design responsivo** para mobile e desktop
- 🎨 **Interface moderna** com animações e feedback visual

### **Acessar a Interface:**
Após iniciar a aplicação, acesse: **http://localhost:3000**

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd cadastro-clientes-nodejs
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
NODE_ENV=development
PORT=3000
DB_PATH=./database/clientes.db
```

4. **Execute a aplicação**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

5. **Acesse a aplicação**
- **Interface Web**: http://localhost:3000
- **API**: http://localhost:3000/api

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/clientes` | Listar todos os clientes |
| GET | `/clientes/:id` | Buscar cliente por ID |
| POST | `/clientes` | Criar novo cliente |
| PUT | `/clientes/:id` | Atualizar cliente |
| DELETE | `/clientes/:id` | Excluir cliente |
| PATCH | `/clientes/:id/restaurar` | Restaurar cliente |
| GET | `/clientes/estatisticas` | Obter estatísticas |

### Health Check
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da API |

## 📝 Exemplos de Uso

### Criar Cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "endereco": "Rua das Flores, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234567",
    "dataNascimento": "1990-01-01"
  }'
```

### Listar Clientes
```bash
curl http://localhost:3000/api/clientes?page=1&limit=10
```

### Buscar Cliente
```bash
curl http://localhost:3000/api/clientes/1
```

### Atualizar Cliente
```bash
curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Santos",
    "telefone": "11777777777"
  }'
```

### Excluir Cliente
```bash
curl -X DELETE http://localhost:3000/api/clientes/1
```

## 🏗️ Estrutura do Projeto

```
src/
├── config/
│   └── database.js          # Configuração do banco de dados
├── controllers/
│   └── clienteController.js # Controller dos clientes
├── models/
│   └── Cliente.js          # Modelo do cliente
├── routes/
│   ├── index.js            # Rotas principais
│   └── clienteRoutes.js    # Rotas dos clientes
├── tests/
│   ├── setup.js            # Configuração dos testes
│   ├── models/
│   │   └── Cliente.test.js # Testes do modelo
│   ├── controllers/
│   │   └── clienteController.test.js # Testes do controller
│   └── routes/
│       └── clienteRoutes.test.js # Testes das rotas
└── app.js                  # Aplicação principal
```

## 🔒 Segurança

- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: Máximo 100 requisições por 15 minutos por IP
- **CORS**: Configurado para desenvolvimento
- **Validação**: Validação rigorosa de dados de entrada
- **Sanitização**: Proteção contra injeção SQL via Sequelize

## 📊 Validações

### Cliente
- **Nome**: Obrigatório, 2-100 caracteres
- **Email**: Obrigatório, formato válido, único
- **Telefone**: Obrigatório, 10-20 caracteres
- **Endereço**: Opcional, máximo 200 caracteres
- **Cidade**: Opcional, máximo 100 caracteres
- **Estado**: Opcional, exatamente 2 caracteres
- **CEP**: Opcional, 8-10 caracteres
- **Data de Nascimento**: Opcional, formato de data válido

## 🚀 Scripts Disponíveis

```bash
npm start          # Iniciar aplicação
npm run dev        # Iniciar em modo desenvolvimento
npm test           # Executar testes
npm run test:watch # Executar testes em modo watch
npm run test:coverage # Executar testes com cobertura
```

## 📈 Cobertura de Testes

Os testes cobrem:
- ✅ Modelo Cliente (validações, criação, busca, atualização)
- ✅ Controller (todas as operações CRUD)
- ✅ Rotas (validação de dados, endpoints)
- ✅ Integração com banco de dados

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente
```env
NODE_ENV=development    # Ambiente de execução
PORT=3000              # Porta do servidor
DB_PATH=./database/clientes.db # Caminho do banco SQLite
```

### Banco de Dados
- **Desenvolvimento**: SQLite em arquivo
- **Testes**: SQLite em memória
- **Produção**: SQLite (configurável para outros SGBDs)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através de:
- Email: seu-email@exemplo.com
- Issues: [GitHub Issues](https://github.com/seu-usuario/cadastro-clientes-nodejs/issues)

---

Desenvolvido com ❤️ usando Node.js
