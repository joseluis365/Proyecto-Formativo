import { Link } from "react-router-dom";
import AdminLogoutButton from "../../components/UI/AdminLogoutButton";
import HelpModal from "../../components/UI/HelpModal";
import { useEffect, useState } from "react";
import { useLayout } from "../../LayoutContext";

export default function Header({ onMenuClick, title, subtitle, children }) {
    const [profilePath, setProfilePath] = useState("/Perfil");
    const { helpContent, setIsHelpOpen } = useLayout();

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.id_rol === 6) {
                    setProfilePath("/farmacia/perfil");
                } else if (user.id_rol === 4) {
                    setProfilePath("/medico/perfil");
                }
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <>
            <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-neutral-gray-border/20 dark:border-gray-800 px-8 py-4 bg-background-light/80 dark:bg-gray-800 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden pr-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                            <span className="material-symbols-outlined dark:text-white">menu</span>
                        </button>
                    )}
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold leading-tight">{title}</p>
                        <p className="text-neutral-gray-text dark:text-gray-400 text-sm font-normal leading-normal md:text-base truncate whitespace-normal">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Contenido inyectado central (Navegación, etc) */}
                <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
                    {children}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center justify-center rounded-full size-10 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>

                    {/* Botón de Ayuda Contextual */}
                    <button
                        onClick={() => helpContent && setIsHelpOpen(true)}
                        title={helpContent ? "Ver ayuda de esta pantalla" : "No hay ayuda disponible para esta vista"}
                        className={`flex items-center justify-center rounded-full size-10 transition-all
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
                        className="flex items-center justify-center rounded-full size-10 bg-primary/10 hover:bg-primary/20 dark:bg-primary/40 text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">account_circle</span>
                    </Link>
                    {/* Botón de Cerrar Sesión */}
                    <AdminLogoutButton
                        className="flex items-center justify-center rounded-full size-10 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500"
                    />
                </div>
            </header>

            {/* Modal de ayuda contextual (se monta una vez, lee el contexto) */}
            <HelpModal />
        </>
    );
}

