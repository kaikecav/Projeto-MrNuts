import api from './client.js';

export async function getCarrinho() {
  const response = await api.get('/carrinho');
  return response.data;
}

export async function addCarrinho(idProduto, quantidade) {
  const response = await api.post('/carrinho', {
    idProduto,
    quantidade,
  });
  return response.data;
}

export async function updateCarrinho(idCarrinho, quantidade) {
  const response = await api.put(`/carrinho/${idCarrinho}`, {
    quantidade,
  });
  return response.data;
}

export async function removeCarrinho(idCarrinho) {
  const response = await api.delete(`/carrinho/${idCarrinho}`);
  return response.data;
}

export async function clearCarrinho() {
  const response = await api.delete('/carrinho');
  return response.data;
}
