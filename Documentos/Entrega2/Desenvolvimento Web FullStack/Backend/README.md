# TechFood — Backend (Node.js + Express)

API REST do TechFood com autenticação JWT, hash de senha (bcrypt) e upload de imagens (multer).

## Stack

- Node.js + Express 4
- MySQL 8 (via `mysql2/promise`)
- JWT (`jsonwebtoken`) + denylist em memória para logout
- Bcrypt (hash de senhas)
- Multer (upload de fotos de perfil)

## Pré-requisitos

- Node.js 18+
- MySQL Server rodando local (porta 3306)

## Como rodar

### 1. Criar o banco

No MySQL Workbench, execute o arquivo `BD projeto.sql`:

```sql
SOURCE caminho/para/BD projeto.sql;
```

(Para resetar o banco entre testes, use `migrate.sql`.)

### 2. Configurar variáveis

```bash
copy .env.example .env
```

Edite `.env` com sua senha do MySQL e um `JWT_SECRET` qualquer.

### 3. Instalar e iniciar

```bash
npm install
npm run dev
```

API em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão 3000) |
| `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_DATABASE` / `DB_PORT` | Conexão MySQL |
| `JWT_SECRET` | Chave para assinar JWTs |
| `JWT_EXPIRES` | Duração do token (ex: `1h`) |

## Estrutura (MVC)

```
src/
├── server.js              ← inicializa o servidor
├── app.js                 ← Express + CORS + estáticos
├── routes.js              ← define todos os endpoints
├── db.js                  ← pool MySQL
├── uploadConfig.js        ← multer
├── controllers/
│   ├── authController.js  ← register, login, logout, forgot-password
│   └── usuarioController.js ← CRUD + profile + updateMe
├── middlewares/
│   └── authMiddleware.js  ← valida JWT
└── services/
    └── tokenService.js    ← cria/verifica/revoga JWTs
```

## Endpoints

### Públicos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cria conta (multipart, aceita campo `img`) |
| POST | `/api/auth/login` | Retorna `{token, user}` |
| POST | `/api/auth/forgot-password` | Redefine senha |
| GET | `/api/usuarios` | Lista usuários (sem senha) |
| GET | `/health` | Status do servidor |

### Protegidos (header `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/logout` | Revoga o token (denylist) |
| GET | `/api/usuarios/profile` | Perfil do usuário logado |
| PUT | `/api/usuarios/me` | Atualiza dados do próprio usuário |
| GET | `/api/usuarios/:id` | Busca usuário |
| POST | `/api/usuarios` | Cria usuário (admin) |
| PUT | `/api/usuarios/:id` | Atualiza usuário |
| DELETE | `/api/usuarios/:id` | Remove usuário |

## Imagens

- Salvas em `uploads/` (criada automaticamente)
- Servidas em `http://localhost:3000/uploads/<nome-arquivo>`
- Limite: 2 MB · Formatos: jpeg, jpg, png, gif, webp
