import { useEffect, useState } from "react";
import { useLayout } from "../LayoutContext";
import { useHelp } from "../hooks/useHelp";
import useTheme from "../hooks/useTheme";
import api from "../Api/axios";
import AdminLogoutButton from "../components/UI/AdminLogoutButton";
import MotionSpinner from "../components/UI/Spinner";
import Swal from "sweetalert2";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ROL_LABELS = {
    1: "SuperAdmin",
    2: "Administrador",
    3: "Personal Administrativo",
    4: "Médico",
    5: "Paciente",
    6: "Farmacéutico",
    7: "Coordinador",
    8: "Administrativo",
};

const ROL_COLORS = {
    1: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    2: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    3: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    4: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    5: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    6: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const SEXO_LABELS = { M: "Masculino", F: "Femenino", O: "Otro" };

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
}

function formatNow() {
    return new Date().toLocaleString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatToISODate(dateStr) {
    if (!dateStr) return "";
    return typeof dateStr === "string" ? dateStr.substring(0, 10) : "";
}

/* ------------------------------------------------------------------ */
/*  InfoRow — fila dentro del formulario de información                */
/* ------------------------------------------------------------------ */
function InfoField({ label, value, name, editMode, onChange, type = "text", readOnly = false, error }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {label}
            </label>
            {editMode && !readOnly ? (
                <>
                    <input
                        type={type}
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition ${error ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {error && <p className="text-[10px] text-red-500 font-bold uppercase mt-0.5 ml-1">{error}</p>}
                </>
            ) : (
                <p className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm border border-transparent">
                    {value || <span className="text-gray-400 italic">Sin información</span>}
                </p>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  SelectField                                                        */
/* ------------------------------------------------------------------ */
function SelectField({ label, name, value, editMode, onChange, options }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {label}
            </label>
            {editMode ? (
                <select
                    name={name}
                    defaultValue={value || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                >
                    <option value="">Seleccionar...</option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            ) : (
                <p className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm border border-transparent">
                    {options.find(o => String(o.value) === String(value))?.label || <span className="text-gray-400 italic">Sin información</span>}
                </p>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  ActivityItem                                                       */
/* ------------------------------------------------------------------ */
function ActivityItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="material-symbols-outlined text-gray-400 text-lg mt-0.5">{icon}</span>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{value}</span>
            </div>
        </div>
    );
}

/* ================================================================== */
/*  Perfil — Componente principal                                      */
/* ================================================================== */
export default function Perfil() {
    const { setTitle, setSubtitle } = useLayout();
    
    useHelp({
        title: "Mi Perfil",
        description: "Esta es tu página de información personal. Aquí puedes ver los detalles de tu cuenta, tu información de contacto, activar/desactivar opciones visuales (como el modo oscuro) y cerrar sesión de manera segura.",
        sections: [
            {
                title: "¿Qué puedo editar?",
                type: "list",
                items: [
                    "Datos básicos: Nombres, apellidos, correo, teléfono y dirección.",
                    "Si tu rol lo permite, podrás modificar también tu sexo, fecha de nacimiento y grupo sanguíneo.",
                    "Aplica tus cambios a través del botón 'Editar Perfil'."
                ]
            },
            {
                title: "Preferencias visuales",
                type: "steps",
                items: [
                    "Baja a la sección 'Preferencias'.",
                    "Activa o desactiva el 'Modo Oscuro' usando el interruptor.",
                    "Estos cambios se guardan localmente para no interferir en la vista de otros usuarios."
                ]
            },
            {
                title: "Seguridad",
                type: "warning",
                content: "Asegúrate de no dejar tu sesión iniciada en dispositivos de acceso público. Puedes salir rápidamente haciendo clic en el botón inferior 'Cerrar Sesión'."
            }
        ]
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [consultorios, setConsultorios] = useState([]);

    useEffect(() => {
        setTitle("Mi Perfil");
        setSubtitle("Información y configuración de tu cuenta.");
    }, [setTitle, setSubtitle]);

    const { isDark, toggleTheme } = useTheme();

    /* Cargar datos frescos desde el servidor */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await api.get("/me");
                setUser(data);
                setFormData(data);

                // Si es médico, cargar consultorios
                if (data.id_rol === 4) {
                    const resp = await api.get("/consultorios");
                    setConsultorios(resp.map(c => ({
                        value: c.id_consultorio,
                        label: `Consultorio ${c.numero_consultorio}`
                    })));
                }
            } catch (err) {
                console.error("Error al cargar el perfil:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        let { name, value } = e.target;
        
        // Validación y limpieza en tiempo real
        const newFieldErrors = { ...errors };
        
        if (name === "telefono") {
            value = value.replace(/\D/g, '').substring(0, 10);
            e.target.value = value;
            if (!value) newFieldErrors.telefono = "El teléfono es obligatorio";
            else if (!/^3\d{9}$/.test(value)) newFieldErrors.telefono = "Debe empezar con 3 y tener 10 dígitos";
            else delete newFieldErrors.telefono;
        } else if (name === "email") {
            const emailRegex = /^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!value) newFieldErrors.email = "El correo es obligatorio";
            else if (value.length < 12) newFieldErrors.email = "Mínimo 12 caracteres";
            else if (!emailRegex.test(value)) newFieldErrors.email = "Formato inválido";
            else delete newFieldErrors.email;
        } else if (name === "direccion") {
            const addressRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/;
            if (!value) newFieldErrors.direccion = "La dirección es obligatoria";
            else if (value.length < 8) newFieldErrors.direccion = "Mínimo 8 caracteres";
            else if (!addressRegex.test(value)) newFieldErrors.direccion = "Debe contener letras y números";
            else delete newFieldErrors.direccion;
        } else if (["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"].includes(name)) {
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
            const compRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
            const isOptional = ["segundo_nombre", "segundo_apellido"].includes(name);
            const regex = name.includes("apellido") ? compRegex : nameRegex;

            if (!value && !isOptional) newFieldErrors[name] = "Campo obligatorio";
            else if (value && (value.length < 3 || value.length > 40)) newFieldErrors[name] = "De 3 a 40 letras";
            else if (value && !regex.test(value)) newFieldErrors[name] = "Formato inválido";
            else delete newFieldErrors[name];
        } else {
            // General clear for other fields if they had error
            delete newFieldErrors[name];
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors(newFieldErrors);
    };

    const handleSave = async () => {
        const newErrors = {};

        // Validaciones de nombres
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
        const compositeNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;

        if (!formData.primer_nombre || formData.primer_nombre.length < 3 || formData.primer_nombre.length > 40 || !nameRegex.test(formData.primer_nombre)) {
            newErrors.primer_nombre = "Mínimo 3 letras, sin espacios";
        }
        if (formData.segundo_nombre && (formData.segundo_nombre.length < 3 || formData.segundo_nombre.length > 40 || !nameRegex.test(formData.segundo_nombre))) {
            newErrors.segundo_nombre = "Mínimo 3 letras, sin espacios";
        }
        if (!formData.primer_apellido || formData.primer_apellido.length < 3 || formData.primer_apellido.length > 40 || !compositeNameRegex.test(formData.primer_apellido)) {
            newErrors.primer_apellido = "Mínimo 3 letras, sin espacios dobles";
        }
        if (formData.segundo_apellido && (formData.segundo_apellido.length < 3 || formData.segundo_apellido.length > 40 || !compositeNameRegex.test(formData.segundo_apellido))) {
            newErrors.segundo_apellido = "Mínimo 3 letras, sin espacios dobles";
        }

        // Teléfono: ^3\d{9}$
        if (!formData.telefono) {
            newErrors.telefono = "El teléfono es obligatorio";
        } else if (!/^3\d{9}$/.test(formData.telefono)) {
            newErrors.telefono = "Debe empezar con 3 y tener exactamente 10 números";
        }

        // Dirección: ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$ y min:8, max:150
        const addressRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/;
        if (!formData.direccion) {
            newErrors.direccion = "La dirección es obligatoria";
        } else if (formData.direccion.length < 8) {
            newErrors.direccion = "La dirección debe tener al menos 8 caracteres";
        } else if (formData.direccion.length > 150) {
            newErrors.direccion = "La dirección no puede exceder los 150 caracteres";
        } else if (!addressRegex.test(formData.direccion)) {
            newErrors.direccion = "La dirección debe contener letras y números, y puede incluir #, -, . o ,. o /";
        }

        // Email: ^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ y min:12, max:150
        const emailRegex = /^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!formData.email) {
            newErrors.email = "El correo es obligatorio";
        } else if (formData.email.length < 12) {
            newErrors.email = "El correo debe tener al menos 12 caracteres";
        } else if (formData.email.length > 150) {
            newErrors.email = "El correo no puede exceder los 150 caracteres";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Formato de correo inválido (ej: usuario@dominio.com)";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Swal.fire({
                icon: "error",
                title: "Datos Inválidos",
                text: "Por favor, corrige los errores en el formulario.",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        setErrors({});
        setSaving(true);
        try {
            await api.put(`/usuario/${user.documento}`, formData);
            // Actualizar localStorage con nuevos datos básicos
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...stored, ...formData }));
            
            // Recargar datos para asegurar que las relaciones se refresquen
            const data = await api.get("/me");
            setUser(data);
            setFormData(data);

            setEditMode(false);
            Swal.fire({ icon: "success", title: "Perfil actualizado", timer: 1500, showConfirmButton: false });
        } catch (err) {
            console.error("Error al actualizar perfil:", err);
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el perfil." });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setEditMode(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <MotionSpinner />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-96 text-gray-500">
                No se pudo cargar la información del perfil.
            </div>
        );
    }

    const rolId = user.id_rol;
    let rolLabel = ROL_LABELS[rolId] || user.rol?.nombre_rol || "Usuario";

    // Lógica dinámica para Personal Administrativo / Exámenes
    if (rolId === 3) {
        rolLabel = user.examenes ? "Personal Exámenes" : "Personal Administrativo";
    }

    const rolColor = ROL_COLORS[rolId] || "bg-gray-100 text-gray-700";
    const fullName = [user.primer_nombre, user.segundo_nombre, user.primer_apellido, user.segundo_apellido]
        .filter(Boolean).join(" ");

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-10">

            {/* ── TOP CARD ────────────────────────────────────────── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Avatar basado en sexo (Masculino por default) */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/80 to-primary shadow-lg overflow-hidden border-2 border-primary/20">
                            <img 
                                src={user.sexo === "Femenino" ? "/avatar_femenino.png" : "/avatar_masculino.png"} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900" title="En línea" />
                    </div>

                    {/* Nombre + info básica */}
                    <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white wrap-break-word leading-tight">
                                {fullName}
                            </h1>
                            <span className={`inline-flex items-center w-fit text-xs font-bold px-3 py-1 rounded-full ${rolColor}`}>
                                {rolLabel}
                            </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5 shrink-0">
                                <span className="material-symbols-outlined text-base">badge</span>
                                Doc: {user.documento}
                            </span>
                            {user.nit && user.id_rol === 2 && (
                                <span className="flex items-center gap-1.5 break-all">
                                    <span className="material-symbols-outlined text-base">apartment</span>
                                    NIT: {user.nit}
                                </span>
                            )}
                            {user.nit_farmacia && user.id_rol === 6 && (
                                <span className="flex items-center gap-1.5 break-all">
                                    <span className="material-symbols-outlined text-base">local_pharmacy</span>
                                    NIT: {user.nit_farmacia}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 shrink-0">
                                <span className="material-symbols-outlined text-base">calendar_month</span>
                                Reg: {formatDate(user.created_at)}
                            </span>
                        </div>
                    </div>

                    {/* Editar */}
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold transition shrink-0"
                        >
                            <span className="material-symbols-outlined text-base">edit</span>
                            Editar Perfil
                        </button>
                    )}
                </div>
            </div>

            {/* ── MAIN GRID ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── INFORMACIÓN PERSONAL ────────────────────────── */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="material-symbols-outlined text-primary">person</span>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Información Personal</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoField label="Primer Nombre" name="primer_nombre" value={formData.primer_nombre} editMode={editMode} onChange={handleChange} error={errors.primer_nombre} />
                        <InfoField label="Segundo Nombre" name="segundo_nombre" value={formData.segundo_nombre} editMode={editMode} onChange={handleChange} error={errors.segundo_nombre} />
                        <InfoField label="Primer Apellido" name="primer_apellido" value={formData.primer_apellido} editMode={editMode} onChange={handleChange} error={errors.primer_apellido} />
                        <InfoField label="Segundo Apellido" name="segundo_apellido" value={formData.segundo_apellido} editMode={editMode} onChange={handleChange} error={errors.segundo_apellido} />
                        <InfoField label="Correo Electrónico" name="email" value={formData.email} editMode={editMode} onChange={handleChange} type="email" error={errors.email} />
                        <InfoField label="Teléfono" name="telefono" value={formData.telefono} editMode={editMode} onChange={handleChange} type="tel" error={errors.telefono} />
                        <InfoField label="Dirección" name="direccion" value={formData.direccion} editMode={editMode} onChange={handleChange} error={errors.direccion} />

                        {/* Campos globales restringidos para edición a admins */}
                        <SelectField
                            label="Tipo de Documento"
                            name="id_tipo_documento"
                            value={formData.id_tipo_documento}
                            editMode={editMode && [1, 2, 3].includes(rolId)}
                            onChange={handleChange}
                            options={[
                                { value: 1, label: "Cédula de Ciudadanía" },
                                { value: 2, label: "Registro Civil" },
                                { value: 3, label: "Cédula de Extranjería" },
                                { value: 4, label: "Pasaporte" }
                            ]}
                        />
                        <SelectField
                            label="Sexo"
                            name="sexo"
                            value={formData.sexo}
                            editMode={editMode && [1, 2, 3].includes(rolId)}
                            onChange={handleChange}
                            options={[
                                { value: "Masculino", label: "Masculino" },
                                { value: "Femenino", label: "Femenino" },
                                { value: "Otro", label: "Otro" },
                            ]}
                        />
                        <InfoField 
                            label="Fecha de Nacimiento" 
                            name="fecha_nacimiento" 
                            value={formatToISODate(formData.fecha_nacimiento)} 
                            editMode={editMode && [1, 2, 3].includes(rolId)} 
                            onChange={handleChange} 
                            type="date" 
                        />

                        {/* Grupo sanguíneo para Pacientes (5) o Médicos (4) */}
                        {(rolId === 4 || rolId === 5) && (
                            <InfoField label="Grupo Sanguíneo" name="grupo_sanguineo" value={formData.grupo_sanguineo} editMode={editMode} onChange={handleChange} />
                        )}

                        {/* Campos específicos por rol */}
                        {rolId === 4 && (
                            <>
                                <InfoField 
                                    label="Registro Profesional" 
                                    name="registro_profesional" 
                                    value={formData.registro_profesional} 
                                    editMode={editMode} 
                                    onChange={handleChange} 
                                    readOnly={true} // Solo lectura como pidió el usuario
                                />
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Especialidad</label>
                                    <p className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm border border-transparent">
                                        {user.especialidad?.especialidad || <span className="text-gray-400 italic">Sin asignar</span>}
                                    </p>
                                </div>
                                <SelectField
                                    label="Consultorio Asignado"
                                    name="id_consultorio"
                                    value={formData.id_consultorio}
                                    editMode={editMode}
                                    onChange={handleChange}
                                    options={consultorios}
                                />
                            </>
                        )}
                    </div>

                    {/* Recuadro de última actualización de contraseña (solo lectura) */}
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Contraseña</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Última actualización: {user.updated_at ? formatDate(user.updated_at) : "Sin registro"}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">Solo lectura</span>
                        </div>
                    </div>

                    {/* Botones de edición */}
                    {editMode && (
                        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-base">
                                    {saving ? "hourglass_empty" : "published_with_changes"}
                                </span>
                                {saving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>

                {/* ── ACTIVIDAD ────────────────────────────────────── */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">history</span>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Actividad</h2>
                        </div>

                        {/* Estado */}
                        <div className="flex items-center gap-2 py-3 border-b border-gray-100 dark:border-gray-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Estado</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">Sesión Activa</p>
                            </div>
                        </div>

                        <ActivityItem icon="login" label="Último acceso" value={formatNow()} />
                        <ActivityItem
                            icon="manage_accounts"
                            label="Rol de acceso"
                            value={rolLabel}
                        />
                        {user.empresa && user.id_rol === 2 && (
                            <ActivityItem
                                icon="apartment"
                                label="Empresa"
                                value={user.empresa.nombre_empresa || user.nit}
                            />
                        )}
                        {user.farmacia && user.id_rol === 6 && (
                             <ActivityItem
                                icon="local_pharmacy"
                                label="Farmacia asignada"
                                value={`${user.farmacia.nombre} (NIT: ${user.farmacia.nit})`}
                            />
                        )}
                    </div>

                    {/* ── PREFERENCIAS ─────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 mt-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">settings</span>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Preferencias</h2>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-400 text-lg">dark_mode</span>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white">Modo Oscuro</span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500">Apariencia visual de la plataforma</span>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                    </div>
                </div>
            </div>
        </div>

            {/* ── CERRAR SESIÓN ─────────────────────────────────── */}
            <div className="flex justify-center">
                <AdminLogoutButton
                    showText={true}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition border border-transparent hover:border-red-200 dark:hover:border-red-800"
                />
            </div>
        </div>
    );
}
