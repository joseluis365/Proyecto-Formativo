import { motion } from "framer-motion";

export default function HistoryCard({ history, onClick }) {
    const { empresa, tipo_licencia, fecha_inicio, fecha_fin, id_estado } = history;

    const STATUS_MAP = {
        1: { text: "Activa", classes: "bg-green-100 text-green-700" },
        2: { text: "Inactiva", classes: "bg-red-100 text-red-700" },
        3: { text: "Sin Licencia", classes: "bg-gray-100 text-gray-700" },
        4: { text: "Por Vencer", classes: "bg-yellow-100 text-yellow-700" },
        5: { text: "Vencida", classes: "bg-orange-100 text-orange-700" },
        6: { text: "Pendiente", classes: "bg-blue-100 text-blue-700" },
    };

    const statusInfo = STATUS_MAP[id_estado] || { text: "Desconocido", classes: "bg-gray-100 text-gray-500" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md cursor-pointer group"
        >
            {/* Empresa Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {empresa?.nombre?.charAt(0) || "E"}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">
                            {empresa?.nombre || "Empresa Desconocida"}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            NIT: {empresa?.nit}
                        </p>
                    </div>
                </div>
            </div>

            {/* Licencia Info */}
            <div className="flex-1 flex flex-col items-start md:items-center">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {tipo_licencia?.tipo || "Licencia"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Duración: {tipo_licencia?.duracion_meses} meses
                </p>
            </div>

            {/* Fechas */}
            <div className="flex-1 flex flex-col items-start md:items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>{new Date(fecha_inicio).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <span className="material-symbols-outlined text-base">event_busy</span>
                    <span>{new Date(fecha_fin).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Estado */}
            <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.classes}`}>
                    {statusInfo.text}
                </span>
            </div>
        </motion.div>
    );
}
