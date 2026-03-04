import { useState, useEffect } from "react";
import api from "@/Api/axios";

export default function useEspecialidades() {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSpecialties = async () => {
            setLoading(true);
            try {
                // Endpoint público o protegido según api.php
                const response = await api.get("/especialidades");
                // El interceptor ya devuelve response.data o response.data.data
                const data = Array.isArray(response) ? response : response?.data || [];

                setSpecialties(data.map(item => ({
                    value: item.value ?? item.id_especialidad,
                    label: item.label ?? item.especialidad
                })));
            } catch (error) {
                console.error("Error fetching specialties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecialties();
    }, []);

    return { specialties, loading };
}
