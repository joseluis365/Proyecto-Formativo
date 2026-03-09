import SidebarItem from "./SidebarItem";

export default function PatientSidebar({ isOpen, onClose }) {
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
                    {/* Header */}
                    <div className="flex items-center gap-3 p-3">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                            style={{
                                backgroundImage:
                                    'url("https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-usuario_157943-15752.jpg")',
                            }}
                        />
                        <div>
                            <h1 className="text-gray-900 dark:text-white text-base font-bold">
                                Portal Paciente
                            </h1>
                            <p className="text-neutral-gray-text dark:text-gray-400 text-xs">
                                Mi Salud Integral
                            </p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="mt-6 grow">
                        <div className="flex flex-col gap-2">
                            <SidebarItem to="/paciente" icon="home" label="Inicio" onClick={onClose} />
                            <SidebarItem to="/paciente/agendar" icon="add_circle" label="Agendar Cita" onClick={onClose} />
                            <SidebarItem to="/paciente/citas" icon="calendar_month" label="Mis Citas" onClick={onClose} />
                            <SidebarItem to="/paciente/historial" icon="history" label="Mi Historial" onClick={onClose} />
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
