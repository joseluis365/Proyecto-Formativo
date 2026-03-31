import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import BlueButton from "@/components/UI/BlueButton";
import api from "@/Api/axios";
import Swal from "sweetalert2";
import useEspecialidades from "@/hooks/useEspecialidades";
import usePrioridades from "@/hooks/usePrioridades";
import useMedicos from "@/hooks/useMedicos";
import useMedicosDisponibles from "@/hooks/useMedicosDisponibles";
import { AnimatePresence, motion } from "framer-motion";
import { useLayout } from "../../LayoutContext";
import useCategoriasExamen from "@/hooks/useCategoriasExamen";
import SearchableSelect from "@/components/UI/SearchableSelect";
import TableSkeleton from "../../components/UI/TableSkeleton";

const vitalSignSchema = (min, max, minMsg, maxMsg) => 
    z.string({ required_error: "Campo obligatorio" })
     .min(1, "Campo obligatorio")
     .refine(val => !isNaN(Number(val)), { message: "Debe ser un número" })
     .transform(val => Number(val))
     .pipe(z.number().min(min, minMsg).max(max, maxMsg));

const validateDateNotPast = (val) => {
    if (!val) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(`${val}T00:00:00`);
    return inputDate >= today;
};

const schema = z.object({
    subjetivo: z.string().min(1, "El subjetivo es obligatorio"),
    signos_vitales: z.object({
        ta_sistolica: vitalSignSchema(90, 190, "Verifique tensión (Mín 90)", "Verifique tensión (Máx 190)"),
        ta_diastolica: vitalSignSchema(60, 110, "Verifique tensión (Mín 60)", "Verifique tensión (Máx 110)"),
        fc: vitalSignSchema(50, 120, "Verifique el pulso (Mín 50)", "Verifique el pulso (Máx 120)"),
        fr: vitalSignSchema(10, 35, "Verifique frecuencia (Mín 10)", "Verifique frecuencia (Máx 35)"),
        temperatura: vitalSignSchema(34, 43, "Verifique la temperatura (Mín 34°C)", "Verifique la temperatura (Máx 43°C)"),
        peso: vitalSignSchema(1, 400, "Verifique el peso (Mín 1 kg)", "Verifique el peso (Máx 400 kg)"),
        talla: vitalSignSchema(30, 250, "Verifique la talla (Mín 30 cm)", "Verifique la talla (Máx 250 cm)"),
        saturacion_o2: vitalSignSchema(85, 100, "Verifique saturación (Mín 85%)", "Máximo 100%"),
    }),
    diagnostico: z.string().min(1, "El análisis y diagnóstico es obligatorio"),
    enfermedades: z.array(z.object({
        codigo_icd: z.string()
    })).min(1, "Debe seleccionar al menos un diagnóstico CIE-11"),
    tratamiento: z.string().min(1, "El tratamiento es obligatorio"),
    observaciones: z.string().optional(),
    notas_medicas: z.string().optional(),
    remisiones: z.array(z.object({
        tipo_remision: z.enum(["cita", "examen"]),
        id_especialidad: z.preprocess(val => (val === "" || val === null) ? undefined : String(val), z.string().optional()),
        doc_medico: z.preprocess(val => (val === "" || val === null) ? undefined : String(val), z.string().optional()),
        id_categoria_examen: z.preprocess(val => (val === "" || val === null) ? undefined : String(val), z.string().optional()),
        id_motivo: z.preprocess(val => (val === "" || val === null) ? undefined : String(val), z.string().min(1, "El campo es obligatorio")),
        requiere_ayuno: z.boolean().optional(),
        id_prioridad: z.preprocess(val => (val === "" || val === null) ? undefined : String(val), z.string().optional()),
        fecha: z.string().min(1, "La fecha es obligatoria").refine(validateDateNotPast, "No puede ser pasada"),
        hora_inicio: z.string().min(1, "La hora es obligatoria"),
        notas: z.string().min(5, "La justificación es obligatoria (mín. 5 caracteres)")
    })).superRefine((data, ctx) => {
        data.forEach((rem, idx) => {
            if (String(rem.id_motivo) === "51" && (!rem.notas || rem.notas.trim().length < 5)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mínimo 5 caracteres si eligió 'Otro'", path: [idx, 'notas'] });
            }
            if (rem.tipo_remision === 'cita' && !rem.id_especialidad) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Especialidad obligatoria", path: [idx, 'id_especialidad'] });
            }
            if (rem.tipo_remision === 'cita' && !rem.doc_medico) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Médico obligatorio", path: [idx, 'doc_medico'] });
            }
            if (rem.tipo_remision === 'examen' && !rem.id_categoria_examen) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Categoría obligatoria", path: [idx, 'id_categoria_examen'] });
            }
        });
    }).optional(),
    recetas: z.array(z.object({
        id_presentacion: z.preprocess(val => String(val ?? ""), z.string().min(1, "Medicamento requerido")),
        nit_farmacia: z.preprocess(val => String(val ?? ""), z.string().min(1, "Farmacia requerida")),
        cantidad_dispensar: z.coerce.number().min(1, "Obligatorio (mínimo 1)"),
        dosis: z.string().min(1, "Dosis requerida"),
        frecuencia: z.string().min(1, "Frecuencia requerida"),
        duracion: z.string().min(1, "Fecha obligatoria").refine(validateDateNotPast, "No pasada"),
        observaciones: z.string().optional()
    })).optional()
});

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

