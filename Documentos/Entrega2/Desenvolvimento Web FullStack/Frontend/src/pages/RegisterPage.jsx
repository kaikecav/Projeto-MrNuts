import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi.js';
import { useToast } from '../contexts/ToastContext.jsx';

export default function RegisterPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomeUsuario: '',
    email: '',
    senha: '',
    contato: '',
    tipoUsuario: '2',
    cpf: '',
    cnpj: '',
  });
  const [imagem, setImagem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nomeUsuario || !form.email || !form.senha) {
      setError('Nome, email e senha são obrigatórios');
      return;
    }
    if (form.tipoUsuario === '2' && !form.cpf) {
      setError('CPF é obrigatório para compradores');
      return;
    }
    if (form.tipoUsuario === '3' && !form.cnpj) {
      setError('CNPJ é obrigatório para fornecedores');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if ((k === 'cpf' && form.tipoUsuario !== '2') || (k === 'cnpj' && form.tipoUsuario !== '3')) {
          return;
        }
        if (v) fd.append(k, v);
      });
      if (imagem) fd.append('img', imagem);

      await authApi.register(fd);
      toast.success('Conta criada com sucesso! Faça login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
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

      <div className="min-h-screen flex items-start justify-center pt-8 pb-12 px-4">
        <div className="bg-white border border-marketplace-cream rounded-2xl p-8 w-full max-w-md shadow-sm">
          <h1 className="text-xl font-semibold mb-1 text-marketplace-ink">Criar conta</h1>
          <p className="text-sm text-marketplace-muted mb-5">Preencha seus dados</p>

          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Nome">
              <input
                type="text"
                value={form.nomeUsuario}
                onChange={(e) => update('nomeUsuario', e.target.value)}
                className={fieldClass}
                placeholder="Seu nome completo"
              />
            </Field>

            <Field label="E-mail">
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={fieldClass}
                placeholder="seu@email.com"
              />
            </Field>

            <Field label="Senha">
              <input
                type="password"
                value={form.senha}
                onChange={(e) => update('senha', e.target.value)}
                className={fieldClass}
                placeholder="********"
              />
            </Field>

            <Field label="Contato">
              <input
                type="text"
                value={form.contato}
                onChange={(e) => update('contato', e.target.value)}
                className={fieldClass}
                placeholder="(11) 99999-9999"
              />
            </Field>

            <Field label="Tipo de usuário">
              <select
                value={form.tipoUsuario}
                onChange={(e) => update('tipoUsuario', e.target.value)}
                className={fieldClass}
              >
                {/* <option value="1">Administrador</option> */}
                <option value="2">Comprador</option>
                <option value="3">Fornecedor</option>
              </select>
            </Field>

            {form.tipoUsuario === '2' && (
              <Field label="CPF">
                <input
                  type="text"
                  value={form.cpf}
                  onChange={(e) => update('cpf', e.target.value)}
                  className={fieldClass}
                  placeholder="000.000.000-00"
                />
              </Field>
            )}

            {form.tipoUsuario === '3' && (
              <Field label="CNPJ">
                <input
                  type="text"
                  value={form.cnpj}
                  onChange={(e) => update('cnpj', e.target.value)}
                  className={fieldClass}
                  placeholder="00.000.000/0000-00"
                />
              </Field>
            )}

            <Field label="Foto (opcional)">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagem(e.target.files[0])}
                className="w-full px-3 py-2 border border-dashed border-marketplace-cream rounded-lg bg-marketplace-cream text-xs text-marketplace-muted cursor-pointer"
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
              className="w-full py-2.5 bg-marketplace-accent text-white rounded-lg font-medium text-sm hover:bg-marketplace-accent-dark disabled:opacity-50 transition"
            >
              {loading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-marketplace-muted">
            Já tem conta?{' '}
            <Link to="/login" className="text-marketplace-accent font-medium hover:text-marketplace-accent-dark">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const fieldClass =
  'w-full px-3 py-2.5 border border-marketplace-cream rounded-lg bg-marketplace-cream text-sm text-marketplace-ink focus:outline-none focus:ring-2 focus:ring-marketplace-accent';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-marketplace-muted mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
