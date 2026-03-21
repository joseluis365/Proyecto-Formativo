import { useEffect, useState } from "react";
import { useLayout } from "../../LayoutContext";
import api from "../../Api/axios";
import PrincipalText from "../../components/Users/PrincipalText";
import TableSkeleton from "../../components/UI/TableSkeleton";
import { motion } from "framer-motion";

function EstadoBadge({ estado }) {
    const cfg = {
        Pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        Dispensado: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        Activa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        Vencida: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg[estado] ?? cfg.Pendiente}`}>
            {estado}
        </span>
    );
}

export default function MisMedicamentos() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTitle("Mis Medicamentos");
        setSubtitle("Consulta tus recetas médicas y el estado de cada medicamento.");
        setHelpContent({
            title: "Mis Recetas",
            description: "Aquí puedes ver las recetas emitidas por tu médico y el estado de entrega de cada medicamento.",
            sections: [
                {
                    title: "Estados de los medicamentos",
                    type: "list",
                    items: [
                        "Pendiente: El medicamento fue recetado pero aún no ha sido entregado por la farmacia.",
                        "Dispensado: El medicamento ya fue entregado. Sigue las instrucciones del médico.",
                        "Vencida: La receta ha expirado. Consulta a tu médico para renovarla.",
                    ]
                },
                {
                    title: "¿Dónde retirar los medicamentos?",
                    type: "tip",
                    content: "Cada medicamento muestra la farmacia asignada. Dirígete a esa farmacia con tu documento de identidad para retirar el medicamento. El farmacéutico verificará la receta en el sistema."
                }
            ]
        });
        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    useEffect(() => {
        const fetchRecetas = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/paciente/${user.documento}/recetas`);
                setRecetas(res.data ?? []);
            } catch {
                setRecetas([]);
            } finally {
                setLoading(false);
            }
        };
        if (user.documento) fetchRecetas();
    }, [user.documento]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <PrincipalText
                icon="medication"
                text="Mis Medicamentos"
                number={recetas.length}
                subtext="Recetas médicas emitidas para ti."
            />

            {loading ? (
                <TableSkeleton rows={4} cols={4} />
            ) : recetas.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4 block">medication</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sin recetas</h3>
                    <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto">Cuando tu médico emita una receta, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {recetas.map((receta, i) => (
                        <motion.div
                            key={receta.id_receta}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 bg-gray-50/60 dark:bg-gray-800/40">
                                <div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        <span className="material-symbols-outlined text-sm text-primary">assignment</span>
                                        Receta #{receta.id_receta}
                                        <span className="mx-1">·</span>
                                        <span>Vence: {receta.fecha_vencimiento}</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                        Cita del {receta.historial_detalle?.cita?.fecha ?? "—"}
                                    </p>
                                </div>
                                <EstadoBadge estado={receta.estado?.nombre_estado ?? "Pendiente"} />
                            </div>

                            {/* Medication items */}
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {(receta.receta_detalles ?? []).map((det) => {
                                    const p = det.presentacion;
                                    const med = p?.medicamento?.nombre ?? "Medicamento";
                                    const conc = p?.concentracion?.concentracion ?? "";
                                    const forma = p?.forma_farmaceutica?.forma_farmaceutica ?? "";
                                    const dispensado = !!det.dispensacion;

                                    return (
                                        <div key={det.id_detalle_receta} className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${dispensado ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                                                <span className={`material-symbols-outlined text-lg ${dispensado ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {dispensado ? 'check_circle' : 'medication'}
                                                </span>
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {med} {conc} <span className="text-gray-400 font-normal text-sm">({forma})</span>
                                                </p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">water_drop</span>
                                                        {det.dosis}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">schedule</span>
                                                        {det.frecuencia}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">date_range</span>
                                                        {det.duracion}
                                                    </span>
                                                </div>
                                                {det.observaciones && (
                                                    <p className="text-xs text-gray-400 italic">{det.observaciones}</p>
                                                )}
                                            </div>

                                            <div className="text-right shrink-0">
                                                <EstadoBadge estado={dispensado ? "Dispensado" : "Pendiente"} />
                                                <p className="text-xs text-gray-400 mt-1">
                                                    <span className="material-symbols-outlined text-xs align-middle">local_pharmacy</span>
                                                    {det.farmacia?.nombre ?? det.nit_farmacia}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
