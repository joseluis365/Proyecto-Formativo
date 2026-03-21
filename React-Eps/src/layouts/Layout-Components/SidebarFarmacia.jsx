import SidebarDropdown from "./SidebarDropdown";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";

export default function SidebarFarmacia({ isOpen, onClose }) {
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
          bg-white dark:bg-gray-800
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
                        <img src="/icono.png" alt="Saluvanta EPS" className="size-10 rounded-full object-cover block dark:hidden" />
                        <img src="/icono_dark.png" alt="Saluvanta EPS" className="size-10 rounded-full object-cover hidden dark:block" />
                        <div>
                            <h1 className="text-gray-900 dark:text-white text-base font-bold">
                                Saluvanta EPS
                            </h1>
                            <p className="text-neutral-gray-text dark:text-gray-400 text-sm">
                                Panel Farmacia
                            </p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="mt-6 grow">
                        <div className="flex flex-col gap-2">
                            <SidebarItem  to="/farmacia/dashboard" icon="home" label="Inicio" onClick={onClose} />
                            <SidebarItem to="/farmacia/inventario" icon="inventory_2" label="Inventario" onClick={onClose} />
                            <SidebarItem to="/farmacia/medicamentos" icon="medication" label="Medicamentos" onClick={onClose} />
                            <SidebarItem to="/farmacia/movimientos" icon="swap_horiz" label="Movimientos" onClick={onClose} />
                            <SidebarItem to="/farmacia/reportes" icon="bar_chart" label="Reportes" onClick={onClose} />
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
