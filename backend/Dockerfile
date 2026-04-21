# Usa uma imagem estável do Node
FROM node:20

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências e gera o client do Prisma
RUN npm install
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Expõe a porta que o seu servidor usa (definida como 3000 no server.js)
EXPOSE 3000

# Comando para rodar o servidor
CMD ["npm", "run", "dev"]