import { useEffect, useState } from "react";
import api from "../../Api/axios";
import { bloquearDia } from "../../Api/bloqueoAgenda";
import { useLayout } from "../../LayoutContext";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import { AnimatePresence, motion } from "framer-motion";

export default function BloqueoAgenda() {
  const { setTitle, setSubtitle } = useLayout();

  useEffect(() => {
    setTitle("Bloqueo de Agenda");
    setSubtitle("Gestiona días no disponibles para médicos.");
  }, []);

  const [medicos, setMedicos] = useState([]);
  const [docMedico, setDocMedico] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 🔹 Cargar médicos
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const res = await api.get("/usuarios", {
          params: { id_rol: 2 },
        });
        setMedicos(res.data.data || res.data);
      } catch (err) {
        console.error("Error cargando médicos:", err);
        setError("No se pudieron cargar los médicos.");
      }
    };

    fetchMedicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!docMedico || !fecha) {
      setError("Debe seleccionar médico y fecha.");
      return;
    }

    try {
      setLoading(true);

      await bloquearDia({
        doc_medico: docMedico,
        fecha,
        motivo,
      });

      setSuccess("Día bloqueado correctamente.");
      setDocMedico("");
      setFecha("");
      setMotivo("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Error al bloquear el día."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <PrincipalText
          icon="event_busy"
          text="Bloqueos Registrados"
          number={medicos.length}
        />
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* MÉDICO */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Seleccionar Médico
          </label>
          <select
            value={docMedico}
            onChange={(e) => setDocMedico(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 dark:bg-gray-800"
          >
            <option value="">Seleccione un médico</option>
            {medicos.map((medico) => (
              <option key={medico.documento} value={medico.documento}>
                {medico.nombre} {medico.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* FECHA */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha a bloquear
          </label>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        {/* MOTIVO */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Motivo (opcional)
          </label>
          <Input
            placeholder="Ej: Vacaciones"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-3 font-bold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "Bloqueando..." : "Bloquear Día"}
        </button>

        {/* MENSAJES */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}