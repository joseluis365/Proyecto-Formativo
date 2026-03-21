export default function AppointmentCard({
    doctorName,
    specialty,
    doctorSpecialty,
    time,
    status,
    onView,
    onCancel,
    onReschedule
}) {
    const STATUS_COLORS = {
        Agendada: { text: "Programada", classes: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50" },
        Confirmada: { text: "Confirmada", classes: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200/50" },
        Cancelada: { text: "Cancelada", classes: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200/50" },
        Atendida: { text: "Finalizada", classes: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200/50" },
        Pendiente: { text: "Pendiente", classes: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50" },
    };

    const statusData = STATUS_COLORS[status] || { text: status || "Pendiente", classes: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200/50" };

    // Limpiamos el nombre del médico de prefijos
    const cleanDoctorName = doctorName?.split(' - ')[0].replace(/^(Dr|Dra|Doctor|Doctora)\.?\s*/i, '').trim();

    return (
        <div className="group relative w-full bg-white dark:bg-gray-900 rounded-4xl border border-neutral-gray-border/10 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 p-6 overflow-hidden">
            {/* Fondo decorativo sutil */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

            {/* Estado Badge */}
            <div className="flex justify-between items-start mb-6 relative">
                <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${statusData.classes}`}>
                    {statusData.text}
                </div>
                {/* Tipo de Cita Badge (Nuevo) */}
                <div className="px-3 py-1 text-[9px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                    {specialty}
                </div>
            </div>

            {/* Profesional Info */}
            <div className="flex items-center gap-5 mb-8 relative">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary shadow-inner">
                    <span className="material-symbols-outlined text-4xl">account_circle</span>
                </div>
                <div>
                    <h2 className="text-gray-900 dark:text-white font-black text-xl tracking-tight leading-tight mb-1">
                        {cleanDoctorName}
                    </h2>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">
                        {doctorSpecialty || "Médico General"}
                    </p>
                </div>
            </div>

            {/* Horario y Fecha */}
            <div className="grid grid-cols-2 gap-4 mb-8 relative">
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">Fecha</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {time.split(' | ')[0]}
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span className="text-[9px] font-black uppercase tracking-widest">Horario</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {time.split(' | ')[1]}
                    </p>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 relative">
                <button
                    onClick={onView}
                    className="grow py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.2rem] bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-gray-200 dark:shadow-none cursor-pointer flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-base">visibility</span>
                    Detalles
                </button>

                {(status === "Agendada" || status === "Pendiente") && (
                    <>
                        {/* Botón Reagendar */}
                        <button
                            onClick={onReschedule}
                            className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.2rem] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer flex items-center justify-center"
                            title="Reagendar Cita"
                        >
                            <span className="material-symbols-outlined text-xl">event_repeat</span>
                        </button>

                        {/* Botón Cancelar */}
                        <button
                            onClick={onCancel}
                            className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.2rem] bg-red-50 dark:bg-red-500/10 text-red-600 border border-red-100 dark:border-red-900/20 hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center"
                            title="Cancelar Cita"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
