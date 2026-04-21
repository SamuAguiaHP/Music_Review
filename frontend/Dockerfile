FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# O "--host" é necessário para o Vite aceitar conexões de fora do container
CMD ["npm", "run", "dev", "--", "--host"]