import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { useLayout } from "../../LayoutContext";
import UsersTable from "../../components/Users/UsersTable";
import PrincipalText from "../../components/Users/PrincipalText";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";

export default function Usuarios() {
  const { setTitle, setSubtitle } = useLayout();

  useEffect(() => {
    setTitle("Usuarios");
    setSubtitle("Gestión del Personal Administrativo");
  }, []);

  // 🔹 Estados necesarios
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [id_rol, setId_rol] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Opciones del filtro
  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "ACTIVO", label: "Activos" },
    { value: "INACTIVO", label: "Inactivos" },
  ];

  // 🔹 FUNCIÓN CENTRAL (la que faltaba)
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/personal", {
        params: {
          search: search || undefined,
          id_rol,
          status: status || undefined,
        },
      });

      setUsers(res.data.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ejecutar cuando cambian filtros
  useEffect(() => {
    fetchUsers();
  }, [search, id_rol, status]);

  const totalUsers = users.length;

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <PrincipalText
          icon="badge"
          text="Personal Registrado"
          number={totalUsers}
        />
        <Button icon="add" text="Agregar Personal" />
      </div>

      {/* FILTROS */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <Input
          placeholder="Buscar usuario"
          icon="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Filter
          value={status}
          onChange={setStatus}
          options={statusOptions}
          placeholder="Filtrar por estado"
        />
      </div>

      {/* TABLA */}
      <UsersTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
