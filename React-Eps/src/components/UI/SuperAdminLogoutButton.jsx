import React from 'react';
import superAdminApi from '../../Api/superadminAxios';
import { useNavigate } from 'react-router-dom';

const SuperAdminLogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Obtener el token guardado para SuperAdmin
        const token = sessionStorage.getItem('superadmin_token');

        try {
            // Llamada al controlador de Laravel con el nuevo axios
            await superAdminApi.post('/superadmin/logout');
            console.log("Sesión de SuperAdmin cerrada en el servidor");
        } catch (error) {
            console.error("Error al cerrar sesión de SuperAdmin en el servidor", error);
        } finally {
            // Limpiar datos locales y redirigir
            sessionStorage.removeItem('superadmin_token');
            sessionStorage.removeItem('superadmin_user');
            navigate('/SuperAdmin-Login');
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full 
        bg-primary text-white hover:bg-primary/90 
        transition cursor-pointer"
            title="Cerrar Sesión SuperAdmin"
        >
            <span className="material-symbols-outlined text-3xl">
                logout
            </span>
        </button>
    );
};

export default SuperAdminLogoutButton;
