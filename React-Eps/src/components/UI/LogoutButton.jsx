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
      className="w-10 h-10 flex items-center justify-center rounded-full 
        bg-primary text-white hover:bg-primary/90 
        transition cursor-pointer"
    >
      <span className="material-symbols-outlined text-2xl">
        logout
      </span>
    </button>
  );
};

export default LogoutButton;
