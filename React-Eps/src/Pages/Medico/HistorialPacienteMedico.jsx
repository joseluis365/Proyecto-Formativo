import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import useHistorial from "../../hooks/useHistorial";
import PersonalInfo from "../../components/PacienteInfo/PersonalInfo";
import BackgroundInfo from "../../components/PacienteInfo/BackgroundInfo";
import MedicalInfo from "../../components/PacienteInfo/MedicalInfo";
import Button from "../../components/UI/Button";
import WhiteButton from "../../components/UI/WhiteButton";
import Swal from "sweetalert2";
import DataTable from "../../components/UI/DataTable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/Api/axios";
import { AnimatePresence, motion } from "framer-motion";
import DetalleRemisionModal from "@/components/Modals/DetalleRemisionModal";
import DetalleRecetaModal from "@/components/Modals/DetalleRecetaModal";

const schema = z.object({
    email: z.string().email("Correo electrónico inválido"),
    telefono: z.string().regex(/^\d+$/, "El teléfono solo debe contener números"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
    sexo: z.string().min(1, "Selecciona el sexo"),
    fecha_nacimiento: z.string().min(1, "Fecha obligatoria").refine((val) => {
        const date = new Date(val);
        const today = new Date();
        return date <= today;
    }, "La fecha de nacimiento no puede ser futura"),
    grupo_sanguineo: z.string().min(1, "Selecciona el grupo sanguíneo"),
    antecedentes_personales: z.string().optional(),
    antecedentes_familiares: z.string().optional(),
    alergias: z.string().optional(),
    habitos_vida: z.object({
        tabaco: z.string().optional(),
        alcohol: z.string().optional(),
        ejercicio: z.string().optional(),
        dieta: z.string().optional()
    })
});

const ErrorMsg = ({ error }) => {
    if (!error) return null;
    return (
        <span className="text-red-500 text-[10px] font-bold mt-1 block animate-pulse">
            {error.message}
        </span>
    );
};


// ── Cita Detail Modal (reutilizable) ─────────────────────────────────────────
function CitaDetalleModal({ cita, onClose }) {
    if (!cita) return null;
    const det = cita.historialDetalle || cita.historial_detalle;
    const paciente = cita.paciente;
    const [downloading, setDownloading] = useState(false);
    const [selectedRemision, setSelectedRemision] = useState(null);
    const [selectedReceta, setSelectedReceta] = useState(null);

    const getUnit = (key) => {
        const k = key.toUpperCase().replace(/_/g, " ");
        switch (k) {
            case 'FC':
            case 'FRECUENCIA CARDIACA': return 'lpm';
            case 'FR':
            case 'FRECUENCIA RESPIRATORIA': return 'rpm';
            case 'PESO': return 'kg';
            case 'TALLA':
            case 'ESTATURA': return 'm';
            case 'TEMPERATURA': return '°C';
            case 'TA SISTOLICA': return 'mmHG';
            case 'TA DIASTOLICA': return 'mmHG';
            case 'PRESION ARTERIAL': return 'mmHG';
            case 'SATURACION O2':
            case 'SATURACION OXIGENO': return '%';
            case 'IMC': return 'kg/m²';
            default: return '';
        }
    };

    const downloadPdf = async () => {
        if (!cita.id_cita) return;
        setDownloading(true);
        try {
            const resp = await api.get(`/pdf/cita/${cita.id_cita}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([resp], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `cita_${cita.id_cita}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch { /* silent */ } finally { setDownloading(false); }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
            >
                <ModalHeader
                    title={`Consulta #${cita.id_cita} — ${cita.fecha} ${cita.hora_inicio?.slice(0, 5)}`}
                    subtitle={paciente ? `${paciente.primer_nombre} ${paciente.primer_apellido} · Doc: ${paciente.documento}${cita.especialidad?.nombre_especialidad ? ` · ${cita.especialidad.nombre_especialidad}` : ""}` : cita.doc_paciente}
                    onClose={onClose}
                    icon="clinical_notes"
                />

                {det ? (
                    <div className="space-y-3">
                        {[{label:"Motivo / Subjetivo",icon:"person_raised_hand",value:det.subjetivo},{label:"Diagnóstico",icon:"stethoscope",value:det.diagnostico},{label:"Tratamiento",icon:"medication",value:det.tratamiento},{label:"Observaciones",icon:"notes",value:det.observaciones}]
                            .map(({label, icon, value}) => value ? (
                                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">{icon}</span> {label}
                                    </h3>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{value}</p>
                                </div>
                            ) : null)}

                        {det.signos_vitales && Object.keys(det.signos_vitales).length > 0 && (
                            <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">monitor_heart</span> Signos Vitales
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {Object.entries(det.signos_vitales).map(([k, v]) => (
                                        <div key={k} className="bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm border border-blue-50/50 dark:border-gray-700">
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-0.5 truncate" title={k.replace(/_/g, " ")}>
                                                {k.replace(/_/g, " ")}
                                            </p>
                                            <p className="text-sm font-black text-blue-700 dark:text-blue-300 flex items-baseline gap-1">
                                                {v} <span className="text-[10px] font-medium text-blue-500/70">{getUnit(k)}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {det.enfermedades?.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">vaccines</span> Diagnósticos CIE-11
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {det.enfermedades.map(enf => (
                                        <span key={enf.codigo_icd} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                            [{enf.codigo_icd}] {enf.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {det.remisiones?.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">outpatient</span> Remisiones ({det.remisiones.length})
                                </h3>
                                <div className="space-y-3">
                                    {det.remisiones.map((r, i) => (
                                        <div key={r.id_remision || i} className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.tipo_remision === 'examen' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        {r.tipo_remision === 'examen' ? 'EXAMEN' : 'INTERCONSULTA'}
                                                    </span>
                                                    {r.id_remision && <span className="text-xs font-bold text-gray-400">#{r.id_remision}</span>}
                                                </div>
                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                                    {r.especialidad?.especialidad || (r.categoriaExamen || r.categoria_examen)?.categoria || "Requiere asignación"}
                                                </p>
                                                {(r.cita?.fecha || r.examen?.fecha) && (
                                                    <p className="text-[10px] font-bold text-primary mt-0.5 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">calendar_month</span>
                                                        {r.cita?.fecha || r.examen?.fecha} — { (r.cita?.hora_inicio || r.examen?.hora_inicio)?.slice(0,5) }
                                                    </p>
                                                )}
                                                {r.notas && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1" title={r.notas}>{r.notas}</p>}
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedRemision(r); }}
                                                className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0 border border-primary/20"
                                            >
                                                <span className="material-symbols-outlined text-sm">open_in_full</span> Ver Detalles
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {det.receta && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">medication</span> Receta Médica
                                </h3>
                                <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-100 dark:border-gray-700 flex items-start justify-between gap-4">
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                                                RECETA
                                            </span>
                                        {det.receta.id_receta && <span className="text-xs font-bold text-gray-400">#{det.receta.id_receta}</span>}
                                        </div>
                                        {(det.receta.recetaDetalles || det.receta.receta_detalles)?.length > 0 ? (
                                            <ul className="list-disc pl-4 space-y-1">
                                                {(det.receta.recetaDetalles || det.receta.receta_detalles).map((rd, i) => (
                                                    <li key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {rd.presentacion?.medicamento?.nombre}
                                                        <span className="text-gray-400 font-normal ml-1">({rd.dosis} por {rd.duracion})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">Sin medicamentos</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedReceta(det.receta); }}
                                        className="flex items-center gap-1 text-primary hover:bg-primary/5 px-2 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0 border border-primary/20 mt-1"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_full</span> Ver Detalles
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Sin detalles clínicos registrados para esta cita.</p>
                )}

                {/* Footer del Modal - Botón PDF */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={downloadPdf}
                        disabled={downloading}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                            downloading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
                        }`}
                    >
                        {downloading ? (
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                        ) : (
                            <span className="material-symbols-outlined">description</span>
                        )}
                        {downloading ? "Generando..." : "Descargar PDF"}
                    </button>
                </div>
            </motion.div>

            {/* Sub-modales de detalles usando AnimatePresence */}
            <AnimatePresence>
                {selectedRemision && (
                    <DetalleRemisionModal
                        key="modal-remision"
                        remision={selectedRemision}
                        cita={cita}
                        onClose={() => setSelectedRemision(null)}
                    />
                )}
                {selectedReceta && (
                    <DetalleRecetaModal
                        key="modal-receta"
                        receta={selectedReceta}
                        cita={cita}
                        onClose={() => setSelectedReceta(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function HistorialPacienteMedico() {
    const { doc } = useParams();
    const navigate = useNavigate();
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    
    const { 
        historial, 
        paciente,
        citas,
        remisiones,
        recetas,
        loading, 
        updateAntecedentes 
    } = useHistorial(doc);

    const [isEditing, setIsEditing] = useState(false);
    const [savingBg, setSavingBg] = useState(false);
    const [searchParams] = useSearchParams();
    const canEdit = searchParams.get('editable') === 'true';
    const [selectedCita, setSelectedCita] = useState(null);
    const [rawCitas, setRawCitas] = useState([]);
    const [selectedRemision, setSelectedRemision] = useState(null);
    const [selectedReceta, setSelectedReceta] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            email: "",
            telefono: "",
            direccion: "",
            sexo: "",
            fecha_nacimiento: "",
            grupo_sanguineo: "",
            antecedentes_personales: "",
            antecedentes_familiares: "",
            alergias: "",
            habitos_vida: {
                tabaco: "",
                alcohol: "",
                ejercicio: "",
                dieta: ""
            }
        }
    });

    useEffect(() => {
        setTitle("Historial Clínico Completado");
        setSubtitle(`Atenciones, historia e información de un solo vistazo.`);

        setHelpContent({
            title: "Guía del Historial Clínico",
            description: "Consulta toda la historia clínica, farmacológica y demográfica del paciente.",
            sections: [
                {
                    title: "Información General",
                    type: "text",
                    content: "En la parte superior se detallan los datos personales, antecedentes familiares, cirujías y hábitos de vida. Esta información sirve como hoja de vida médica del paciente."
                },
                {
                    title: "Modo Edición",
                    type: "warning",
                    content: "Si accedes a esta vista durante el transcurso de una Consulta Médica (Atender cita), verás habilitado el 'Modo Edición'. Podrás actualizar el correo, teléfono y dirección del paciente, así como modificar sus antecedentes personales, alergias y hábitos (tabaco, dieta, alcohol)."
                },
                {
                    title: "Historial de Atenciones Clínicas",
                    type: "steps",
                    items: [
                        "Navega por las tablas de 'Registro de Atenciones' para ver el historial cronológico de citas pasadas.",
                        "Revisa la pestaña de 'Remisiones y Exámenes' para comprobar el estado de los procedimientos ordenados.",
                        "Consulta el 'Historial Farmacológico' para revisar los medicamentos prescritos anteriormente."
                    ]
                },
                {
                    title: "Exportación",
                    type: "tip",
                    content: "Usa el botón 'Exportar Pdf Completo' situado al pie de la página para generar un documento para el paciente o para archivos físicos."
                }
            ]
        });

        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    // Fetch raw citas with full sub-relations for the detail modal
    useEffect(() => {
        if (!doc) return;
        const fetchRawCitas = async () => {
            try {
                const res = await api.get("/citas", { params: { doc_paciente: doc, atendidas: 1, per_page: 100 } });
                const items = Array.isArray(res) ? res : (res?.data ?? []);
                setRawCitas(items);
            } catch {}
        };
        fetchRawCitas();
    }, [doc]);

    useEffect(() => {
        if (historial || paciente) {
            reset({
                antecedentes_personales: historial?.antecedentes_personales || "",
                antecedentes_familiares: historial?.antecedentes_familiares || "",
                alergias: historial?.alergias || "",
                habitos_vida: historial?.habitos_vida || { tabaco: "", alcohol: "", ejercicio: "", dieta: "" },
                email: paciente?.email || "",
                telefono: paciente?.telefono || "",
                direccion: paciente?.direccion || "",
                sexo: paciente?.sexo || "",
                fecha_nacimiento: paciente?.fecha_nacimiento || "",
                grupo_sanguineo: paciente?.grupo_sanguineo || ""
            });
        }
    }, [historial, paciente, reset]);

    const handleSaveBg = async (data) => {
        setSavingBg(true);
        try {
            await updateAntecedentes(data);
            Swal.fire("Guardado", "Antecedentes actualizados.", "success");
            setIsEditing(false);
        } catch (err) {
            Swal.fire("Error", "No se pudieron actualizar los antecedentes.", "error");
        } finally {
            setSavingBg(false);
        }
    };

    if (loading && !historial) {
        return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Cargando Historia Clínica...</div>;
    }

    const unassigned = paciente || {};
    const nombre = `${unassigned.primer_nombre || ''} ${unassigned.segundo_nombre || ''} ${unassigned.primer_apellido || ''} ${unassigned.segundo_apellido || ''}`.replace(/\s+/g, ' ').trim() || 'Desconocido';

    const formatFechaNacimiento = (fecha) => {
        if (!fecha || fecha === "N/A") return "N/A";
        const dateObj = new Date(fecha);
        if (isNaN(dateObj)) return fecha;
        
        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const today = new Date();
        let age = today.getFullYear() - year;
        const m = today.getMonth() - dateObj.getUTCMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateObj.getUTCDate())) {
            age--;
        }
        return `${formattedDate} (${age} años)`;
    };

    const infoArray = [
        { label: "Documento", value: unassigned.documento || "N/A" },
        { label: "Edad/Cumpleaños", value: formatFechaNacimiento(unassigned.fecha_nacimiento) },
        { label: "Sexo", value: unassigned.sexo || "N/A" },
        { label: "Grupo Sanguíneo", value: unassigned.grupo_sanguineo || "N/A" },
        { label: "Teléfono", value: unassigned.telefono || "N/A" },
        { label: "Dirección", value: unassigned.direccion || "N/A" },
        { label: "Correo", value: unassigned.email || "N/A" },
    ];

    const personalBackground = [
        { label: "Enfermedades Previas & Cirugías", items: (historial?.antecedentes_personales || "Sin registrar").split("\n").filter(Boolean) }
    ];

    const alergiasBackground = [
        { label: "Reacciones Alérgicas", items: (historial?.alergias || "Sin registrar").split("\n").filter(Boolean) }
    ];

    const familyBackground = [
        { label: "Enfermedades Hereditarias", items: (historial?.antecedentes_familiares || "Sin registrar").split("\n").filter(Boolean) }
    ];

    // Build habits display from JSON
    const habitsDisplay = [];
    if (historial?.habitos_vida) {
        if (historial.habitos_vida.tabaco) habitsDisplay.push(`Tabaco: ${historial.habitos_vida.tabaco}`);
        if (historial.habitos_vida.alcohol) habitsDisplay.push(`Alcohol: ${historial.habitos_vida.alcohol}`);
        if (historial.habitos_vida.ejercicio) habitsDisplay.push(`Ejercicio: ${historial.habitos_vida.ejercicio}`);
        if (historial.habitos_vida.dieta) habitsDisplay.push(`Dieta: ${historial.habitos_vida.dieta}`);
    }
    
    if (habitsDisplay.length === 0) habitsDisplay.push("Sin registrar");

    // Columns for tables
    const citasColumns = [
        { key: "fecha", header: "Fecha", render: (c) => c.fecha || 'N/A' },
        { key: "medico", header: "Profesional", render: (c) => c.medico },
        { key: "especialidad", header: "Especialidad", render: (c) => <span className="text-primary font-bold">{c.especialidad}</span> },
        { key: "diagnostico", header: "Diagnóstico", render: (c) => <span className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">{c.diagnostico}</span> },
        { key: "actions", header: "Acciones", align: "center", render: (c) => {
            const raw = rawCitas.find(r => r.fecha === c.fecha);
            return (
                <button
                    onClick={() => raw && setSelectedCita(raw)}
                    className="text-primary hover:bg-primary/10 p-2 rounded-xl transition-colors"
                    title="Ver detalle médico"
                    disabled={!raw}
                >
                    <span className="material-symbols-outlined text-base">visibility</span>
                </button>
            );
        }}
    ];

    const remisionesColumns = [
        { key: "fecha", header: "Fecha", render: (r) => r.fecha || 'N/A' },
        { key: "tipo", header: "Tipo", render: (r) => <span className="font-bold">{r.tipo}</span> },
        { key: "descripcion", header: "Descripción", render: (r) => r.descripcion },
        { key: "estado", header: "Estado", render: (r) => (
            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${r.estado === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {r.estado}
            </span>
        )},
        { key: "actions", header: "Ver", align: "center", render: (r) => {
            // Buscar la remision raw en los rawCitas para obtener el objeto completo
            const rawRemision = rawCitas.flatMap(c => c.historialDetalle?.remisiones || []).find(rem => rem.id_remision === r.id);
            const rawCita = rawCitas.find(c => (c.historialDetalle?.remisiones || []).some(rem => rem.id_remision === r.id));
            return (
                <button
                    onClick={() => rawRemision && setSelectedRemision({ remision: rawRemision, cita: rawCita })}
                    className="text-primary hover:bg-primary/10 p-1.5 rounded-xl transition-colors"
                    title="Ver detalles de remisión"
                    disabled={!rawRemision}
                >
                    <span className="material-symbols-outlined text-base">open_in_full</span>
                </button>
            );
        }}
    ];

    const recetasColumns = [
        { key: "fecha", header: "Fecha", render: (r) => r.fecha || 'N/A' },
        { key: "estado", header: "Estado", render: (r) => (
            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${r.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>
                {r.estado}
            </span>
        ) },
        { key: "medicamentos", header: "Medicamentos Prescritos", render: (r) => (
            <div className="flex flex-col gap-1">
                {r.medicamentos?.map((m, i) => (
                    <span key={i} className="text-xs text-gray-600 dark:text-gray-300">
                        • <b>{m.medicamento}</b>: {m.dosis}
                    </span>
                ))}
            </div>
        ) },
        { key: "actions", header: "Ver", align: "center", render: (r) => {
            const rawReceta = rawCitas.flatMap(c => c.historialDetalle?.receta ? [c.historialDetalle.receta] : []).find(rec => rec.id_receta === r.id);
            const rawCita = rawCitas.find(c => c.historialDetalle?.receta?.id_receta === r.id);
            return (
                <button
                    onClick={() => rawReceta && setSelectedReceta({ receta: rawReceta, cita: rawCita })}
                    className="text-primary hover:bg-primary/10 p-1.5 rounded-xl transition-colors"
                    title="Ver detalles de receta"
                    disabled={!rawReceta}
                >
                    <span className="material-symbols-outlined text-base">open_in_full</span>
                </button>
            );
        }}
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-4 pb-12">
             <button 
                onClick={() => navigate(-1)}
                className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors mb-2 cursor-pointer"
                title="Regresar"
            >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>

            <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-lg border border-neutral-gray-border/20 dark:border-gray-800 pb-4">
                <div className="bg-primary-green/90 dark:bg-primary-green/50 backdrop-blur-sm text-white p-6 rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                        <h2 className="text-xl sm:text-2xl font-bold">HISTORIAL CLÍNICO – {nombre}</h2>
                    </div>
                    {canEdit && (
                        <div className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined text-sm">edit_square</span>
                            MODO CONSULTA
                        </div>
                    )}
                </div>
                <div className="p-6 sm:p-8 space-y-8">
                    <PersonalInfo Info={infoArray} />
                    <hr className="border-gray-300 dark:border-gray-700" />
                    
                    {isEditing ? (
                        <form onSubmit={handleSubmit(handleSaveBg)} className="space-y-6 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Modo Edición: Datos del Paciente y Antecedentes</h3>
                            </div>

                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2"><span className="material-symbols-outlined text-sm align-middle mr-1 text-primary">person</span> Datos Demográficos</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Correo Electrónico</label>
                                    <input type="email" {...register('email')} className={`w-full mt-1 p-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20'}`} />
                                    <ErrorMsg error={errors.email} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Teléfono</label>
                                    <input type="text" {...register('telefono')} className={`w-full mt-1 p-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 ${errors.telefono ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20'}`} />
                                    <ErrorMsg error={errors.telefono} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Dirección</label>
                                    <input type="text" {...register('direccion')} className={`w-full mt-1 p-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 ${errors.direccion ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20'}`} />
                                    <ErrorMsg error={errors.direccion} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Sexo</label>
                                    <select {...register('sexo')} className={`w-full mt-1 p-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 ${errors.sexo ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20'}`}>
                                        <option value="">Seleccione</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                    <ErrorMsg error={errors.sexo} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Fecha de Nacimiento</label>
                                    <input type="date" {...register('fecha_nacimiento')} className={`w-full mt-1 p-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 ${errors.fecha_nacimiento ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20'}`} />
                                    <ErrorMsg error={errors.fecha_nacimiento} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Grupo Sanguíneo</label>
                                    <select {...register('grupo_sanguineo')} className={`w-full mt-1 p-2.5 rounded-lg border bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 ${errors.grupo_sanguineo ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20'}`}>
                                        <option value="">Seleccione</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                    <ErrorMsg error={errors.grupo_sanguineo} />
                                </div>
                            </div>
                            <hr className="border-gray-200 dark:border-gray-700 my-6" />

                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4"><span className="material-symbols-outlined text-sm align-middle mr-1 text-primary">medical_information</span> Antecedentes Clínicos</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">Antecedentes Personales</label>
                                    <textarea 
                                        {...register('antecedentes_personales')}
                                        className="w-full text-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none h-32 focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
                                        placeholder="Cirugías, enfermedades crónicas, hospitalizaciones..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">Alergias</label>
                                    <textarea 
                                        {...register('alergias')}
                                        className="w-full text-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none h-32 focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
                                        placeholder="Medicamentos, alimentos, ambientales..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">Antecedentes Familiares</label>
                                    <textarea 
                                        {...register('antecedentes_familiares')}
                                        className="w-full text-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none h-24 focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
                                        placeholder="Enfermedades hereditarias, causas de fallecimiento en padres/abuelos..."
                                    />
                                </div>
                            </div>
                            
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4"><span className="material-symbols-outlined text-sm align-middle mr-1 text-primary">spa</span> Hábitos y Estilos de Vida</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Tabaco / Fumador</label>
                                    <input type="text" {...register('habitos_vida.tabaco')} className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ej: No, Ocasional..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Alcohol</label>
                                    <input type="text" {...register('habitos_vida.alcohol')} className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ej: Fines de semana" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Actividad Física</label>
                                    <input type="text" {...register('habitos_vida.ejercicio')} className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ej: Sedentario" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase">Dieta</label>
                                    <input type="text" {...register('habitos_vida.dieta')} className="w-full mt-1 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ej: Balanceada" />
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 justify-end">
                                <button type="button" onClick={() => setIsEditing(false)} disabled={savingBg} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 bg-transparent rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50">Cancelar</button>
                                <button type="submit" disabled={savingBg} className={`px-6 py-2.5 text-white bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${savingBg ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    {savingBg ? (
                                        <>
                                            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">save</span>
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <BackgroundInfo icon="assignment" title="Antecedentes Personales" data={personalBackground}/>
                                <BackgroundInfo icon="vaccines" title="Alergias Conocidas" data={alergiasBackground}/>
                            </div>
                            <hr className="border-gray-100 dark:border-gray-800" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <BackgroundInfo icon="family_history" title="Antecedentes Familiares" data={familyBackground}/>
                                <BackgroundInfo icon="spa" title="Hábitos y Estilos de Vida" data={[{label: "Estilo de vida", items: habitsDisplay}]}/>
                            </div>
                        </>
                    )}
                    
                    <hr className="border-gray-300 dark:border-gray-700" />
                    
                    <div className="space-y-12">
                        <MedicalInfo title="Registro de Atenciones (Citas)" tableData={
                            <DataTable columns={citasColumns} data={citas} searchPlaceholder="Buscar diagnóstico o médico..." />
                        } />
                        
                        {(remisiones?.length > 0) && (
                            <MedicalInfo title="Remisiones y Exámenes" tableData={
                                <DataTable columns={remisionesColumns} data={remisiones} searchPlaceholder="Buscar remisión..." />
                            } />
                        )}

                        {(recetas?.length > 0) && (
                            <MedicalInfo title="Historial Farmacológico" tableData={
                                <DataTable columns={recetasColumns} data={recetas} searchPlaceholder="Buscar receta..." />
                            } />
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 mt-8">
                        <WhiteButton icon="download_2" text="Exportar Pdf Completo" onClick={() => window.print()} />
                        {!isEditing && canEdit && (
                            <div onClick={() => setIsEditing(true)}>
                                <Button icon="edit_document" text="Actualizar Antecedentes" />
                            </div>
                        )}
                        {!canEdit && (
                            <p className="text-xs text-gray-400 italic flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Actualización exclusiva en consulta médica
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedCita && <CitaDetalleModal cita={selectedCita} onClose={() => setSelectedCita(null)} />}
            </AnimatePresence>

            <AnimatePresence>
                {selectedRemision && (
                    <DetalleRemisionModal
                        remision={selectedRemision.remision}
                        cita={selectedRemision.cita}
                        onClose={() => setSelectedRemision(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedReceta && (
                    <DetalleRecetaModal
                        receta={selectedReceta.receta}
                        cita={selectedReceta.cita}
                        onClose={() => setSelectedReceta(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
