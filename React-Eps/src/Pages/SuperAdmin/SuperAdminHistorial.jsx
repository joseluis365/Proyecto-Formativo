import { useEffect, useState } from "react";
import superAdminApi from "../../Api/superadminAxios";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import MotionSpinner from "../../components/UI/Spinner";
import HistoryCard from "../../components/SuperAdmin/HistoryCard";
import HistoryDetailsModal from "../../components/Modals/LicenciaModal/HistoryDetailsModal";
import { AnimatePresence, motion } from "framer-motion";

export default function SuperAdminHistorial() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const statusOptions = [
        { value: 1, label: "Activas" },
        { value: 4, label: "Expiran Pronto" },
        { value: 5, label: "Expiradas" },
        { value: 6, label: "Pendientes" },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await superAdminApi.get("/superadmin/empresa-licencias", {
                    params: {
                        search: debouncedSearch || undefined,
                        id_estado: status || undefined,
                    }
                });
                setHistory(response.data);
            } catch (err) {
                console.error("Error fetching history:", err);
                setError("No se pudo cargar el historial.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [debouncedSearch, status]);

    const handleDownloadHistory = async () => {
        try {
            const token = sessionStorage.getItem("superadmin_token");

            const queryParams = new URLSearchParams();
            if (debouncedSearch) queryParams.append("search", debouncedSearch);
            if (status) queryParams.append("id_estado", status);
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

            const response = await fetch(`http://localhost:8000/api/superadmin/licencias/historial/pdf${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Error al descargar el PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "historial_licencias.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    return (
        <>
            <div className="mb-8 flex flex-wrap justify-between items-start">
                <div>
                    <PrincipalText
                        icon="history_edu"
                        text="Historial de Vinculaciones"
                        number={history.length}
                    />
                    <p className="text-gray-500 dark:text-gray-200 mt-2 ml-1 text-sm">
                        Registro completo de todas las licencias asignadas a empresas.
                    </p>
                </div>
                <button
                    onClick={handleDownloadHistory}
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">description</span>
                    Descargar Historial
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Buscar por NIT, ID de licencia o Nombre de empresa..."
                        icon="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <Filter
                        options={statusOptions}
                        value={status}
                        onChange={(val) => setStatus(val)}
                        placeholder="Todos los estados"
                    />
                </div>
            </div>

            <AnimatePresence>
                {loading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col justify-center items-center py-10"
                    >
                        <p className="text-lg font-semibold mb-2 dark:text-white">Cargando historial</p>
                        <MotionSpinner />
                    </motion.div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-4"
                    >
                        {history.map((item) => (
                            <HistoryCard
                                key={item.id_empresa_licencia || item.id}
                                history={item}
                                onClick={() => setSelectedItem(item)}
                            />
                        ))}
                    </motion.div>
                )}
                {!loading && !error && history.length === 0 && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 text-gray-500 dark:text-gray-200"
                    >
                        El historial está vacío
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedItem && (
                    <HistoryDetailsModal
                        history={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
