import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import UsersTable from "../../components/Users/UsersTable";
import PrincipalText from "../../components/Users/PrincipalText";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";

export default function Usuarios() {
    const mockUsers = [
  {
    id: 1,
    name: "Laura Martinez",
    document: "1023456789",
    email: "laura.martinez@saludintegral.co",
    status: "ACTIVO",
  },
  {
    id: 2,
    name: "Carlos Gómez",
    document: "987654321",
    email: "carlos.gomez@empresa.com",
    status: "INACTIVO",
  },
];
    const { setTitle, setSubtitle } = useLayout();
    useEffect(() => {
        setTitle("Usuarios");
        setSubtitle("Gestión del Personal Administrativo");
    }, []);
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <PrincipalText icon="badge" text="Personal Registrado" number="25" />
            <Button icon="add" text="Agregar Personal" />
          </div>
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <Input placeholder="Buscar usuario" icon="search"/>
            <div className="flex flex-wrap gap-4">
              <Filter options={["Todos", "Activos", "Inactivos"]} placeholder="Filtrar por estado" />
            </div>
          </div>
            <UsersTable users={mockUsers} />
        </div>
    )
}