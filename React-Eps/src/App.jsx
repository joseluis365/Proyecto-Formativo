import { Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/AdminLayout"
import Personal from "./Pages/Admin/Personal"
import Farmaceutico from "./Pages/Admin/Farmaceutico"
import Dashboard from "./Pages/Admin/Dashboard"
import Medicos from "./Pages/Admin/Medicos"
import Pacientes from "./Pages/Admin/Pacientes"
import AgendaMedico from "./Pages/Admin/AgendaMedico"
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
import LoginVerify2FA from "./Pages/Inicio/LoginVerify2FA"
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
import SuperAdminEstados from "./Pages/SuperAdmin/GestionInterna/SuperAdminEstados"
import SuperAdminRoles from "./Pages/SuperAdmin/GestionInterna/SuperAdminRoles"
import SuperAdminDepartamentos from "./Pages/SuperAdmin/GestionInterna/SuperAdminDepartamentos"
import SuperAdminCiudades from "./Pages/SuperAdmin/GestionInterna/SuperAdminCiudades"


// (Layout de UserLayout ha sido eliminado, ya que los pacientes usan PatientLayout ahora)

import { useEffect } from "react";
import SuperAdminRoute from "./components/Routes/SuperAdminRoute"
import AuthRoute from "./components/Routes/AuthRoute"
import AdminRoute from "./components/Routes/AdminRoute"
import ExamenRoute from "./components/Routes/ExamenRoute"
import PersonalRoute from "./components/Routes/PersonalRoute"

// Perfil compartido
import Perfil from "./Pages/Perfil"

// Layout Farmacia
import FarmaciaLayout from "./layouts/FarmaciaLayout"
import FarmaciaRoute from "./components/Routes/FarmaciaRoute"
import FarmaciaDashboard from "./Pages/Farmacia/Dashboard"
import FarmaciaInventario from "./Pages/Farmacia/Inventario"
import FarmaciaMedicamentos from "./Pages/Farmacia/Medicamentos"
import FarmaciaMovimientos from "./Pages/Farmacia/Movimientos"
// FarmaciaReportes
import FarmaciaReportes from "./Pages/Farmacia/Reportes"

// Módulo Médico
import DoctorLayout from "./layouts/DoctorLayout"
import MedicoRoute from "./components/Routes/MedicoRoute"
import AgendaMedicoPD from "./Pages/Medico/AgendaMedico"
import ConsultaMedicaPD from "./Pages/Medico/ConsultaMedica"
import MisPacientesPD from "./Pages/Medico/MisPacientes"
import HistorialPacienteMedicoPD from "./Pages/Medico/HistorialPacienteMedico"
import PerfilMedico from "./Pages/Medico/PerfilMedico"

// Módulo Paciente
import PatientLayout from "./layouts/PatientLayout"
import PatientRoute from "./components/Routes/PatientRoute"
import IndexPaciente from "./Pages/Paciente/IndexPaciente"
import AgendarCita from "./Pages/Paciente/AgendarCita"
import MisCitas from "./Pages/Paciente/MisCitas"
import HistorialPaciente from "./Pages/Paciente/HistorialPaciente"
import PerfilPaciente from "./Pages/Paciente/PerfilPaciente"
import MisMedicamentos from "./Pages/Paciente/MisMedicamentos"

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
import Concentraciones from "./Pages/Admin/Configuracion/Concentraciones"
import FormasFarmaceuticas from "./Pages/Admin/Configuracion/FormasFarmaceuticas"
import Medicamentos from "./Pages/Admin/Configuracion/Medicamentos"
import Presentaciones from "./Pages/Admin/Configuracion/Presentaciones"
import EnfermedadesList from "./Pages/Admin/Configuracion/EnfermedadesList"
import MotivosConsulta from "./Pages/Admin/Configuracion/MotivosConsulta"
import TiposDocumento from "./Pages/Admin/Configuracion/TiposDocumento"

// Módulo Médico — vistas adicionales
import HistorialCitasAtendidas from "./Pages/Medico/HistorialCitasAtendidas"

// Módulo de Exámenes (Rol 3)
import AgendaExamenes from "./Pages/Examenes/AgendaExamenes"
import AtenderExamen from "./Pages/Examenes/AtenderExamen"
import ReportesExamenes from "./Pages/Examenes/ReportesExamenes"

// Módulo Personal Administrativo (Rol 3)
import PersonalAdminDashboard from "./Pages/Personal/PersonalAdminDashboard"
import PqrsList from "./Pages/Personal/PqrsList"
import PersonalReportes from "./Pages/Personal/PersonalReportes"

import { useTheme } from "./hooks/useTheme";

export default function App() {
  // Global Dark Mode Initialization via useTheme hook
  useTheme();
  return (
    <Routes>
      <Route path="/SuperAdmin-Login" element={<SuperAdminLogin />} />
      <Route path="/SuperAdmin-Verify" element={<SuperAdminVerify />} />
      <Route path="/SuperAdmin-ForgotPassword" element={<SuperAdminForgotPassword />} />
      <Route path="/SuperAdmin-RecoveryCode" element={<SuperAdminRecoveryCode />} />
      <Route path="/SuperAdmin-ResetPassword" element={<SuperAdminResetPassword />} />
      <Route path="/Pago" element={<Pago />} />

      {/* Rutas Protegidas SuperAdmin (sessionStorage — independiente) */}
      <Route element={<SuperAdminRoute />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/SuperAdmin-Dashboard" element={<SuperAdminDashboard />} />
          <Route path="/SuperAdmin-Empresas" element={<SuperAdminEmpresas />} />
          <Route path="/SuperAdmin-Licencias" element={<SuperAdminLicencias />} />
          <Route path="/SuperAdmin-Historial" element={<SuperAdminHistorial />} />
          <Route path="/SuperAdmin-Gestion/estados" element={<SuperAdminEstados />} />
          <Route path="/SuperAdmin-Gestion/roles" element={<SuperAdminRoles />} />
          <Route path="/SuperAdmin-Gestion/departamentos" element={<SuperAdminDepartamentos />} />
          <Route path="/SuperAdmin-Gestion/ciudades" element={<SuperAdminCiudades />} />
        </Route>
      </Route>

      {/* Rutas Públicas */}
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
        <Route path="/verify-2fa" element={<LoginVerify2FA />} />
      </Route>

      {/* ── RUTAS PROTEGIDAS — TODOS LOS USUARIOS (localStorage) ── */}
      <Route element={<AuthRoute />}>



        {/* Layout del Farmacéutico */}
        <Route element={<FarmaciaRoute />}>
          <Route element={<FarmaciaLayout />}>
            <Route path="/farmacia/perfil" element={<Perfil />} />
            <Route path="/farmacia/dashboard" element={<FarmaciaDashboard />} />
            <Route path="/farmacia/inventario" element={<FarmaciaInventario />} />
            <Route path="/farmacia/medicamentos" element={<FarmaciaMedicamentos />} />
            <Route path="/farmacia/movimientos" element={<FarmaciaMovimientos />} />
            <Route path="/farmacia/reportes" element={<FarmaciaReportes />} />
          </Route>
        </Route>

        {/* Layout del Médico */}
        <Route element={<MedicoRoute />}>
          <Route element={<DoctorLayout />}>
            <Route path="/medico/agenda" element={<AgendaMedicoPD />} />
            <Route path="/medico/consulta/:id" element={<ConsultaMedicaPD />} />
            <Route path="/medico/pacientes" element={<MisPacientesPD />} />
            <Route path="/medico/pacientes/:doc/historial" element={<HistorialPacienteMedicoPD />} />
            <Route path="/medico/perfil" element={<Perfil />} />
            <Route path="/medico/mis-citas" element={<HistorialCitasAtendidas />} />
            <Route path="/medico/enfermedades" element={<EnfermedadesList isAdmin={false} />} />
          </Route>
        </Route>

        {/* Layout del Paciente */}
        <Route element={<PatientRoute />}>
          <Route element={<PatientLayout />}>
            <Route path="/paciente" element={<IndexPaciente />} />
            <Route path="/paciente/agendar" element={<AgendarCita />} />
            <Route path="/paciente/citas" element={<MisCitas />} />
            <Route path="/paciente/historial" element={<HistorialPaciente />} />
            <Route path="/paciente/perfil" element={<PerfilPaciente />} />
            <Route path="/paciente/medicamentos" element={<MisMedicamentos />} />
          </Route>

            {/* Se ha eliminado UserLayout porque el rol 5 usa PatientLayout exclusivamente. */}
        </Route>

        {/* Layout del Admin (sidebar) — incluyendo /Perfil compartido */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/Perfil" element={<Perfil />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios/personal" element={<Personal />} />
            <Route path="/usuarios/medicos" element={<Medicos />} />
            <Route path="/usuarios/pacientes" element={<Pacientes />} />
            <Route path="/usuarios/pacientes/:doc/historial" element={<HistorialPacienteMedicoPD />} />
            <Route path="/usuarios/farmaceuticos" element={<Farmaceutico />} />
            <Route path="/usuarios/medicos/agenda-medico/:doc" element={<AgendaMedico />} />
            <Route path="/citas/del-dia" element={<CitasDelDia />} />
            <Route path="/citas/agenda" element={<AgendaCitas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/pqrs" element={<PqrsList readonly={true} />} />

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
              <Route path="concentraciones" element={<Concentraciones />} />
              <Route path="formas-farmaceuticas" element={<FormasFarmaceuticas />} />
              <Route path="medicamentos" element={<Medicamentos />} />
              <Route path="presentaciones" element={<Presentaciones />} />
              <Route path="enfermedades" element={<EnfermedadesList isAdmin={true} />} />
              <Route path="motivos-consulta" element={<MotivosConsulta />} />
              <Route path="tipos-documento" element={<TiposDocumento />} />
            </Route>
          </Route>
        </Route>

        {/* Layout de Exámenes (Usando AdminLayout por el Sidebar compartido) */}
        <Route element={<ExamenRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/examenes/agenda" element={<AgendaExamenes />} />
            <Route path="/examenes/atender/:id" element={<AtenderExamen />} />
            <Route path="/examenes/categorias" element={<CategoriasExamen />} />
            <Route path="/examenes/reportes" element={<ReportesExamenes />} />
          </Route>
        </Route>

        {/* Layout de Personal Administrativo Normal */}
        <Route element={<PersonalRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/personal/dashboard" element={<PersonalAdminDashboard />} />
            <Route path="/personal/pacientes" element={<Pacientes />} />
            <Route path="/personal/pacientes/:doc/historial" element={<HistorialPacienteMedicoPD />} />
            <Route path="/personal/agenda" element={<AgendaCitas />} />
            <Route path="/personal/pqrs" element={<PqrsList />} />
            <Route path="/personal/reportes" element={<PersonalReportes />} />
          </Route>
        </Route>

      </Route>
    </Routes>
  )
}

