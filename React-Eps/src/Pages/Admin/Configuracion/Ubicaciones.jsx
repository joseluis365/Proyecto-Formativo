import { useState, useEffect } from "react";
import api from "@/Api/axios";
import { useLayout } from "@/LayoutContext";
import DataTable from "@/components/UI/DataTable";
import PrincipalText from "@/components/Users/PrincipalText";

export default function Ubicaciones() {
    const { setTitle, setSubtitle } = useLayout();
    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [selectedDepto, setSelectedDepto] = useState("");
    const [loadingDeptos, setLoadingDeptos] = useState(true);
    const [loadingCiudades, setLoadingCiudades] = useState(false);

    useEffect(() => {
        setTitle("Ubicaciones");
        setSubtitle("Consulta la división territorial de departamentos y municipios.");
        fetchDepartamentos();
    }, []);

    const fetchDepartamentos = async () => {
        try {
            const response = await api.get("/departamentos");
            setDepartamentos(response.data);
        } catch (error) {
            console.error("Error fetching departamentos:", error);
        } finally {
            setLoadingDeptos(false);
        }
    };

    const fetchCiudades = async (deptoId) => {
        setLoadingCiudades(true);
        try {
            const response = await api.get(`/ciudades/${deptoId}`);
            setCiudades(response.data);
        } catch (error) {
            console.error("Error fetching ciudades:", error);
            setCiudades([]);
        } finally {
            setLoadingCiudades(false);
        }
    };

    const handleDeptoChange = (e) => {
        const id = e.target.value;
        setSelectedDepto(id);
        if (id) {
            fetchCiudades(id);
        } else {
            setCiudades([]);
        }
    };

    const columns = [
        {
            key: "id_ciudad",
            header: "ID",
            render: (item) => <span className="text-gray-500 font-mono text-xs">{item.id_ciudad}</span>
        },
        {
            key: "ciudad",
            header: "Ciudad / Municipio",
            render: (item) => <span className="font-semibold">{item.ciudad}</span>
        },
        {
            key: "departamento",
            header: "Departamento",
            render: () => {
                const depto = departamentos.find(d => d.id_departamento == selectedDepto);
                return depto ? depto.departamento : "N/A";
            }
        }
    ];

    return (
        <div className="space-y-6">
            <PrincipalText icon="distance" text="División Territorial" />

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm">
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecciona un Departamento
                    </label>
                    <select
                        value={selectedDepto}
                        onChange={handleDeptoChange}
                        disabled={loadingDeptos}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                    >
                        <option value="">-- Seleccionar Departamento --</option>
                        {departamentos.map(d => (
                            <option key={d.id_departamento} value={d.id_departamento}>
                                {d.departamento}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedDepto && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-neutral-gray-border/20 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">location_city</span>
                            Ciudades en el departamento
                        </h3>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                            {ciudades.length} resultados
                        </span>
                    </div>
                    <DataTable
                        columns={columns}
                        data={ciudades}
                        loading={loadingCiudades}
                    />
                </div>
            )}
        </div>
    );
}
