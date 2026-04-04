import { useEffect, useState } from "react";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import useTheme from "../../hooks/useTheme";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PrincipalText from "../../components/Users/PrincipalText";
import BlueButton from "../../components/UI/BlueButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePerfilPacienteSchema } from "@/schemas/usuarioSchemas";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

/* ——————————————————————————————————————————————
   ActivityItem — ítem del panel de actividad
—————————————————————————————————————————————— */
function ActivityItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="text-gray-400 mt-0.5">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{value}</span>
            </div>
        </div>
    );
}

/* ——————————————————————————————————————————————
   Helpers
—————————————————————————————————————————————— */
const DOC_LABELS = { 1: "C.C", 2: "T.I", 3: "C.E" };

function formatNow() {
    return new Date().toLocaleString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

/* ——————————————————————————————————————————————
   PerfilPaciente — componente principal
—————————————————————————————————————————————— */
export default function PerfilPaciente() {
    const { setTitle, setSubtitle, setBackPath } = useLayout();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const initialUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [user, setUser] = useState(initialUser);
    const [saving, setSaving] = useState(false);

    /* ── react-hook-form + zod ───────────── */
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updatePerfilPacienteSchema),
        mode: "onChange",
        defaultValues: {
            telefono: initialUser.telefono || "",
            direccion: initialUser.direccion || "",
            email: initialUser.email || "",
        },
    });

    /* ── Help modal ──────────────────────── */
    useHelp({
        title: "Configuración de Perfil",
        description: "En esta sección puedes consultar tus datos básicos y modificar tu información de contacto.",
        sections: [
            {
                title: "Información Básica",
                type: "text",
                content: "Los campos como Nombre, Documento y Sexo no pueden ser modificados directamente por seguridad. Si hay un error, puedes enviar una solicitud desde el apartado de contacto.",
            },
            {
                title: "Datos de Contacto",
                type: "tip",
                content: "Mantén actualizado tu teléfono y correo para recibir recordatorios y notificaciones de citas médicas.",
            },
        ],
    });

    useEffect(() => {
        setTitle("Mi Perfil");
        setSubtitle("Gestiona tu información personal y cuenta.");
        setBackPath("/paciente");

        return () => {
            setBackPath(null);
        };
    }, [setTitle, setSubtitle, setBackPath]);

    /* ── Logout ──────────────────────────── */
    const handleLogout = async () => {
            try {
                await api.post("/logout");
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            } finally {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
            }
    };

    /* ── Guardar ─────────────────────────── */
    const onSubmit = async (data) => {
        setSaving(true);
        try {
            await api.put(`/usuario/${user.documento}`, { ...user, ...data });

            const updatedUser = { ...user, ...data };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            Swal.fire({
                icon: "success",
                title: "Perfil Actualizado",
                text: "Tus datos se han guardado correctamente.",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            // Errores 422 del servidor
            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((key) => {
                    setError(key, { type: "server", message: backendErrors[key][0] });
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
                });
            }
        } finally {
            setSaving(false);
        }
    };

    /* ── CSS helpers ─────────────────────── */
    const inputBase = "w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 focus:border-primary outline-none transition-all dark:text-white text-sm font-medium";
    const labelBase = "text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2 block ml-1";

    const fieldClass = (hasError) =>
        `${inputBase} ${hasError ? "border-red-500 shadow-sm shadow-red-500/10" : "border-transparent"}`;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Cabecera */}
            <div className="flex flex-col items-center gap-2 mt-8 mb-2 text-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    {user.primer_nombre} {user.primer_apellido}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Paciente</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ══ Columna Izquierda (2/3) ══ */}
                <div className="lg:col-span-2 space-y-8">
                    <PrincipalText icon={<AccountCircleRoundedIcon />} text="Información Personal" />

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-neutral-gray-border/5"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ── Campos de solo lectura ── */}
                            <div className="space-y-6">
                                <div>
                                    <label className={labelBase}>Nombre Completo</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${user.primer_nombre ?? ""} ${user.primer_apellido ?? ""}`}
                                        className={`${inputBase} border-transparent opacity-60 cursor-not-allowed`}
                                    />
                                </div>
                                <div>
                                    <label className={labelBase}>Documento de Identidad</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${DOC_LABELS[user.id_tipo_documento] ?? ""} ${user.documento ?? ""}`}
                                        className={`${inputBase} border-transparent opacity-60 cursor-not-allowed`}
                                    />
                                </div>
                                <div>
                                    <label className={labelBase}>Sexo</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={user.sexo || "No especificado"}
                                        className={`${inputBase} border-transparent opacity-60 cursor-not-allowed`}
                                    />
                                </div>
                                <div>
                                    <label className={labelBase}>Fecha de Nacimiento</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={user.fecha_nacimiento ? user.fecha_nacimiento.substring(0, 10) : "No especificada"}
                                        className={`${inputBase} border-transparent opacity-60 cursor-not-allowed`}
                                    />
                                </div>
                            </div>

                            {/* ── Campos Editables ── */}
                            <div className="space-y-6">
                                {/* Teléfono */}
                                <div>
                                    <label className={labelBase}>Teléfono de Contacto</label>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        placeholder="3xxxxxxxxx"
                                        className={fieldClass(!!errors.telefono)}
                                        {...register("telefono", {
                                            onChange: (e) => {
                                                // Limpiar caracteres no numéricos en tiempo real
                                                e.target.value = e.target.value.replace(/\D/g, "").substring(0, 10);
                                            },
                                        })}
                                    />
                                    {errors.telefono && (
                                        <p className="text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1">
                                            {errors.telefono.message}
                                        </p>
                                    )}
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label className={labelBase}>Dirección de Residencia</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Calle 45 # 12-30"
                                        className={fieldClass(!!errors.direccion)}
                                        {...register("direccion")}
                                    />
                                    {errors.direccion && (
                                        <p className="text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1">
                                            {errors.direccion.message}
                                        </p>
                                    )}
                                </div>

                                {/* Correo */}
                                <div>
                                    <label className={labelBase}>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        placeholder="ejemplo@correo.com"
                                        className={fieldClass(!!errors.email)}
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="text-[10px] text-red-500 font-bold uppercase mt-1.5 ml-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer del formulario */}
                        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                <LogoutRoundedIcon sx={{ fontSize: '1.25rem' }} />
                                Cerrar Sesión
                            </button>

                            <div className="w-full sm:w-auto min-w-[200px]">
                                <BlueButton
                                    text="Guardar Cambios"
                                    icon="save"
                                    loading={saving}
                                    type="submit"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* ══ Columna Derecha — Sidebar (1/3) ══ */}
                <div className="space-y-6">
                    {/* Panel Actividad / Sesión */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-neutral-gray-border/5">
                        <div className="flex items-center gap-3 mb-6">
                            <HistoryRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary" />
                            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                Actividad
                            </h2>
                        </div>

                        {/* Punto de sesión activa */}
                        <div className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-800">
                            <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Estado</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Sesión Activa</p>
                            </div>
                        </div>

                        <ActivityItem icon={<LoginRoundedIcon sx={{ fontSize: '1.25rem' }} />} label="Última Sesión" value={formatNow()} />
                    </div>

                    {/* Panel Preferencias */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-neutral-gray-border/5">
                        <div className="flex items-center gap-3 mb-6">
                            <SettingsRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary" />
                            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                Preferencias
                            </h2>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 transition-all border border-transparent hover:border-primary/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <DarkModeRoundedIcon sx={{ fontSize: '1.25rem' }} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Modo Oscuro</p>
                                    <p className="text-[10px] font-medium text-gray-400">Apariencia visual</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                                    isDark ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                        isDark ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
