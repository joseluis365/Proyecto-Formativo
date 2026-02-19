import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { useLayout } from "../../LayoutContext";
import PacientesTable from "../../components/Users/PacientesTable";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import { AnimatePresence, motion } from "framer-motion";
import TableSkeleton from "../../components/UI/TableSkeleton";
import CreatePacienteModal from "../../components/Modals/UserModal/CreatePacienteModal";

const statusOptions = [
  { value: "", label: "Todos" },
  { value: 1, label: "Activos" },
  { value: 2, label: "Inactivos" },
];

export default function Pacientes() {
  const { setTitle, setSubtitle } = useLayout();

  useEffect(() => {
    setTitle("Pacientes");
    setSubtitle("Gestión de los Pacientes");
  }, []);

  // 🔹 Estados necesarios
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [id_rol, setId_rol] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [creating, setCreating] = useState(false);
  const [totalUsersByRol, setTotalUsersByRol] = useState(0);

  // 🔹 Opciones del filtro



  // 🔹 FUNCIÓN CENTRAL (la que faltaba)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/usuarios", {
        params: {
          search: debouncedSearch || undefined,
          id_rol: 5,
          status: status || undefined,
        },
      });

      setUsers(res.data.data);
      setTotalUsersByRol(res.data.totalPorRol);
    } catch (err) {
      console.error("Error cargando pacientes:", err);
      setError("No se pudieron cargar los pacientes"); // ❌ error controlado
      setUsers([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);


  // 🔹 Ejecutar cuando cambian filtros
  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, id_rol, status]);

  console.log(users);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <PrincipalText
          icon="badge"
          text="Pacientes Registrados"
          number={totalUsersByRol}
        />
        <button onClick={() => setCreating(true)} className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
          Agregar Paciente
          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">add</span>
        </button>
      </div>

      {/* FILTROS */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <Input
          placeholder="Buscar paciente"
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
      <AnimatePresence mode="wait">
        {/* 🦴 SOLO PRIMERA CARGA */}
        {loading && isInitialLoad && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TableSkeleton rows={6} columns={5} />
          </motion.div>
        )}

        {/* ❌ ERROR */}
        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-red-500"
          >
            {error}
          </motion.div>
        )}

        {/* 📭 EMPTY */}
        {!loading && !error && users.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-gray-500"
          >
            No se encontraron pacientes
          </motion.div>
        )}

        {/* ✅ DATA */}
        {!error && users.length > 0 && (
          <motion.div
            key="data"
            animate={{ opacity: loading ? 0.6 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <PacientesTable
              users={users}
              fetchUsers={fetchUsers}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {creating && (
          <CreatePacienteModal
            onClose={() => setCreating(false)}
            onSuccess={fetchUsers}
          />
        )}
      </AnimatePresence>
    </div>

  );
}