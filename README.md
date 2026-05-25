<h1 align="center" style="font-weight: bold;">Music Review 🎧</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Spotify-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify">
</p>

O **Music Review** é uma plataforma full-stack de avaliação musical desenvolvida como projeto final do processo de Trainee da **Comp Júnior (UFLA)**. O objetivo do sistema é permitir que os usuários explorem álbuns através de dados reais do Spotify, salvando suas obras favoritas em uma biblioteca privada e deixando notas e análises detalhadas.

---

## 🚀 Status do Projeto: Concluido
O sistema conta com um fluxo completo e seguro de autenticação, e a integração ponta-a-ponta (Front-end ↔ Back-end ↔ Banco de Dados ↔ API do Spotify) está totalmente funcional. Os usuários já podem criar as suas bibliotecas musicais privadas, salvando e removendo álbuns e reviews de forma dinâmica.

---

## 🛠️ Tecnologias Utilizadas

### Front-end (UI/UX)
* **React + Vite**: Construção rápida e modular da interface.
* **React Router DOM**: Navegação fluida entre páginas (SPA).
* **Bootstrap & CSS**: Estilização responsiva com efeitos visuais avançados.
* **Axios**: Consumo da API interna e externa com interceptação de tokens.

### Back-end & Infraestrutura
* **Node.js & Express**: Estrutura robusta do servidor e roteamento.
* **Prisma ORM**: Gerenciamento, migrações e modelagem avançada do banco de dados relacional.
* **PostgreSQL (Docker)**: Banco de dados relacional conteinerizado.
* **JWT & Bcrypt**: Autenticação de rotas privadas e criptografia de senhas.
* **Nodemailer + Mailtrap**: Motor de disparo de e-mails transacionais.

---

## 📋 Funcionalidades Implementadas

### 🔒 Segurança & Autenticação
* Sistema de Registro e Login com validação de dados.
* Autenticação via **JWT** (JSON Web Token) protegendo rotas privadas no backend.
* Funcionalidade **"Lembrar de Mim"** gerenciando sessões no `localStorage` e `sessionStorage`.
* Fluxo completo de **Recuperação de Senha** com envio de e-mail automatizado.
* **Níveis de Acesso**: Rotas protegidas diferenciando usuários `STANDARD` de `ADMIN`.

### 💿 Biblioteca Privada & Integração Spotify
* Busca de álbuns em tempo real utilizando a **API oficial do Spotify**.
* **Biblioteca Isolada por Usuário:** O banco de dados relaciona os álbuns salvos especificamente ao usuário logado, garantindo total privacidade.
* **Atualização Otimista (UI):** Salvamento e exclusão dinâmica de álbuns na interface, alternando estados e removendo itens da tela instantaneamente sem necessidade de recarregar a página.
* Prevenção de duplicatas arquitetada diretamente no banco de dados.
* **Gestão de Reviews**: CRUD completo para que usuários possam registrar, editar e excluir suas avaliações.

---

## 🔧 Como rodar o projeto localmente

### 1. Preparando o Back-end
```bash
# Clone o repositório
git clone [https://github.com/SamuAguiaHP/Music_Review.git](https://github.com/SamuAguiaHP/Music_Review.git)

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
# Inicie os containers (PostgreSQL + Servidor Node) via Docker
docker-compose up -d

# Sincronize as tabelas do Prisma com o banco
docker-compose exec backend npx prisma migrate dev

# (Caso rode o Node localmente sem Docker, use apenas `npm run dev`)
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

## 📋 Documentação da API (Endpoints)

| Método | Endpoint | Descrição | Acesso |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Cria novo usuário | Público |
| `POST` | `/auth/login` | Login e geração de JWT | Público |
| `DELETE` | `/users/:id` | Exclusão de usuário | ADMIN |
| `GET` | `/users` | Listar Usuários | ADMIN |
| `GET` | `/spotify/search` | Busca na API do Spotify | Autenticado |
| `DELETE` | `/reviews` | Exclusão de avaliação | Autenticado |
| `GET` | `/reviews` | Listar avaliação | Autenticado |
| `POST` | `/reviews` | Criação de avaliação | Autenticado |
| `DELETE` | `/albums/:id` | Exclusão de álbum | Autenticado |
| `GET` | `/albums` | Listar álbuns | Autenticado |
| `POST` | `/albums` | Salvar álbum | Autenticado |

---

## 👨‍💻 Autor
**Samuel Aguiar Guimarães**  
Ciência da Computação - **UFLA**  
Trainee Comp Júnior
