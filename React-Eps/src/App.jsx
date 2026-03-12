import { Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/AdminLayout"
import DoctorLayout from "./layouts/DoctorLayout"
import Personal from "./Pages/Admin/Personal"
import Dashboard from "./Pages/Admin/Dashboard"
import Medicos from "./Pages/Admin/Medicos"
import Pacientes from "./Pages/Admin/Pacientes"
import AgendaMedico from "./Pages/Admin/AgendaMedico"
// Portal Médico — páginas propias
import AgendaMedicoPD from "./Pages/Medico/AgendaMedico"
import MisPacientesPD from "./Pages/Medico/MisPacientes"
import Perfil from "./Pages/Perfil"
import HistorialPacienteMedicoPD from "./Pages/Medico/HistorialPacienteMedico"
import InfoPaciente from "./Pages/Admin/InfoPaciente"
import Reportes from "./Pages/Admin/Reportes/Reportes"
import CitasDelDia from "./Pages/Admin/Citas/CitasDelDia"
import AgendaCitas from "./Pages/Admin/Citas/AgendaCitas"
import IndexLayout from "./layouts/IndexLayout"
import Index from "./Pages/Inicio/Index"
import Contactenos from "./Pages/Inicio/Contactenos"
import SobreNosotros from "./Pages/Inicio/SobreNosotros"
import LoginLayout from "./layouts/LoginLayout"
import Login from "./Pages/Inicio/Login"
import ConfirmEmail from "./Pages/Inicio/ConfirmEmail"
import VerifyCode from "./Pages/Inicio/VerifyCode"
import ResetPassword from "./Pages/Inicio/ResetPassword"
import SuperAdminLogin from "./Pages/SuperAdmin/SuperAdminLogin"
import SuperAdminVerify from "./Pages/SuperAdmin/SuperAdminVerify"
import SuperAdminDashboard from "./Pages/SuperAdmin/SuperAdminDashboard"
import SuperAdminLayout from "./layouts/SuperAdminLayout"
import SuperAdminEmpresas from "./Pages/SuperAdmin/SuperAdminEmpresas"
import SuperAdminLicencias from "./Pages/SuperAdmin/SuperAdminLicencias"
import SuperAdminHistorial from "./Pages/SuperAdmin/SuperAdminHistorial"
import Licencias from "./Pages/Inicio/Licencias"
import Pago from "./Pages/Inicio/Pago"

import SuperAdminForgotPassword from "./Pages/SuperAdmin/SuperAdminForgotPassword"
import SuperAdminRecoveryCode from "./Pages/SuperAdmin/SuperAdminRecoveryCode"
import SuperAdminResetPassword from "./Pages/SuperAdmin/SuperAdminResetPassword"

import { useEffect } from "react";
import SuperAdminRoute from "./components/Routes/SuperAdminRoute"
import AdminRoute from "@/components/Routes/AdminRoute"
import PatientRoute from "@/components/Routes/PatientRoute"
import MedicoRoute from "@/components/Routes/MedicoRoute"

// Configuración
import ConfiguracionIndex from "./Pages/Admin/Configuracion/ConfiguracionIndex"
import Prioridades from "./Pages/Admin/Configuracion/Prioridades"
import TiposCita from "./Pages/Admin/Configuracion/TiposCita"
import CategoriasExamen from "./Pages/Admin/Configuracion/CategoriasExamen"
import CategoriasMedicamento from "./Pages/Admin/Configuracion/CategoriasMedicamento"
import Especialidades from "./Pages/Admin/Configuracion/Especialidades"
import Ubicaciones from "./Pages/Admin/Configuracion/Ubicaciones"
import Farmacias from "./Pages/Admin/Configuracion/Farmacias"
import Departamentos from "./Pages/Admin/Configuracion/Departamentos"
import Ciudades from "./Pages/Admin/Configuracion/Ciudades"
import Roles from "./Pages/Admin/Configuracion/Roles"
import Estados from "./Pages/Admin/Configuracion/Estados"

// Portal Paciente
import PatientLayout from "./layouts/PatientLayout"
import IndexPaciente from "./Pages/Paciente/IndexPaciente"
import AgendarCita from "./Pages/Paciente/AgendarCita"
import MisCitas from "./Pages/Paciente/MisCitas"
import HistorialPaciente from "./Pages/Paciente/HistorialPaciente"
import PerfilPaciente from "./Pages/Paciente/PerfilPaciente"

export default function App() {
  // Global Dark Mode Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  return (
    <Routes>
      <Route path="/SuperAdmin-Login" element={<SuperAdminLogin />} />
      <Route path="/SuperAdmin-Verify" element={<SuperAdminVerify />} />
      <Route path="/SuperAdmin-ForgotPassword" element={<SuperAdminForgotPassword />} />
      <Route path="/SuperAdmin-RecoveryCode" element={<SuperAdminRecoveryCode />} />
      <Route path="/SuperAdmin-ResetPassword" element={<SuperAdminResetPassword />} />
      <Route path="/Pago" element={<Pago />} />

      {/* Rutas Protegidas SuperAdmin — Aisladas bajo prefijo para evitar colisiones con otros roles */}
      <Route path="/SuperAdmin-*" element={<SuperAdminRoute />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="Dashboard" element={<SuperAdminDashboard />} />
          <Route path="Empresas" element={<SuperAdminEmpresas />} />
          <Route path="Licencias" element={<SuperAdminLicencias />} />
          <Route path="Historial" element={<SuperAdminHistorial />} />
        </Route>
      </Route>

      {/* Portal Paciente — Protegido por rol */}
      <Route element={<PatientRoute />}>
        <Route element={<PatientLayout />}>
          <Route path="/paciente" element={<IndexPaciente />} />
          <Route path="/paciente/agendar" element={<AgendarCita />} />
          <Route path="/paciente/citas" element={<MisCitas />} />
          <Route path="/paciente/historial" element={<HistorialPaciente />} />
          <Route path="/paciente/perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route element={<MedicoRoute />}>
        <Route element={<DoctorLayout />}>
          <Route path="/medico/agenda" element={<AgendaMedicoPD />} />
          <Route path="/medico/pacientes" element={<MisPacientesPD />} />
          <Route path="/medico/pacientes/historial/:doc" element={<HistorialPacienteMedicoPD />} />
          <Route path="/medico/perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route element={<IndexLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/Contactenos" element={<Contactenos />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
        <Route path="/Licencias" element={<Licencias />} />
      </Route>
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/code-verification" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      {/* Panel Admin — Protegido por rol */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios/personal" element={<Personal />} />
          <Route path="/usuarios/medicos" element={<Medicos />} />
          <Route path="/usuarios/pacientes" element={<Pacientes />} />
          <Route path="/usuarios/pacientes/info-paciente" element={<InfoPaciente />} />
          <Route path="/usuarios/medicos/agenda-medico/:doc" element={<AgendaMedico />} />
          <Route path="/citas/del-dia" element={<CitasDelDia />} />
          <Route path="/citas/agenda" element={<AgendaCitas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/admin/perfil" element={<Perfil />} />

          {/* Configuración */}
          <Route path="/configuracion" element={<ConfiguracionIndex />}>
            <Route path="prioridades" element={<Prioridades />} />
            <Route path="tipos-cita" element={<TiposCita />} />
            <Route path="categorias-examen" element={<CategoriasExamen />} />
            <Route path="categorias-medicamento" element={<CategoriasMedicamento />} />
            <Route path="especialidades" element={<Especialidades />} />
            <Route path="ubicaciones" element={<Ubicaciones />} />
            <Route path="farmacias" element={<Farmacias />} />
            <Route path="departamentos" element={<Departamentos />} />
            <Route path="ciudades" element={<Ciudades />} />
            <Route path="roles" element={<Roles />} />
            <Route path="estados" element={<Estados />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

