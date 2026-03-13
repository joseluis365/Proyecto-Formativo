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
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8BuQ6_MKI0ZY9bYYQaNC3Nhs-jNSjBCulSOKjA8DvKERRh_kzKdh6zxMs6nDID93VCAIR-xh5ieBovBudkSfZOC2x-JxjpuWWwSw5hEhH4tk8BWBRRXmelKD_P4ar3bLS0kBn302EEW9ecT4p_pVXCClHHyUZ0iyUFnI3bCCB5vv0we2rswgKg3XEosiY9DZJE9a4SR7upNACuI_CxKEGuKEZwD7o0seDCt2eurCVC_79nO9sNDIOLPj3yWzttSVgnsjZQerFkaez")',
                            }}
                        />
                        <div className="min-w-0">
                            <h1 className="text-gray-900 dark:text-white text-base font-medium">
                                Salud Integral
                            </h1>
                            <p className="text-neutral-gray-text dark:text-gray-400 text-sm">
                                Portal Médico
                            </p>
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav className="mt-6 grow overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            <SidebarItem
                                to="/medico/agenda"
                                icon="calendar_month"
                                label="Mi Agenda"
                                onClick={onClose}
                            />
                            <SidebarItem
                                to="/medico/pacientes"
                                icon="group"
                                label="Pacientes"
                                onClick={onClose}
                            />

                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
