import { Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/AdminLayout"
import Personal from "./Pages/Admin/Personal"
import Dashboard from "./Pages/Admin/Dashboard"
import Medicos from "./Pages/Admin/Medicos"
import Pacientes from "./Pages/Admin/Pacientes"
import AgendaMedico from "./Pages/Admin/AgendaMedico"
import InfoPaciente from "./Pages/Admin/InfoPaciente"
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

import SuperAdminRoute from "./components/Routes/SuperAdminRoute"

// Configuración
import ConfiguracionIndex from "./Pages/Admin/Configuracion/ConfiguracionIndex"
import Prioridades from "./Pages/Admin/Configuracion/Prioridades"
import TiposCita from "./Pages/Admin/Configuracion/TiposCita"
import CategoriasExamen from "./Pages/Admin/Configuracion/CategoriasExamen"
import CategoriasMedicamento from "./Pages/Admin/Configuracion/CategoriasMedicamento"
import Especialidades from "./Pages/Admin/Configuracion/Especialidades"
import Ubicaciones from "./Pages/Admin/Configuracion/Ubicaciones"

export default function App() {
  return (
    <Routes>
      <Route path="/SuperAdmin-Login" element={<SuperAdminLogin />} />
      <Route path="/SuperAdmin-Verify" element={<SuperAdminVerify />} />
      <Route path="/SuperAdmin-ForgotPassword" element={<SuperAdminForgotPassword />} />
      <Route path="/SuperAdmin-RecoveryCode" element={<SuperAdminRecoveryCode />} />
      <Route path="/SuperAdmin-ResetPassword" element={<SuperAdminResetPassword />} />
      <Route path="/Pago" element={<Pago />} />

      {/* Rutas Protegidas SuperAdmin */}
      <Route element={<SuperAdminRoute />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/SuperAdmin-Dashboard" element={<SuperAdminDashboard />} />
          <Route path="/SuperAdmin-Empresas" element={<SuperAdminEmpresas />} />
          <Route path="/SuperAdmin-Licencias" element={<SuperAdminLicencias />} />
          <Route path="/SuperAdmin-Historial" element={<SuperAdminHistorial />} />
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
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios/personal" element={<Personal />} />
        <Route path="/usuarios/medicos" element={<Medicos />} />
        <Route path="/usuarios/pacientes" element={<Pacientes />} />
        <Route path="/usuarios/pacientes/info-paciente" element={<InfoPaciente />} />
        <Route path="/usuarios/medicos/agenda-medico/:doc" element={<AgendaMedico />} />

        {/* Configuración */}
        <Route path="/configuracion" element={<ConfiguracionIndex />} />
        <Route path="/configuracion/prioridades" element={<Prioridades />} />
        <Route path="/configuracion/tipos-cita" element={<TiposCita />} />
        <Route path="/configuracion/categorias-examen" element={<CategoriasExamen />} />
        <Route path="/configuracion/categorias-medicamento" element={<CategoriasMedicamento />} />
        <Route path="/configuracion/especialidades" element={<Especialidades />} />
        <Route path="/configuracion/ubicaciones" element={<Ubicaciones />} />
      </Route>
    </Routes>
  )
}

