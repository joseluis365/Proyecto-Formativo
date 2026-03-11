import SidebarItem from "./SidebarItem";

export default function DoctorSidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Overlay (solo mobile) */}
            <div
                onClick={onClose}
                className={`
                    fixed inset-0 bg-black/40 z-40 transition-opacity
                    ${isOpen ? "opacity-100 lg:hidden" : "opacity-0 pointer-events-none lg:hidden"}
                `}
            />

            {/* Sidebar panel */}
            <aside
                className={`
                    fixed lg:static top-0 left-0 z-50
                    w-64 h-full shrink-0
                    bg-white dark:bg-gray-900/50
                    border-r border-neutral-gray-border/20 dark:border-gray-800
                    flex flex-col
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Header / Brand */}
                    <div className="flex items-center gap-3 p-3">
                        <div className="bg-primary size-10 rounded-full shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-white text-xl font-bold">stethoscope</span>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-gray-900 dark:text-white text-base font-black leading-none mb-1">
                                Salud Integral
                            </h1>
                            <p className="text-primary text-[10px] font-black uppercase tracking-[2px]">
                                Portal Médico
                            </p>
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav className="mt-6 grow overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            <SidebarItem
                                to="/medico/agenda"
                                icon="calendar_today"
                                label="Mi Agenda"
                                onClick={onClose}
                            />
                            <SidebarItem
                                to="/medico/pacientes"
                                icon="people"
                                label="Mis Pacientes"
                                onClick={onClose}
                            />
                            <SidebarItem
                                to="/medico/perfil"
                                icon="person"
                                label="Mi Perfil"
                                onClick={onClose}
                            />
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
