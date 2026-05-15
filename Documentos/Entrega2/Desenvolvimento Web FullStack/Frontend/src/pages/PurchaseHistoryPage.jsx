import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function PurchaseHistoryPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/pedidos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar histórico');
      }

      const data = await response.json();
      setPurchases(data || []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar histórico');
      toast.error('Erro ao carregar histórico de compras');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-sm text-gray-500">
        Carregando histórico de compras...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-xl font-semibold mb-6">Histórico de Compras</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-6">
          {error}
        </div>
      )}

      {purchases.length === 0 ? (
        <div className="bg-white border border-brand-200 rounded-xl p-8 text-center">
          <div className="text-sm text-gray-500">
            Você ainda não realizou nenhuma compra
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map(purchase => (
            <div key={purchase.idPedido} className="bg-white border border-brand-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Pedido #{purchase.idPedido}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(purchase.dataPedido).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                    purchase.status === 'entregue'
                      ? 'bg-green-100 text-green-800'
                      : purchase.status === 'cancelado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {purchase.status?.charAt(0).toUpperCase() + purchase.status?.slice(1)}
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-100 pt-3 mt-3">
                {purchase.itens?.length > 0 ? (
                  <div className="space-y-2">
                    {purchase.itens.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div>
                          <div className="text-gray-800">{item.nomeProduto}</div>
                          <div className="text-xs text-gray-500">Qtd: {item.quantidade}</div>
                        </div>
                        <div className="font-medium text-gray-800">
                          R$ {parseFloat(item.precoUnitario * item.quantidade).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Sem itens</div>
                )}
              </div>

              <div className="border-t border-brand-100 pt-3 mt-3 flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-800">
                  Total: R$ {parseFloat(purchase.totalPedido || 0).toFixed(2)}
                </div>
                {purchase.numeroRastreamento && (
                  <div className="text-xs text-gray-500">
                    Rastreamento: {purchase.numeroRastreamento}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
