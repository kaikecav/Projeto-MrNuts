import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Filters from '../components/Filters.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { getProdutos } from '../api/productsApi.js';
import { useCart } from '../contexts/CartContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    categoria: searchParams.get('categoria') || '',
    precoMax: 1000,
    emEstoque: false,
  });

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, produtos]);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const data = await getProdutos();
      setProdutos(data || []);

      // Extrair categorias únicas
      const uniqueCategories = [...new Set((data || []).map(p => p.categoria))].filter(Boolean);
      setCategorias(uniqueCategories.sort());
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setProdutos([]);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...produtos];

    // Filtro por categoria
    if (filters.categoria && filters.categoria.trim() !== '') {
      filtered = filtered.filter((p) => p.categoria === filters.categoria);
    }

    // Filtro por preço
    if (filters.precoMax) {
      filtered = filtered.filter((p) => parseFloat(p.preco || 0) <= filters.precoMax);
    }

    // Filtro por disponibilidade
    if (filters.emEstoque) {
      filtered = filtered.filter((p) => (p.estoque || 0) > 0);
    }

    setFilteredProdutos(filtered);
    setCurrentPage(1);
  };

  const handleAddCart = (idProduto) => {
    const product = produtos.find((p) => p.idProduto === idProduto);
    if (product) {
      addItem(product, 1);
      toast.success('Produto adicionado ao carrinho!');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const totalPages = Math.ceil(filteredProdutos.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProdutos = filteredProdutos.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-marketplace-paper">
      <header className="bg-white border-b border-marketplace-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-marketplace-accent rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">MR</span>
            </div>
            <h1 className="text-2xl font-bold text-marketplace-ink">NUTS</h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-marketplace-ink font-medium hover:text-marketplace-accent"
            >
              Início
            </button>
            <button
              onClick={() => navigate('/produtos')}
              className="text-marketplace-accent font-medium"
            >
              Produtos
            </button>
          </nav>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/carrinho')}
              className="px-4 py-2 rounded-lg bg-marketplace-cream text-marketplace-ink font-medium hover:bg-marketplace-gold transition-colors"
            >
              🛒 Carrinho
            </button>
            <button
              onClick={() => navigate('/perfil')}
              className="px-4 py-2 rounded-lg bg-marketplace-accent text-white font-medium hover:bg-marketplace-accent-dark transition-colors"
            >
              👤 Perfil
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <aside className="lg:col-span-1">
            <FiltersSection
              categorias={categorias}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          {/* Produtos */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-marketplace-ink mb-2">Produtos</h1>
              <p className="text-marketplace-muted">
                {filteredProdutos.length} produto{filteredProdutos.length !== 1 ? 's' : ''} encontrado{filteredProdutos.length !== 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-white rounded-lg border border-marketplace-cream animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProdutos.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-marketplace-ink mb-4">
                  Nenhum produto encontrado
                </h2>
                <p className="text-marketplace-muted mb-8">
                  Tente ajustar seus filtros
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {paginatedProdutos.map((produto) => (
                    <ProductCard
                      key={produto.idProduto}
                      product={produto}
                      onAddCart={handleAddCart}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function FiltersSection({ categorias, filters, onFilterChange }) {
  return (
    <div className="bg-white rounded-lg border border-marketplace-cream p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-bold text-marketplace-ink mb-6">Filtros</h2>

      {/* Categoria */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-marketplace-ink mb-3">
          Categoria
        </label>
        <select
          value={filters.categoria}
          onChange={(e) => onFilterChange({ ...filters, categoria: e.target.value })}
          className="w-full px-3 py-2 border border-marketplace-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-marketplace-accent text-sm"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Preço Máximo */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-marketplace-ink mb-3">
          Preço Máximo
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.precoMax}
            onChange={(e) => onFilterChange({ ...filters, precoMax: parseInt(e.target.value) })}
            className="w-full accent-marketplace-accent"
          />
          <div className="text-sm text-marketplace-muted">
            R$ 0 - R$ {filters.precoMax}
          </div>
        </div>
      </div>

      {/* Disponibilidade */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.emEstoque}
            onChange={(e) => onFilterChange({ ...filters, emEstoque: e.target.checked })}
            className="w-4 h-4 accent-marketplace-accent rounded"
          />
          <span className="text-sm font-medium text-marketplace-ink">
            Apenas em estoque
          </span>
        </label>
      </div>

      {/* Botão Limpar Filtros */}
      <button
        onClick={() => onFilterChange({ categoria: '', precoMax: 1000, emEstoque: false })}
        className="w-full px-4 py-2 border border-marketplace-accent text-marketplace-accent rounded-lg text-sm font-medium hover:bg-marketplace-paper transition-colors"
      >
        Limpar Filtros
      </button>
    </div>
  );
}
