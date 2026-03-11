import { useState, useCallback, useEffect } from "react";
import api from "@/Api/axios";

/**
 * Hook para gestionar el historial clínico de un paciente.
 * 
 * Permite:
 * - Consultar el resumen del historial (antecedentes).
 * - Consultar la lista de atenciones previas (detalles).
 * - Actualizar los antecedentes.
 * - Listar todos los pacientes del médico autenticado.
 */
export default function useHistorial(docPaciente = null, { enabled = true } = {}) {
    const [historial, setHistorial] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Cargar resumen del historial (antecedentes)
    const fetchHistorial = useCallback(async () => {
        if (!enabled || !docPaciente) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/paciente/${docPaciente}/historial`);
            setHistorial(response.data || null);
        } catch (err) {
            console.error("Error fetching historial:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [docPaciente, enabled]);

    // 2. Cargar detalles (atenciones anteriores)
    const fetchDetalles = useCallback(async () => {
        if (!enabled || !docPaciente) return;
        setLoading(true);
        try {
            const response = await api.get(`/paciente/${docPaciente}/historial/detalles`);
            setDetalles(response.data || []);
        } catch (err) {
            console.error("Error fetching historial detalles:", err);
        } finally {
            setLoading(false);
        }
    }, [docPaciente, enabled]);

    // 3. Cargar todos los pacientes del médico
    const fetchMisPacientes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/medico/pacientes');
            setPacientes(response.data || []);
        } catch (err) {
            console.error("Error fetching mis pacientes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 4. Actualizar antecedentes
    const updateAntecedentes = async (data) => {
        if (!docPaciente) return;
        setLoading(true);
        try {
            const response = await api.put(`/paciente/${docPaciente}/historial`, data);
            setHistorial(response.data);
            return response;
        } catch (err) {
            console.error("Error updating antecedentes:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch si se pasa un documento de paciente
    useEffect(() => {
        if (docPaciente && enabled) {
            fetchHistorial();
            fetchDetalles();
        }
    }, [docPaciente, enabled, fetchHistorial, fetchDetalles]);

    return {
        historial,
        detalles,
        pacientes,
        loading,
        error,
        fetchHistorial,
        fetchDetalles,
        fetchMisPacientes,
        updateAntecedentes
    };
}
