import { useState, useCallback, useEffect, useRef } from "react";
import api from "@/Api/axios";
import Swal from "sweetalert2";

/**
 * Hook universal para la gestión de citas médicas.
 * Diseñado para ser reutilizado por los tres portales del sistema.
 *
 * ─── Uso por portal ────────────────────────────────────────────────────────
 *
 * Portal Admin — todas las citas de una fecha, sin restricción de médico:
 *   useCitas({ fecha: selectedDate })
 *
 * Portal Admin — AgendaMedico, citas de un médico específico por fecha:
 *   useCitas({ fecha: selectedDate, doc_medico: medico.documento })
 *
 * Portal Médico — solo citas del médico autenticado:
 *   useCitas({ doc_medico: user.documento })
 *   useCitas({ doc_medico: user.documento, fecha: selectedDate })
 *
 * Portal Paciente — solo citas del paciente autenticado:
 *   useCitas({ doc_paciente: user.documento })
 *
 * ─── Filtros disponibles ────────────────────────────────────────────────────
 * - fecha:        string YYYY-MM-DD — filtra por día exacto
 * - doc_paciente: number/string — filtra por documento del paciente
 * - doc_medico:   number/string — filtra por documento del médico
 * - estado:       string — filtra por nombre de estado ("Agendada", etc.)
 * - enabled:      boolean — si false, deshabilita el fetch automático
 *
 * @param {Object} filters
 * @param {string}  [filters.fecha]
 * @param {number}  [filters.doc_paciente]
 * @param {number}  [filters.doc_medico]
 * @param {string}  [filters.estado]
 * @param {boolean} [filters.enabled=true]
 */
export default function useCitas(filters = {}) {
    const { fecha, doc_paciente, doc_medico, estado, per_page, enabled = true } = filters;

    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ref para cancelar peticiones en vuelo cuando el componente se desmonta
    const abortControllerRef = useRef(null);

    /**
     * Construye los params omitiendo los undefined/null/empty string.
     * Axios ignora params undefined automáticamente — esta función hace
     * la intención explícita y facilita el testeo.
     */
    const buildParams = useCallback(() => {
        const params = {};
        if (fecha)        params.fecha        = fecha;
        if (doc_paciente) params.doc_paciente = doc_paciente;
        if (doc_medico)   params.doc_medico   = doc_medico;
        if (estado)       params.estado       = estado;
        if (per_page)     params.per_page     = per_page;
        return params;
    }, [fecha, doc_paciente, doc_medico, estado, per_page]);

    /**
     * Carga las citas del servidor con los filtros activos.
     * Puede llamarse manualmente (callback explícito) o automáticamente.
     */
    const fetchCitas = useCallback(async () => {
        if (!enabled) return;

        // Cancelar request anterior si aún no terminó (ej: cambio rápido de fecha)
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/citas", {
                params: buildParams(),
                signal: abortControllerRef.current.signal,
            });

            // El interceptor de axios.js ya extrae response.data.data
            // Si la respuesta es un array directo o tiene .data, normalizamos:
            const data = Array.isArray(response)
                ? response
                : response?.data ?? response ?? [];

            setCitas(data);
        } catch (err) {
            // Ignorar errores de cancelación (AbortController)
            if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;

            const msg = err.response?.data?.message || "Error al cargar las citas.";
            setError(msg);
            console.error("useCitas — fetchCitas error:", err);
        } finally {
            setLoading(false);
        }
    }, [buildParams, enabled]);

    // Refresco automático cuando cambian los filtros o se activa el hook
    useEffect(() => {
        fetchCitas();
        // Cleanup: cancelar request en vuelo al desmontar o cambiar filtros
        return () => {
            abortControllerRef.current?.abort();
        };
    }, [fetchCitas]);

    // ── MUTACIONES ────────────────────────────────────────────────────────────

    /**
     * Crea una nueva cita.
     * POST /cita
     */
    const createCita = async (citaData) => {
        setLoading(true);
        try {
            await api.post("/cita", citaData);
            Swal.fire({
                title: "¡Éxito!",
                text: "La cita ha sido agendada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });
            await fetchCitas();
            return true;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.errors?.hora_inicio?.[0] ||
                "No se pudo agendar la cita.";
            const isConflict =
                message.toLowerCase().includes("médico ya tiene una cita") ||
                message.toLowerCase().includes("horario");
            Swal.fire({
                title: isConflict ? "Horario no disponible" : "Error",
                text: message,
                icon: isConflict ? "warning" : "error",
                confirmButtonColor: isConflict ? "#F59E0B" : "#EF4444",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualiza una cita existente (estado, médico, etc.).
     * PUT /cita/{id}
     */
    const updateCita = async (id, citaData) => {
        setLoading(true);
        try {
            await api.put(`/cita/${id}`, citaData);
            Swal.fire({
                title: "Actualizado",
                text: "La cita ha sido modificada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });
            await fetchCitas();
            return true;
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "No se pudo actualizar la cita.",
                icon: "error",
                confirmButtonColor: "#EF4444",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reagenda una cita cambiando fecha y hora.
     * PUT /citas/{id}/reagendar
     */
    const reagendarCita = async (id, { fecha: nuevaFecha, hora_inicio }) => {
        setLoading(true);
        try {
            await api.put(`/citas/${id}/reagendar`, { fecha: nuevaFecha, hora_inicio });
            Swal.fire({
                title: "¡Cita Reagendada!",
                text: "Tu cita ha sido reprogramada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });
            await fetchCitas();
            return true;
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.errors?.hora_inicio?.[0] ||
                "No se pudo reagendar la cita.";
            const isConflict =
                message.toLowerCase().includes("ya tiene una cita") ||
                message.toLowerCase().includes("horario");
            Swal.fire({
                title: isConflict ? "Horario no disponible" : "Error",
                text: message,
                icon: isConflict ? "warning" : "error",
                confirmButtonColor: isConflict ? "#F59E0B" : "#EF4444",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cancela (elimina) una cita con confirmación.
     * DELETE /cita/{id}
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
            cancelButtonText: "Volver",
        });

        if (!result.isConfirmed) return false;

        setLoading(true);
        try {
            await api.delete(`/cita/${id}`);
            Swal.fire({
                title: "Cancelada",
                text: "La cita ha sido eliminada de la agenda.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });
            await fetchCitas();
            return true;
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || "No se pudo cancelar la cita.",
                icon: "error",
                confirmButtonColor: "#EF4444",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        citas,
        loading,
        error,
        fetchCitas,
        createCita,
        updateCita,
        reagendarCita,
        cancelCita,
    };
}
