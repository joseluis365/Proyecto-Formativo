import { useEffect, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import useCitas from "../../hooks/useCitas";
import PrincipalText from "../../components/Users/PrincipalText";
import TableSkeleton from "../../components/UI/TableSkeleton";
import { motion } from "framer-motion";

export default function HistorialPaciente() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Obtenemos solo las citas atendidas de este paciente desde el servidor
    const { citas, loading } = useCitas({
        doc_paciente: user.documento,
        estado: "Atendida"
    });

    useEffect(() => {
        setTitle("Mi Historial Médico");
        setSubtitle("Consulta tus atenciones pasadas, diagnósticos y tratamientos.");
    }, [setTitle, setSubtitle]);

    // Procesamos y ordenamos el historial cronológicamente (más reciente primero)
    const historialProcesado = useMemo(() => {
        if (!citas) return [];
        return citas
            .filter(c => c.estado?.nombre_estado === "Atendida")
            .sort((a, b) => {
                const dateA = new Date(`${a.fecha}T${a.hora_inicio}`);
                const dateB = new Date(`${b.fecha}T${b.hora_inicio}`);
                return dateB - dateA;
            })
            .map(c => {
                const doctorRaw = `${c.medico?.primer_nombre} ${c.medico?.primer_apellido}`;
                // Limpiar nombre del médico
                const doctorClean = doctorRaw.replace(/^(Dr|Dra|Doctor|Doctora)\.?\s*/i, '').trim();

                return {
                    id: c.id_cita,
                    fecha: new Date(c.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    }),
                    hora: c.hora_inicio?.slice(0, 5),
                    medico: doctorClean,
                    especialidad: c.tipoCita?.tipo || "Consulta General",
                    diagnostico: c.historialDetalle?.diagnostico || "Sin registro",
                    tratamiento: c.historialDetalle?.tratamiento || "Sin registro",
                    observaciones: c.historialDetalle?.observaciones || c.historialDetalle?.notas_medicas || "Sin observaciones adicionales",
                    remisiones: c.historialDetalle?.remisiones || []
                };
            });
    }, [citas]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <PrincipalText
                icon="history_edu"
                text="Línea de Tiempo Médica"
                subtext="Sigue la evolución de tu salud a través de tus citas finalizadas."
            />

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 animate-pulse border border-neutral-gray-border/10">
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-6"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : historialProcesado.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4 block">medical_information</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Historial vacío</h3>
                    <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto">Cuando completes tus consultas médicas, aparecerán aquí ordenadas por fecha.</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative ml-4 md:ml-0 md:pl-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/20 before:to-transparent"
                >
                    {historialProcesado.map((atencion) => (
                        <motion.div
                            key={atencion.id}
                            variants={itemVariants}
                            className="relative mb-12 last:mb-0"
                        >
                            {/* Dot indicator */}
                            <div className="absolute -left-[21px] md:-left-[37px] top-6 size-4 rounded-full bg-primary ring-4 ring-primary/20 border-2 border-white dark:border-gray-900 z-10 shadow-lg shadow-primary/40"></div>

                            {/* Card Content */}
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-neutral-gray-border/10 hover:shadow-primary/5 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            {atencion.fecha} • {atencion.hora}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                                            {atencion.medico}
                                        </h2>
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1">
                                            {atencion.especialidad}
                                        </p>
                                    </div>

                                    {/* Remisiones Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        {atencion.remisiones.some(r => r.id_examen) && (
                                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-xs">lab_research</span>
                                                Examen solicitado
                                            </span>
                                        )}
                                        {atencion.remisiones.some(r => r.id_especialidad) && (
                                            <span className="px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-900/30 flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-xs">forward_to_inbox</span>
                                                Interconsulta
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <div className="size-1 bg-primary rounded-full"></div>
                                            Diagnóstico Clínico
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300 font-bold leading-relaxed bg-primary/5 p-5 rounded-2xl border-l-4 border-primary">
                                            {atencion.diagnostico}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                            <div className="size-1 bg-green-500 rounded-full"></div>
                                            Tratamiento Sugerido
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            {atencion.tratamiento}
                                        </p>
                                    </div>
                                </div>

                                {atencion.observaciones && (
                                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Observaciones Médicas</h4>
                                        <p className="text-gray-500 dark:text-gray-500 text-xs italic leading-relaxed">
                                            "{atencion.observaciones}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
