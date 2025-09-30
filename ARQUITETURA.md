# 🏗️ Arquitetura da Aplicação

## Visão Geral

A aplicação segue o padrão **MVC (Model-View-Controller)** com uma arquitetura em camadas bem definida, proporcionando separação de responsabilidades e facilitando manutenção e testes.

## 📁 Estrutura de Diretórios

```
src/
├── config/           # Configurações da aplicação
│   └── database.js   # Configuração do banco de dados
├── controllers/      # Lógica de negócio e controle
│   └── clienteController.js
├── models/          # Modelos de dados (ORM)
│   └── Cliente.js
├── routes/          # Definição das rotas da API
│   ├── index.js     # Rotas principais
│   └── clienteRoutes.js
├── tests/           # Testes automatizados
│   ├── setup.js     # Configuração dos testes
│   ├── models/      # Testes dos modelos
│   ├── controllers/ # Testes dos controllers
│   └── routes/      # Testes das rotas
├── scripts/         # Scripts utilitários
│   └── seed.js      # População do banco
└── app.js           # Aplicação principal
```

## 🔄 Fluxo de Dados (MVC)

```
Cliente (Frontend/API) 
    ↓ HTTP Request
Routes (src/routes/)
    ↓ Validação + Roteamento
Controllers (src/controllers/)
    ↓ Lógica de Negócio
Models (src/models/)
    ↓ ORM (Sequelize)
Database (SQLite)
    ↓ Response
Models → Controllers → Routes → Cliente
```

## 🧩 Componentes Principais

### 1. **Models (Modelo)**
- **Responsabilidade**: Definição da estrutura de dados e validações
- **Localização**: `src/models/`
- **Tecnologia**: Sequelize ORM
- **Funcionalidades**:
  - Definição de esquemas de dados
  - Validações de entrada
  - Relacionamentos entre entidades
  - Métodos de consulta personalizados

### 2. **Controllers (Controlador)**
- **Responsabilidade**: Lógica de negócio e controle de fluxo
- **Localização**: `src/controllers/`
- **Funcionalidades**:
  - Processamento de requisições
  - Validação de dados
  - Interação com modelos
  - Formatação de respostas
  - Tratamento de erros

### 3. **Routes (Visualização/API)**
- **Responsabilidade**: Definição de endpoints e roteamento
- **Localização**: `src/routes/`
- **Funcionalidades**:
  - Mapeamento de URLs
  - Middlewares de validação
  - Controle de acesso
  - Documentação de endpoints

## 🔧 Camadas de Infraestrutura

### **Configuração**
- **Database**: Configuração do Sequelize e SQLite
- **Environment**: Variáveis de ambiente
- **Security**: Middlewares de segurança

### **Middleware Stack**
```
Request → Helmet → CORS → Rate Limiting → JSON Parser → Routes → Error Handler → Response
```

### **Segurança**
- **Helmet**: Headers de segurança HTTP
- **CORS**: Controle de origem cruzada
- **Rate Limiting**: Proteção contra spam
- **Input Validation**: Validação rigorosa de dados

## 🗄️ Camada de Dados

### **Banco de Dados**
- **Tipo**: SQLite (desenvolvimento/testes)
- **ORM**: Sequelize
- **Migrações**: Automáticas via sync()
- **Backup**: Arquivo .db

### **Modelo de Dados**
```sql
clientes (
  id INTEGER PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  endereco VARCHAR(200),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  data_nascimento DATE,
  ativo BOOLEAN DEFAULT true,
  created_at DATETIME,
  updated_at DATETIME
)
```

## 🧪 Camada de Testes

### **Estratégia de Testes**
- **Unit Tests**: Modelos e controllers isolados
- **Integration Tests**: Rotas e API endpoints
- **Test Database**: SQLite em memória
- **Coverage**: Cobertura > 90%

### **Estrutura de Testes**
```
tests/
├── setup.js              # Configuração global
├── models/Cliente.test.js # Testes do modelo
├── controllers/           # Testes dos controllers
└── routes/               # Testes das rotas
```

## 🚀 Padrões de Design

### **1. Repository Pattern**
- Abstração da camada de dados
- Facilita testes e manutenção
- Implementado via Sequelize

### **2. Middleware Pattern**
- Processamento em pipeline
- Reutilização de código
- Separação de responsabilidades

### **3. Error Handling**
- Tratamento centralizado de erros
- Logs estruturados
- Respostas padronizadas

### **4. Validation Pattern**
- Validação em múltiplas camadas
- Middleware de validação
- Validação no modelo

## 📊 Fluxo de Requisição Completo

```
1. Cliente faz requisição HTTP
   ↓
2. Express recebe requisição
   ↓
3. Middlewares de segurança (Helmet, CORS, Rate Limiting)
   ↓
4. Parser de JSON
   ↓
5. Router identifica endpoint
   ↓
6. Middleware de validação (se aplicável)
   ↓
7. Controller processa requisição
   ↓
8. Model interage com banco de dados
   ↓
9. Controller formata resposta
   ↓
10. Router retorna resposta
    ↓
11. Middleware de tratamento de erros (se necessário)
    ↓
12. Cliente recebe resposta HTTP
```

## 🔄 Ciclo de Desenvolvimento

### **Desenvolvimento**
1. Modificar modelo (se necessário)
2. Atualizar controller
3. Ajustar rotas
4. Testar localmente
5. Executar testes

### **Testes**
1. Testes unitários (modelos)
2. Testes de integração (controllers)
3. Testes de API (rotas)
4. Verificação de cobertura

### **Deploy**
1. Validação de ambiente
2. Migração de banco
3. Inicialização da aplicação
4. Health check

## 🎯 Benefícios da Arquitetura

### **Manutenibilidade**
- Código organizado e modular
- Separação clara de responsabilidades
- Fácil localização de funcionalidades

### **Testabilidade**
- Componentes isolados
- Mocks e stubs facilitados
- Cobertura de testes abrangente

### **Escalabilidade**
- Arquitetura preparada para crescimento
- Fácil adição de novos recursos
- Padrões bem definidos

### **Segurança**
- Múltiplas camadas de proteção
- Validação rigorosa
- Logs e monitoramento

---

Esta arquitetura garante uma base sólida para o desenvolvimento e manutenção da aplicação, seguindo as melhores práticas da indústria.
