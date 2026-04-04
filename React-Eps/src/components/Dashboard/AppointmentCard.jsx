import MuiIcon from "../UI/MuiIcon";

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
                <MuiIcon name="calendar_month" sx={{ fontSize: '40px' }} className="text-slate-300 dark:text-gray-600" />
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
                    <MuiIcon name="calendar_month" sx={{ fontSize: '18px' }} className="text-primary" />
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
                    <MuiIcon name="stethoscope" sx={{ fontSize: '20px' }} className="text-primary" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{appointment.doctorName}</p>
                    <p className="text-xs text-sky-blue dark:text-sky-400 font-medium">{appointment.specialty}</p>
                </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-800/50 rounded-xl px-4 py-2.5">
                <MuiIcon name="schedule" sx={{ fontSize: '16px' }} />
                <span className="text-sm font-medium">{appointment.date} · {appointment.time}</span>
            </div>

            {/* Button */}
            <button
                onClick={onViewDetails}
                className="w-full cursor-pointer bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold rounded-xl py-2.5 flex items-center justify-center gap-2"
            >
                <span>Ver detalles</span>
                <MuiIcon name="arrow_forward" sx={{ fontSize: '16px' }} />
            </button>
        </div>
    );
}
