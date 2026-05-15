import api from './client.js';

export async function getProdutos(filters = {}) {
  const params = new URLSearchParams();
  if (filters.categories && filters.categories.length > 0) {
    params.append('categoria', filters.categories[0]);
  }
  if (filters.priceMax) {
    params.append('preco_max', filters.priceMax);
  }
  if (filters.ratingMin) {
    params.append('rating_min', filters.ratingMin);
  }
  if (filters.inStock) {
    params.append('em_estoque', 'true');
  }

  const response = await api.get(`/produtos?${params.toString()}`);
  return response.data;
}

export async function getProdutoById(id) {
  const response = await api.get(`/produtos/${id}`);
  return response.data;
}

export async function createProduto(data) {
  const response = await api.post('/produtos', data);
  return response.data;
}

export async function updateProduto(id, data) {
  const response = await api.put(`/produtos/${id}`, data);
  return response.data;
}

export async function deleteProduto(id) {
  const response = await api.delete(`/produtos/${id}`);
  return response.data;
}
