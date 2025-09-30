# 🚀 Guia de Instalação e Execução

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** (geralmente vem com o Node.js)

Para verificar se estão instalados:
```bash
node --version
npm --version
```

## 📦 Instalação Passo a Passo

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas configurações
# (opcional - os valores padrão já funcionam)
```

### 3. Criar Diretório do Banco de Dados
```bash
mkdir database
```

### 4. Popular o Banco com Dados de Exemplo (Opcional)
```bash
npm run seed
```

## 🏃‍♂️ Executando a Aplicação

### Modo Desenvolvimento (Recomendado)
```bash
npm run dev
```
- A aplicação será reiniciada automaticamente quando você modificar arquivos
- Logs detalhados no console

### Modo Produção
```bash
npm start
```

## 🧪 Executando os Testes

### Todos os Testes
```bash
npm test
```

### Testes com Cobertura
```bash
npm run test:coverage
```

### Testes em Modo Watch
```bash
npm run test:watch
```

## 🌐 Acessando a API

Após iniciar a aplicação, você pode acessar:

- **API Base**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health
- **Documentação**: http://localhost:3000/api (endpoints disponíveis)

## 📝 Exemplos de Uso

### Testar se a API está funcionando
```bash
curl http://localhost:3000/api/health
```

### Listar clientes
```bash
curl http://localhost:3000/api/clientes
```

### Criar um cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Usuario",
    "email": "teste@email.com",
    "telefone": "11999999999"
  }'
```

## 🔧 Solução de Problemas

### Erro: "Cannot find module"
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Port already in use"
```bash
# Mude a porta no arquivo .env
PORT=3001
```

### Erro de banco de dados
```bash
# Remova o banco e recrie
rm -rf database/
mkdir database/
npm run seed
```

### Testes falhando
```bash
# Limpe o cache do Jest
npx jest --clearCache
npm test
```

## 📊 Verificando a Instalação

### 1. Teste a API
```bash
curl http://localhost:3000/api/health
```
Deve retornar:
```json
{
  "success": true,
  "message": "API funcionando corretamente",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Execute os Testes
```bash
npm test
```
Todos os testes devem passar ✅

### 3. Verifique a Cobertura
```bash
npm run test:coverage
```
Deve mostrar cobertura acima de 90%

## 🎯 Próximos Passos

1. **Explore a API**: Use os endpoints documentados no README.md
2. **Execute os Testes**: Verifique se tudo está funcionando
3. **Personalize**: Modifique conforme suas necessidades
4. **Deploy**: Configure para produção quando necessário

## 📞 Suporte

Se encontrar problemas:

1. Verifique se seguiu todos os passos
2. Consulte a seção de solução de problemas
3. Verifique os logs no console
4. Execute os testes para identificar problemas específicos

---

**🎉 Parabéns! Sua aplicação está pronta para uso!**
