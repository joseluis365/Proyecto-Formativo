import MuiIcon from "../UI/MuiIcon";

export default function AppointmentCard({
    doctorName,
    doctorSpecialty,
    patientName,
    patientDoc,
    specialty,     /* Usado como el badge principal o extra */
    tipoServicio,  /* e.g., "Cita" o "Remisión" */
    time,
    status,
    onView,
    onCancel,
    onReschedule,
    isExamen = false,
    requiresFasting = false
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
        <div className="group relative w-full min-w-[300px] bg-white dark:bg-gray-900 rounded-4xl border border-neutral-gray-border/10 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 p-6 overflow-hidden">
            {/* Fondo decorativo sutil */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

            {/* Estado Badge */}
            <div className="flex justify-between items-start mb-5 relative gap-2 flex-wrap">
                <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${statusData.classes}`}>
                    {statusData.text}
                </div>
                {/* Tipo de Servicio / Especialidad Badges */}
                <div className="flex gap-2">
                    {tipoServicio && (
                        <div className="px-3 py-1 text-[9px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                            {tipoServicio}
                        </div>
                    )}
                    {specialty && (
                        <div className="px-3 py-1 text-[9px] font-bold text-primary bg-primary/5 rounded-lg border border-primary/10 shadow-sm">
                            {specialty}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Principal: Profesional y Paciente */}
            <div className="flex flex-col gap-4 mb-6 relative">
                {/* Profesional / Examen */}
                <div className="flex items-center gap-4">
                    <div className="flex shrink-0 items-center justify-center size-12 rounded-xl bg-primary/10 text-primary shadow-inner">
                        <MuiIcon name={isExamen ? 'science' : 'stethoscope'} sx={{ fontSize: '1.5rem' }} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
                            {isExamen ? 'Examen Clínico' : 'Médico'}
                        </p>
                        <h2 className="text-gray-900 dark:text-white font-bold text-base tracking-tight leading-tight truncate">
                            {isExamen ? doctorName : cleanDoctorName}
                        </h2>
                        <p className="text-xs font-medium text-primary/80 truncate">
                            {isExamen 
                                ? (requiresFasting ? 'Requiere Ayuno: Sí' : 'Requiere Ayuno: No')
                                : (doctorSpecialty || "Médico General")
                            }
                        </p>
                    </div>
                </div>

                {/* Paciente (Condicional si se provee) */}
                {patientName && (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100/50 dark:border-gray-700/50">
                        <div className="flex shrink-0 items-center justify-center size-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-inner">
                            <MuiIcon name="person" sx={{ fontSize: '1.25rem' }} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">Paciente</p>
                            <h3 className="text-gray-800 dark:text-gray-200 font-bold text-sm tracking-tight leading-tight truncate">
                                {patientName}
                            </h3>
                            {patientDoc && (
                                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">
                                    CC: {patientDoc}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Horario y Fecha */}
            <div className="grid grid-cols-2 gap-4 mb-8 relative">
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                        <MuiIcon name="calendar_today" sx={{ fontSize: '0.875rem' }} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Fecha</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {time.split(' | ')[0]}
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                        <MuiIcon name="schedule" sx={{ fontSize: '0.875rem' }} />
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
                    <MuiIcon 
                        name={status === 'Atendida' ? 'assignment_turned_in' : 'visibility'} 
                        sx={{ fontSize: '1rem' }} 
                    />
                    {status === 'Atendida' ? 'Ver Resultados' : 'Detalles'}
                </button>

                {(status === "Agendada" || status === "Pendiente") && (
                    <>
                        {/* Botón Reagendar */}
                        <button
                            onClick={onReschedule}
                            className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.2rem] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer flex items-center justify-center"
                            title="Reagendar Cita"
                        >
                            <MuiIcon name="event_repeat" sx={{ fontSize: '1.25rem' }} />
                        </button>

                        {/* Botón Cancelar */}
                        {onCancel && (
                            <button
                                onClick={onCancel}
                                className="py-4 px-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.2rem] bg-red-50 dark:bg-red-500/10 text-red-600 border border-red-100 dark:border-red-900/20 hover:bg-red-100 transition-all cursor-pointer flex items-center justify-center"
                                title="Cancelar Cita"
                            >
                                <MuiIcon name="close" sx={{ fontSize: '1.25rem' }} />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
