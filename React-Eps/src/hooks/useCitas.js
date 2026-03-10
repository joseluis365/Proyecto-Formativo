import { useState, useCallback, useEffect } from "react";
import api from "@/Api/axios";
import Swal from "sweetalert2";

/**
 * Hook para la gestión de citas médicas siguiendo la arquitectura del proyecto.
 * @param {Object} filters - Objeto con filtros: { fecha, doc_paciente, doc_medico }
 */
export default function useCitas(filters = {}) {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { fecha, doc_paciente, doc_medico, estado } = filters;

    /**
     * Obtiene las citas del servidor aplicando los filtros activos.
     */
    const fetchCitas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/citas", {
                params: {
                    fecha,
                    doc_paciente,
                    doc_medico,
                    estado
                }
            });

            // Estructura consistente con otros hooks del proyecto
            const data = response.data || response || [];
            setCitas(data);
        } catch (err) {
            const msg = err.response?.data?.message || "Error al cargar las citas.";
            setError(msg);
            console.error("Error en useCitas:", err);
        } finally {
            setLoading(false);
        }
    }, [fecha, doc_paciente, doc_medico]);

    // Refresco automático cuando cambian los criterios de filtrado
    useEffect(() => {
        fetchCitas();
    }, [fetchCitas]);

    /**
     * Crea una nueva cita (POST /cita)
     */
    const createCita = async (citaData) => {
        setLoading(true);
        try {
            await api.post("/cita", citaData);
            Swal.fire({
                title: "¡Éxito!",
                text: "La cita ha sido agendada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6"
            });
            await fetchCitas(); // Refresh automático post-creación
            return true;
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors?.hora_inicio?.[0] || "No se pudo agendar la cita.";
            const isDuplicate = message.toLowerCase().includes("médico ya tiene una cita") || message.toLowerCase().includes("horario");

            Swal.fire({
                title: isDuplicate ? "Horario no disponible" : "Error",
                text: message,
                icon: isDuplicate ? "warning" : "error",
                confirmButtonColor: isDuplicate ? "#F59E0B" : "#EF4444"
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualiza una cita existente (PUT /cita/{id})
     */
    const updateCita = async (id, citaData) => {
        setLoading(true);
        try {
            await api.put(`/cita/${id}`, citaData);
            Swal.fire({
                title: "Actualizado",
                text: "La cita ha sido modificada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6"
            });
            await fetchCitas(); // Refresh automático post-actualización
            return true;
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "No se pudo actualizar la cita.",
                icon: "error",
                confirmButtonColor: "#EF4444"
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cancela (elimina) una cita (DELETE /cita/{id})
     */
    const cancelCita = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#F59E0B",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Sí, cancelar cita",
            cancelButtonText: "Volver"
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await api.delete(`/cita/${id}`);
                Swal.fire({
                    title: "Cancelada",
                    text: "La cita ha sido eliminada de la agenda.",
                    icon: "success",
                    confirmButtonColor: "#3B82F6"
                });
                await fetchCitas(); // Refresh automático post-cancelación
                return true;
            } catch (err) {
                Swal.fire({
                    title: "Error",
                    text: err.response?.data?.message || "No se pudo cancelar la cita.",
                    icon: "error",
                    confirmButtonColor: "#EF4444"
                });
                return false;
            } finally {
                setLoading(false);
            }
        }
        return false;
    };

    return {
        citas,
        loading,
        error,
        fetchCitas,
        createCita,
        updateCita,
        cancelCita
    };
}
