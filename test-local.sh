#!/bin/bash

echo "🧪 Testando aplicação localmente antes do push..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para mostrar status
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}1. Construindo imagem Docker...${NC}"
docker build -t cadastro-clientes-test .
show_status $? "Imagem construída com sucesso"

echo -e "${YELLOW}2. Executando testes básicos...${NC}"
docker run --rm cadastro-clientes-test npm test
show_status $? "Testes básicos passaram"

echo -e "${YELLOW}3. Verificando se a aplicação inicia...${NC}"
timeout 10s docker run --rm -p 3000:3000 cadastro-clientes-test npm start &
APP_PID=$!
sleep 5
curl -f http://localhost:3000 > /dev/null 2>&1
show_status $? "Aplicação inicia corretamente"
kill $APP_PID 2>/dev/null

echo ""
echo -e "${GREEN}🎉 Todos os testes passaram! Pode fazer push com segurança.${NC}"
