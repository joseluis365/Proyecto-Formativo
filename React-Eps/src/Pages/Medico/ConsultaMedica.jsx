import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import BlueButton from "@/components/UI/BlueButton";
import api from "@/Api/axios";
import Swal from "sweetalert2";
import useEspecialidades from "@/hooks/useEspecialidades";
import usePrioridades from "@/hooks/usePrioridades";
import useMedicos from "@/hooks/useMedicos";
import { AnimatePresence, motion } from "framer-motion";
import { useLayout } from "../../LayoutContext";
import TableSkeleton from "../../components/UI/TableSkeleton";

// ── Clases de textarea reutilizables ────────────────────────────────────────
const TEXTAREA_BASE =
    "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-colors";
const SELECT_BASE =
    "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";

const ErrorMsg = ({ error }) => {
    if (!error) return null;
    return (
        <span className="text-red-500 text-[10px] font-bold mt-1 block animate-pulse">
            {error.message}
        </span>
    );
};

function RemisionRow({ index, field, register, control, remove, specialties, prioridades, medicos, errors }) {
    const tipo = useWatch({ control, name: `remisiones.${index}.tipo_remision` });
    const selectedEspecialidad = useWatch({ control, name: `remisiones.${index}.id_especialidad` });

    // Filtrar médicos según la especialidad seleccionada (si el backend lo soporta; si no, todos los médicos servirán de fallback)
    const medicosFiltrados = medicos.filter(m =>
        !selectedEspecialidad || String(m.especialidad?.id_especialidad) === String(selectedEspecialidad) || String(m.id_especialidad) === String(selectedEspecialidad)
    );

    return (
        <motion.div
            key={field.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 space-y-4 relative"
        >
            <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
                <span className="material-symbols-outlined text-xl">delete</span>
            </button>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Remisión #{index + 1}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tipo
                    </label>
                    <select
                        {...register(`remisiones.${index}.tipo_remision`, { required: true })}
                        className={SELECT_BASE}
                    >
                        <option value="cita">Cita a Especialista</option>
                        <option value="examen">Examen Clínico</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Prioridad
                    </label>
                    <select
                        {...register(`remisiones.${index}.id_prioridad`)}
                        className={SELECT_BASE}
                    >
                        <option value="">Sin prioridad</option>
                        {prioridades.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                    {tipo === "cita" ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        Especialidad Destino
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register(`remisiones.${index}.id_especialidad`, {
                                            required: tipo === "cita" ? "La especialidad es obligatoria" : false,
                                        })}
                                        className={`${SELECT_BASE} ${errors?.remisiones?.[index]?.id_especialidad ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                                    >
                                        <option value="">Seleccionar especialidad...</option>
                                        {specialties.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    <ErrorMsg error={errors?.remisiones?.[index]?.id_especialidad} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        Médico Especialista
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register(`remisiones.${index}.doc_medico`, {
                                            required: tipo === "cita" ? "Debe asignar un médico" : false,
                                        })}
                                        className={`${SELECT_BASE} ${errors?.remisiones?.[index]?.doc_medico ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                                    >
                                        <option value="">Cualquier profesional disponible</option>
                                        {medicosFiltrados.map(m => (
                                            <option key={m.documento} value={m.documento}>
                                                Dr. {m.primer_nombre} {m.primer_apellido}
                                            </option>
                                        ))}
                                    </select>
                                    <ErrorMsg error={errors?.remisiones?.[index]?.doc_medico} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    Examen Clínico
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    {...register(`remisiones.${index}.id_examen`, {
                                        required: tipo === "examen" ? "El nombre del examen es obligatorio" : false,
                                    })}
                                    type="text"
                                    placeholder="Nombre o código del examen"
                                    className={`${SELECT_BASE} ${errors?.remisiones?.[index]?.id_examen ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                                />
                                <ErrorMsg error={errors?.remisiones?.[index]?.id_examen} />
                            </div>
                        </>
                    )}
                </div>

                {/* Agendamiento integrado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2 bg-white dark:bg-gray-800/80 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_month</span> Fecha de {tipo === 'cita' ? 'Cita' : 'Examen'}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register(`remisiones.${index}.fecha`, {
                                required: "La fecha es obligatoria",
                                min: { value: new Date().toISOString().split("T")[0], message: "La fecha no puede ser anterior a hoy" }
                            })}
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            className={`${SELECT_BASE} ${errors?.remisiones?.[index]?.fecha ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                        />
                        <ErrorMsg error={errors?.remisiones?.[index]?.fecha} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span> Hora de Inicio
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register(`remisiones.${index}.hora_inicio`, { required: "La hora es obligatoria" })}
                            className={`${SELECT_BASE} ${errors?.remisiones?.[index]?.hora_inicio ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                        >
                            <option value="">Seleccione horario</option>
                            {Array.from({ length: 19 }).map((_, i) => {
                                const hour = Math.floor(i / 2) + 8;
                                const min = i % 2 === 0 ? "00" : "30";
                                const val = `${hour.toString().padStart(2, "0")}:${min}`;
                                return <option key={val} value={val}>{val}</option>;
                            })}
                        </select>
                        <ErrorMsg error={errors?.remisiones?.[index]?.hora_inicio} />
                    </div>
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Justificación
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register(`remisiones.${index}.notas`, {
                            required: "La justificación es obligatoria",
                            minLength: { value: 5, message: "Mínimo 5 caracteres" }
                        })}
                        rows={2}
                        placeholder="Motivo de la remisión..."
                        className={`${TEXTAREA_BASE} ${errors?.remisiones?.[index]?.notas ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    />
                    <ErrorMsg error={errors?.remisiones?.[index]?.notas} />
                </div>
            </div>
        </motion.div>
    );
}

function SignosVitalesRow({ register, open, errors }) {
    const signs = [
        { name: "ta_sistolica", label: "TA Sistólica", placeholder: "mmHg", min: 70, max: 250 },
        { name: "ta_diastolica", label: "TA Diastólica", placeholder: "mmHg", min: 40, max: 150 },
        { name: "fc", label: "F. Cardiaca", placeholder: "lpm", min: 30, max: 220 },
        { name: "fr", label: "F. Respirat.", placeholder: "rpm", min: 8, max: 60 },
        { name: "temperatura", label: "Temperatura", placeholder: "°C", min: 30, max: 45 },
        { name: "peso", label: "Peso", placeholder: "kg", min: 1, max: 400 },
        { name: "talla", label: "Talla", placeholder: "cm", min: 30, max: 250 },
        { name: "saturacion_o2", label: "SpO₂ (%)", placeholder: "%", min: 50, max: 100 },
    ];

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
                        {signs.map(({ name, label, placeholder, min, max }) => {
                            const error = errors?.signos_vitales?.[name];
                            return (
                                <div key={name} className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        {label}
                                    </label>
                                    <input
                                        {...register(`signos_vitales.${name}`, {
                                            valueAsNumber: true,
                                            min: { value: min, message: `Mín ${min}` },
                                            max: { value: max, message: `Máx ${max}` },
                                        })}
                                        type="number"
                                        step="0.1"
                                        placeholder={placeholder}
                                        className={`w-full p-2 rounded-lg border bg-white dark:bg-gray-800 dark:text-white text-sm text-center focus:outline-none focus:ring-2 transition-colors
                                            ${error
                                                ? 'border-red-500 ring-1 ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-primary/40'
                                            }
                                        `}
                                    />
                                    <ErrorMsg error={error} />
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const TABS = [
    { id: "soap", icon: "clinical_notes", label: "SOAP Clínico" },
    { id: "remisiones", icon: "outpatient", label: "Remisiones" },
];

export default function ConsultaMedica() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle, setSubtitle } = useLayout();

    const [cita, setCita] = useState({
        paciente: {},
        historial: {},
        remisiones: [],
        tipoCita: {}
    });
    const [loadingCita, setLoadingCita] = useState(true);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("soap");
    const [signosOpen, setSignosOpen] = useState(false);

    const { specialties } = useEspecialidades();
    const { prioridades } = usePrioridades();
    const { medicos } = useMedicos();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            subjetivo: "",
            signos_vitales: {},
            diagnostico: "",
            tratamiento: "",
            observaciones: "",
            notas_medicas: "",
            remisiones: [],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "remisiones" });

    useEffect(() => {
        setTitle("Consulta Médica");
        setSubtitle("Atención clínica para el paciente");

        const fetchCita = async () => {
            try {
                const response = await api.get(`/cita/${id}`);
                const dataRaw = response.data || response || {};

                setCita({
                    paciente: dataRaw.paciente || {},
                    historial: dataRaw.historial || {},
                    remisiones: dataRaw.remisiones || [],
                    tipoCita: dataRaw.tipoCita || {},
                    ...dataRaw
                });
            } catch (error) {
                Swal.fire("Error", "No se pudo cargar la cita solicitada.", "error");
                navigate("/medico/agenda");
            } finally {
                setLoadingCita(false);
            }
        };

        fetchCita();
    }, [id, navigate, setTitle, setSubtitle]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Limpiar signos vitales y convertir Talla de cm a metros para el backend
            const signosLimpios = Object.fromEntries(
                Object.entries(data.signos_vitales ?? {})
                    .map(([k, v]) => {
                        if (k === 'talla' && v) return [k, v / 100]; // cm -> m
                        return [k, v];
                    })
                    .filter(([, v]) => v !== undefined && v !== null && !isNaN(v))
            );

            const payload = {
                subjetivo: data.subjetivo || undefined,
                signos_vitales: Object.keys(signosLimpios).length > 0 ? signosLimpios : undefined,
                diagnostico: data.diagnostico,
                tratamiento: data.tratamiento,
                observaciones: data.observaciones || undefined,
                notas_medicas: data.notas_medicas || undefined,
                remisiones: data.remisiones || [],
                medicamentos: [],
            };

            await api.post(`/cita/${id}/atender`, payload);

            await Swal.fire({
                title: "¡Atención Registrada!",
                text: "La evolución clínica ha sido guardada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });

            navigate("/medico/agenda");
        } catch (error) {
            const msg = error.response?.data?.message || "No se pudo registrar la atención.";
            const isIdempotencia = msg.includes("ya fue atendida");
            const isAuth = error.response?.status === 403;

            Swal.fire({
                title: isIdempotencia ? "Cita ya atendida" : isAuth ? "Sin autorización" : "Error",
                text: msg,
                icon: isIdempotencia ? "warning" : "error",
                confirmButtonColor: isIdempotencia ? "#F59E0B" : "#EF4444",
            });
            if (isIdempotencia) navigate("/medico/agenda");
        } finally {
            setLoading(false);
        }
    };

    if (loadingCita) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <TableSkeleton rows={5} columns={4} />
            </div>
        );
    }

    const pacienteNombre = `${cita.paciente?.primer_nombre ?? ""} ${cita.paciente?.primer_apellido ?? ""}`.trim();
    const remisionCount = fields.length;

    return (
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
            <button
                onClick={() => navigate('/medico/agenda')}
                className="flex items-center gap-2 text-primary font-bold hover:underline mb-4 cursor-pointer w-fit"
            >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Volver a la agenda
            </button>

            <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl">stethoscope</span>
                    Atender: {pacienteNombre}
                </h1>

                <button
                    type="button"
                    onClick={() => navigate(`/medico/pacientes/historial/${cita.paciente?.documento}`)}
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
                >
                    <span className="material-symbols-outlined">history</span>
                    Ver historial clínico
                </button>
            </div>

            <div className="px-6 py-4 bg-primary/5 dark:bg-primary/10 border border-gray-100 dark:border-gray-800 rounded-t-xl">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <span className="material-symbols-outlined text-base text-primary">badge</span>
                        <span className="font-bold">{cita.paciente?.documento}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <span className="material-symbols-outlined text-base text-primary">local_hospital</span>
                        {cita.tipoCita?.tipo ?? "Consulta General"}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <span className="material-symbols-outlined text-base text-primary">schedule</span>
                        {cita.hora_inicio?.slice(0, 5)} — {cita.fecha}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-b-xl shadow-sm flex-1 flex flex-col">
                <div className="flex border-b border-gray-200 dark:border-gray-800">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 justify-center items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer
                                ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}
                            `}
                        >
                            <span className="material-symbols-outlined text-base">{tab.icon}</span>
                            {tab.label}
                            {tab.id === "remisiones" && remisionCount > 0 && (
                                <span className="ml-1 bg-primary text-white text-xs rounded-full size-5 flex items-center justify-center font-bold">
                                    {remisionCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
                    <div className="p-6 flex-1">
                        {activeTab === "soap" && (
                            <div className="space-y-6">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setSignosOpen(v => !v)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                            <span className="material-symbols-outlined text-base text-primary">monitor_heart</span>
                                            Signos Vitales <span className="text-xs font-normal text-gray-400">(opcional)</span>
                                        </span>
                                        <span className={`material-symbols-outlined text-gray-400 transition-transform ${signosOpen ? "rotate-180" : ""}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <div className="px-4 pb-4">
                                        <SignosVitalesRow register={register} open={signosOpen} errors={errors} />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">S</span>
                                        Subjetivo — Relato del paciente
                                    </label>
                                    <textarea {...register("subjetivo")} rows={3} className={TEXTAREA_BASE} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-black">A</span>
                                        Diagnóstico <span className="text-xs text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register("diagnostico", {
                                            required: "El diagnóstico clínico es obligatorio",
                                            minLength: { value: 5, message: "El diagnóstico debe tener al menos 5 caracteres" }
                                        })}
                                        rows={4}
                                        className={`${TEXTAREA_BASE} ${errors.diagnostico ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                                    />
                                    <ErrorMsg error={errors.diagnostico} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-black">P</span>
                                        Tratamiento y Plan <span className="text-xs text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register("tratamiento", {
                                            required: "El tratamiento sugerido es obligatorio",
                                            minLength: { value: 5, message: "El tratamiento debe tener al menos 5 caracteres" }
                                        })}
                                        rows={4}
                                        className={`${TEXTAREA_BASE} ${errors.tratamiento ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                                    />
                                    <ErrorMsg error={errors.tratamiento} />
                                </div>
                            </div>
                        )}

                        {activeTab === "remisiones" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">Agrega remisiones o exámenes opcionales.</p>
                                    <button
                                        type="button"
                                        onClick={() => append({ tipo_remision: "cita", id_especialidad: "", id_examen: "", id_prioridad: "", notas: "" })}
                                        className="flex items-center gap-1.5 text-sm font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <span className="material-symbols-outlined">add_circle</span> Agregar Remisión
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {fields.map((field, index) => (
                                        <RemisionRow
                                            key={field.id}
                                            index={index}
                                            field={field}
                                            register={register}
                                            control={control}
                                            remove={remove}
                                            specialties={specialties}
                                            prioridades={prioridades}
                                            medicos={medicos}
                                            errors={errors}
                                        />
                                    ))}
                                </AnimatePresence>

                                {fields.length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">outpatient</span>
                                        <p className="text-gray-400 text-sm">No se han agregado remisiones.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 rounded-b-xl shrink-0">
                        <div className="w-64">
                            <BlueButton text="Finalizar Atención" icon="task_alt" type="submit" loading={loading} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
