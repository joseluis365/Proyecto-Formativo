import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
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

  useHelp({
    title: "Gestión de Pacientes",
    description: "Esta vista te permite administrar todos los pacientes registrados en la clínica. Puedes buscar, filtrar, agregar nuevos pacientes y cambiar su estado.",
    sections: [
      {
        title: "Acciones principales",
        type: "list",
        items: [
          "Buscar paciente: Usa la barra de búsqueda para encontrar a un paciente por nombre, apellido o documento.",
          "Filtrar por estado: Alterna entre ver pacientes Activos (habilitados para consultas) o Inactivos.",
          "Agregar Paciente: Abre un formulario para registrar a una nueva persona en el sistema."
        ]
      },
      {
        title: "Sobre la tabla",
        type: "tip",
        content: "La tabla principal muestra el documento, nombre, correo, teléfono y estado actual de cada paciente. Puedes hacer clic en los iconos de acción de la derecha para inactivar o reactivar a un usuario."
      }
    ]
  });

  useEffect(() => {
    setTitle("Pacientes");
    setSubtitle("Gestión de los Pacientes");
  }, []);

  // 🔹 Estados necesarios
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [id_rol, setId_rol] = useState(1);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
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
          page: page,
        },
      });

      setUsers(res.data || []);
      setTotalUsersByRol(res.totalPorRol || 0);
      setLastPage(res.last_page || 1);
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
  }, [debouncedSearch, id_rol, status, page]);

  // Restablecer paginación si se busca o filtra
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

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
          <AddRoundedIcon sx={{ fontSize: '1.125rem' }} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* FILTROS */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="lg:w-sm md:w-1/2 xs:w-full">
          <Input
            placeholder="Buscar paciente"
            icon="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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

        {/* ✔️ CONTENIDO */}
        {!loading && !error && users.length > 0 && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
              <PacientesTable users={users} fetchUsers={fetchUsers} />
            </div>

            {/* Paginación */}
            {lastPage > 1 && (
              <div className="flex justify-center flex-wrap gap-2 mt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 text-sm rounded-lg border dark:text-white border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Anterior
                </button>
                <div className="flex gap-1 overflow-x-auto">
                  {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg transition-all text-sm font-bold shrink-0 ${
                        page === p
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  className="px-4 py-2 text-sm rounded-lg border dark:text-white border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
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
