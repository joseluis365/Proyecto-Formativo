import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SuperAdminHeader() {
    const [open, setOpen] = useState(false);

    // Bloquear scroll cuando el menú está abierto
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    const closeMenu = () => setOpen(false);
    const navLinkStyles = ({ isActive }) => 
    isActive 
        ? "text-blue-600 font-bold" 
        : "text-slate-600 hover:text-blue-500 transition-colors";

    return (
        <>
            {/* HEADER */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 md:px-10 lg:px-40 py-2.5 flex items-center">

                {/* MENU DESKTOP */}
                <div className="hidden md:flex flex-1 justify-between gap-8 items-center">
                    <div>
                        
                    </div>
                    <nav className="flex items-center gap-6 mx-auto">
                        <NavLink className={navLinkStyles} to="/SuperAdmin-Dashboard">Inicio</NavLink>
                        <NavLink className={navLinkStyles} to="/Empresas">Empresas</NavLink>
                        <NavLink className={navLinkStyles} to="/Licencias">Licencias</NavLink>
                        <NavLink className={navLinkStyles} to="/Historial">Historial</NavLink>
                    </nav>

                    <Link to="/login">
                        <button
                            type="button"
                            className="w-10 h-10 flex items-center justify-center rounded-full 
                            bg-primary text-white hover:bg-primary/90 
                            transition"
                        >
                            <span className="material-symbols-outlined text-3xl">
                                person
                            </span>
                        </button>
                    </Link>
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
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl
                transform transition-transform duration-300 ease-in-out
                ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-6 flex flex-col h-full gap-6">

                    {/* HEADER MENU */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Menú</h3>
                        <button onClick={closeMenu} className="text-2xl">
                            ✕
                        </button>
                    </div>

                    {/* LINKS */}
                    <nav className="flex flex-col gap-4 text-sm font-semibold">
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/SuperAdmin-Dashboard">Inicio</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/Empresas">Empresas</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/Licencias">Licencias</NavLink>
                        <NavLink className={navLinkStyles} onClick={closeMenu} to="/Historial">Historial</NavLink>
                    </nav>

                    {/* CTA */}
                    <Link to="/login" onClick={closeMenu} className="mt-auto">
                        <button className="cursor-pointer w-full bg-primary text-white rounded-lg px-5 py-2 font-bold">
                            Iniciar Sesión
                        </button>
                    </Link>
                </div>
            </aside>
        </>
    );
}