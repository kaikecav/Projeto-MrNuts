# MR NUTS Marketplace - React + Tailwind + Backend

Marketplace de nozes e sementes migrado para React + Tailwind CSS com backend Express + JWT.

## 🚀 O que foi feito

### Backend (Express)
- ✅ Controllers para produtos, carrinho e pedidos
- ✅ Rotas protegidas por autenticação JWT
- ✅ Sistema de carrinho com localStorage
- ✅ Processamento de pedidos com transações
- ✅ API RESTful completa

### Frontend (React + Tailwind)
- ✅ Homepage com hero carousel (3 slides)
- ✅ Página de catálogo com filtros avançados
- ✅ Cards de produtos responsivos
- ✅ Carrinho persistente no localStorage
- ✅ Checkout com validação de endereço
- ✅ Sistema de notificações (toast)
- ✅ Autenticação JWT integrada

### Design
- ✅ Paleta de cores do marketplace (laranja #c56a2b, cream #fbf5ee)
- ✅ Componentes reutilizáveis
- ✅ Totalmente responsivo (mobile, tablet, desktop)
- ✅ Tailwind CSS customizado

## 📋 Estrutura

```
Desenvolvimento Web FullStack/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js (autenticação)
│   │   │   ├── usuarioController.js (usuários)
│   │   │   ├── productsController.js (produtos) ✨ NOVO
│   │   │   ├── cartController.js (carrinho) ✨ NOVO
│   │   │   └── ordersController.js (pedidos) ✨ NOVO
│   │   ├── middlewares/
│   │   ├── routes.js (atualizado)
│   │   └── ...
│   ├── database_migrations.sql (script SQL) ✨ NOVO
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Avatar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx ✨ NOVO
    │   │   ├── Filters.jsx ✨ NOVO
    │   │   ├── Pagination.jsx ✨ NOVO
    │   │   ├── Hero.jsx ✨ NOVO
    │   │   └── ...
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── HomePage.jsx ✨ NOVO
    │   │   ├── ProductsPage.jsx ✨ NOVO
    │   │   ├── CartPage.jsx ✨ NOVO
    │   │   ├── CheckoutPage.jsx ✨ NOVO
    │   │   ├── PerfilPage.jsx
    │   │   └── ...
    │   ├── contexts/
    │   │   ├── AuthContext.jsx
    │   │   ├── ToastContext.jsx
    │   │   └── CartContext.jsx ✨ NOVO
    │   ├── api/
    │   │   ├── client.js
    │   │   ├── authApi.js
    │   │   ├── productsApi.js ✨ NOVO
    │   │   ├── cartApi.js ✨ NOVO
    │   │   └── ordersApi.js ✨ NOVO
    │   ├── App.jsx (atualizado)
    │   └── ...
    ├── tailwind.config.js (atualizado)
    └── package.json
```

## 🛠️ Setup

### 1. Backend Setup

```bash
cd "Backend"
npm install

# Configure .env
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha
# DB_DATABASE=techfood
# JWT_SECRET=sua_chave_secreta
# JWT_EXPIRES=1h

# Execute o script de migrations no MySQL:
# mysql -u root -p < database_migrations.sql

npm run dev
# Backend rodará em http://localhost:3000
```

### 2. Frontend Setup

```bash
cd "../Frontend"
npm install

# Configure .env.local (se necessário)
# VITE_API_URL=http://localhost:3000/api

npm run dev
# Frontend rodará em http://localhost:5173
```

## 🗄️ Database

Tabelas criadas no MySQL:

```sql
- produto (id, nome, categoria, preco, rating, reviews, imagem, emEstoque)
- carrinho (id, idUsuario, idProduto, quantidade)
- pedido (id, idUsuario, totalPedido, status, endereco, telefone)
- pedido_item (id, idPedido, idProduto, quantidade, precoUnitario)
```

Execute `database_migrations.sql` antes de usar a aplicação.

## 🎯 Funcionalidades

### Públicas
- ✅ Homepage com carousel
- ✅ Catálogo de produtos com filtros
- ✅ Login / Registro
- ✅ Adicionar produtos ao carrinho

### Autenticadas
- ✅ Ver carrinho
- ✅ Editar quantidade
- ✅ Checkout
- ✅ Visualizar perfil
- ✅ Histórico de pedidos

### Admin
- ✅ Gerenciar usuários (CRUD)
- ✅ Criar/editar/deletar produtos (via API)

## 🎨 Paleta de Cores

```
- paper: #fbf5ee (fundo principal)
- cream: #fff3e4 (elementos claros)
- ink: #2a1a12 (texto principal)
- muted: #9a7561 (texto secundário)
- accent: #c56a2b (botões, destaques)
- accent-dark: #8e3f1a (hover)
- gold: #f2b05f (destaque premium)
- sage: #d7c3a4 (bege neutro)
```

## 🔄 Fluxo de Compra

1. Usuário acessa homepage
2. Navega pelo catálogo com filtros
3. Clica "Add" em um produto
4. Produto é adicionado ao carrinho (localStorage)
5. Vai para /carrinho
6. Edita quantidades conforme necessário
7. Clica "Ir para Checkout"
8. Preenche endereço e telefone
9. Confirma pedido
10. Pedido é salvo no banco de dados
11. Carrinho é limpo

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ Tokens JWT com expiração
- ✅ Rotas protegidas por autenticação
- ✅ CORS habilitado
- ✅ Upload de imagens com validação

## 📱 Responsividade

- ✅ Mobile first
- ✅ Tablet (768px)
- ✅ Desktop (1024px)
- ✅ Todos os componentes testados

## 🧪 Próximas Melhorias

- [ ] Modo de página de detalhes do produto
- [ ] Busca por texto
- [ ] Ordenação de produtos (preço, rating)
- [ ] Análise de pedidos no perfil
- [ ] Métodos de pagamento integrados
- [ ] Sistema de avaliações
- [ ] Wishlist
- [ ] Sistema de cupons de desconto

## 📞 Suporte

Para dúvidas ou erros, verifique:
1. Se o backend está rodando: `http://localhost:3000/health`
2. Se o banco de dados está acessível
3. Se as variáveis de ambiente estão configuradas
4. Os logs do console para mensagens de erro

---

**Desenvolvido com React ⚛️ + Tailwind CSS 🎨 + Express.js 🚀**
