import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import superAdminApi from "../../Api/superadminAxios";

import SuperAdminLogoutButton from "../../components/UI/SuperAdminLogoutButton";

export default function SuperAdminHeader() {
    const [open, setOpen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        setIsDarkMode(isDark);
    };

    // Bloquear scroll cuando el menú está abierto
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await superAdminApi.post('/superadmin/logout');
            console.log("Sesión de SuperAdmin cerrada en el servidor (Mobile)");
        } catch (error) {
            console.error("Error al cerrar sesión de SuperAdmin", error);
        } finally {
            sessionStorage.removeItem('superadmin_token');
            sessionStorage.removeItem('superadmin_user');
            sessionStorage.removeItem('superadmin_email');
            navigate('/SuperAdmin-Login');
        }
    };

    const closeMenu = () => setOpen(false);
    const navLinkStyles = ({ isActive }) =>
        isActive
            ? "text-blue-600 font-bold dark:text-blue-400"
            : "text-slate-600 hover:text-blue-500 transition-colors dark:text-white dark:hover:text-blue-400";

    return (
        <>
            {/* HEADER */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md px-6 md:px-10 lg:px-40 py-2.5 flex items-center justify-between">

                {/* ESPACIO IZQUIERDO (Para equilibrar el centro) */}
                <div className="hidden md:block flex-1"></div>

                {/* MENU DESKTOP (CENTRAL) */}
                <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Dashboard">Inicio</NavLink>
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Empresas">Empresas</NavLink>
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Licencias">Planes</NavLink>
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Historial">Historial</NavLink>
                </nav>

                {/* SECCIÓN DERECHA (PEGADA AL MARGEN) */}
                <div className="hidden md:flex items-center justify-end gap-2 flex-1">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none flex items-center justify-center"
                        title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {isDarkMode ? 'dark_mode' : 'light_mode'}
                        </span>
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded-full mr-2">
                        <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">admin_panel_settings</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider">SuperAdmin</span>
                    </div>

                    <SuperAdminLogoutButton />
                </div>

                {/* BOTÓN HAMBURGUESA */}
                <div className="md:hidden flex justify-start items-center">
                    <button
                        onClick={() => setOpen(true)}
                        className="md:hidden text-2xl cursor-pointer"
                    >
                        ☰
                    </button>
                </div>
            </header>

            {/* OVERLAY */}
            <div
                onClick={closeMenu}
                className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300
                ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* MENU MOBILE */}
            <aside
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-gray-900 dark:border-l dark:border-gray-800 shadow-xl
                transform transition-transform duration-300 ease-in-out
                ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-6 flex flex-col h-full gap-6">

                    {/* HEADER MENU */}
                    <div className="flex justify-between items-center text-gray-800 dark:text-gray-100">
                        <h3 className="text-lg font-bold">Menú</h3>
                        <button onClick={closeMenu} className="text-2xl hover:text-gray-600 dark:hover:text-gray-300">
                            ✕
                        </button>
                    </div>

                    {/* LINKS */}
                    <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-600 dark:text-white">
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/SuperAdmin-Dashboard">Inicio</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/SuperAdmin-Empresas">Empresas</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/SuperAdmin-Licencias">Licencias</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/SuperAdmin-Historial">Historial</NavLink>
                    </nav>

                    <div className="flex-1 mt-4">
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center gap-3 w-full p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 transition-colors focus:outline-none"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {isDarkMode ? 'dark_mode' : 'light_mode'}
                            </span>
                            <span className="font-semibold">{isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
                        </button>
                    </div>

                    {/* CTA */}

                    <button onClick={handleLogout} className="cursor-pointer w-full bg-primary text-white rounded-lg px-5 py-2 font-bold">
                        Cerrar Sesión
                    </button>

                </div>
            </aside>
        </>
    );
}
