import { useState, useCallback, useEffect } from "react";
import api from "@/Api/axios";

/**
 * Hook para gestionar el historial clínico completo de un paciente.
 */
export default function useHistorial(docPaciente = null, { enabled = true } = {}) {
    // Estado consolidado devuelto por /completo
    const [completoData, setCompletoData] = useState({
        historial: null,
        paciente: null,
        citas: [],
        remisiones: [],
        recetas: []
    });

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Cargar historial completo
    const fetchCompleto = useCallback(async () => {
        if (!enabled || !docPaciente) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/paciente/${docPaciente}/historial/completo`);
            // The api interceptor returns response.data directly, so response IS {status: 'success', data: {...}}
            const payload = response.data || response;
            setCompletoData(payload || {
                historial: null,
                paciente: null,
                citas: [],
                remisiones: [],
                recetas: []
            });
        } catch (err) {
            console.error("Error fetching historial completo:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [docPaciente, enabled]);

    // 2. Cargar todos los pacientes del médico
    const fetchMisPacientes = useCallback(async () => {
        setLoading(true);
        try {
            const payload = response.data || response;
            setPacientes(payload || []);
        } catch (err) {
            console.error("Error fetching mis pacientes:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Actualizar antecedentes
    const updateAntecedentes = async (data) => {
        if (!docPaciente) return;
        setLoading(true);
        try {
            const response = await api.put(`/paciente/${docPaciente}/historial`, data);
            // Actualizar localmente el historial
            setCompletoData(prev => ({
                ...prev,
                historial: response.data || response // Fallback por si interceptor desempaqueta distinto
            }));
            return response;
        } catch (err) {
            console.error("Error updating antecedentes:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch
    useEffect(() => {
        if (docPaciente && enabled) {
            fetchCompleto();
        }
    }, [docPaciente, enabled, fetchCompleto]);

    return {
        ...completoData,
        pacientes,
        loading,
        error,
        fetchCompleto,
        fetchMisPacientes,
        updateAntecedentes
    };
}
