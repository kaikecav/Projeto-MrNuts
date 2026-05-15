import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosApi } from '../api/usuariosApi.js';
import { useToast } from '../contexts/ToastContext.jsx';
import Avatar from '../components/Avatar.jsx';

const tipoLabel = (t) =>
  t === 1 ? 'Admin' : t === 2 ? 'Comprador' : t === 3 ? 'Fornecedor' : '?';

export default function UsuariosPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await usuariosApi.list();
      setUsuarios(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Excluir o usuario "${nome}"?`)) return;
    try {
      await usuariosApi.remove(id);
      toast.success('Usuario excluido com sucesso');
      fetchUsuarios();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao excluir');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchUsuarios}
            className="px-4 py-2 bg-brand-100 text-brand-900 rounded-lg text-sm font-medium hover:bg-brand-200"
          >
            Atualizar
          </button>
          <button
            onClick={() => navigate('/usuarios/novo')}
            className="px-4 py-2 bg-brand-900 text-white rounded-lg text-sm font-medium hover:bg-black"
          >
            + Novo usuario
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="bg-white border border-brand-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Carregando usuarios...
          </div>
        ) : usuarios.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Nenhum usuario cadastrado ainda.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-brand-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left px-5 py-3">Usuario</th>
                <th className="text-left px-5 py-3">Tipo</th>
                <th className="text-left px-5 py-3">Contato</th>
                <th className="text-right px-5 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-200">
              {usuarios.map((u) => (
                <tr key={u.idUsuario} className="hover:bg-brand-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={u} size="sm" />
                      <div>
                        <div className="font-medium text-sm">{u.nomeUsuario}</div>
                        <div className="text-xs text-gray-500 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-block px-2 py-1 bg-green-50 text-green-800 text-[10px] font-mono rounded">
                      {tipoLabel(u.tipoUsuario)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {u.contato || '-'}
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/usuarios/${u.idUsuario}/editar`)}
                      className="px-3 py-1.5 bg-brand-100 text-brand-900 rounded text-xs font-medium hover:bg-brand-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.idUsuario, u.nomeUsuario)}
                      className="px-3 py-1.5 bg-red-50 text-red-800 rounded text-xs font-medium hover:bg-red-100"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
