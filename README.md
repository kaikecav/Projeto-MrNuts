# FECAP - Fundação de Comércio Álvares Penteado

<p align="center">
<a href= "https://www.fecap.br/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZPrRa89Kma0ZZogxm0pi-tCn_TLKeHGVxywp-LXAFGR3B1DPouAJYHgKZGV0XTEf4AE&usqp=CAU" alt="FECAP - Fundação de Comércio Álvares Penteado" border="0"></a>
</p>

# TechFood

## Integrantes: <a href="/www.linkedin.com/in/fabrizzio-puttini">Fabrizzio Puttini</a>, <a href="https://www.linkedin.com/in/julia-valério/">Julia Valério</a>, <a href="https://www.linkedin.com/in/lr-s/">Luiz Silvestre</a>, <a href="https://www.linkedin.com/in/guilherme-belcastro-medeiros-785598281/">Guilherme Belcastro</a>, <a href="https://www.linkedin.com/in/kaike-cavalcante-7283a0266/">Kaike Cavalcante</a>

## Professores Orientadores: <a href="https://www.linkedin.com/in/francisco-escobar/">Francisco Escobar</a>, <a href="https://www.linkedin.com/in/cristina-machado-corr%C3%AAa-leite-630309160/">Cristina Machado Corrêa Leite</a>, <a href="https://www.linkedin.com/in/katia-bossi/">Katia Milani Lara Bossi</a>, <a href="https://www.linkedin.com/in/jesuslisboagomes/">Jésus Gomes</a>, <a href="https://www.linkedin.com/in/dolemes/">David de Oliveira Lemes</a>

## Descrição

<p align="center">
  <img src="./assets/img_logo_MrNuts.png" width="300">
</p>

Projeto de Marketplace para a empresa **Mr. Nuts** desenvolvido pelo grupo **TechFood**. A aplicação é fullstack, construída com **React + Vite + Tailwind CSS** no frontend e **Node.js + Express + MySQL** no backend. O projeto foca na negociação de produtos entre usuários (compradores e fornecedores), com funcionalidades de anúncios, categorias, carrinho de compras, pedidos, avaliações e autenticação JWT. Conta também com uma área para Usuários Administradores realizarem a gestão de produtos e usuários.

## 🚀 Tecnologias Utilizadas

### Frontend
- React 19
- Vite 8
- Tailwind CSS 3
- React Router DOM 7
- Axios

### Backend
- Node.js + Express 4
- MySQL 2
- JWT (jsonwebtoken)
- Bcrypt (hash de senhas)
- Multer (upload de imagens)
- UUID

## 🛠 Estrutura de Pastas

<pre>
Projeto1/
├── 📄 .gitignore
├── 📄 README.md (este arquivo)
│
└── 📂 Documentos/
    ├── 📂 Entrega1/
    │   ├── 📂 Cálculo 2/
    │   ├── 📂 Desenvolvimento_Web_FullStack/
    │   │   └── 📂 Backend/
    │   │       └── 📂 src/
    │   │           ├── 📄 db.js
    │   │           └── 📄 server.js
    │   ├── 📂 Gestão Empresarial e Dinâmicas das Organizações/
    │   ├── 📂 Projeto Interdisciplinar Programação Web/
    │   └── 📂 Projetos em Banco de Dados/
    │       ├── 📄 DER.png
    │       └── 📄 DER TechFood.mwb
    │
    └── 📂 Entrega2/
        ├── 📂 Cálculo 2/
        ├── 📂 Desenvolvimento Web FullStack/
        │   ├── � Backend/
        │   │   ├── 📂 src/
        │   │   │   ├── 📂 controllers/
        │   │   │   │   ├── 📄 authController.js
        │   │   │   │   ├── 📄 cartController.js
        │   │   │   │   ├── 📄 categoriesController.js
        │   │   │   │   ├── 📄 ordersController.js
        │   │   │   │   ├── 📄 productsController.js
        │   │   │   │   └── 📄 usuarioController.js
        │   │   │   ├── 📂 middlewares/
        │   │   │   │   └── 📄 authMiddleware.js
        │   │   │   ├── 📂 services/
        │   │   │   │   └── 📄 tokenService.js
        │   │   │   ├── 📄 app.js
        │   │   │   ├── 📄 db.js
        │   │   │   ├── 📄 routes.js
        │   │   │   ├── 📄 server.js
        │   │   │   └── � uploadConfig.js
        │   │   ├── 📂 uploads/
        │   │   ├── 📄 .env.example
        │   │   ├── 📄 BD projeto.sql
        │   │   ├── 📄 package.json
        │   │   └── 📄 README.md
        │   │
        │   └── 📂 Frontend/
        │       ├── 📂 public/
        │       ├── 📂 src/
        │       │   ├── 📂 api/
        │       │   ├── 📂 components/
        │       │   │   ├── 📄 AdminRoute.jsx
        │       │   │   ├── 📄 Avatar.jsx
        │       │   │   ├── 📄 Filters.jsx
        │       │   │   ├── 📄 Hero.jsx
        │       │   │   ├── 📄 Navbar.jsx
        │       │   │   ├── 📄 Pagination.jsx
        │       │   │   ├── 📄 ProductCard.jsx
        │       │   │   ├── 📄 ProtectedRoute.jsx
        │       │   │   └── 📄 SupplierRoute.jsx
        │       │   ├── 📂 contexts/
        │       │   ├── 📂 pages/
        │       │   │   ├── 📄 CartPage.jsx
        │       │   │   ├── 📄 CheckoutPage.jsx
        │       │   │   ├── 📄 HomePage.jsx
        │       │   │   ├── 📄 LoginPage.jsx
        │       │   │   ├── 📄 PerfilPage.jsx
        │       │   │   ├── 📄 ProductsPage.jsx
        │       │   │   ├── � PurchaseHistoryPage.jsx
        │       │   │   ├── 📄 RegisterPage.jsx
        │       │   │   ├── 📄 SupplierDashboardPage.jsx
        │       │   │   ├── 📄 UsuarioFormPage.jsx
        │       │   │   └── 📄 UsuariosPage.jsx
        │       │   ├── 📄 App.jsx
        │       │   ├── 📄 index.css
        │       │   └── 📄 main.jsx
        │       ├── 📄 .env.example
        │       ├── 📄 index.html
        │       ├── 📄 package.json
        │       ├── 📄 tailwind.config.js
        │       └── 📄 vite.config.js
        │
        ├── 📂 Gestão Empresarial e Dinâmicas das Organizações/
        ├── 📂 Projeto Interdisciplinar Programação Web/
        └── 📂 Projetos em Banco de Dados/
            ├── 📄 schema.sql
            └── 📄 README.md
