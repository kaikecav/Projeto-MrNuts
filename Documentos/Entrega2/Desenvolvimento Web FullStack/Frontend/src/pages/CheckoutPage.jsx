import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPedido } from '../api/ordersApi.js';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    endereco: '',
    telefone: '',
  });
  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-marketplace-paper flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-marketplace-ink mb-4">Carrinho Vazio</h1>
          <p className="text-marketplace-muted mb-8">
            Adicione produtos para continuar com sua compra.
          </p>
          <button
            onClick={() => navigate('/produtos')}
            className="px-8 py-3 bg-marketplace-accent text-white rounded-lg font-medium hover:bg-marketplace-accent-dark transition-colors"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\d{10,15}$/.test(formData.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Telefone inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos corretamente');
      return;
    }

    try {
      setLoading(true);
      await createPedido(formData.endereco, formData.telefone);
      clearCart();
      toast.success('Pedido criado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      toast.error(err.response?.data?.error || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-marketplace-paper py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-marketplace-ink mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-marketplace-cream shadow-sm p-8">
              <h2 className="text-2xl font-bold text-marketplace-ink mb-6">
                Informações de Entrega
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Info (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-marketplace-ink mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={user?.nomeUsuario || ''}
                    disabled
                    className="w-full px-4 py-2 border border-marketplace-cream rounded-lg bg-marketplace-paper text-marketplace-ink"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-marketplace-ink mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-marketplace-cream rounded-lg bg-marketplace-paper text-marketplace-ink"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-marketplace-ink mb-2">
                    Endereço *
                  </label>
                  <textarea
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endereco: e.target.value,
                      }))
                    }
                    placeholder="Rua, número, complemento, cidade, estado, CEP"
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent ${
                      errors.endereco
                        ? 'border-red-500 bg-red-50'
                        : 'border-marketplace-cream'
                    }`}
                  />
                  {errors.endereco && (
                    <p className="text-red-500 text-sm mt-2">{errors.endereco}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-marketplace-ink mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        telefone: e.target.value,
                      }))
                    }
                    placeholder="(11) 99999-9999"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent ${
                      errors.telefone
                        ? 'border-red-500 bg-red-50'
                        : 'border-marketplace-cream'
                    }`}
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-2">{errors.telefone}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-marketplace-accent text-white font-bold py-3 rounded-lg hover:bg-marketplace-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processando...' : 'Confirmar Pedido'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-marketplace-cream shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-marketplace-ink text-lg mb-6">Resumo do Pedido</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.idProduto} className="flex justify-between text-sm">
                    <span className="text-marketplace-muted">
                      {item.nomeProduto} x {item.quantidade}
                    </span>
                    <span className="font-medium text-marketplace-ink">
                      ${(item.preco * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-marketplace-cream pt-4 space-y-2">
                <div className="flex justify-between text-marketplace-muted">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-marketplace-muted">
                  <span>Frete</span>
                  <span>Gratuito</span>
                </div>
                <div className="flex justify-between font-bold text-marketplace-ink">
                  <span>Total</span>
                  <span className="text-2xl text-marketplace-accent">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
