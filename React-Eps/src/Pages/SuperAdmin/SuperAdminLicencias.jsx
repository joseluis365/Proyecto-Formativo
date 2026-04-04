import { useEffect, useState } from "react";
import axios from "../../Api/superadminAxios";
import PrincipalText from "../../components/Users/PrincipalText";
import MotionSpinner from "../../components/UI/Spinner";
import LicencesSection from "../../components/SuperAdmin/LicencesSection";
import { AnimatePresence, motion } from "framer-motion";
import CreateLicenciaModal from "../../components/Modals/LicenciaModal/CreateLicenciaModal";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function SuperAdminLicencias() {
  // 🔹 Estados
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);


  // 🔹 Obtener empresas
  const fetchLicenses = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("/superadmin/licencias");
      console.log("Respuesta completa:", res);


      // La API devuelve { total: X, data: [...] }
      const dataArray = res?.data || res || [];
      const formattedData = dataArray.map(licencia => ({
        ...licencia,
        empresas: licencia.companies || "Sin empresas Asignadas",
      }));

      setLicenses(formattedData);
    } catch (err) {
      console.error("Error cargando licencias:", err);
      setError("No se pudieron cargar las licencias");
      setLicenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);



  const totalLicenses = licenses.length;

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <PrincipalText
          icon="license"
          text="Planes Registrados"
          number={totalLicenses}
        />
        <button
          onClick={() => setCreating(true)}
          className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
        >
          Agregar Plan
          <AddRoundedIcon sx={{ fontSize: '1.125rem' }} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* CONTENIDO */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center py-10"
          >
            <p className="text-lg font-semibold mb-2 dark:text-white">Cargando Planes</p>
            <MotionSpinner />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-red-500"
          >
            {error}
          </motion.div>
        ) : licenses.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-gray-500 dark:text-gray-200"
          >
            No se encontraron Planes
          </motion.div>
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <LicencesSection licenses={licenses} onUpdate={fetchLicenses} />
          </motion.div>
        )}
      </AnimatePresence >

      <AnimatePresence>
        {creating && (
          <CreateLicenciaModal
            onClose={() => setCreating(false)}
            onSuccess={fetchLicenses}
          />
        )}
      </AnimatePresence>
    </>
  );
}