function RemisionRow({ index, field, register, control, setValue, remove, specialties, prioridades, categorias, motivosList, errors }) {
    const tipo = useWatch({ control, name: `remisiones.${index}.tipo_remision` });
    const selectedEspecialidad = useWatch({ control, name: `remisiones.${index}.id_especialidad` });
    const selectedCategoriaId = useWatch({ control, name: `remisiones.${index}.id_categoria_examen` });
    const selectedFecha = useWatch({ control, name: `remisiones.${index}.fecha` });
    const selectedHora = useWatch({ control, name: `remisiones.${index}.hora_inicio` });
    const selectedDocMedico = useWatch({ control, name: `remisiones.${index}.doc_medico` });
    const selectedMotivoId = useWatch({ control, name: `remisiones.${index}.id_motivo` });

    useEffect(() => {
        if (tipo === "examen" && selectedCategoriaId && categorias) {
            const cat = categorias.find(c => String(c.value) === String(selectedCategoriaId));
            if (cat) {
                // Forzar booleano real
                const requires = !!(cat.requiere_ayuno === true || cat.requiere_ayuno === 1 || cat.requiere_ayuno === "1" || cat.requiere_ayuno === "true");
                setValue(`remisiones.${index}.requiere_ayuno`, requires, { shouldValidate: true, shouldDirty: true });
            }
        }
    }, [tipo, selectedCategoriaId, categorias, setValue, index]);

    const requiereAyuno = useWatch({ control, name: `remisiones.${index}.requiere_ayuno` });

    // Cargar médicos disponibles dinámicamente según especialidad, fecha y hora
    const { medicos: medicosDisponibles, loading: loadingMedicos } = useMedicosDisponibles(
        selectedFecha, 
        selectedHora, 
        selectedEspecialidad
    );

    const isDatePicked = Boolean(selectedFecha);

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
                                        Especialidad Destino <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name={`remisiones.${index}.id_especialidad`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <SearchableSelect
                                                    options={specialties}
                                                    value={field.value}
                                                    onChange={(val) => field.onChange(val)}
                                                    placeholder="Buscar especialidad..."
                                                    error={!!fieldState.error}
                                                />
                                                <ErrorMsg error={fieldState.error} />
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        Médico Especialista <span className="text-red-500">*</span>
                                    </label>
                                    {(!selectedFecha || !selectedHora) ? (
                                        <p className="text-xs text-gray-400 italic py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-lg">Seleccione fecha y hora primero.</p>
                                    ) : loadingMedicos ? (
                                        <p className="text-xs text-primary italic py-2.5 px-3 border border-primary/20 rounded-lg animate-pulse">Buscando disponibilidad...</p>
                                    ) : (
                                        <Controller
                                            name={`remisiones.${index}.doc_medico`}
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <SearchableSelect
                                                        options={medicosDisponibles.map(m => ({ value: m.documento, label: `Dr. ${m.primer_nombre} ${m.primer_apellido}` }))}
                                                        value={field.value}
                                                        onChange={(val) => field.onChange(val)}
                                                        placeholder={medicosDisponibles.length === 0 ? "Sin médicos disponibles" : "Seleccionar médico..."}
                                                        noOptionsText="No hay médicos disponibles en ese horario"
                                                        error={!!fieldState.error}
                                                    />
                                                    <ErrorMsg error={fieldState.error} />
                                                </>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                        Categoría de Examen <span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name={`remisiones.${index}.id_categoria_examen`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <SearchableSelect
                                                    options={categorias || []}
                                                    value={field.value}
                                                    onChange={(val) => field.onChange(val)}
                                                    placeholder="Buscar categoría de examen..."
                                                    error={!!fieldState.error}
                                                />
                                                <ErrorMsg error={fieldState.error} />
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="space-y-1 flex items-center mt-6">
                                    <label className="inline-flex items-center cursor-default opacity-90">
                                        <input
                                            type="checkbox"
                                            checked={!!requiereAyuno}
                                            {...register(`remisiones.${index}.requiere_ayuno`)}
                                            className="sr-only peer"
                                            onChange={() => {}} // Evitar cambios manuales ya que depende de la categoría
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 shadow-inner"></div>
                                        <span className="ms-3 text-sm font-bold text-gray-900 dark:text-gray-300">
                                            {requiereAyuno ? 'Requiere Ayuno' : 'No requiere Ayuno'}
                                        </span>
                                    </label>
                                </div>
                                
                                {requiereAyuno && (
                                    <div className="md:col-span-2 mt-2 inline-flex items-center gap-2 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 font-bold px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800/30 text-sm">
                                        <span className="material-symbols-outlined text-base">warning</span>
                                        El paciente debe presentarse en ayunas para este examen.
                                    </div>
                                )}
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
                            disabled={!isDatePicked}
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
                        Motivo Principal <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name={`remisiones.${index}.id_motivo`}
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <SearchableSelect
                                    options={motivosList || []}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                    placeholder="Busca o selecciona un motivo..."
                                    error={!!fieldState.error}
                                />
                                <ErrorMsg error={fieldState.error} />
                            </>
                        )}
                    />
                </div>

                <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Justificación / Detalles Adicionales <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register(`remisiones.${index}.notas`)}
                        rows={2}
                        placeholder="Detalles sobre el motivo de la remisión..."
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
        { name: "ta_sistolica", label: "TA Sistólica", placeholder: "mmHg", min: 90, max: 190 },
        { name: "ta_diastolica", label: "TA Diastólica", placeholder: "mmHg", min: 60, max: 110 },
        { name: "fc", label: "F. Cardiaca", placeholder: "lpm", min: 50, max: 120 },
        { name: "fr", label: "F. Respirat.", placeholder: "rpm", min: 10, max: 35 },
        { name: "temperatura", label: "Temperatura", placeholder: "°C", min: 34, max: 43 },
        { name: "peso", label: "Peso", placeholder: "kg", min: 1, max: 400 },
        { name: "talla", label: "Talla", placeholder: "cm", min: 30, max: 250 },
        { name: "saturacion_o2", label: "SpO₂ (%)", placeholder: "%", min: 85, max: 100 },
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
                                        {...register(`signos_vitales.${name}`)}
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

function BuscadorEnfermedades({ fields, append, remove, errors, options }) {
    const selectedCodes = fields.map(f => f.codigo_icd);

    const handleSelect = (code) => {
        if (!code || selectedCodes.includes(code)) return;
        if (fields.length >= 15) {
            Swal.fire("Límite alcanzado", "No puedes diagnosticar más de 15 enfermedades", "warning");
            return;
        }
        append({ codigo_icd: code });
    };

    return (
        <div className="space-y-3">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">search</span>
                    Diagnóstico CIE-11
                </label>
                <SearchableSelect
                    options={options}
                    value="" 
                    onChange={handleSelect}
                    placeholder="Escriba para buscar enfermedad..."
                />
            </div>
            
            <ErrorMsg error={errors?.enfermedades} />

            {fields.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    <AnimatePresence>
                        {fields.map((field, idx) => {
                            const enfData = options.find(o => o.value === field.codigo_icd);
                            return (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-sm font-bold">medical_services</span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black leading-none opacity-70">{field.codigo_icd}</span>
                                        <span className="text-xs font-bold leading-tight max-w-[200px] truncate">
                                            {enfData ? enfData.label.split('] ')[1] : "CIE-11 Seleccionado"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="ml-1 p-0.5 rounded-full hover:bg-primary/20 text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm font-bold">close</span>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

function RecetaRow({ index, field, register, control, setValue, errors, remove, presentaciones }) {
    const selectedMed = useWatch({ control, name: `recetas.${index}.id_presentacion` });
    const selectedFarmacia = useWatch({ control, name: `recetas.${index}.nit_farmacia` });
    const [medFarmacias, setMedFarmacias] = useState([]);
    const [loadingFarms, setLoadingFarms] = useState(false);

    const isInitMed = useRef(true);

    useEffect(() => {
        if (!selectedMed) {
            setMedFarmacias([]);
            if (!isInitMed.current) setValue(`recetas.${index}.nit_farmacia`, "");
            return;
        }
        const fetchFarmaciasConStock = async () => {
            setLoadingFarms(true);
            
            // Si no estamos en la carga inicial, borramos la farmacia seleccionada al cambiar de medicamento
            if (!isInitMed.current) {
                setValue(`recetas.${index}.nit_farmacia`, "");
            }
            
            try {
                const res = await api.get(`/farmacia/inventario/por-presentacion/${selectedMed}`);
                const list = Array.isArray(res) ? res : (res?.data || []);
                setMedFarmacias(list);
            } catch (err) {
                console.error("Error fetching farmacias para medicamento:", err);
                setMedFarmacias([]);
            } finally {
                setLoadingFarms(false);
                isInitMed.current = false;
            }
        };
        fetchFarmaciasConStock();
    }, [selectedMed]);

    const medicamentosOptions = presentaciones.map(p => ({
        value: String(p.id_presentacion),
        label: `${p.medicamento?.nombre ?? 'Medicamento'} — ${p.concentracion?.concentracion ?? ''} (${p.forma_farmaceutica?.forma_farmaceutica ?? p.formaFarmaceutica?.forma_farmaceutica ?? ''})`
    }));

    const farmaciaOptions = medFarmacias.map(f => ({
        value: String(f.nit),
        label: `${f.nombre} (Stock: ${f.stock})`
    }));

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

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Medicamento #{index + 1}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medicamento (Presentación) *</label>
                    <SearchableSelect
                        options={medicamentosOptions}
                        value={String(selectedMed || "")}
                        onChange={(val) => setValue(`recetas.${index}.id_presentacion`, val, { shouldValidate: true })}
                        placeholder="Buscar medicamento..."
                        error={!!errors?.recetas?.[index]?.id_presentacion}
                    />
                    <ErrorMsg error={errors?.recetas?.[index]?.id_presentacion} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Farmacia de Entrega <span className="text-red-500">*</span>
                    </label>
                    {!selectedMed ? (
                        <p className="text-xs text-gray-400 italic py-2.5 px-3 border border-gray-200 dark:border-gray-700 rounded-lg">Seleccione medicamento primero.</p>
                    ) : loadingFarms ? (
                        <p className="text-xs text-primary italic py-2.5 px-3 border border-primary/20 rounded-lg animate-pulse">Buscando disponibilidad en farmacias...</p>
                    ) : (
                        <SearchableSelect
                            options={farmaciaOptions}
                            value={String(selectedFarmacia || "")}
                            onChange={(val) => setValue(`recetas.${index}.nit_farmacia`, val, { shouldValidate: true })}
                            placeholder={medFarmacias.length === 0 ? "Sin stock en farmacias" : "Seleccionar farmacia..."}
                            noOptionsText="No hay farmacias con stock para este medicamento"
                            error={!!errors?.recetas?.[index]?.nit_farmacia}
                        />
                    )}
                    <ErrorMsg error={errors?.recetas?.[index]?.nit_farmacia} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Cant. a Dispensar
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`recetas.${index}.cantidad_dispensar`)}
                        type="number" placeholder="Ej: 30"
                        className={`${SELECT_BASE} ${errors?.recetas?.[index]?.cantidad_dispensar ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    />
                    <ErrorMsg error={errors?.recetas?.[index]?.cantidad_dispensar} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dosis *</label>
                    <input
                        {...register(`recetas.${index}.dosis`, { required: "Dosis requerida" })}
                        type="text" placeholder="Ej: 1 comprimido"
                        className={`${SELECT_BASE} ${errors?.recetas?.[index]?.dosis ? 'border-red-500' : ''}`}
                    />
                    <ErrorMsg error={errors?.recetas?.[index]?.dosis} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frecuencia *</label>
                    <input
                        {...register(`recetas.${index}.frecuencia`, { required: "Frecuencia requerida" })}
                        type="text" placeholder="Ej: Cada 8 horas"
                        className={`${SELECT_BASE} ${errors?.recetas?.[index]?.frecuencia ? 'border-red-500' : ''}`}
                    />
                    <ErrorMsg error={errors?.recetas?.[index]?.frecuencia} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        Fin del Tratamiento
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register(`recetas.${index}.duracion`, { 
                            required: "La fecha de fin es obligatoria",
                            min: { value: new Date().toISOString().split("T")[0], message: "La fecha no puede ser en el pasado" }
                        })}
                        type="date" 
                        min={new Date().toISOString().split("T")[0]}
                        className={`${SELECT_BASE} ${errors?.recetas?.[index]?.duracion ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    />
                    <ErrorMsg error={errors?.recetas?.[index]?.duracion} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Observaciones</label>
                    <input
                        {...register(`recetas.${index}.observaciones`)}
                        type="text" placeholder="Observaciones opcionales"
                        className={SELECT_BASE}
                    />
                </div>
            </div>
        </motion.div>
    );
}

const TABS = [
    { id: "soap", icon: "clinical_notes", label: "SOAP Clínico" },
    { id: "remisiones", icon: "outpatient", label: "Remisiones" },
    { id: "recetas", icon: "medication", label: "Recetas" },
];

export default function ConsultaMedica() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle, setSubtitle, setHelpContent } = useLayout();

    const SESSION_KEY = `consulta_medica_${id}`;
    
    const getSavedData = () => {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return null; }
        }
        return null;
    };

    const [cita, setCita] = useState({
        paciente: {},
        historial: {},
        remisiones: [],
        tipoCita: {}
    });
    const [loadingCita, setLoadingCita] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("soap");
    const [signosOpen, setSignosOpen] = useState(true);
    const [presentaciones, setPresentaciones] = useState([]);

    const { specialties } = useEspecialidades();
    const { prioridades } = usePrioridades();
    const { medicos } = useMedicos();
    const { categorias } = useCategoriasExamen();
    const [enfermedadesOptions, setEnfermedadesOptions] = useState([]);
    const [motivosList, setMotivosList] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        reset,
        setValue
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: getSavedData() || {
            subjetivo: "",
            signos_vitales: {},
            diagnostico: "",
            enfermedades: [],
            tratamiento: "",
            observaciones: "",
            notas_medicas: "",
            remisiones: [],
            recetas: [],
        },
    });

    useEffect(() => {
        const subscription = watch((value) => {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch, SESSION_KEY]);

    const { fields, append, remove } = useFieldArray({ control, name: "remisiones" });
    const { fields: recetaFields, append: appendReceta, remove: removeReceta } = useFieldArray({ control, name: "recetas" });
    const { fields: enfFields, append: appendEnf, remove: removeEnf } = useFieldArray({ control, name: "enfermedades" });

    useEffect(() => {
        setTitle("Consulta Médica");
        setSubtitle("Atención clínica para el paciente");

        setHelpContent({
            title: "Guía de Consulta",
            description: "Registra la evolución del paciente siguiendo el formato SOAP.",
            sections: [
                {
                    title: "Notas SOAP",
                    type: "text",
                    content: "Usa el Subjetivo (S) para el relato, Diagnóstico (A) para la evaluación clínica y Tratamiento (P) para el plan a seguir. El Diagnóstico y Plan son obligatorios."
                },
                {
                    title: "Signos Vitales",
                    type: "tip",
                    content: "Puedes expandir la sección de signos vitales para registrar TA, FC, FR, etc."
                },
                {
                    title: "Remisiones",
                    type: "steps",
                    items: [
                        "Cambia a la pestaña de 'Remisiones' si necesitas derivar al paciente.",
                        "Selecciona si es una cita con especialista o un examen.",
                        "Completa la justificación médica para autorizar el servicio."
                    ]
                }
            ]
        });

        const fetchCita = async () => {
            try {
                const response = await api.get(`/cita/${id}`);
                const dataRaw = response.data || response || {};

                const citaData = {
                    paciente: dataRaw.paciente || {},
                    historial: dataRaw.historial || {},
                    remisiones: dataRaw.remisiones || [],
                    tipoCita: dataRaw.tipoCita || {},
                    ...dataRaw
                };
                setCita(citaData);

                // Pre-llenar subjetivo con el motivo de la consulta si no hay borrador guardado
                if (!getSavedData()?.subjetivo) {
                    const reasonObj = dataRaw.motivoConsulta || dataRaw.motivo_consulta;
                    const dropdownReason = reasonObj?.motivo || "";
                    const extraReason = dataRaw.motivo || "";
                    let combined = dropdownReason;
                    if (extraReason) {
                        combined = dropdownReason ? `${dropdownReason} - ${extraReason}` : extraReason;
                    }
                    if (combined) {
                        setValue('subjetivo', combined);
                    }
                }
            } catch (error) {
                Swal.fire("Error", "No se pudo cargar la cita solicitada.", "error");
                navigate("/medico/agenda");
            } finally {
                setLoadingCita(false);
            }
        };

        const fetchPresentaciones = async () => {
            try {
                const res = await api.get("/configuracion/presentaciones", { params: { per_page: 500 } });
                // Support both paginated and flat array responses
                const items = res.data?.data ?? res.data ?? [];
                setPresentaciones(Array.isArray(items) ? items : []);
            } catch { /* silencio */ }
        };

        const fetchEnfermedades = async () => {
            try {
                const res = await api.get("/enfermedades/buscar", { params: { limit: 3000 } });
                const list = Array.isArray(res) ? res : (res?.data || []);
                setEnfermedadesOptions(list.map(e => ({
                    value: e.codigo_icd,
                    label: `[${e.codigo_icd}] ${e.nombre}`
                })));
            } catch (err) { console.error("Error cargando enfermedades", err); }
        };

        const fetchMotivos = async () => {
            try {
                const res = await api.get('/motivos-consulta');
                setMotivosList(res.data || res);
            } catch (err) { console.error("Error cargando motivos", err); }
        };

        fetchCita();
        fetchPresentaciones();
        fetchEnfermedades();
        fetchMotivos();

        return () => setHelpContent(null);
    }, [id, navigate, setTitle, setSubtitle, setHelpContent]);

    const onSubmit = async (data) => {
        if (loading) return;
        setLoading(true);
        try {
            // Limpiar signos vitales y convertir Talla de cm a metros para el backend
            const signosLimpios = Object.fromEntries(
                Object.entries(data.signos_vitales ?? {})
                    .map(([k, v]) => {
                        if (k === 'talla' && (v !== "" && v !== null && v !== undefined)) return [k, Number(v) / 100]; // cm -> m
                        return [k, v];
                    })
                    .filter(([, v]) => v !== undefined && v !== null && v !== "" && !isNaN(Number(v)))
            );

            const payload = {
                subjetivo: data.subjetivo || undefined,
                signos_vitales: Object.keys(signosLimpios).length > 0 ? signosLimpios : undefined,
                diagnostico: data.diagnostico,
                enfermedades: data.enfermedades?.map(e => e.codigo_icd),
                tratamiento: data.tratamiento,
                observaciones: data.observaciones || undefined,
                notas_medicas: data.notas_medicas || undefined,
                remisiones: (data.remisiones || []).map(r => ({
                    ...r,
                    doc_medico: (r.doc_medico === 'undefined' || r.doc_medico === 'null') ? "" : r.doc_medico,
                    id_especialidad: (r.id_especialidad === 'undefined' || r.id_especialidad === 'null') ? "" : r.id_especialidad
                })),
                recetas: data.recetas?.length > 0 ? data.recetas : undefined,
            };

            await api.post(`/cita/${id}/atender`, payload);

            sessionStorage.removeItem(SESSION_KEY);

            await Swal.fire({
                title: "¡Atención Registrada!",
                text: "La evolución clínica ha sido guardada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });

            navigate("/medico/agenda");
        } catch (error) {
            // Manejar errores de validación del backend (HTTP 422)
            if (error.response?.status === 422 && error.response.data.errors) {
                const apiErrors = error.response.data.errors;
                
                // Mapear cada error del API al campo correspondiente en react-hook-form
                Object.keys(apiErrors).forEach((key) => {
                    setError(key, {
                        type: "manual",
                        message: apiErrors[key][0],
                    });
                });

                // Auto-cambio de pestaña para que el médico vea el error
                const firstErrorKey = Object.keys(apiErrors)[0];
                if (firstErrorKey.startsWith('remisiones') && activeTab !== 'remisiones') {
                    setActiveTab('remisiones');
                } else if (firstErrorKey.startsWith('recetas') && activeTab !== 'recetas') {
                    setActiveTab('recetas');
                } else if (['subjetivo', 'diagnostico', 'tratamiento', 'enfermedades', 'signos_vitales'].some(k => firstErrorKey.startsWith(k)) && activeTab !== 'soap') {
                    setActiveTab('soap');
                }

                return; // No mostrar el Swal general para errores de validación
            }

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
                <h1 className="text-2xl font-bold flex items-center gap-2 dark:text-white">
                    <span className="material-symbols-outlined text-primary text-3xl ">stethoscope</span>
                    Atender: {pacienteNombre}
                </h1>

                <button
                    type="button"
                    onClick={() => navigate(`/medico/pacientes/${cita.paciente?.documento}/historial?editable=true`)}
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
                    {TABS.map(tab => {
                        const hasErrors = (tab.id === "soap" && (errors.subjetivo || errors.diagnostico || errors.tratamiento)) ||
                                         (tab.id === "remisiones" && errors.remisiones) ||
                                         (tab.id === "recetas" && errors.recetas);

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-1 justify-center items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer relative
                                    ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}
                                `}
                            >
                                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                                {tab.label}
                                {hasErrors && (
                                    <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-gray-900 shadow-sm" />
                                )}
                                {tab.id === "remisiones" && fields.length > 0 && !hasErrors && (
                                    <span className="ml-1 bg-primary text-white text-xs rounded-full size-5 flex items-center justify-center font-bold">
                                        {fields.length}
                                    </span>
                                )}
                                {tab.id === "recetas" && recetaFields.length > 0 && !hasErrors && (
                                    <span className="ml-1 bg-green-500 text-white text-xs rounded-full size-5 flex items-center justify-center font-bold">
                                        {recetaFields.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.log("Validation errors:", errors);
                    
                    const tabErrors = [];
                    if (errors.subjetivo || errors.diagnostico || errors.tratamiento || errors.enfermedades) tabErrors.push("SOAP Clínico");
                    if (errors.remisiones) tabErrors.push("Remisiones");
                    if (errors.recetas) tabErrors.push("Recetas");

                    Swal.fire({
                        title: "¡Campos pendientes!",
                        html: `Por favor revise las siguientes secciones:<br/><b>${tabErrors.join(", ")}</b>`,
                        icon: "warning",
                        confirmButtonColor: "#3B82F6",
                    });
                })} className="flex-1 flex flex-col">
                    <div className="p-6 flex-1">
                        {activeTab === "soap" && (
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">S</span>
                                        Subjetivo — Motivo de Consulta
                                    </label>
                                    <textarea
                                        {...register("subjetivo")}
                                        rows={2}
                                        placeholder="Relato del paciente..."
                                        className={`${TEXTAREA_BASE} ${errors.subjetivo ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                                    />
                                    <ErrorMsg error={errors.subjetivo} />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                            <span className="size-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black">O</span>
                                            Objetivo — Examen Físico y Signos
                                        </label>
                                        <button type="button" onClick={() => setSignosOpen(v => !v)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                            <span className="material-symbols-outlined text-sm">{signosOpen ? 'expand_less' : 'monitor_heart'}</span>
                                            {signosOpen ? 'Ocultar Signos' : 'Registrar Signos Vitales'}
                                        </button>
                                    </div>
                                    
                                    <div className={signosOpen ? "animate-fade-in" : "hidden"}>
                                        <SignosVitalesRow register={register} open={true} errors={errors} />
                                    </div>

                                    <div className="space-y-4">
                                        <BuscadorEnfermedades 
                                            fields={enfFields} 
                                            append={appendEnf} 
                                            remove={removeEnf} 
                                            errors={errors} 
                                            options={enfermedadesOptions}
                                        />

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Hallazgos Clínicos / Observaciones <span className="text-xs text-gray-400 font-normal">(Opcional)</span>
                                            </label>
                                            <textarea
                                                {...register("observaciones")}
                                                rows={2}
                                                placeholder="Notas del examen físico u observaciones objetivas..."
                                                className={TEXTAREA_BASE}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-black">A</span>
                                        Análisis Clínico y Diagnóstico
                                    </label>
                                    <textarea
                                        {...register("diagnostico")}
                                        rows={3}
                                        placeholder="Apreciación diagnóstica y análisis del caso..."
                                        className={`${TEXTAREA_BASE} ${errors.diagnostico ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                                    />
                                    <ErrorMsg error={errors.diagnostico} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                        <span className="size-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-black">P</span>
                                        Tratamiento y Plan Médico <span className="text-xs text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register("tratamiento", {
                                            required: "El plan de tratamiento es obligatorio",
                                            minLength: { value: 5, message: "Mínimo 5 caracteres" }
                                        })}
                                        rows={3}
                                        placeholder="Medicamentos, recomendaciones, dieta..."
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
                                        onClick={() => append({ tipo_remision: "cita", id_motivo: String(cita.id_motivo || ""), id_especialidad: "", doc_medico: "", id_categoria_examen: "", requiere_ayuno: false, id_prioridad: "", notas: "", fecha: "", hora_inicio: "" })}
                                        className="flex items-center gap-1.5 text-sm font-bold text-primary hover:bg-primary/5 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <span className="material-symbols-outlined">add_circle</span> Agregar Remisión
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <RemisionRow
                                            key={field.id}
                                            index={index}
                                            field={field}
                                            register={register}
                                            control={control}
                                            setValue={setValue}
                                            remove={remove}
                                            specialties={specialties}
                                            prioridades={prioridades}
                                            medicos={medicos}
                                            categorias={categorias}
                                            motivosList={motivosList}
                                            errors={errors}
                                        />
                                    ))}
                                </div>

                                {fields.length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">outpatient</span>
                                        <p className="text-gray-400 text-sm">No se han agregado remisiones.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "recetas" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-500">Agrega medicamentos a la receta del paciente.</p>
                                    <button
                                        type="button"
                                        onClick={() => appendReceta({ id_presentacion: "", nit_farmacia: "", dosis: "", frecuencia: "", duracion: "", observaciones: "" })}
                                        className="flex items-center gap-1.5 text-sm font-bold text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <span className="material-symbols-outlined">add_circle</span> Agregar Medicamento
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {recetaFields.map((field, index) => (
                                        <RecetaRow
                                            key={field.id}
                                            index={index}
                                            field={field}
                                            register={register}
                                            control={control}
                                            setValue={setValue}
                                            remove={removeReceta}
                                            presentaciones={presentaciones}
                                            errors={errors}
                                        />
                                    ))}
                                </AnimatePresence>

                                {recetaFields.length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block">medication</span>
                                        <p className="text-gray-400 text-sm">No se han agregado medicamentos a la receta.</p>
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
