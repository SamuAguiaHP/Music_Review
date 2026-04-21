# 🎵 Music Review

O **Music Review** é uma plataforma de avaliação musical desenvolvida como projeto do processo de Trainee da **Comp Júnior (UFLA)**. O objetivo do sistema é permitir que usuários explorem álbuns e músicas, deixando notas e comentários sobre suas faixas favoritas.

---

## 🚀 Status do Projeto: Back-end Base Concluído
Atualmente, o núcleo lógico do sistema (Back-end) está totalmente funcional, com todas as rotas CRUD e relacionamentos de banco de dados implementados.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js** & **Express**: Estrutura do servidor e roteamento.
* **Prisma ORM**: Gerenciamento e modelagem do banco de dados.
* **PostgreSQL**: Banco de dados relacional.
* **Insomnia**: Testes de requisições API.
* **Git & GitHub**: Versionamento seguindo o Padrão Athena.

---

## 📋 Funcionalidades Implementadas (Back-end)

### 👤 Usuários (`Users`)
* Cadastro de usuários com nome, email e senha.
* Listagem e gerenciamento de perfis.

### 💿 Álbuns (`Albums`)
* Cadastro de álbuns (Título, Artista, Ano de Lançamento e Capa).
* Relacionamento um-para-muitos com as músicas.

### 🎸 Músicas (`Tracks`)
* Cadastro de faixas vinculadas obrigatoriamente a um álbum.
* Suporte a metadados como duração e número da faixa.

### ✍️ Avaliações (`Reviews`)
* Sistema de notas e comentários.
* Conexão entre o Usuário e a Música avaliada.

---

## 🔧 Como rodar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SamuAguiaHP/Music_Review]
   ```

2. **Acesse a pasta do servidor:**
   ```bash
   cd backend
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz da pasta `backend` e adicione sua URL de conexão com o PostgreSQL:
   ```env
   DATABASE_URL="sua_string_de_conexao_aqui"
   ```

5. **Sincronize o banco de dados:**
   ```bash
   npx prisma db push
   ```

6. **Inicie o servidor:**
   ```bash
   npm run dev
   ```
   O servidor estará rodando em: `http://localhost:3000`

---

## 🚩 Próximos Passos
- [ ] Integração com a **API do Spotify** para busca real de dados.
- [ ] Desenvolvimento do **Front-end** em React + Vite.
- [ ] Implementação de Autenticação (JWT).

---

## 👨‍💻 Autor
**Samuel**
Estudante de Ciência da Computação / Sistemas de Informação - **UFLA**
Trainee Comp Júnior 2026
```