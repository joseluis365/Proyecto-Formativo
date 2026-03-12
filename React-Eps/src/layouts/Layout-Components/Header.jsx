import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/UI/ThemeToggle";
import LogoutButton from "@/components/UI/LogoutButton";

export default function Header({ onMenuClick, title, subtitle, children }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-neutral-gray-border/20 dark:border-gray-800 px-8 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <button
                onClick={onMenuClick}
                className="lg:hidden pr-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-wrap justify-between gap-3 items-center flex-1">
                <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">{title}</p>
                    <p className="text-neutral-gray-text dark:text-gray-400 text-sm font-normal leading-normal md:text-base truncate whitespace-normal">
                        {subtitle}
                    </p>
                </div>
                <div className="hidden lg:block">
                    {children}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user.rol?.id_rol === 3 && (
                    <div className="hidden sm:flex items-center justify-center rounded-full size-10 bg-primary/10 text-primary transition-all" title="Empresa Colaboradora">
                        <span className="material-symbols-outlined font-bold">corporate_fare</span>
                    </div>
                )}
                <button
                    className="flex items-center justify-center rounded-full size-10 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <ThemeToggle />
                <div
                    onClick={() => navigate(user.rol?.id_rol === 4 ? '/paciente/perfil' : '/medico/perfil')}
                    title="Mi Perfil"
                    className="flex items-center justify-center rounded-full size-10 bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined">account_circle</span>
                </div>
                <LogoutButton />
            </div>
        </header>
    );
}
