import Header from "./Layout-Components/Header";
import { Outlet, NavLink } from "react-router-dom";

export default function SuperAdminLayout() {
    const navLinkStyles = ({ isActive }) =>
        `flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs tracking-wide ${
            isActive
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        }`;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <Header title="SuperAdmin" subtitle="Panel de Control Global">
                <nav className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/40 p-1.5 rounded-2xl border border-gray-100/50 dark:border-gray-800">
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Dashboard">Inicio</NavLink>
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Empresas">Empresas</NavLink>
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Licencias">Planes</NavLink>
                    <NavLink className={navLinkStyles} to="/SuperAdmin-Historial">Historial</NavLink>
                </nav>
            </Header>
            <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900/70">
                <Outlet />
            </main>
        </div>
    );
}
