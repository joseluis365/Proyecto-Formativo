import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import MuiIcon from "../../components/UI/MuiIcon";

export default function IndexHeader() {
    const [open, setOpen] = useState(false);

    const { isDarkMode, toggleDarkMode } = useTheme();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
            }
        }
    }, []);

    // Bloquear scroll cuando el menú está abierto
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    const closeMenu = () => setOpen(false);
    const navLinkStyles = ({ isActive }) =>
        isActive
            ? "text-blue-600 font-bold"
            : "text-slate-600 dark:text-gray-200 hover:text-blue-500 transition-colors";

    return (
        <>
            {/* HEADER */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-gray-600 bg-white/90 dark:bg-gray-900 backdrop-blur-md px-6 md:px-10 lg:px-40 py-2.5 flex items-center justify-between">

                {/* LOGO */}
                <div className="flex items-center gap-3 text-primary">
                    <img src="/icono.png" alt="Saluvanta EPS" className="size-8 rounded-lg object-cover block dark:hidden" />
                    <img src="/icono_dark.png" alt="Saluvanta EPS" className="size-8 rounded-lg object-cover hidden dark:block" />
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        Saluvanta EPS
                    </h2>
                </div>

                {/* MENU DESKTOP */}
                <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                    <nav className="flex items-center gap-6">
                        <NavLink className={navLinkStyles} to="/">Inicio</NavLink>
                        <NavLink className={navLinkStyles} to="/SobreNosotros">Sobre Nosotros</NavLink>
                        <NavLink className={navLinkStyles} to="/Contactenos">Contáctenos</NavLink>
                        <NavLink className={navLinkStyles} to="/Licencias">Planes</NavLink>
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to={user.id_rol === 1 ? "/SuperAdmin-Dashboard" : user.id_rol === 6 ? "/farmacia/dashboard" : "/dashboard"}>
                                <button className="cursor-pointer bg-primary text-white rounded-lg px-5 py-2 text-sm font-bold flex items-center gap-2">
                                    <MuiIcon name="dashboard" sx={{ fontSize: '1rem' }} />
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <button className="cursor-pointer bg-primary text-white rounded-lg px-5 py-2 text-sm font-bold">
                                    Iniciar Sesión
                                </button>
                            </Link>
                        )}

                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none flex items-center justify-center"
                            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        >
                            <MuiIcon name={isDarkMode ? 'dark_mode' : 'light_mode'} sx={{ fontSize: '20px' }} />
                        </button>
                    </div>
                </div>

                {/* BOTÓN HAMBURGUESA */}
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden text-2xl text-slate-900 dark:text-white"
                >
                    ☰
                </button>
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
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/">Inicio</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/SobreNosotros">Sobre Nosotros</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/Contactenos">Contáctenos</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/Licencias">Licencias</NavLink>
                    </nav>

                    <div className="flex-1 mt-4">
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center gap-3 w-full p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 transition-colors focus:outline-none"
                        >
                            <MuiIcon name={isDarkMode ? 'dark_mode' : 'light_mode'} sx={{ fontSize: '20px' }} />
                            <span className="font-semibold">{isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
                        </button>
                    </div>

                    {/* CTA */}
                    {user ? (
                        <Link to={user.id_rol === 1 ? "/SuperAdmin-Dashboard" : user.id_rol === 6 ? "/farmacia/dashboard" : "/dashboard"} onClick={closeMenu}>
                            <button className="cursor-pointer w-full bg-primary text-white rounded-lg px-5 py-2 font-bold flex items-center justify-center gap-2">
                                <MuiIcon name="dashboard" sx={{ fontSize: '1.25rem' }} />
                                Dashboard
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login" onClick={closeMenu}>
                            <button className="cursor-pointer w-full bg-primary text-white rounded-lg px-5 py-2 font-bold">
                                Iniciar Sesión
                            </button>
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
