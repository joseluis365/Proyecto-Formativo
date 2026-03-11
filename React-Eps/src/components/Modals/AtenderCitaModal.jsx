import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import api from "@/Api/axios";
import Swal from "sweetalert2";
import useEspecialidades from "@/hooks/useEspecialidades";
import usePrioridades from "@/hooks/usePrioridades";
import { AnimatePresence, motion } from "framer-motion";

// ── Clases de textarea reutilizables ────────────────────────────────────────
const TEXTAREA_BASE =
    "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-colors";
const SELECT_BASE =
    "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors";

// ── Sub-componente: un campo de remisión individual ──────────────────────────
function RemisionRow({ index, field, register, control, remove, specialties, prioridades }) {
    const tipo = useWatch({ control, name: `remisiones.${index}.tipo_remision` });

    return (
        <motion.div
            key={field.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 space-y-4 relative"
        >
            {/* Botón eliminar */}
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
                {/* Tipo de remisión */}
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

                {/* Prioridad */}
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

                {/* Campo condicional: Especialidad (tipo=cita) o Examen (tipo=examen) */}
                <div className="space-y-1 md:col-span-2">
                    {tipo === "cita" ? (
                        <>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                Especialidad Destino
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register(`remisiones.${index}.id_especialidad`, {
                                    required: "Seleccione una especialidad",
                                })}
                                className={SELECT_BASE}
                            >
                                <option value="">Seleccionar especialidad...</option>
                                {specialties.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </>
                    ) : (
                        <>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                Examen Clínico
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register(`remisiones.${index}.id_examen`)}
                                type="text"
                                placeholder="Nombre o código del examen (integración futura)"
                                className={SELECT_BASE}
                            />
                        </>
                    )}
                </div>

                {/* Notas */}
                <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Justificación
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register(`remisiones.${index}.notas`, {
                            required: "La justificación es obligatoria",
                        })}
                        rows={2}
                        placeholder="Motivo de la remisión..."
                        className={TEXTAREA_BASE}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// ── Sub-componente: Signos Vitales colapsable ────────────────────────────────
function SignosVitalesRow({ register, open }) {
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
                        {[
                            { name: "ta_sistolica",  label: "TA Sistólica",  placeholder: "mmHg", unit: "" },
                            { name: "ta_diastolica", label: "TA Diastólica", placeholder: "mmHg", unit: "" },
                            { name: "fc",            label: "FC",            placeholder: "lpm",  unit: "" },
                            { name: "fr",            label: "FR",            placeholder: "rpm",  unit: "" },
                            { name: "temperatura",   label: "Temperatura",   placeholder: "°C",   unit: "" },
                            { name: "peso",          label: "Peso",          placeholder: "kg",   unit: "" },
                            { name: "talla",         label: "Talla",         placeholder: "m",    unit: "" },
                            { name: "saturacion_o2", label: "SpO₂",          placeholder: "%",    unit: "" },
                        ].map(({ name, label, placeholder }) => (
                            <div key={name} className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                    {label}
                                </label>
                                <input
                                    {...register(`signos_vitales.${name}`, {
                                        setValueAs: v => v === "" ? undefined : parseFloat(v),
                                    })}
                                    type="number"
                                    step="0.1"
                                    placeholder={placeholder}
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── TAB ICONS / LABELS ────────────────────────────────────────────────────────
const TABS = [
    { id: "soap",       icon: "clinical_notes",  label: "SOAP Clínico"  },
    { id: "remisiones", icon: "outpatient",       label: "Remisiones"    },
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function AtenderCitaModal({ isOpen, onClose, cita, onSuccess }) {
    const [loading, setLoading]             = useState(false);
    const [activeTab, setActiveTab]         = useState("soap");
    const [signosOpen, setSignosOpen]       = useState(false);

    const { specialties } = useEspecialidades();
    const { prioridades }  = usePrioridades();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            // SOAP S
            subjetivo:     "",
            // SOAP O — signos_vitales se serializa como objeto al enviar
            signos_vitales: {},
            // SOAP A
            diagnostico:   "",
            // SOAP P
            tratamiento:   "",
            // Extra
            observaciones: "",
            notas_medicas: "",
            // Remisiones
            remisiones: [],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "remisiones" });

    // Resetear al cerrar o cambiar de cita
    useEffect(() => {
        if (!isOpen) {
            reset();
            setActiveTab("soap");
            setSignosOpen(false);
        }
    }, [isOpen, reset]);

    // ── SUBMIT ─────────────────────────────────────────────────────────────────
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Limpiar signos_vitales: quitar campos vacíos/undefined
            const signosLimpios = Object.fromEntries(
                Object.entries(data.signos_vitales ?? {}).filter(([, v]) => v !== undefined && v !== "")
            );

            const payload = {
                subjetivo:      data.subjetivo      || undefined,
                signos_vitales: Object.keys(signosLimpios).length > 0 ? signosLimpios : undefined,
                diagnostico:    data.diagnostico,
                tratamiento:    data.tratamiento,
                observaciones:  data.observaciones  || undefined,
                notas_medicas:  data.notas_medicas  || undefined,
                remisiones:     data.remisiones.length > 0 ? data.remisiones : undefined,
            };

            await api.post(`/cita/${cita.id_cita}/atender`, payload);

            Swal.fire({
                title: "¡Atención Registrada!",
                text: "La evolución clínica ha sido guardada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });

            reset();
            onSuccess?.();
            onClose();
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
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !cita) return null;

    const pacienteNombre = `${cita.paciente?.primer_nombre ?? ""} ${cita.paciente?.primer_apellido ?? ""}`.trim();
    const remisionCount  = fields.length;

    return (
        <BaseModal maxWidth="max-w-3xl">
            <div className="flex flex-col max-h-[90vh]">

                {/* ── Header ─────────────────────────────────────────────────── */}
                <ModalHeader
                    title={`Atender: ${pacienteNombre}`}
                    icon="stethoscope"
                    onClose={onClose}
                />

                {/* ── Info rápida del paciente ────────────────────────────────── */}
                <div className="px-6 pt-4 pb-3 bg-primary/5 dark:bg-primary/10 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-base text-primary">badge</span>
                            <span className="font-bold text-gray-800 dark:text-gray-200">{cita.paciente?.documento}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-base text-primary">local_hospital</span>
                            {cita.tipoCita?.tipo ?? "Consulta General"}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined text-base text-primary">schedule</span>
                            {cita.hora_inicio?.slice(0, 5)} — {cita.fecha}
                        </span>
                        {cita.motivo && (
                            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 italic">
                                <span className="material-symbols-outlined text-base text-primary">note</span>
                                {cita.motivo}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Tab Bar ────────────────────────────────────────────────── */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer
                                ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }
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

                {/* ── Contenido con scroll ─────────────────────────────────────── */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                        {/* ══ TAB 1: SOAP ════════════════════════════════════════ */}
                        {activeTab === "soap" && (
                            <div className="space-y-5">

                                {/* Signos Vitales — colapsable */}
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setSignosOpen(v => !v)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                                    >
                                        <span className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                            <span className="material-symbols-outlined text-base text-primary">monitor_heart</span>
                                            Signos Vitales
                                            <span className="text-xs font-normal text-gray-400">(opcional)</span>
                                        </span>
                                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${signosOpen ? "rotate-180" : ""}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <div className="px-4 pb-4">
                                        <SignosVitalesRow register={register} open={signosOpen} />
                                    </div>
                                </div>

                                {/* S — Subjetivo */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">S</span>
                                        Subjetivo — Relato del paciente
                                        <span className="text-xs font-normal text-gray-400">(opcional)</span>
                                    </label>
                                    <textarea
                                        {...register("subjetivo")}
                                        rows={3}
                                        placeholder="Síntomas y molestias reportadas por el paciente, evolución, antecedentes relevantes..."
                                        className={TEXTAREA_BASE}
                                    />
                                </div>

                                {/* A — Diagnóstico (Assessment) */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-xs font-black">A</span>
                                        Diagnóstico
                                        <span className="text-xs text-red-500 font-bold">*</span>
                                    </label>
                                    <textarea
                                        {...register("diagnostico", { required: "El diagnóstico es obligatorio" })}
                                        rows={4}
                                        placeholder="Diagnóstico médico (código CIE-10 recomendado)..."
                                        className={`${TEXTAREA_BASE} ${errors.diagnostico ? "border-red-400 dark:border-red-500" : ""}`}
                                    />
                                    {errors.diagnostico && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {errors.diagnostico.message}
                                        </p>
                                    )}
                                </div>

                                {/* P — Tratamiento (Plan) */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-black">P</span>
                                        Tratamiento y Plan
                                        <span className="text-xs text-red-500 font-bold">*</span>
                                    </label>
                                    <textarea
                                        {...register("tratamiento", { required: "El tratamiento es obligatorio" })}
                                        rows={4}
                                        placeholder="Indicaciones médicas, medicación prescrita, cuidados en casa..."
                                        className={`${TEXTAREA_BASE} ${errors.tratamiento ? "border-red-400 dark:border-red-500" : ""}`}
                                    />
                                    {errors.tratamiento && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">error</span>
                                            {errors.tratamiento.message}
                                        </p>
                                    )}
                                </div>

                                {/* Observaciones extras */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base text-gray-400">edit_note</span>
                                        Observaciones adicionales
                                        <span className="text-xs font-normal text-gray-400">(opcional)</span>
                                    </label>
                                    <textarea
                                        {...register("observaciones")}
                                        rows={2}
                                        placeholder="Notas del médico, indicaciones especiales..."
                                        className={TEXTAREA_BASE}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ══ TAB 2: REMISIONES ══════════════════════════════════ */}
                        {activeTab === "remisiones" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Agrega remisiones o exámenes opcionales para este paciente.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => append({
                                            tipo_remision:   "cita",
                                            id_especialidad: "",
                                            id_examen:       "",
                                            id_prioridad:    "",
                                            notas:           "",
                                        })}
                                        className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 px-3 py-2 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-lg">add_circle</span>
                                        Agregar Remisión
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
                                        />
                                    ))}
                                </AnimatePresence>

                                {fields.length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2 block">
                                            outpatient
                                        </span>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                                            No se han agregado remisiones para este paciente.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Footer sticky ─────────────────────────────────────────── */}
                    <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <div className="w-56">
                            <BlueButton
                                text="Finalizar Atención"
                                icon="task_alt"
                                type="submit"
                                loading={loading}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </BaseModal>
    );
}
