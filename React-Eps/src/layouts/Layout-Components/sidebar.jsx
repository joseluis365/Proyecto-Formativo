import SidebarDropdown from "./SidebarDropdown";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";

export default function Sidebar({ isOpen, onClose }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLabUser = user.id_rol === 3 && user.examenes === true;
  const isPersonalAdmin = user.id_rol === 3 && user.examenes !== true;
  const isSuperAdminOrAdmin = user.id_rol === 1 || user.id_rol === 2;

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
            <img
              src="/icono.png"
              alt="Saluvanta EPS"
              className="size-10 rounded-full object-cover block dark:hidden"
            />
            <img
              src="/icono_dark.png"
              alt="Saluvanta EPS"
              className="size-10 rounded-full object-cover hidden dark:block"
            />
            <div>
              <h1 className="text-gray-900 dark:text-white text-base font-bold">
                Saluvanta EPS
              </h1>
              <p className="text-neutral-gray-text dark:text-gray-400 text-sm">
                Gestión Administrativa  
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-6 grow">
            <div className="flex flex-col gap-2">
              {(isSuperAdminOrAdmin || isLabUser) && !isLabUser && <SidebarItem to="/dashboard" icon="home" label="Inicio" onClick={onClose} />}
              
              {isSuperAdminOrAdmin && (
                <>
                  <SidebarDropdown icon="group" label="Usuarios" basePath="/usuarios">
                    <SidebarSubItem to="/usuarios/personal" label="Personal" />
                    <SidebarSubItem to="/usuarios/medicos" label="Medicos" />
                    <SidebarSubItem to="/usuarios/pacientes" label="Pacientes" />
                    <SidebarSubItem to="/usuarios/farmaceuticos" label="Farmaceuticos" />
                  </SidebarDropdown>
                  <SidebarItem to="/citas/agenda" icon="calendar_month" label="Agenda de Citas" />
                  <SidebarItem to="/pqrs" icon="forum" label="PQRS" />
                  <SidebarItem to="/reportes" icon="bar_chart" label="Reportes" />
                </>
              )}
              
              {/* Módulo Laboratorio / Exámenes Clínicos (Opciones Individuales si es Personal de Examenes) */}
              {isLabUser && (
                <>
                  <SidebarItem to="/examenes/agenda" icon="science" label="Agenda de Exámenes" onClick={onClose} />
                  <SidebarItem to="/examenes/categorias" icon="category" label="Tipos de Exámenes" onClick={onClose} />
                  <SidebarItem to="/examenes/reportes" icon="bar_chart" label="Reportes" onClick={onClose} />
                </>
              )}

              {/* Módulo Personal Administrativo Normal (Rol 3 sin examenes) */}
              {isPersonalAdmin && (
                <>
                  <SidebarItem to="/personal/dashboard" icon="home" label="Inicio" onClick={onClose} />
                  <SidebarItem to="/personal/pacientes" icon="group" label="Pacientes" onClick={onClose} />
                  <SidebarItem to="/personal/agenda" icon="calendar_month" label="Agenda de Citas" onClick={onClose} />
                  <SidebarItem to="/personal/pqrs" icon="forum" label="PQRS" onClick={onClose} />
                  <SidebarItem to="/personal/reportes" icon="bar_chart" label="Reportes" onClick={onClose} />
                </>
              )}

              {/* Gestión Interna (Solo Admins Normales - Super y Admin regulares) */}
              {(isSuperAdminOrAdmin && !isLabUser) && (
              <SidebarDropdown icon="settings" label="Gestión Interna" basePath="/configuracion">
                <SidebarSubItem to="/configuracion/prioridades" label="Prioridades" />
                <SidebarSubItem to="/configuracion/tipos-cita" label="Tipos de Cita" />
                <SidebarSubItem to="/configuracion/categorias-examen" label="Categorías de Examen" />
                <SidebarSubItem to="/configuracion/categorias-medicamento" label="Categorías de Medicamento" />
                <SidebarSubItem to="/configuracion/especialidades" label="Especialidades" />
                <SidebarSubItem to="/configuracion/farmacias" label="Farmacias" />
                <SidebarSubItem to="/configuracion/departamentos" label="Departamentos" />
                <SidebarSubItem to="/configuracion/ciudades" label="Ciudades" />
                <SidebarSubItem to="/configuracion/roles" label="Roles" />
                <SidebarSubItem to="/configuracion/estados" label="Estados" />
                <SidebarSubItem to="/configuracion/concentraciones" label="Concentraciones" />
                <SidebarSubItem to="/configuracion/formas-farmaceuticas" label="Formas Farmacéuticas" />
                <SidebarSubItem to="/configuracion/medicamentos" label="Medicamentos" />
                <SidebarSubItem to="/configuracion/presentaciones" label="Presentaciones" />
                <SidebarSubItem to="/configuracion/enfermedades" label="Enfermedades" />
              </SidebarDropdown>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
