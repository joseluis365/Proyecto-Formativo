import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import useHistorial from "../../hooks/useHistorial";
import PrincipalText from "../../components/Users/PrincipalText";
import TableSkeleton from "../../components/UI/TableSkeleton";
import BlueButton from "../../components/UI/BlueButton";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function HistorialPacienteMedico() {
    const { doc } = useParams();
    const navigate = useNavigate();
    const { setTitle, setSubtitle } = useLayout();
    const { 
        historial, 
        detalles, 
        loading, 
        updateAntecedentes 
    } = useHistorial(doc);

    const [isEditingBg, setIsEditingBg] = useState(false);
    const [bgData, setBgData] = useState({
        antecedentes_personales: "",
        antecedentes_familiares: "",
    });

    useEffect(() => {
        setTitle("Historial Clínico");
        setSubtitle(`Detalle de atenciones y antecedentes del paciente.`);
    }, [setTitle, setSubtitle]);

    useEffect(() => {
        if (historial) {
            setBgData({
                antecedentes_personales: historial.antecedentes_personales || "",
                antecedentes_familiares: historial.antecedentes_familiares || "",
            });
        }
    }, [historial]);

    const handleSaveBg = async () => {
        try {
            await updateAntecedentes(bgData);
            Swal.fire("Guardado", "Antecedentes actualizados.", "success");
            setIsEditingBg(false);
        } catch (err) {
            Swal.fire("Error", "No se pudieron actualizar los antecedentes.", "error");
        }
    };

    if (loading && !historial) {
        return <div className="p-8"><TableSkeleton rows={10} columns={1} /></div>;
    }

    const paciente = historial?.paciente;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* ── Botón Volver ────────────────────────────────────────────── */}
            <button 
                onClick={() => navigate('/medico/pacientes')}
                className="flex items-center gap-2 text-primary font-bold hover:underline mb-2 cursor-pointer"
            >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Volver a Mis Pacientes
            </button>

            {/* ── Banner Info Paciente ────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-neutral-gray-border/10 dark:border-gray-800 flex flex-col md:flex-row gap-8 items-center">
                <div className="size-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-5xl">person</span>
                </div>
                <div className="grow text-center md:text-left">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                        {paciente ? `${paciente.primer_nombre} ${paciente.primer_apellido}` : 'Cargando...'}
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-primary">badge</span>
                            CC {doc}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-primary">cake</span>
                            {paciente?.fecha_nacimiento || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-primary">mail</span>
                            {paciente?.email || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* ── Columna Izquierda: Antecedentes (1/3) ─────────────────── */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-neutral-gray-border/10 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <PrincipalText icon="history_edu" text="Antecedentes" />
                            {!isEditingBg ? (
                                <button 
                                    onClick={() => setIsEditingBg(true)}
                                    className="p-2 rounded-xl hover:bg-primary/5 text-primary transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditingBg(false)}
                                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                    <button 
                                        onClick={handleSaveBg}
                                        className="p-2 rounded-xl text-green-500 hover:bg-green-50 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">check</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">Personales</label>
                                {isEditingBg ? (
                                    <textarea 
                                        className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 resize-none h-32 focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={bgData.antecedentes_personales}
                                        onChange={(e) => setBgData({...bgData, antecedentes_personales: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                        {historial?.antecedentes_personales || "No se han registrado antecedentes personales."}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">Familiares</label>
                                {isEditingBg ? (
                                    <textarea 
                                        className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 resize-none h-32 focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={bgData.antecedentes_familiares}
                                        onChange={(e) => setBgData({...bgData, antecedentes_familiares: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                        {historial?.antecedentes_familiares || "No se han registrado antecedentes familiares."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Columna Derecha: Timeline de Atenciones (2/3) ──────────── */}
                <div className="xl:col-span-2 space-y-6">
                    <PrincipalText icon="clinical_notes" text="Línea de Tiempo Clínico" number={detalles.length} />
                    
                    <div className="space-y-4">
                        <AnimatePresence>
                            {detalles.map((detalle, idx) => (
                                <motion.div 
                                    key={detalle.id_detalle}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-neutral-gray-border/10 dark:border-gray-800 relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                        <div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Fecha atención</p>
                                            <p className="text-lg font-black text-gray-900 dark:text-white">
                                                {new Date(detalle.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Médico</p>
                                            <p className="text-sm font-bold text-primary">Dr. {detalle.cita?.medico?.primer_nombre} {detalle.cita?.medico?.primer_apellido}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                                                <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">S</span>
                                                Subjetivo
                                            </label>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                                {detalle.subjetivo || "Sin reporte subjetivo."}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                                                    <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">A</span>
                                                    Diagnóstico
                                                </label>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {detalle.diagnostico}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-primary uppercase flex items-center gap-1">
                                                    <span className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">P</span>
                                                    Tratamiento
                                                </label>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {detalle.tratamiento}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {detalle.remisiones?.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-3 px-2">Remisiones Generadas</p>
                                            <div className="flex flex-wrap gap-2">
                                                {detalle.remisiones.map(rem => (
                                                    <div key={rem.id} className="px-3 py-1.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-sm text-primary">logout</span>
                                                        <span className="text-xs font-bold text-primary italic">
                                                            {rem.tipo_remision === 'cita' 
                                                                ? (rem.especialidad?.especialidad || 'Especialista')
                                                                : 'Examen Clínico'
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {detalles.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                    <p className="text-gray-400 font-medium">No hay atenciones registradas para este paciente.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
