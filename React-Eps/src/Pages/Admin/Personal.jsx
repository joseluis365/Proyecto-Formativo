import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { useLayout } from "../../LayoutContext";
import PersonalTable from "../../components/Users/PersonalTable";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import { AnimatePresence, motion } from "framer-motion";
import TableSkeleton from "../../components/UI/TableSkeleton";
import CreatePersonalModal from "../../components/Modals/UserModal/CreatePersonalModal";
import { ROLES } from "@/constants/roles";

const statusOptions = [
  { value: "", label: "Todos" },
  { value: 1, label: "Activos" },
  { value: 2, label: "Inactivos" },
];

export default function Personal() {
  const { setTitle, setSubtitle } = useLayout();

  useEffect(() => {
    setTitle("Personal");
    setSubtitle("Gestión del Personal Administrativo");
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
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);


  // 🔹 FUNCIÓN CENTRAL (la que faltaba)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/usuarios", {
        params: {
          search: debouncedSearch || undefined,
          id_rol: ROLES.PERSONAL_ADMINISTRATIVO,
          status: status || undefined,
          page: currentPage,
        },
      });

      setUsers(res.data || []);
      setTotalUsersByRol(res.totalPorRol || 0);
      setCurrentPage(res.current_page || 1);
      setLastPage(res.last_page || 1);

    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("No se pudieron cargar los usuarios"); // ❌ error controlado
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
    fetchUsers(currentPage);
  }, [debouncedSearch, id_rol, status, currentPage]);


  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <PrincipalText
          icon="badge"
          text="Personal Registrado"
          number={totalUsersByRol}
        />
        <button onClick={() => setCreating(true)} className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
          Agregar Personal
          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">add</span>
        </button>
      </div>

      {/* FILTROS */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="lg:w-sm md:w-1/2 xs:w-full">
          <Input
            placeholder="Buscar nombre o documento"
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
            No se encontraron usuarios
          </motion.div>
        )}

        {/* ✅ DATA */}
        {!error && users.length > 0 && (
          <motion.div
            key="data"
            animate={{ opacity: loading ? 0.6 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <PersonalTable
              users={users}
              fetchUsers={fetchUsers}
            />

            <div className="flex justify-center gap-2 mt-6">
              {/* Botón anterior */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Anterior
              </button>

              {/* Números de página */}
              {Array.from({ length: lastPage }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Botón siguiente */}
              <button
                disabled={currentPage === lastPage}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {creating && (
          <CreatePersonalModal
            onClose={() => setCreating(false)}
            onSuccess={fetchUsers}
          />
        )}
      </AnimatePresence>
    </div>

  );
}
