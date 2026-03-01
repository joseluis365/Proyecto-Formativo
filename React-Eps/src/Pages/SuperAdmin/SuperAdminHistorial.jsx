import { useEffect, useState } from "react";
import superAdminApi from "../../Api/superadminAxios";
import PrincipalText from "../../components/Users/PrincipalText";
import MotionSpinner from "../../components/UI/Spinner";
import HistoryCard from "../../components/SuperAdmin/HistoryCard";
import HistoryDetailsModal from "../../components/Modals/LicenciaModal/HistoryDetailsModal";
import { AnimatePresence, motion } from "framer-motion";

export default function SuperAdminHistorial() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await superAdminApi.get("/superadmin/empresa-licencias");
                setHistory(response.data);
            } catch (err) {
                console.error("Error fetching history:", err);
                setError("No se pudo cargar el historial.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleDownloadHistory = async () => {
        try {
            const token = sessionStorage.getItem("superadmin_token");
            const response = await fetch("http://localhost:8000/api/superadmin/licencias/historial/pdf", {
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
