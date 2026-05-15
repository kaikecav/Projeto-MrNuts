import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }
    navigate('/checkout');
  };

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

  return (
    <div className="min-h-screen bg-marketplace-paper py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-4xl font-bold text-marketplace-ink mb-8">Seu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-marketplace-cream shadow-sm">
              {items.map((item) => {
                const imagemUrl = item.imagem
                  ? `http://localhost:3000/uploads/${item.imagem}`
                  : null;

                return (
                  <div
                    key={item.idProduto}
                    className="flex gap-4 p-6 border-b border-marketplace-cream last:border-b-0"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-marketplace-paper rounded-lg flex-shrink-0 overflow-hidden">
                      {imagemUrl ? (
                        <img
                          src={imagemUrl}
                          alt={item.nomeProduto}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-marketplace-cream">
                          <span className="text-marketplace-muted text-xs">Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-marketplace-ink mb-1">
                        {item.nomeProduto}
                      </h3>
                      <p className="text-sm text-marketplace-muted mb-4">
                        R$ {parseFloat(item.preco || 0).toFixed(2)} cada
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-marketplace-cream rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.idProduto, Math.max(1, item.quantidade - 1))
                            }
                            className="px-3 py-1 text-marketplace-muted hover:bg-marketplace-paper"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-medium text-marketplace-ink min-w-12 text-center">
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.idProduto, item.quantidade + 1)
                            }
                            className="px-3 py-1 text-marketplace-muted hover:bg-marketplace-paper"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.idProduto)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remover
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-marketplace-ink">
                        R$ {(parseFloat(item.preco || 0) * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={clearCart}
              className="mt-4 text-red-500 hover:text-red-700 font-medium text-sm"
            >
              Limpar Carrinho
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-marketplace-cream shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-marketplace-ink text-lg mb-6">Resumo do Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-marketplace-muted">
                  <span>Subtotal</span>
                  <span>R$ {(total || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-marketplace-muted">
                  <span>Frete</span>
                  <span>Gratuito</span>
                </div>
                <div className="flex justify-between text-marketplace-muted">
                  <span>Impostos</span>
                  <span>Calculado no checkout</span>
                </div>

                <div className="border-t border-marketplace-cream pt-4 flex justify-between font-bold text-marketplace-ink">
                  <span>Total</span>
                  <span className="text-2xl text-marketplace-accent">
                    R$ {(total || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-marketplace-accent text-white font-bold py-3 rounded-lg hover:bg-marketplace-accent-dark transition-colors mb-3"
              >
                Ir para Checkout
              </button>

              <button
                onClick={() => navigate('/produtos')}
                className="w-full border-2 border-marketplace-accent text-marketplace-accent-dark font-bold py-3 rounded-lg hover:bg-marketplace-paper transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
