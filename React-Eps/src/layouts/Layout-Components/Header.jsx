import ThemeToggle from "@/components/UI/ThemeToggle";
import LogoutButton from "@/components/UI/LogoutButton";

export default function Header({ onMenuClick, title, subtitle }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-neutral-gray-border/20 dark:border-gray-800 px-6 md:px-8 py-4 bg-background-light/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="flex items-center gap-4 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                    <span className="material-symbols-outlined">menu_open</span>
                </button>
                <div className="flex flex-col gap-0.5 min-w-0">
                    <h1 className="text-gray-900 dark:text-white text-xl md:text-2xl font-black tracking-tight truncate">{title}</h1>
                    {subtitle && (
                        <p className="text-neutral-gray-text dark:text-gray-400 text-xs md:text-sm font-medium truncate hidden sm:block">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:flex items-center gap-2">
                    <ThemeToggle />
                </div>
                
                <div className="flex items-center gap-1 md:gap-2 px-1 py-1 bg-gray-100/50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <button
                        className="flex items-center justify-center rounded-xl size-10 hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all shadow-sm group"
                        title="Notificaciones"
                    >
                        <span className="material-symbols-outlined group-active:scale-90 transition-transform">notifications</span>
                    </button>
                    
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

                    <div className="flex items-center gap-3 pl-1 pr-2">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-black text-gray-900 dark:text-white leading-none">
                                {user.primer_nombre} {user.primer_apellido}
                            </span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                                {user.rol?.nombre_rol || 'Usuario'}
                            </span>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 aspect-square rounded-xl size-9 flex items-center justify-center overflow-hidden mr-2">
                            <span className="material-symbols-outlined text-primary text-xl">person</span>
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 mr-2" />
                        
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
}

