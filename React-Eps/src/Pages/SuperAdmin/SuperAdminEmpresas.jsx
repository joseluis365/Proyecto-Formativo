import { useEffect, useState } from "react";
import superAdminApi from "../../Api/superAdminAxios";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import CompaniesSection from "../../components/SuperAdmin/CompaniesSection";
import { AnimatePresence, motion } from "framer-motion";
import CreateEmpresaModal from "../../components/Modals/EmpresaModal/CreateEmpresaModal";
import AssignLicenciaModal from "../../components/Modals/LicenciaModal/AsignarLicenciaModal";
import CompanyDetailsModal from "../../components/Modals/EmpresaModal/CompanyDetailsModal";
import Swal from 'sweetalert2';
import MotionSpinner from "../../components/UI/Spinner";

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
  const [assigningLicense, setAssigningLicense] = useState(null);
  const [licencias, setLicencias] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [viewingCompany, setViewingCompany] = useState(false);


  // Opciones del filtro
  const statusOptions = [
    { value: 1, label: "Licencia Activa" },
    { value: 2, label: "Licencia Expirada" },
    { value: 3, label: "Sin Licencia" },
    { value: 6, label: "Licencia Bloqueada" },
  ];

  // Obtener empresas
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await superAdminApi.get("/empresas", {
        params: {
          search: debouncedSearch || undefined,
          id_estado: status || undefined,
        },
      });
      const formattedData = res.data.data.map(company => ({
        ...company,
        email: company.email_contacto,
        expiresAt: company.expiresAt || "Sin fecha de expiración",
        licenseType: company.licenseType || "Sin Licencia",
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Ejecutar cuando cambian filtros
  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch, status]);

  // Cargar licencias al montar
  useEffect(() => {
    const fetchLicencias = async () => {
      try {
        const res = await superAdminApi.get('/licencias');
        setLicencias(res.data.data || res.data);
      } catch (err) {
        console.error("Error al cargar licencias:", err);
      }
    };
    fetchLicencias();
  }, []);

  const handleAssignLicense = (company) => {
    setAssigningLicense(company.nit);
  };

  const handleRenewLicense = (company) => {
    setAssigningLicense(company.nit);
  };

  const handleRequireActive = async (company) => {
    try {
      const result = await Swal.fire({
        title: '¿Activar Licencia?',
        text: `Se activará la licencia para ${company.nombre}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, activar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await superAdminApi.post(`/empresa/${company.nit}/activar-licencia`);
        Swal.fire(
          'Activada!',
          'La licencia ha sido activada correctamente.',
          'success'
        );
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error activando licencia:", error);
      Swal.fire(
        'Error',
        'Hubo un problema al activar la licencia.',
        'error'
      );
    }
  };

  const handleViewCompany = async (company) => {
    try {
      const res = await superAdminApi.get(`/empresa/${company.nit}`);
      setSelectedCompany(res.data);
      setViewingCompany(true);
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      Swal.fire('Error', 'No se pudieron cargar los detalles de la empresa', 'error');
    }
  }

  const handleLicenseSuccess = () => {
    fetchCompanies();
    setAssigningLicense(null);
  };


  const totalCompanies = companies.length;

  console.log(companies);

  const exportarPDF = async () => {
    try {
      const token = sessionStorage.getItem("superadmin_token");

      const response = await fetch(
        "http://localhost:8000/api/empresas/pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar el PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "informe_empresas_eps.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exportando PDF:", error);
      Swal.fire("Error", "No se pudo generar el PDF", "error");
    }
  };
  console.log(companies);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <PrincipalText
          icon="badge"
          text="Empresas Registradas"
          number={totalCompanies}
        />
        <div className="flex gap-3">
          <button
            onClick={exportarPDF}
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all shadow-lg flex items-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            Exportar PDF
          </button>

          <button
            onClick={() => setCreating(true)}
            className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
          >
            Agregar Empresa
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">add</span>
          </button>
        </div>
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
      <AnimatePresence mode="wait">
        {loading && isInitialLoad && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center py-10"
          >
            <p className="text-lg font-semibold mb-2 dark:text-white">Cargando Empresas</p>
            <MotionSpinner />
          </motion.div>
        )}

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

        {!loading && !error && companies.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-gray-500 dark:text-gray-200"
          >
            No se encontraron empresas
          </motion.div>
        )}

        {!error && companies.length > 0 && (
          <motion.div
            key="data"
            animate={{ opacity: loading ? 0.6 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <CompaniesSection
              companies={companies}
              onAssignLicense={handleAssignLicense}
              onRenew={handleRenewLicense}
              onActive={handleRequireActive}
              onView={(company) => handleViewCompany(company)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {creating && (
          <CreateEmpresaModal
            onClose={() => setCreating(false)}
            onSuccess={fetchCompanies}
          />
        )}
        {assigningLicense && (
          <AssignLicenciaModal
            empresaNit={assigningLicense}
            licencias={licencias}
            onClose={() => setAssigningLicense(null)}
            onSuccess={handleLicenseSuccess}
          />
        )}
        {viewingCompany && selectedCompany && (
          <CompanyDetailsModal
            company={selectedCompany}
            onClose={() => {
              setViewingCompany(false);
              setSelectedCompany(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}