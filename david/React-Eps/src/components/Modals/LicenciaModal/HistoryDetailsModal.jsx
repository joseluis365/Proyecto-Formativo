import { motion } from "framer-motion";

export default function HistoryDetailsModal({ history, onClose }) {
    const { empresa, tipo_licencia, fecha_inicio, fecha_fin, id_estado, created_at } = history;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
                {/* Header */}
                <div className="bg-primary p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                            {empresa?.nombre?.charAt(0) || "E"}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{empresa?.nombre}</h2>
                            <p className="opacity-90 text-sm">NIT: {empresa?.nit}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Status Badge */}
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Estado de Licencia</span>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${statusInfo.classes}`}>
                            {statusInfo.text}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tipo de Licencia</label>
                            <p className="text-gray-800 dark:text-white font-semibold">{tipo_licencia?.tipo}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duración</label>
                            <p className="text-gray-800 dark:text-white font-semibold">{tipo_licencia?.duracion_meses} Meses</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Fecha Inicio</label>
                            <div className="flex items-center gap-2 text-gray-800 dark:text-white font-semibold">
                                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                                {new Date(fecha_inicio).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Fecha Fin</label>
                            <div className="flex items-center gap-2 text-gray-800 dark:text-white font-semibold">
                                <span className="material-symbols-outlined text-sm text-primary">event_busy</span>
                                {new Date(fecha_fin).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>ID Vinculación:</span>
                            <span className="font-mono">{history.id_empresa_licencia || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                            <span>Registrado el:</span>
                            <span>{new Date(created_at).toLocaleString()}</span>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
