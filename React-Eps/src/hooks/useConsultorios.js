import { useState, useEffect } from "react";
import api from "../Api/axios";

export default function useConsultorios(includeId = null) {
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultorios = async () => {
      try {
        setLoading(true);
        const url = includeId 
          ? `/consultorios/disponibles?include_id=${includeId}` 
          : "/consultorios/disponibles";
        const data = await api.get(url);
        // Formatear para el componente Select de IconInput
        const formatted = (data || []).map((c) => ({
          value: c.id_consultorio,
          label: `Consultorio ${c.numero_consultorio}`,
        }));
        setConsultorios(formatted);
      } catch (error) {
        console.error("Error al cargar consultorios disponibles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultorios();
  }, [includeId]);

  return { consultorios, loading };
}
