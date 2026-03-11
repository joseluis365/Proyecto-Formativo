/**
 * AppointmentCard
 * Props:
 *   appointment: { doctorName, specialty, date, time } | null
 *   onViewDetails: () => void
 */
export default function AppointmentCard({ appointment, onViewDetails }) {
    if (!appointment) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl p-6 bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 shadow-sm min-h-[160px] text-center">
                <span className="material-symbols-outlined text-slate-300 dark:text-gray-600" style={{ fontSize: '40px' }}>
                    calendar_month
                </span>
                <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">Sin cita próxima</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">No tienes citas programadas</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl p-6 bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>
                        calendar_month
                    </span>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Próxima Cita
                    </span>
                </div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    Confirmada
                </span>
            </div>

            {/* Doctor Info */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                        stethoscope
                    </span>
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{appointment.doctorName}</p>
                    <p className="text-xs text-sky-blue dark:text-sky-400 font-medium">{appointment.specialty}</p>
                </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-800/50 rounded-xl px-4 py-2.5">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>schedule</span>
                <span className="text-sm font-medium">{appointment.date} · {appointment.time}</span>
            </div>

            {/* Button */}
            <button
                onClick={onViewDetails}
                className="w-full cursor-pointer bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold rounded-xl py-2.5 flex items-center justify-center gap-2"
            >
                <span>Ver detalles</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </button>
        </div>
    );
}
