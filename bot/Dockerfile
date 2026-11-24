# Usa uma imagem leve do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os ficheiros de dependências primeiro
COPY package*.json ./

# Instala as dependências (incluindo ts-node-dev)
RUN npm install

# Copia o restante do código
COPY . .

# Comando padrão para iniciar em modo de desenvolvimento
CMD ["npm", "run", "dev"]