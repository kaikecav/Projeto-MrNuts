import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { getProdutos } from '../api/productsApi.js';
import { useCart } from '../contexts/CartContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const data = await getProdutos();
      setProdutos(data || []);

      // Agrupar produtos por categoria
      const grouped = {};
      (data || []).forEach(produto => {
        const categoria = produto.categoria || 'Sem Categoria';
        if (!grouped[categoria]) {
          grouped[categoria] = [];
        }
        grouped[categoria].push(produto);
      });

      setCategorizedProducts(grouped);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setProdutos([]);
      setCategorizedProducts({});
    } finally {
      setLoading(false);
    }
  };

  const handleAddCart = async (idProduto) => {
    const product = produtos.find((p) => p.idProduto === idProduto);
    if (product) {
      addItem(product, 1);
      toast.success('Produto adicionado ao carrinho!');
    }
  };

  const handleHeroCTA = () => {
    navigate('/produtos');
  };

  const categoryDescriptions = {
    'Nozes': 'Nozes frescas e premium de qualidade superior',
    'Castanhas': 'Castanhas de caju, castanha-do-pará e outras variedades',
    'Amêndoas': 'Amêndoas selecionadas, com e sem casca',
    'Amendoins': 'Amendoins torrados e naturais em diversas apresentações',
    'Sementes': 'Sementes de girassol, abóbora, linhaça e outras',
    'Frutas Secas': 'Passa, damasco, tâmara e outras frutas desidratadas',
    'Mix de Nozes': 'Misturas especiais e blends customizados de frutos secos',
    'Raízes & Tubérculos': 'Batata, batata-doce, gengibre e outras raízes premium',
    'Cereais & Grãos': 'Arroz, quinoa, aveia e outros grãos saudáveis',
    'Óleos & Manteigas': 'Manteigas de amendoim, castanha e óleos prensados a frio'
  };

  return (
    <div className="min-h-screen bg-marketplace-paper">
      <header className="bg-white border-b border-marketplace-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
              className="text-marketplace-ink font-medium hover:text-marketplace-accent"
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
        <Hero onCTAClick={handleHeroCTA} />

        {/* Seções dinâmicas por categoria */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-lg border border-marketplace-cream animate-pulse"
              />
            ))}
          </div>
        ) : Object.keys(categorizedProducts).length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-marketplace-ink mb-4">
              Nenhum produto disponível
            </h2>
            <p className="text-marketplace-muted mb-8">
              Volte em breve para conferir nossos produtos!
            </p>
          </div>
        ) : (
          Object.entries(categorizedProducts).map(([categoria, produtos]) => (
            <section key={categoria} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-marketplace-ink mb-2">
                    {categoria}
                  </h2>
                  <p className="text-marketplace-muted">
                    {categoryDescriptions[categoria] || 'Produtos de qualidade premium'}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/produtos?categoria=${encodeURIComponent(categoria)}`)}
                  className="px-6 py-3 border-2 border-marketplace-accent text-marketplace-accent-dark font-medium rounded-lg hover:bg-marketplace-paper transition-colors"
                >
                  Ver Mais
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {produtos.slice(0, 4).map((produto) => (
                  <ProductCard
                    key={produto.idProduto}
                    product={produto}
                    onAddCart={handleAddCart}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        {/* CTA Newsletter */}
        <section className="bg-gradient-to-r from-marketplace-accent to-marketplace-accent-dark rounded-2xl p-12 text-white mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Junte-se à Comunidade Mr. Nuts</h2>
            <p className="text-white/80 mb-8">
              Receba receitas semanais, descontos exclusivos e acesso antecipado às colheitas sazonais.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Inscrito com sucesso!');
              }}
              className="flex gap-4"
            >
              <input
                type="email"
                placeholder="Digite seu email"
                required
                className="flex-1 px-6 py-3 rounded-lg text-marketplace-ink"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-marketplace-gold text-marketplace-ink font-bold rounded-lg hover:bg-marketplace-gold/90 transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-marketplace-ink text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-marketplace-gold rounded flex items-center justify-center">
                  <span className="text-marketplace-ink font-bold">MR</span>
                </div>
                <span className="text-xl font-bold">NUTS</span>
              </div>
              <p className="text-white/70">
                Seu marketplace global para nozes, sementes e vegetais de raiz fornecidos diretamente
                de agricultores ao redor do mundo.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Loja</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Mais Vendidos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Novidades
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Atacado
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Suporte</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Informações de Envio
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      Devoluções
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-marketplace-gold">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Contato</h4>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>
                    <a href="mailto:support@mrnuts.com" className="hover:text-marketplace-gold">
                      support@mrnuts.com
                    </a>
                  </li>
                  <li>+55 (11) 3000-0000</li>
                  <li>São Paulo, SP</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/70 text-sm">
            <span>2026 Mr Nuts Marketplace. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
