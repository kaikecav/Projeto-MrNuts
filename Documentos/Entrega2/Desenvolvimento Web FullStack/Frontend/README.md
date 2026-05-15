# TechFood — Frontend (React + Vite)

Interface web do TechFood. Consome a API REST do `Backend/` com autenticação JWT.

## Stack

- React 19 + Vite
- React Router DOM (rotas)
- Axios (HTTP, com interceptor de token)
- TailwindCSS (estilo)
- Context API (auth + toasts)

## Pré-requisitos

- Node.js 18+
- O **Backend** rodando em `http://localhost:3000`

## Como rodar

```bash
npm install
copy .env.example .env   # ou cp em Linux/Mac
npm run dev
```

App em `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API | `http://localhost:3000/api` |
| `VITE_UPLOADS_URL` | URL para imagens estáticas | `http://localhost:3000` |

## Estrutura

```
src/
├── api/
│   ├── client.js          axios + interceptor de token
│   ├── authApi.js         login, registro, perfil
│   └── usuariosApi.js     CRUD de usuários
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   └── Avatar.jsx
├── contexts/
│   ├── AuthContext.jsx    sessão (token + usuário)
│   └── ToastContext.jsx   notificações de sucesso/erro
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── UsuariosPage.jsx
│   ├── UsuarioFormPage.jsx
│   └── PerfilPage.jsx
├── App.jsx                React Router
└── main.jsx
```

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/login` | público | Tela de login |
| `/registro` | público | Criar conta |
| `/usuarios` | privado | Lista + ações |
| `/usuarios/novo` | privado | Criar usuário |
| `/usuarios/:id/editar` | privado | Editar usuário |
| `/perfil` | privado | Perfil do usuário logado |

## Fluxo de autenticação

1. `LoginPage` chama `POST /auth/login` → recebe `{token, user}`
2. `AuthContext` salva no `localStorage` e no estado
3. `client.js` injeta `Authorization: Bearer <token>` em toda request
4. Se a API retornar 401/403, o interceptor limpa a sessão e manda pra `/login`
