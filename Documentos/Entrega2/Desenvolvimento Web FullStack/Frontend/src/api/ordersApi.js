import api from './client.js';

export async function getPedidos() {
  const response = await api.get('/pedidos');
  return response.data;
}

export async function getPedidoById(id) {
  const response = await api.get(`/pedidos/${id}`);
  return response.data;
}

export async function createPedido(endereco, telefone) {
  const response = await api.post('/pedidos', {
    endereco,
    telefone,
  });
  return response.data;
}

export async function updateStatusPedido(id, status) {
  const response = await api.put(`/pedidos/${id}/status`, {
    status,
  });
  return response.data;
}
