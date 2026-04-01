/*
 * Header compartido de layouts internos.
 * Muestra titulo, accesos rapidos y ayuda contextual.
 */
import { Link } from "react-router-dom";
import AdminLogoutButton from "../../components/UI/AdminLogoutButton";
import HelpModal from "../../components/UI/HelpModal";
import { useEffect, useState } from "react";
import { useLayout } from "../../LayoutContext";

export default function Header({ onMenuClick, title, subtitle, children, hamburger, hideLogout }) {
    const [profilePath, setProfilePath] = useState("/Perfil");
    const { helpContent, setIsHelpOpen } = useLayout();
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.id_rol === 6) {
                    setProfilePath("/farmacia/perfil");
                } else if (user.id_rol === 4) {
                    setProfilePath("/medico/perfil");
                } else if (user.id_rol === 5) {
                    setProfilePath("/paciente/perfil");
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-10 flex items-start sm:items-center justify-between gap-4 border-b border-neutral-gray-border/20 dark:border-gray-800 px-4 sm:px-8 py-4 bg-background-light/80 dark:bg-gray-800 backdrop-blur-sm">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Hamburger menu — md to lg gap only */}
                    {hamburger && (
                        <div className="hidden md:flex lg:hidden items-center shrink-0">
                            {hamburger}
                        </div>
                    )}
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden pr-1 sm:pr-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
                            <span className="material-symbols-outlined dark:text-white">menu</span>
                        </button>
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="text-gray-900 dark:text-white text-xl sm:text-2xl md:text-3xl font-bold leading-tight wrap-break-word whitespace-normal">{title}</div>
                        </div>
                        <p className="text-neutral-gray-text dark:text-gray-400 text-[11px] sm:text-sm font-medium leading-normal wrap-break-word whitespace-normal">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Top-bar nav — lg+ screens only */}
                {children && (
                    <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
                        {children}
                    </div>
                )}


                <div className="flex items-center gap-1 sm:gap-2 shrink-0">

                    {/* Botón de Ayuda Contextual */}
                    <button
                        onClick={() => helpContent && setIsHelpOpen(true)}
                        title={helpContent ? "Ver ayuda de esta pantalla" : "No hay ayuda disponible para esta vista"}
                        className={`flex items-center justify-center rounded-full size-9 sm:size-10 transition-all
                            ${helpContent
                                ? "hover:bg-primary/10 dark:hover:bg-primary/20 text-primary cursor-pointer"
                                : "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                            }`}
                    >
                        <span className="material-symbols-outlined">help</span>
                    </button>

                    {/* Botón de Perfil */}
                    <Link
                        to={profilePath}
                        title="Mi Perfil"
                        className="flex items-center justify-center rounded-full size-9 sm:size-10 bg-primary/10 hover:bg-primary/20 dark:bg-primary/40 text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">account_circle</span>
                    </Link>

                    {/* Botón de Cerrar Sesión — oculto en pantallas < 768px o cuando hideLogout = true */}
                    {!hideLogout && !isSmallScreen && (
                        <AdminLogoutButton
                            className="flex items-center justify-center rounded-full size-9 sm:size-10 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500"
                        />
                    )}
                </div>
            </header>

            {/* Modal de ayuda contextual */}
            <HelpModal />
        </>
    );
}


