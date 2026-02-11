import { useEffect, useState } from "react";
import api from "../../Api/axios";
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
                const response = await api.get("/empresa-licencias");
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

    return (
        <>
            <div className="mb-8">
                <PrincipalText
                    icon="history_edu"
                    text="Historial de Vinculaciones"
                    number={history.length}
                />
                <p className="text-gray-500 dark:text-gray-400 mt-2 ml-1 text-sm">
                    Registro completo de todas las licencias asignadas a empresas.
                </p>
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
                        <p className="text-lg font-semibold mb-2">Cargando historial...</p>
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
