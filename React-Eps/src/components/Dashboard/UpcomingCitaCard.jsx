/**
 * UpcomingCitaCard
 * Props:
 *   cita: {
 *     especialidad: string,
 *     doctorName: string,
 *     date: string,
 *     time: string,
 *     location?: string,
 *   }
 *   onViewDetails: () => void
 */
export default function UpcomingCitaCard({ cita, onViewDetails }) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl p-5 bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">

            {/* Top row: specialty + status badge */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
                            stethoscope
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{cita.especialidad}</p>
                        <p className="text-xs text-sky-500 dark:text-sky-400 font-medium">{cita.doctorName}</p>
                    </div>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Confirmada
                </span>
            </div>

            {/* Date / time / location row */}
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-800/50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                        {cita.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                        {cita.time}
                    </span>
                </div>
                {cita.location && (
                    <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
                        {cita.location}
                    </span>
                )}
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
