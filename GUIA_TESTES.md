
# 🧪 Guia Completo de Execução dos Testes

Este guia te ajudará a executar todos os testes da aplicação e verificar se tudo está funcionando corretamente.

## 📋 Pré-requisitos

Antes de executar os testes, certifique-se de que:

1. **Node.js** está instalado (versão 16 ou superior)
2. **npm** está funcionando
3. As **dependências** estão instaladas:
   ```bash
   npm install
   ```

## 🚀 Como Executar os Testes

### 1. **Executar Todos os Testes**
```bash
npm test
```
Este comando executa todos os testes e mostra um resumo dos resultados.

### 2. **Executar Testes com Cobertura**
```bash
npm run test:coverage
```
Este comando executa os testes e gera um relatório de cobertura de código.

### 3. **Executar Testes em Modo Watch**
```bash
npm run test:watch
```
Este comando executa os testes e fica observando mudanças nos arquivos, re-executando automaticamente quando você modificar o código.

## 📊 Tipos de Testes Implementados

### **1. Testes do Modelo Cliente** (`src/tests/models/Cliente.test.js`)

**O que testa:**
- ✅ Criação de clientes com dados válidos
- ✅ Validações de campos obrigatórios
- ✅ Validações de formato (email, telefone, etc.)
- ✅ Validação de email único
- ✅ Busca de clientes
- ✅ Atualização de clientes
- ✅ Soft delete (desativação)

**Exemplo de saída esperada:**
```
✓ deve criar um cliente com dados válidos
✓ deve falhar ao criar cliente sem nome
✓ deve falhar ao criar cliente sem email
✓ deve falhar ao criar cliente com email inválido
✓ deve falhar ao criar cliente com nome muito curto
✓ deve falhar ao criar cliente com telefone muito curto
✓ deve falhar ao criar cliente com email duplicado
✓ deve buscar todos os clientes
✓ deve buscar cliente por ID
✓ deve buscar cliente por email
✓ deve atualizar dados do cliente
✓ deve desativar cliente
```

### **2. Testes do Controller** (`src/tests/controllers/clienteController.test.js`)

**O que testa:**
- ✅ Endpoints da API REST
- ✅ Criação de clientes via API
- ✅ Listagem com paginação
- ✅ Busca por ID
- ✅ Atualização de clientes
- ✅ Exclusão (soft delete)
- ✅ Tratamento de erros
- ✅ Validações de entrada

**Exemplo de saída esperada:**
```
✓ deve criar um cliente com dados válidos
✓ deve falhar ao criar cliente com email duplicado
✓ deve falhar ao criar cliente com dados inválidos
✓ deve listar todos os clientes
✓ deve listar clientes com paginação
✓ deve buscar cliente por ID
✓ deve retornar 404 para cliente não encontrado
✓ deve atualizar cliente
✓ deve retornar 404 para cliente não encontrado
✓ deve excluir cliente (soft delete)
✓ deve retornar 404 para cliente não encontrado
✓ deve retornar estatísticas dos clientes
```

### **3. Testes das Rotas** (`src/tests/routes/clienteRoutes.test.js`)

**O que testa:**
- ✅ Validação de dados de entrada
- ✅ Middlewares de validação
- ✅ Rotas GET, POST, PUT, DELETE, PATCH
- ✅ Tratamento de erros de validação
- ✅ Formato de respostas

**Exemplo de saída esperada:**
```
✓ deve rejeitar requisição sem nome
✓ deve rejeitar requisição sem email
✓ deve rejeitar requisição sem telefone
✓ deve rejeitar email com formato inválido
✓ GET /api/clientes deve retornar lista de clientes
✓ GET /api/clientes/estatisticas deve retornar estatísticas
✓ GET /api/clientes/:id deve retornar cliente específico
✓ POST /api/clientes deve criar novo cliente
✓ PUT /api/clientes/:id deve atualizar cliente
✓ DELETE /api/clientes/:id deve excluir cliente
✓ PATCH /api/clientes/:id/restaurar deve restaurar cliente
```

## 📈 Interpretando os Resultados