</pre>

### 📝 Descrição das Pastas

- **`Documentos/Entrega2/Desenvolvimento Web FullStack/Backend/`** — API REST com autenticação JWT, upload de imagens e CRUD completo.
- **`Documentos/Entrega2/Desenvolvimento Web FullStack/Frontend/`** — SPA em React com rotas protegidas, carrinho e dashboard de fornecedor.
- **`Documentos/Entrega2/Projetos em Banco de Dados/`** — Schema SQL atualizado e documentação do banco.
- **`Documentos/Entrega1/`** — Primeira entrega do projeto (CRUD básico, DER inicial, documentações).

## 🗄 Banco de Dados

> 📄 Documentação completa do banco de dados: [`Documentos/Entrega2/Projetos em Banco de Dados/README.md`](Documentos/Entrega2/Projetos%20em%20Banco%20de%20Dados/README.md)
>
> 📄 Script SQL de criação: [`Documentos/Entrega2/Projetos em Banco de Dados/schema.sql`](Documentos/Entrega2/Projetos%20em%20Banco%20de%20Dados/schema.sql)

O banco **techfood** (MySQL) possui as seguintes tabelas:

| Tabela | Descrição |
|--------|-----------|
| `usuario` | Dados base de todos os usuários (nome, email, senha hash, foto, tipo) |
| `administrador` | Extensão para admins (nível de acesso) |
| `comprador` | Extensão para compradores (CPF, CEP) |
| `fornecedor` | Extensão para fornecedores (CNPJ, nome fantasia, descrição) |
| `categoriaProduto` | Categorias dos produtos (Nozes, Castanhas, Amêndoas, etc.) |
| `anuncio` | Anúncios de produtos dos fornecedores (título, preço, estoque) |
| `avaliacao` | Avaliações dos compradores sobre anúncios (nota 1-5, comentário) |

**Tipos de Usuário:** 1 = Administrador, 2 = Comprador, 3 = Fornecedor

## 🔌 Rotas da API

### Autenticação
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/auth/register` | Registrar novo usuário (com upload de foto) | ❌ |
| `POST` | `/api/auth/login` | Login (retorna token JWT) | ❌ |
| `POST` | `/api/auth/forgot-password` | Recuperação de senha | ❌ |
| `POST` | `/api/auth/logout` | Logout | ✅ |

### Usuários
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/usuarios` | Listar todos os usuários | ❌ |
| `GET` | `/api/usuarios/profile` | Perfil do usuário logado | ✅ |
| `GET` | `/api/usuarios/:id` | Buscar usuário por ID | ✅ |
| `POST` | `/api/usuarios` | Criar usuário | ✅ |
| `PUT` | `/api/usuarios/me` | Atualizar próprio perfil | ✅ |
| `PUT` | `/api/usuarios/:id` | Atualizar usuário por ID | ✅ |
| `DELETE` | `/api/usuarios/:id` | Deletar usuário | ✅ |

### Produtos
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/produtos` | Listar todos os produtos | ❌ |
| `GET` | `/api/produtos/:id` | Buscar produto por ID | ❌ |
| `POST` | `/api/produtos` | Criar produto (com imagem) | ✅ |
| `PUT` | `/api/produtos/:id` | Atualizar produto | ✅ |
| `DELETE` | `/api/produtos/:id` | Deletar produto | ✅ |

### Categorias
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/categorias` | Listar categorias | ❌ |
| `POST` | `/api/categorias` | Criar categoria | ✅ |

