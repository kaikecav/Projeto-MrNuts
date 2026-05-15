import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Sessao encerrada');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? 'bg-white/15 text-white'
        : 'text-white/60 hover:text-white hover:bg-white/10'
    }`;

  const isAdmin = user?.tipoUsuario === 1;

  return (
    <nav className="bg-brand-900 text-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-2">
        <Link to={isAdmin ? "/usuarios" : "/"} className="font-mono text-sm text-white/70 mr-4">
          TechFood
        </Link>

        {isAdmin && (
          <>
            <NavLink to="/usuarios" className={linkClass}>
              Usuarios
            </NavLink>
            <NavLink to="/usuarios/novo" className={linkClass}>
              Novo
            </NavLink>
          </>
        )}
        <NavLink to="/perfil" className={linkClass}>
          Perfil
        </NavLink>

        <div className="flex-1" />

        {user && (
          <span className="text-xs text-white/50 font-mono mr-2">
            {user.email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 transition"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
