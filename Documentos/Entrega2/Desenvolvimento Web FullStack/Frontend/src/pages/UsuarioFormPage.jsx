import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usuariosApi } from '../api/usuariosApi.js';
import { useToast } from '../contexts/ToastContext.jsx';
import { buildImageUrl } from '../api/client.js';

export default function UsuarioFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    nomeUsuario: '',
    email: '',
    senha: '',
    contato: '',
    tipoUsuario: '2',
  });
  const [imagem, setImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await usuariosApi.getById(id);
        setForm({
          nomeUsuario: data.nomeUsuario || '',
          email: data.email || '',
          senha: '',
          contato: data.contato || '',
          tipoUsuario: String(data.tipoUsuario || '2'),
        });
        setImagemAtual(data.img);
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar usuario');
      } finally {
        setLoadingFetch(false);
      }
    })();
  }, [id, isEdit]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nomeUsuario || !form.email) {
      setError('Nome e email sao obrigatorios');
      return;
    }
    if (!isEdit && !form.senha) {
      setError('Senha e obrigatoria para novos usuarios');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nomeUsuario', form.nomeUsuario);
      fd.append('email', form.email);
      fd.append('contato', form.contato);
      fd.append('tipoUsuario', form.tipoUsuario);
      if (form.senha) fd.append('senha', form.senha);
      if (imagem) fd.append('img', imagem);

      if (isEdit) {
        await usuariosApi.update(id, fd);
        toast.success('Usuario atualizado!');
      } else {
        await usuariosApi.create(fd);
        toast.success('Usuario criado!');
      }
      navigate('/usuarios');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 text-sm text-gray-500">
        Carregando...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        {isEdit ? 'Editar usuario' : 'Novo usuario'}
      </h1>

      <form onSubmit={onSubmit} className="bg-white border border-brand-200 rounded-xl p-6 space-y-4">
        <Field label="Nome">
          <input
            type="text"
            value={form.nomeUsuario}
            onChange={(e) => update('nomeUsuario', e.target.value)}
            className={fieldClass}
            placeholder="Nome completo"
          />
        </Field>

        <Field label="E-mail">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={fieldClass}
            placeholder="email@exemplo.com"
          />
        </Field>

        <Field label={isEdit ? 'Senha (deixe vazio para nao alterar)' : 'Senha'}>
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

        <Field label="Tipo de usuario">
          <select
            value={form.tipoUsuario}
            onChange={(e) => update('tipoUsuario', e.target.value)}
            className={fieldClass}
          >
            <option value="1">Administrador</option>
            <option value="2">Comprador</option>
            <option value="3">Fornecedor</option>
          </select>
        </Field>

        <Field label="Foto">
          {imagemAtual && !imagem && (
            <div className="mb-2 flex items-center gap-3">
              <img
                src={buildImageUrl(imagemAtual)}
                alt="atual"
                className="w-16 h-16 rounded-full object-cover border border-brand-200"
              />
              <span className="text-xs text-gray-500">Imagem atual</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files[0])}
            className="w-full px-3 py-2 border border-dashed border-brand-200 rounded-lg bg-brand-100 text-xs text-gray-600 cursor-pointer"
          />
        </Field>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/usuarios')}
            className="px-4 py-2.5 bg-brand-100 text-brand-900 rounded-lg text-sm font-medium hover:bg-brand-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 bg-brand-900 text-white rounded-lg font-medium text-sm hover:bg-black disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
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
