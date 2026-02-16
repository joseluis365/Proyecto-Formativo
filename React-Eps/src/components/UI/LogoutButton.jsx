import React from 'react';
import api from '../../Api/axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 1. Obtener el token guardado (ajusta según donde lo guardes)
    const token = localStorage.getItem('access_token');

    try {
      // 2. Llamada al controlador de Laravel
      await api.post('/superadmin/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Sesión cerrada en el servidor");
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor", error);
      // Opcional: Aunque falle la red, es buena práctica limpiar el cliente
    } finally {
      // 3. Limpiar datos locales y redirigir siempre
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      navigate('/SuperAdmin-login'); 
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