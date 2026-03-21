import { useState, useEffect } from 'react';
import api from '@/Api/axios';

const useTipoDocumentos = () => {
    const [tipoDocumentos, setTipoDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTipoDocumentos = async () => {
            try {
                setLoading(true);
                const response = await api.get('/tipos-documento');
                // El interceptor de axios ya desempaqueta response.data
                const data = Array.isArray(response) ? response : response?.data || [];
                
                const options = data.map(tipo => ({
                    value: tipo.id_tipo_documento,
                    label: tipo.tipo_documento
                }));
                setTipoDocumentos(options);
            } catch (err) {
                console.error("Error fetching tipos de documento:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTipoDocumentos();
    }, []);

    return { tipoDocumentos, loading, error };
};

export default useTipoDocumentos;
