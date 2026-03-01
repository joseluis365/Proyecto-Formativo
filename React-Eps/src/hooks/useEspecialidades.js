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
                // Backend devuelve array directo o { data: [] }
                const data = Array.isArray(response.data) ? response.data : response.data.data || [];
                setSpecialties(data.map(item => ({
                    value: item.id_especialidad,
                    label: item.especialidad
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
