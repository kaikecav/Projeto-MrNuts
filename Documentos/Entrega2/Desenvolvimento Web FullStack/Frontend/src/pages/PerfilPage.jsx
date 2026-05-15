import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import Avatar from '../components/Avatar.jsx';
import PurchaseHistoryPage from './PurchaseHistoryPage.jsx';
import SupplierDashboardPage from './SupplierDashboardPage.jsx';

export default function PerfilPage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const isAdmin = user?.tipoUsuario === 1;
  const isComprador = user?.tipoUsuario === 2;
  const isFornecedor = user?.tipoUsuario === 3;

  // Define aba padrão conforme tipo de usuário
  const defaultTab = isComprador ? 'compras' : isFornecedor ? 'fornecedor' : 'perfil';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [perfil, setPerfil] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [contato, setContato] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authApi.profile();
        setPerfil(data);
        setNomeUsuario(data.nomeUsuario || '');
        setContato(data.contato || '');
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar perfil');
      } finally {
        setLoadingFetch(false);
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      if (nomeUsuario && nomeUsuario !== perfil.nomeUsuario)
        fd.append('nomeUsuario', nomeUsuario);
      if (contato !== perfil.contato) fd.append('contato', contato);
      if (novaSenha) {
        fd.append('senhaAtual', senhaAtual);
        fd.append('novaSenha', novaSenha);
      }
      if (imagem) fd.append('img', imagem);

      const { data } = await authApi.updateMe(fd);
      setPerfil(data);
      updateUser({
        id: data.idUsuario,
        nomeUsuario: data.nomeUsuario,
        email: data.email,
        contato: data.contato,
        img: data.img,
        tipoUsuario: data.tipoUsuario,
      });
      setSenhaAtual('');
      setNovaSenha('');
      setImagem(null);
      toast.success('Perfil atualizado!');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-500">
        Carregando perfil...
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error || 'Perfil indisponivel'}
        </div>
      </div>
    );
  }

  const tabButtonClass = (tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition ${
      activeTab === tab
        ? 'bg-brand-900 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-marketplace-paper">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Card de Perfil */}
        <div className="bg-white border border-brand-200 rounded-xl p-6 mb-6 flex items-center gap-4">
          <Avatar user={perfil} size="lg" />
          <div>
            <div className="text-lg font-semibold">{perfil.nomeUsuario}</div>
            <div className="text-sm text-gray-500 font-mono">{perfil.email}</div>
            <div className="text-xs text-gray-400 mt-1">
              Cadastrado em {new Date(perfil.dataCadastro).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('perfil')}
            className={tabButtonClass('perfil')}
          >
            Meus Dados
          </button>

          {isComprador && (
            <button
              onClick={() => setActiveTab('compras')}
              className={tabButtonClass('compras')}
            >
              Histórico de Compras
            </button>
          )}

          {isFornecedor && (
            <button
              onClick={() => setActiveTab('fornecedor')}
              className={tabButtonClass('fornecedor')}
            >
              Minha Loja
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'perfil' && (
          <form onSubmit={onSubmit} className="bg-white border border-brand-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold border-b border-brand-200 pb-3">
              Atualizar dados
            </h3>

            <Field label="Nome">
              <input
                type="text"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                className={fieldClass}
              />
            </Field>

            <Field label="Contato">
              <input
                type="text"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                className={fieldClass}
              />
            </Field>

            <Field label="Nova foto">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagem(e.target.files[0])}
                className="w-full px-3 py-2 border border-dashed border-brand-200 rounded-lg bg-brand-100 text-xs text-gray-600 cursor-pointer"
              />
            </Field>

            <h3 className="text-sm font-semibold border-b border-brand-200 pb-3 pt-2">
              Trocar senha (opcional)
            </h3>

            <Field label="Senha atual">
              <input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className={fieldClass}
              />
            </Field>

            <Field label="Nova senha">
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className={fieldClass}
              />
            </Field>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-900 text-white rounded-lg font-medium text-sm hover:bg-black disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          </form>
        )}

        {activeTab === 'compras' && isComprador && (
          <div className="bg-white border border-brand-200 rounded-xl shadow-sm overflow-hidden p-6">
            <PurchaseHistoryPage />
          </div>
        )}

        {activeTab === 'fornecedor' && isFornecedor && (
          <SupplierDashboardPage />
        )}
      </div>
    </div>
  );
}

const fieldClass =
  'w-full px-3 py-2.5 border border-brand-200 rounded-lg bg-brand-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
