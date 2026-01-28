import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import PacientesTable from "../../components/Users/PacientesTable";
import Button from "../../components/UI/Button";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";

export default function Pacientes() {
    const mockPacientes = [
  {
    id: 1,
    name: "Laura Martinez",
    document: "1023456789",
    age: "25",
    rh: "O+",
    status: "ACTIVO",
  },
  {
    id: 2,
    name: "Carlos Gómez",
    document: "987654321",
    age: "25",
    rh: "O+",
    status: "INACTIVO",
  },
];
    const { setTitle, setSubtitle } = useLayout();
    useEffect(() => {
        setTitle("Pacientes");
        setSubtitle("Gestión de pacientes");
    }, []);
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="personal_injury" text="Pacientes Registrados" number="25" />
                <Button icon="add" text="Agregar Paciente" />
            </div>
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <Input placeholder="Buscar paciente" icon="search"/>
              <div className="flex flex-wrap gap-4">
                <Filter options={["Todos", "Activos", "Inactivos"]} placeholder="Filtrar por estado" />
              </div>
            </div>
            <PacientesTable users={mockPacientes} />
            

        </div>
    )
}