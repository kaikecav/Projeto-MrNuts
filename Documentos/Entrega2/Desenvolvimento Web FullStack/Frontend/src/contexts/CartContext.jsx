import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setItems(cartData);
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err);
      }
    }
  }, []);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    const newCount = items.reduce((sum, item) => sum + item.quantidade, 0);
    setTotal(parseFloat(newTotal.toFixed(2)));
    setItemCount(newCount);
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantidade = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.idProduto === product.idProduto);
      if (existing) {
        return prev.map((item) =>
          item.idProduto === product.idProduto
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      return [...prev, { ...product, quantidade }];
    });
  };

  const removeItem = (idProduto) => {
    setItems((prev) => prev.filter((item) => item.idProduto !== idProduto));
  };

  const updateQuantity = (idProduto, quantidade) => {
    if (quantidade <= 0) {
      removeItem(idProduto);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.idProduto === idProduto ? { ...item, quantidade } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}
