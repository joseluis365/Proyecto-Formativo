import { useEffect, useState } from "react";
import { useLayout } from "../LayoutContext";
import api from "../Api/axios";
import LogoutButton from "../components/UI/LogoutButton";
import MotionSpinner from "../components/UI/Spinner";
import Swal from "sweetalert2";
import { ROLES, ROL_LABELS } from "@/constants/roles";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ROL_COLORS = {
    [ROLES.ADMIN]: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    [ROLES.MEDICO]: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    [ROLES.PACIENTE]: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    [ROLES.PERSONAL_ADMINISTRATIVO]: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    [ROLES.FARMACEUTICO]: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
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

/* ------------------------------------------------------------------ */
/*  InfoField — Fila de información                                    */
/* ------------------------------------------------------------------ */
function InfoField({ label, value, name, editMode, onChange, type = "text" }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {label}
            </label>
            {editMode ? (
                <input
                    type={type}
                    name={name}
                    defaultValue={value || ""}
                    onChange={onChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
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
                    {options.find(o => o.value === value)?.label || <span className="text-gray-400 italic">Sin información</span>}
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

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setTitle("Mi Perfil");
        setSubtitle("Información y configuración de tu cuenta.");
    }, []);

    // Theme state configuration
    const [isDark, setIsDark] = useState(
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    const toggleTheme = () => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    /* Cargar datos frescos desde el servidor */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                if (!storedUser.documento) return;

                const data = await api.get(`/usuario/${storedUser.documento}`);
                setUser(data);
                setFormData(data);
            } catch (err) {
                console.error("Error al cargar el perfil:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/usuario/${user.documento}`, formData);
            // Actualizar localStorage con nuevos datos básicos
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...stored, ...formData }));
            setUser((prev) => ({ ...prev, ...formData }));
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
    const rolLabel = ROL_LABELS[rolId] || user.rol?.nombre_rol || "Usuario";
    const rolColor = ROL_COLORS[rolId] || ROL_COLORS[6];
    const fullName = [user.primer_nombre, user.segundo_nombre, user.primer_apellido, user.segundo_apellido]
        .filter(Boolean).join(" ");

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-10">

            {/* HEADER CARD */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Avatar genérico */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/80 to-primary flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-5xl">person</span>
                        </div>
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900" title="En línea" />
                    </div>

                    {/* Nombre + info básica */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{fullName}</h1>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${rolColor}`}>{rolLabel}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">badge</span>
                                Doc: {user.documento}
                            </span>
                            {user.nit && user.id_rol !== ROLES.FARMACEUTICO && (
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">apartment</span>
                                    NIT Empresa: {user.nit}
                                </span>
                            )}
                            {user.nit_farmacia && user.id_rol === ROLES.FARMACEUTICO && (
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-base">local_pharmacy</span>
                                    NIT Farmacia: {user.nit_farmacia}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">calendar_month</span>
                                Registrado: {formatDate(user.created_at)}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* INFORMACIÓN PERSONAL */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="material-symbols-outlined text-primary">person</span>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Información Personal</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoField label="Primer Nombre" name="primer_nombre" value={formData.primer_nombre} editMode={editMode} onChange={handleChange} />
                        <InfoField label="Segundo Nombre" name="segundo_nombre" value={formData.segundo_nombre} editMode={editMode} onChange={handleChange} />
                        <InfoField label="Primer Apellido" name="primer_apellido" value={formData.primer_apellido} editMode={editMode} onChange={handleChange} />
                        <InfoField label="Segundo Apellido" name="segundo_apellido" value={formData.segundo_apellido} editMode={editMode} onChange={handleChange} />
                        <InfoField label="Correo Electrónico" name="email" value={formData.email} editMode={editMode} onChange={handleChange} type="email" />
                        <InfoField label="Teléfono" name="telefono" value={formData.telefono} editMode={editMode} onChange={handleChange} type="tel" />
                        <InfoField label="Dirección" name="direccion" value={formData.direccion} editMode={editMode} onChange={handleChange} />

                        {/* Sexo, fecha nacimiento y grupo sanguíneo solo para roles distintos al administrador y farmacéutico */}
                        {rolId !== ROLES.ADMIN && rolId !== ROLES.FARMACEUTICO && (
                            <>
                                <SelectField
                                    label="Sexo"
                                    name="sexo"
                                    value={formData.sexo}
                                    editMode={editMode}
                                    onChange={handleChange}
                                    options={[
                                        { value: "M", label: "Masculino" },
                                        { value: "F", label: "Femenino" },
                                        { value: "O", label: "Otro" },
                                    ]}
                                />
                                <InfoField label="Fecha de Nacimiento" name="fecha_nacimiento" value={formData.fecha_nacimiento} editMode={editMode} onChange={handleChange} type="date" />
                                <InfoField label="Grupo Sanguíneo" name="grupo_sanguineo" value={formData.grupo_sanguineo} editMode={editMode} onChange={handleChange} />
                            </>
                        )}

                        {rolId === ROLES.MEDICO && (
                            <>
                                <InfoField label="Registro Profesional" name="registro_profesional" value={formData.registro_profesional} editMode={editMode} onChange={handleChange} />
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Especialidad</label>
                                    <p className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-sm border border-transparent">
                                        {user.especialidad?.nombre_especialidad || user.especialidad?.especialidad || <span className="text-gray-400 italic">Sin asignar</span>}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

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

                {/* ACTIVIDAD */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary">history</span>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Actividad</h2>
                        </div>

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
                        {user.empresa && user.id_rol !== ROLES.FARMACEUTICO && (
                            <ActivityItem
                                icon="apartment"
                                label="Empresa"
                                value={user.empresa.nombre_empresa || user.nit}
                            />
                        )}
                        {user.farmacia && user.id_rol === ROLES.FARMACEUTICO && (
                            <ActivityItem
                                icon="local_pharmacy"
                                label="Farmacia asignada"
                                value={`${user.farmacia.nombre} (NIT: ${user.farmacia.nit})`}
                            />
                        )}
                    </div>

                    {/* PREFERENCIAS */}
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

            {/* LOGOUT */}
            <div className="flex justify-center">
                <LogoutButton
                    showText={true}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition border border-transparent hover:border-red-200 dark:hover:border-red-800"
                />
            </div>
        </div>
    );
}
