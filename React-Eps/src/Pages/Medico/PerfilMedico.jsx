import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import useTheme from "../../hooks/useTheme";
import PrincipalText from "../../components/Users/PrincipalText";
import { motion } from "framer-motion";
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';

import MuiIcon from "../../components/UI/MuiIcon";

export default function PerfilMedico() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const { isDark, toggleTheme } = useTheme();

    const formatNow = () => {
        return new Date().toLocaleString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    function ActivityItem({ icon, label, value }) {
        return (
            <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                {typeof icon === 'string' ? (
                    <MuiIcon name={icon} className="text-gray-400 mt-0.5" sx={{ fontSize: '1.125rem' }} />
                ) : (
                    <div className="text-gray-400 mt-0.5 flex items-center">{icon}</div>
                )}
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{value}</span>
                </div>
            </div>
        );
    }

    useHelp({
        title: "Perfil Profesional",
        description: "Aquí puedes visualizar tu información como profesional de la salud asignado a la EPS.",
        sections: [
            {
                title: "Datos de Especialidad",
                type: "text",
                content: "Tu registro profesional y especialidad son validados por el sistema. Si necesitas actualizar algún dato administrativo, contacta a Gerencia."
            },
            {
                title: "Seguridad de Datos",
                type: "warning",
                content: "Recuerda que el acceso a la información del paciente es solo para fines asistenciales. Asegúrate de cerrar tu sesión al finalizar."
            }
        ]
    });

    useEffect(() => {
        setTitle("Mi Perfil");
        setSubtitle("Gestiona tu información personal y profesional.");
    }, [setTitle, setSubtitle]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8 pb-10"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Información Profesional (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Cabecera del Perfil */}
                    <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-neutral-gray-border/10 dark:border-gray-800 overflow-hidden">
                        {/* Banner decorativo */}
                        <div className="h-32 bg-linear-to-r from-primary to-blue-600" />
                        
                        <div className="px-8 pb-8">
                            <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
                                <div className="size-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-lg overflow-hidden shrink-0 relative">
                                    <img 
                                        src={user.sexo === "Femenino" ? "/avatar_femenino.png" : "/avatar_masculino.png"} 
                                        alt="Doctor profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="pb-2">
                                    <h2 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight wrap-break-word">
                                        Dr. {user.primer_nombre} {user.primer_apellido}
                                    </h2>
                                    <p className="text-primary font-bold flex items-center gap-2">
                                        <VerifiedRoundedIcon sx={{ fontSize: '1rem' }} />
                                        {user.especialidad?.especialidad || user.nombre_especialidad || "Especialista"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Documento</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{(user.id_tipo_documento === 1 ? 'C.C ' : user.id_tipo_documento === 3 ? 'C.E ' : '')}{user.documento}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Profesional</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Consultorio Asignado</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{user.consultorio || "Principal 102"}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sexo</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{user.sexo || "No especificado"}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha de Nacimiento</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{user.fecha_nacimiento ? user.fecha_nacimiento.substring(0, 10) : "No especificada"}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registro Médico</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{user.registro_medico || "REG-992384"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-neutral-gray-border/10 dark:border-gray-800 shadow-sm">
                        <PrincipalText icon={<BadgeRoundedIcon sx={{ fontSize: '2.5rem' }} />} text="Datos Administrativos" />
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Estado de Cuenta</span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">ACTIVO</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Rol en Sistema</span>
                                <span className="text-gray-800 dark:text-white text-sm font-bold">Médico Especialista</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Sidebar (1/3) */}
                <div className="space-y-6">
                    {/* Sesión */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-neutral-gray-border/5">
                        <div className="flex items-center gap-3 mb-6">
                            <HistoryRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary" />
                            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Actividad</h2>
                        </div>

                        <div className="space-y-1">
                            {/* Estado Activo */}
                            <div className="flex items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-800">
                                <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Estado</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Sesión Activa</p>
                                </div>
                            </div>

                            <ActivityItem 
                                icon={<LoginRoundedIcon sx={{ fontSize: '1.125rem' }} />} 
                                label="Última Sesión" 
                                value={formatNow()} 
                            />
                        </div>
                    </div>

                    {/* Preferencias */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-neutral-gray-border/5">
                        <div className="flex items-center gap-3 mb-6">
                            <SettingsRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary" />
                            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Preferencias</h2>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 transition-all border border-transparent hover:border-primary/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <DarkModeRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Modo Oscuro</p>
                                    <p className="text-[10px] font-medium text-gray-400">Apariencia visual</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Soporte */}
                    <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-8 border border-neutral-gray-border/10 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <SupportAgentRoundedIcon sx={{ fontSize: '2.5rem' }} />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Soporte IT</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-6 px-4">
                            ¿Problemas con tu acceso o registro profesional?
                        </p>
                        <button className="w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer uppercase text-xs tracking-widest">
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
