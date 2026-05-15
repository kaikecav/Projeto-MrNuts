import { Router } from 'express';
import upload from './uploadConfig.js';
import { verifyTokenMiddleware } from './middlewares/authMiddleware.js';
import {
  register,
  login,
  logout,
  forgotPassword,
} from './controllers/authController.js';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  profile,
  updateMe,
} from './controllers/usuarioController.js';
import {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
} from './controllers/productsController.js';
import {
  getCategorias,
  createCategoria,
} from './controllers/categoriesController.js';
import {
  getCarrinho,
  addCarrinho,
  updateCarrinho,
  removeCarrinho,
  clearCarrinho,
} from './controllers/cartController.js';
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updateStatusPedido,
} from './controllers/ordersController.js';

const r = Router();

// ----- Rotas publicas (sem autenticacao) -----
r.post('/auth/register', upload.single('img'), register);
r.post('/auth/login', login);
r.post('/auth/forgot-password', forgotPassword);

// ----- Rotas protegidas (precisa de token) -----
r.post('/auth/logout', verifyTokenMiddleware, logout);

// Perfil do usuario logado
r.get('/usuarios/profile', verifyTokenMiddleware, profile);
r.put('/usuarios/me', verifyTokenMiddleware, upload.single('img'), updateMe);

// CRUD de usuarios
r.get('/usuarios', getUsuarios); // aberta - lista publica
r.get('/usuarios/:id', verifyTokenMiddleware, getUsuarioById);
r.post('/usuarios', verifyTokenMiddleware, upload.single('img'), createUsuario);
r.put('/usuarios/:id', verifyTokenMiddleware, upload.single('img'), updateUsuario);
r.delete('/usuarios/:id', verifyTokenMiddleware, deleteUsuario);

// ----- Rotas de Produtos (publicas) -----
r.get('/produtos', getProdutos);
r.get('/produtos/:id', getProdutoById);
r.post('/produtos', verifyTokenMiddleware, upload.single('imagem'), createProduto);
r.put('/produtos/:id', verifyTokenMiddleware, upload.single('imagem'), updateProduto);
r.delete('/produtos/:id', verifyTokenMiddleware, deleteProduto);

// ----- Rotas de Categorias (publicas) -----
r.get('/categorias', getCategorias);
r.post('/categorias', verifyTokenMiddleware, createCategoria);

// ----- Rotas de Carrinho (protegidas) -----
r.get('/carrinho', verifyTokenMiddleware, getCarrinho);
r.post('/carrinho', verifyTokenMiddleware, addCarrinho);
r.put('/carrinho/:idCarrinho', verifyTokenMiddleware, updateCarrinho);
r.delete('/carrinho/:idCarrinho', verifyTokenMiddleware, removeCarrinho);
r.delete('/carrinho', verifyTokenMiddleware, clearCarrinho);

// ----- Rotas de Pedidos (protegidas) -----
r.get('/pedidos', verifyTokenMiddleware, getPedidos);
r.get('/pedidos/:id', verifyTokenMiddleware, getPedidoById);
r.post('/pedidos', verifyTokenMiddleware, createPedido);
r.put('/pedidos/:id/status', verifyTokenMiddleware, updateStatusPedido);

export default r;
