import React from 'react';
import api from '../../Api/superadminAxios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 1. Obtener el token de superadmin desde sessionStorage
    const token = sessionStorage.getItem('superadmin_token');

    try {
      // 2. Llamada al controlador de Laravel usando la instancia superadminAxios
      await api.post('/superadmin/logout');

      console.log("Sesión de SuperAdmin cerrada en el servidor");
    } catch (error) {
      console.error("Error al cerrar sesión de SuperAdmin", error);
    } finally {
      // 3. Limpiar sessionStorage y redirigir al login de SuperAdmin
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
    >
      <span className="material-symbols-outlined text-3xl">
        person
      </span>
    </button>
  );
};

export default LogoutButton;