### Carrinho
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/carrinho` | Ver carrinho do usuário | ✅ |
| `POST` | `/api/carrinho` | Adicionar item ao carrinho | ✅ |
| `PUT` | `/api/carrinho/:idCarrinho` | Atualizar quantidade | ✅ |
| `DELETE` | `/api/carrinho/:idCarrinho` | Remover item | ✅ |
| `DELETE` | `/api/carrinho` | Limpar carrinho | ✅ |

### Pedidos
| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/api/pedidos` | Listar pedidos do usuário | ✅ |
| `GET` | `/api/pedidos/:id` | Detalhes de um pedido | ✅ |
| `POST` | `/api/pedidos` | Criar pedido (checkout) | ✅ |
| `PUT` | `/api/pedidos/:id/status` | Atualizar status do pedido | ✅ |

## 💻 Configuração para Desenvolvimento

### Pré-requisitos

- <a href="https://nodejs.org/">Node.js</a> (v18 ou superior)
- <a href="https://dev.mysql.com/downloads/installer/">MySQL Server</a> (v8.0 ou superior)

### Instalação do Backend

1. Clone o repositório:

```sh
git clone https://github.com/2026-1-MCC2/Projeto1
```

2. Acesse a pasta do Backend (Entrega 2):

```sh
cd Documentos/Entrega2/Desenvolvimento\ Web\ FullStack/Backend
```

3. Instale as dependências:

```sh
npm install
```

4. Crie o banco de dados no MySQL executando o script:

```sql
-- Execute o arquivo BD projeto.sql no MySQL Workbench ou terminal
source BD\ projeto.sql
```

5. Crie o arquivo `.env` baseado no `.env.example`:

```sh
cp .env.example .env
```

6. Edite o `.env` com suas credenciais:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_DATABASE=techfood
DB_PORT=3306
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES=1h
```

7. Inicie o servidor:

```sh
npm run dev
```

O backend estará rodando em `http://localhost:3000`.

### Instalação do Frontend

1. Acesse a pasta do Frontend:

```sh
cd Documentos/Entrega2/Desenvolvimento\ Web\ FullStack/Frontend
```

2. Instale as dependências:

```sh
npm install
```

3. Crie o arquivo `.env`:

```sh
cp .env.example .env
```

4. Verifique as variáveis:

```
VITE_API_URL=http://localhost:3000/api
VITE_UPLOADS_URL=http://localhost:3000
```

5. Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

O frontend estará rodando em `http://localhost:5173`.

## 📱 Funcionalidades

- **Autenticação** — Registro, login e logout com JWT
- **Perfil** — Edição de dados e foto de perfil
- **Catálogo de Produtos** — Listagem com filtros e paginação
- **Carrinho de Compras** — Adicionar, remover e atualizar quantidades
- **Checkout** — Finalização de pedidos
- **Histórico de Compras** — Visualização de pedidos anteriores
- **Dashboard do Fornecedor** — Gestão de produtos/anúncios
- **Painel Admin** — Gestão de usuários (CRUD completo)
- **Upload de Imagens** — Fotos de perfil e imagens de produtos
- **Rotas Protegidas** — Acesso por tipo de usuário (Admin, Comprador, Fornecedor)

## 👥 Detalhamento do Projeto

| Integrante | Contribuições |
|------------|---------------|
| **Fabrizzio Puttini** | Protótipo no Figma, finalização do Banco de Dados e DER |
| **Guilherme Belcastro** | Base do DER junto à Julia, revisão das documentações |
| **Luiz Silvestre** | Desenvolvimento do Backend e Frontend fullstack |
| **Julia Valério** | Base do DER junto ao Guilherme, documentação de Gestão Empresarial |
| **Kaike Santos** | Backlog, documentação do projeto e documentação de Cálculo II |

## Banco de Dados 
A documentação completa das tabelas, relacionamentos e o script SQL podem ser encontrados no link abaixo: [Acesse a Documentação do Banco de Dados aqui](https://github.com/2026-1-MCC2/Projeto1/tree/main/Documentos/Entrega2/Projetos%20em%20Banco%20de%20Dados)](./BD/README.md)

---

## 📋 Licença

<p xmlns:cc="http://creativecommons.org/ns#">Este trabalho está licenciado sob <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer">CC BY 4.0</a></p>

## 🎓 Referências

1. <https://github.com/iuricode/readme-template>
2. <https://github.com/gabrieldejesus/readme-model>
3. <https://chooser-beta.creativecommons.org/>
4. <https://www.toptal.com/developers/gitignore>
5. <https://expressjs.com/>
6. <https://www.npmjs.com/package/mysql2>
7. <https://react.dev/>
8. <https://vitejs.dev/>
9. <https://tailwindcss.com/>
10. <https://jwt.io/>
