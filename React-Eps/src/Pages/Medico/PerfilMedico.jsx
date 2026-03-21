import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import PrincipalText from "../../components/Users/PrincipalText";
import { motion } from "framer-motion";

export default function PerfilMedico() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        setTitle("Mi Perfil");
        setSubtitle("Gestiona tu información personal y profesional.");
    }, [setTitle, setSubtitle]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
        >
            {/* Cabecera del Perfil */}
            <div className="relative bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-primary/5 border border-neutral-gray-border/10 dark:border-gray-800 overflow-hidden">
                {/* Banner decorativo */}
                <div className="h-32 bg-gradient-to-r from-primary to-blue-600" />
                
                <div className="px-8 pb-8">
                    <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
                        <div className="size-32 rounded-3xl border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-lg overflow-hidden shrink-0 relative">
                            <img 
                                src="https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg" 
                                alt="Doctor profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="pb-2">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                                Dr. {user.primer_nombre} {user.primer_apellido}
                            </h2>
                            <p className="text-primary font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">verified</span>
                                {user.especialidad?.especialidad || "Especialista"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Documento</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user.documento}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Profesional</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Consultorio Asignado</p>
                            <p className="text-gray-900 dark:text-white font-medium">{user.consultorio || "Principal 102"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalles Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-neutral-gray-border/10 dark:border-gray-800 shadow-sm">
                    <PrincipalText icon="badge" text="Datos de Registro" />
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Estado de Cuenta</span>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">ACTIVO</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Rol en Sistema</span>
                            <span className="text-gray-800 dark:text-white text-sm font-bold">Médico Especialista</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">Último Acceso</span>
                            <span className="text-gray-800 dark:text-white text-sm font-bold">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-neutral-gray-border/10 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl">lock</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Seguridad</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Mantén tu contraseña actualizada para proteger la información de tus pacientes.
                    </p>
                    <button className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer">
                        Cambiar Contraseña
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
