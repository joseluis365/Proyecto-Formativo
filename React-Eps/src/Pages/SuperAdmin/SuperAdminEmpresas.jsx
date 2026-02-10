import { useEffect, useState } from "react";
import api from "../../Api/axios";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import CompaniesSection from "../../components/SuperAdmin/CompaniesSection";

export default function SuperAdminEmpresas() {
  // 🔹 Estados
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [creating, setCreating] = useState(false);

  // 🔹 Opciones del filtro
  const statusOptions = [
    { value: 1, label: "Licencia Activa" },
    { value: 2, label: "Licencia Expirada" },
    { value: 3, label: "Sin Licencia" },
  ];

  // 🔹 Obtener empresas
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/empresas", {
        params: {
          search: debouncedSearch || undefined,
          id_estado: status || undefined, // Backend usa 'id_estado'
        },
      });

      // Mapeamos los datos para que coincidan con lo que espera CompaniesSection
      const formattedData = res.data.data.map(company => ({
        ...company,
        email: company.email_contacto, // Mapeo de email_contacto a email
        expiresAt: company.expiresAt || "Sin fecha de expiración", // Manejo de fecha vacía
      }));

      setCompanies(formattedData);
    } catch (err) {
      console.error("Error cargando empresas:", err);
      setError("No se pudieron cargar las empresas");
      setCompanies([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // 🔹 Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 Ejecutar cuando cambian filtros
  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch, status]);

  const totalCompanies = companies.length;

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <PrincipalText
          icon="badge"
          text="Empresas Registradas"
          number={totalCompanies}
        />
        <button
          onClick={() => setCreating(true)}
          className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
        >
          Agregar Empresa
          <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">add</span>
        </button>
      </div>

      {/* FILTROS */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <Input
          placeholder="Buscar empresa (Nombre o NIT)"
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

      {/* CONTENIDO */}
      {loading && isInitialLoad ? (
        <div className="flex justify-center py-10">
          <p>Cargando empresas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          {error}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No se encontraron empresas
        </div>
      ) : (
        <CompaniesSection companies={companies} />
      )}
    </>
  );
}