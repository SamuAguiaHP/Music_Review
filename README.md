<h1 align="center" style="font-weight: bold;">Music Review 🎧</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify">
</p>

O **Music Review** é uma plataforma full-stack de avaliação musical desenvolvida como projeto final do processo de Trainee da **Comp Júnior (UFLA)**. O objetivo do sistema é permitir que os usuários explorem álbuns através de dados reais do Spotify, salvando suas faixas favoritas e deixando notas e análises detalhadas.

---

## 🚀 Status do Projeto: Autenticação & Integração API Concluídas
O sistema já conta com um fluxo completo e seguro de autenticação de utilizadores, incluindo recuperação de senha via e-mail e persistência de sessão. A integração ponta-a-ponta (Front-end ↔ Back-end ↔ Banco de Dados ↔ API do Spotify) está totalmente funcional.

---

## 🛠️ Tecnologias Utilizadas

### Front-end (UI/UX)
* **React + Vite**: Construção rápida e modular da interface.
* **React Router DOM**: Navegação fluida entre páginas (SPA).
* **Bootstrap & CSS**: Estilização responsiva.
* **Axios**: Consumo da API interna e externa.

### Back-end & Infraestrutura
* **Node.js & Express**: Estrutura robusta do servidor e roteamento.
* **Prisma ORM**: Gerenciamento, migrações e modelagem do banco de dados.
* **PostgreSQL (Docker)**: Banco de dados relacional conteinerizado.
* **JWT & Bcrypt**: Autenticação de rotas e criptografia de senhas.
* **Nodemailer + Mailtrap**: Motor de disparo de e-mails transacionais.

---

## 📋 Funcionalidades Implementadas

### 🔒 Segurança & Autenticação
* Sistema de Registro e Login com validação de dados.
* Autenticação via **JWT** (JSON Web Token) com criptografia de senhas (Bcrypt).
* Funcionalidade **"Lembrar de Mim"** gerenciando sessões no `localStorage` e `sessionStorage`.
* Fluxo completo de **Recuperação de Senha** com envio de e-mail automatizado.

### 💿 Álbuns & Integração
* Busca de álbuns em tempo real utilizando a **API oficial do Spotify**.
* Salvamento automático de Álbuns e Músicas no banco de dados local (PostgreSQL) garantindo persistência estruturada.
* Relacionamento seguro entre a base de dados do sistema e os identificadores (`id_spotify`) da plataforma externa.

---

## 🔧 Como rodar o projeto localmente

### 1. Preparando o Back-end
```bash
# Clone o repositório
git clone [https://github.com/SamuAguiaHP/Music_Review.git]

# Acesse a pasta do back-end
cd Music_Review/backend

# Instale as dependências
npm install
```

Crie um ficheiro `.env` na pasta `backend` com as seguintes variáveis:
```env
DATABASE_URL="postgresql://user:password@localhost:5433/music_review_db?schema=public"
JWT_SECRET="sua_chave_secreta"
SPOTIFY_CLIENT_ID="seu_client_id_do_spotify"
SPOTIFY_CLIENT_SECRET="seu_client_secret_do_spotify"
MAIL_HOST="sandbox.smtp.mailtrap.io"
MAIL_PORT=2525
MAIL_USER="seu_user_mailtrap"
MAIL_PASS="sua_senha_mailtrap"
```

Suba o Banco de Dados e o Servidor:
```bash
# Inicie o container do PostgreSQL via Docker
docker-compose up -d

# Sincronize as tabelas do Prisma
npx prisma migrate dev

# Inicie o servidor Node.js
npm run dev
```

### 2. Preparando o Front-end
Abra um **novo terminal** e acesse a pasta do front-end:
```bash
cd Music_Review/frontend

# Instale as dependências
npm install

# Inicie o servidor Vite
npm run dev
```
Acesse a aplicação no navegador através de: `http://localhost:5173`

---

## 🚩 Próximos Passos
- [x] Integração com a **API do Spotify** para busca real de dados.
- [x] Desenvolvimento do **Front-end** em React + Vite (Layout Base & Responsividade).
- [x] Implementação de Autenticação completa (JWT + Recuperação de Senha).
- [ ] Desenvolvimento do **CRUD de Reviews** (Dar notas e comentar os álbuns salvos).
- [ ] Implementação de Testes Automatizados (Jest/SuperTest).
- [ ] Gravação do vídeo final de demonstração.

---

## 👨‍💻 Autor
**Samuel** Estudante de Ciência da Computação / Sistemas de Informação - **UFLA** Trainee Comp Júnior 2026
```