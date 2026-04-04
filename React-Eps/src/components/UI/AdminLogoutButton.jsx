import api from '../../Api/axios';
import { useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

/**
 * AdminLogoutButton — Cierra sesión para usuarios normales (cualquier rol).
 * Llama a POST /logout, limpia localStorage y redirige al index principal.
 * INDEPENDIENTE del SuperAdmin (que usa sessionStorage).
 */
const AdminLogoutButton = ({ className = "", showText = false }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-2 cursor-pointer transition ${className}`}
            title="Cerrar Sesión"
        >
            <LogoutRoundedIcon />
            {showText && <span>Cerrar Sesión</span>}
        </button>
    );
};

export default AdminLogoutButton;
