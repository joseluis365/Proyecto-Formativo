import { Routes, Route } from "react-router-dom"
import DashboardLayout from "./layouts/AdminLayout"
import Usuarios from "./Pages/Admin/Usuarios"
import Dashboard from "./Pages/Admin/Dashboard"
import Medicos from "./Pages/Admin/Medicos"
import Pacientes from "./Pages/Admin/Pacientes"
import AgendaMedico from "./Pages/Admin/AgendaMedico"
import InfoPaciente from "./Pages/Admin/InfoPaciente"

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/usuarios/personal" element={<Usuarios />} />
        <Route path="/usuarios/medicos" element={<Medicos />} />
        <Route path="/usuarios/pacientes" element={<Pacientes />} />
        <Route path="/usuarios/pacientes/info-paciente" element={<InfoPaciente />} />
        <Route path="/usuarios/medicos/agenda-medico" element={<AgendaMedico />} />
        
      </Route>
    </Routes>
  )
}

