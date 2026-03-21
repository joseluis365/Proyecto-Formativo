import { motion, AnimatePresence } from "framer-motion";

export default function EnfermedadInfoModal({ isOpen, onClose, enfermedad }) {
    if (!isOpen || !enfermedad) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                            <span className="material-symbols-outlined text-3xl">vaccines</span>
                        </div>
                        <div>
                            <span className="text-xs font-black text-primary uppercase tracking-widest leading-none">
                                {enfermedad.codigo_icd}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                Detalle de Enfermedad
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">label</span> Nombre
                        </h3>
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {enfermedad.nombre}
                        </p>
                    </section>

                    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">description</span> Descripción Completa
                        </h3>
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {enfermedad.descripcion || (
                                <span className="italic text-gray-400">Sin descripción registrada para esta patología.</span>
                            )}
                        </div>
                    </section>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        Cerrar vista
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