### **Saída de Sucesso:**
```
PASS src/tests/models/Cliente.test.js
PASS src/tests/controllers/clienteController.test.js
PASS src/tests/routes/clienteRoutes.test.js

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        2.156 s
```

### **Saída com Cobertura:**
```
PASS src/tests/models/Cliente.test.js
PASS src/tests/controllers/clienteController.test.js
PASS src/tests/routes/clienteRoutes.test.js

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        2.156 s

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |   95.2  |   90.0   |   100   |   95.0  |
----------|---------|----------|---------|---------|-------------------
```

## 🔧 Solução de Problemas Comuns

### **Erro: "Cannot find module"**
```bash
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### **Erro: "Database connection failed"**
```bash
# Solução: Os testes usam banco em memória, não deveria dar erro
# Se der erro, limpe o cache do Jest
npx jest --clearCache
```

### **Testes falhando com timeout**
```bash
# Solução: Aumentar timeout (já configurado para 30s)
# Verifique se não há processos bloqueando a porta
```

### **Erro de permissão no Windows**
```bash
# Solução: Execute o PowerShell como administrador
# Ou use o Git Bash
```

## 🎯 Verificações Específicas

### **1. Verificar se o banco de dados está funcionando:**
```bash
npm test -- --testNamePattern="deve criar um cliente com dados válidos"
```

### **2. Verificar se a API está funcionando:**
```bash
npm test -- --testNamePattern="deve criar um cliente com dados válidos"
```

### **3. Verificar se as validações estão funcionando:**
```bash
npm test -- --testNamePattern="deve falhar ao criar cliente"
```

### **4. Verificar se a paginação está funcionando:**
```bash
npm test -- --testNamePattern="deve listar clientes com paginação"
```

## 📊 Relatório de Cobertura

Após executar `npm run test:coverage`, você pode:

1. **Ver o relatório no terminal** - Mostra estatísticas resumidas
2. **Abrir o relatório HTML** - Navegue até a pasta `coverage/lcov-report/index.html` e abra no navegador
3. **Verificar arquivos específicos** - O relatório mostra quais linhas não estão cobertas

### **Meta de Cobertura:**
- ✅ **Statements**: > 90%
- ✅ **Branches**: > 85%
- ✅ **Functions**: 100%
- ✅ **Lines**: > 90%

## 🚀 Executando Testes Específicos

### **Executar apenas testes do modelo:**
```bash
npm test -- src/tests/models/
```

### **Executar apenas testes do controller:**
```bash
npm test -- src/tests/controllers/
```

### **Executar apenas testes das rotas:**
```bash
npm test -- src/tests/routes/
```

### **Executar teste específico:**
```bash
npm test -- --testNamePattern="deve criar um cliente com dados válidos"
```

## 🔍 Debug de Testes

### **Executar com logs detalhados:**
```bash
npm test -- --verbose
```

### **Executar um teste por vez:**
```bash
npm test -- --runInBand
```

### **Executar com timeout maior:**
```bash
npm test -- --testTimeout=60000
```

## ✅ Checklist de Verificação

Antes de considerar os testes como "passando", verifique:

- [ ] Todos os 45 testes passaram
- [ ] Cobertura de código > 90%
- [ ] Nenhum teste está falhando
- [ ] Nenhum teste está sendo pulado (skipped)
- [ ] Tempo de execução < 10 segundos
- [ ] Não há warnings no console
- [ ] Relatório de cobertura foi gerado

## 🎉 Resultado Esperado

Se tudo estiver funcionando corretamente, você deve ver:

```
✅ 45 testes passando
✅ 0 testes falhando
✅ Cobertura > 90%
✅ Tempo de execução < 5 segundos
✅ Nenhum erro no console
```

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** - Os erros aparecem no console
2. **Execute testes individuais** - Para isolar o problema
3. **Verifique a configuração** - Jest configurado em `jest.config.js`
4. **Consulte a documentação** - README.md tem mais detalhes

---

**🎯 Objetivo:** Todos os testes devem passar com 100% de sucesso e alta cobertura de código!
