# ⚡ Execução Rápida - Sistema de Clientes

## 🚀 Iniciar a Aplicação (3 passos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor
```bash
npm run dev
```

### 3. Acessar Interface
Abra o navegador em: **http://localhost:3000**

## 🧪 Executar Testes (1 comando)

```bash
npm test
```

**Resultado esperado:** ✅ 45 testes passando

## 📊 Verificar Cobertura de Testes

```bash
npm run test:coverage
```

**Meta:** Cobertura > 90%

## 🌱 Popular Banco com Dados de Exemplo

```bash
npm run seed
```

## 📱 Interface Web - Recursos

### **Dashboard**
- Estatísticas em tempo real
- Contadores de clientes ativos/inativos

### **Gerenciamento**
- ➕ Adicionar novos clientes
- ✏️ Editar clientes existentes
- 👁️ Visualizar detalhes
- 🗑️ Excluir/Restaurar clientes

### **Filtros e Busca**
- 🔍 Filtrar por nome
- 📊 Filtrar por status (ativo/inativo)
- 📄 Paginação automática

### **Design**
- 📱 Totalmente responsivo
- 🎨 Interface moderna
- ⚡ Animações suaves
- 🔔 Notificações em tempo real

## 🔧 Comandos Úteis

```bash
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start

# Testes em modo watch
npm run test:watch

# Limpar e reinstalar dependências
rm -rf node_modules package-lock.json && npm install
```

## 🌐 URLs Importantes

- **Interface Web**: http://localhost:3000
- **API Base**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health
- **Documentação API**: http://localhost:3000/api

## ✅ Verificação Rápida

1. **Servidor iniciou?** ✅ Console mostra "Servidor rodando na porta 3000"
2. **Interface carrega?** ✅ http://localhost:3000 abre sem erro
3. **Testes passam?** ✅ `npm test` retorna 45 testes passando
4. **API funciona?** ✅ http://localhost:3000/api/health retorna sucesso

## 🆘 Problemas Comuns

### **Erro: "Cannot find module"**
```bash
npm install
```

### **Erro: "Port already in use"**
Mude a porta no arquivo `.env`:
```
PORT=3001
```

### **Testes falhando**
```bash
npx jest --clearCache
npm test
```

### **Interface não carrega**
Verifique se o servidor está rodando e acesse: http://localhost:3000

---

**🎉 Pronto! Sua aplicação está funcionando perfeitamente!**
