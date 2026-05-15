import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !senha) {
      setError('Preencha email e senha');
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, senha);
      toast.success('Bem-vindo!');
      if (data.user.tipoUsuario === 1) {
        navigate('/usuarios');
      } else {
        navigate('/perfil');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao fazer login';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-marketplace-paper">
      <header className="bg-white border-b border-marketplace-cream sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-marketplace-accent rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">MR</span>
            </div>
            <h1 className="text-2xl font-bold text-marketplace-ink">NUTS</h1>
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg text-marketplace-ink font-medium hover:text-marketplace-accent"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </header>
      <div className="min-h-screen flex items-start justify-center pt-16 px-4">
      <div className="bg-white border border-brand-200 rounded-2xl p-8 w-full max-w-md shadow-sm">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-marketplace-accent rounded-lg flex items-center justify-center text-white font-mono text-sm">
            MR
          </div>
          <div>
            <div className="font-semibold text-marketplace-ink">Mr Nuts</div>
            <div className="text-xs text-marketplace-muted font-mono">Marketplace</div>
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-1 text-marketplace-ink">Entrar</h1>
        <p className="text-sm text-marketplace-muted mb-5">Acesse sua conta para continuar</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-marketplace-muted mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-marketplace-cream rounded-lg bg-marketplace-cream text-sm text-marketplace-ink focus:outline-none focus:ring-2 focus:ring-marketplace-accent"
              placeholder="seu@email.com"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-marketplace-muted mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2.5 border border-marketplace-cream rounded-lg bg-marketplace-cream text-sm text-marketplace-ink focus:outline-none focus:ring-2 focus:ring-marketplace-accent"
              placeholder="********"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-marketplace-accent text-white rounded-lg font-medium text-sm hover:bg-marketplace-accent-dark disabled:opacity-50 transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-2 text-xs text-marketplace-muted font-mono">
          <div className="flex-1 h-px bg-marketplace-cream" />
          ou
          <div className="flex-1 h-px bg-marketplace-cream" />
        </div>

        <Link
          to="/registro"
          className="block w-full text-center py-2.5 bg-marketplace-cream text-marketplace-accent rounded-lg font-medium text-sm hover:bg-marketplace-gold transition"
        >
          Criar nova conta
        </Link>
      </div>
      </div>
    </div>
  );
}
