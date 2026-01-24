import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import DoctorTable from "../../components/Users/DoctorsTable";
import PrincipalText from "../../components/Users/PrincipalText";
import AddButton from "../../components/UI/AddButton";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";

export default function Medicos() {
    const mockDoctors = [
  {
    id: 167676,
    name: "Laura Martinez",
    specialty: "Cardiología",
    status: "ACTIVO",
  },
  {
    id: 2343434,
    name: "Carlos Gómez",
    specialty: "Cardiología",
    status: "INACTIVO",
  },
];
    const { setTitle, setSubtitle } = useLayout();
    useEffect(() => {
        setTitle("Medicos");
        setSubtitle("Gestión de profesionales de la salud");
    }, []);
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <PrincipalText icon="stethoscope" text="Médicos Registrados" number="25" />
            <AddButton icon="add" text="Agregar Medico" />
          </div>
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <Input placeholder="Buscar médico" icon="search"/>
            <div className="flex flex-wrap gap-4">
              <Filter options={["Todos", "Activos", "Inactivos"]} placeholder="Filtrar por estado" />
            </div>
          </div>
            <DoctorTable users={mockDoctors} />
        </div>
    )
}