import { useState, useEffect } from "react";
import { useLayout } from "@/LayoutContext";
import GenerarReportesTab from "./GenerarReportesTab";
import HistorialReportesTab from "./HistorialReportesTab";
import { motion, AnimatePresence } from "framer-motion";
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

export default function Reportes() {
    const { setTitle, setSubtitle } = useLayout();
    const [activeTab, setActiveTab] = useState("generar");

    useEffect(() => {
        setTitle("Centro de Reportes Dinámicos");
        setSubtitle("Genera informes y revisa el historial de exportaciones de la plataforma.");
    }, [setTitle, setSubtitle]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            {/* Header / Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                <button
                    onClick={() => setActiveTab("generar")}
                    className={`pb-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
                        activeTab === "generar"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                >
                    <AddchartRoundedIcon sx={{ fontSize: '1.25rem' }} />
                    Generar reporte
                </button>
                <button
                    onClick={() => setActiveTab("historial")}
                    className={`pb-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
                        activeTab === "historial"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                >
                    <HistoryRoundedIcon sx={{ fontSize: '1.25rem' }} />
                    Historial
                </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === "generar" && (
                    <motion.div
                        key="generar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GenerarReportesTab />
                    </motion.div>
                )}
                {activeTab === "historial" && (
                    <motion.div
                        key="historial"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <HistorialReportesTab />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
