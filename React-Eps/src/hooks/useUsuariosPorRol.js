import { useState, useEffect } from "react";
import api from "@/Api/axios";

/**
 * Hook para obtener usuarios filtrados por rol.
 * Utíl para llenar selects de Médicos (rol 2) o Pacientes (rol 4).
 */
export default function useUsuariosPorRol(idRol) {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            if (!idRol) return;
            setLoading(true);
            try {
                const response = await api.get("/usuarios", {
                    params: { id_rol: idRol, per_page: 100, status: 1 }
                });

                // El interceptor de axios.js ya devuelve response.data
                // Si el backend es paginado, response será { data: [...], total: ... }
                const list = response.data || [];

                setUsuarios(list.map(user => ({
                    value: user.documento,
                    label: `${user.primer_nombre} ${user.primer_apellido} (${user.documento})`
                })));
            } catch (error) {
                console.error(`Error fetching usuarios for rol ${idRol}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, [idRol]);

    return { usuarios, loading };
}
