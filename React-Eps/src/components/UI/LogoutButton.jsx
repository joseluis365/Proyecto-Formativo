import React from 'react';
import api from '@/Api/axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center justify-center rounded-full size-10 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
      title="Cerrar sesión"
    >
      <span className="material-symbols-outlined">
        logout
      </span>
    </button>
  );
};

export default LogoutButton;
