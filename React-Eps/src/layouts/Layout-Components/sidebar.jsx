import SidebarDropdown from "./SidebarDropdown";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";

export default function Sidebar({ isOpen, onClose }) {
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
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8BuQ6_MKI0ZY9bYYQaNC3Nhs-jNSjBCulSOKjA8DvKERRh_kzKdh6zxMs6nDID93VCAIR-xh5ieBovBudkSfZOC2x-JxjpuWWwSw5hEhH4tk8BWBRRXmelKD_P4ar3bLS0kBn302EEW9ecT4p_pVXCClHHyUZ0iyUFnI3bCCB5vv0we2rswgKg3XEosiY9DZJE9a4SR7upNACuI_CxKEGuKEZwD7o0seDCt2eurCVC_79nO9sNDIOLPj3yWzttSVgnsjZQerFkaez")',
              }}
            />
            <div>
              <h1 className="text-gray-900 dark:text-white text-base font-medium">
                Salud Integral
              </h1>
              <p className="text-neutral-gray-text dark:text-gray-400 text-sm">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-6 grow">
            <div className="flex flex-col gap-2">
              <SidebarItem to="/dashboard" icon="home" label="Inicio" onClick={onClose} />
              <SidebarDropdown icon="group" label="Usuarios" basePath="/usuarios">
                <SidebarSubItem to="/usuarios/personal" label="Personal" />
                <SidebarSubItem to="/usuarios/medicos" label="Medicos" />
                <SidebarSubItem to="/usuarios/pacientes" label="Pacientes" />
              </SidebarDropdown>
              <SidebarItem to="/farmacia" icon="pill" label="Farmacia" />
              <SidebarItem to="/citas" icon="calendar_month" label="Citas" />
              <SidebarItem to="/reportes" icon="bar_chart" label="Reportes" />
              <SidebarDropdown icon="settings" label="Gestión Interna" basePath="/configuracion">
                <SidebarSubItem to="/configuracion/prioridades" label="Prioridades" />
                <SidebarSubItem to="/configuracion/tipos-cita" label="Tipos de Cita" />
                <SidebarSubItem to="/configuracion/categorias-examen" label="Categorías de Examen" />
                <SidebarSubItem to="/configuracion/categorias-medicamento" label="Categorías de Medicamento" />
                <SidebarSubItem to="/configuracion/especialidades" label="Especialidades" />
              </SidebarDropdown>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
