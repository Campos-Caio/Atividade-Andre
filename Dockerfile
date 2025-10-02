# Use a imagem oficial do Node.js 14 (mesma versão do CI)
FROM node:14-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código fonte
COPY . .

# Criar diretório para o banco de dados
RUN mkdir -p database

# Expor a porta que a aplicação usa
EXPOSE 3000

# Comando para executar os testes
CMD ["npm", "test"]
