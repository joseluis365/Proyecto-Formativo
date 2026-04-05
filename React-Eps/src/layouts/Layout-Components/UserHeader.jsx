import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import { useLayout } from "../../LayoutContext";
import MuiIcon from "../../components/UI/MuiIcon";

function NavItem({ to, label, icon }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) => `
                flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs tracking-wide
                ${isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }
            `}
        >
            <MuiIcon name={icon} sx={{ fontSize: '1.125rem' }} />
            <span>{label}</span>
        </NavLink>
    );
}

export default function UserHeader() {
    const { setIsHelpOpen } = useLayout();
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
            await api.post('/logout');
            console.log("Sesión de usuario cerrada en el servidor (Mobile)");
        } catch (error) {
            console.error("Error al cerrar sesión de usuario", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
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

                {/* LOGO & BRANDING */}
                <div className="flex items-center gap-3 text-primary flex-1 min-w-max">
                    <img src="/icono.png" alt="Saluvanta EPS" className="size-8 rounded-lg object-cover block dark:hidden" />
                    <img src="/icono_dark.png" alt="Saluvanta EPS" className="size-8 rounded-lg object-cover hidden dark:block" />
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white hidden sm:block whitespace-nowrap">
                        Saluvanta EPS
                    </h2>
                </div>

                {/* MENU DESKTOP (CENTRAL - TIPO RAMA DAVID) */}
                <div className="hidden lg:flex items-center justify-center flex-2">
                    <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/40 p-1.5 rounded-2xl border border-gray-100/50 dark:border-gray-800">
                        <NavItem to="/paciente" label="Inicio" icon="dashboard" />
                        <NavItem to="/paciente/agendar" label="Agendar" icon="add_circle" />
                        <NavItem to="/paciente/citas" label="Mis Citas" icon="event_available" />
                        <NavItem to="/paciente/citas" label="Mis Citas" icon="event_available" />
                    </div>
                </div>

                {/* SECCIÓN DERECHA */}
                <div className="flex items-center justify-end gap-3 flex-1">
                    {/* Botón de Ayuda */}
                    <button
                        title="Ver ayuda"
                        onClick={() => setIsHelpOpen(true)}
                        className="p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                        <MuiIcon name="help" sx={{ fontSize: '1.375rem' }} />
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none flex items-center justify-center"
                        title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                        <MuiIcon 
                            name={isDarkMode ? 'dark_mode' : 'light_mode'} 
                            sx={{ fontSize: '1.25rem' }} 
                        />
                    </button>
                </div>

                {/* BOTÓN HAMBURGUESA MOBILE */}
                <div className="md:hidden flex justify-start items-center ml-2">
                    <button
                        onClick={() => setOpen(true)}
                        className="text-2xl cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <MuiIcon name="menu" sx={{ fontSize: '1.75rem' }} className="dark:text-white" />
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
                        <button onClick={closeMenu} className="text-2xl cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
                            ✕
                        </button>
                    </div>

                    {/* LINKS */}
                    <nav className="flex flex-col gap-4 text-sm font-semibold text-slate-600 dark:text-white">
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/paciente">Inicio</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/paciente/agendar">Agendar Cita</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/paciente/citas">Mis Citas</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/paciente/perfil">Mi Perfil</NavLink>
                    </nav>

                    <div className="flex-1 mt-4">
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center cursor-pointer gap-3 w-full p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 transition-colors focus:outline-none"
                        >
                            <MuiIcon 
                                name={isDarkMode ? 'dark_mode' : 'light_mode'} 
                                sx={{ fontSize: '1.25rem' }} 
                            />
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