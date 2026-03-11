/**
 * SolicitudCitaRow
 * Props:
 *   solicitud: {
 *     especialidad: string,
 *     doctorName: string,
 *     fechaSolicitud: string,
 *   }
 *   onCancel: () => void
 *   onViewDetails: () => void
 */
export default function SolicitudCitaRow({ solicitud, onCancel, onViewDetails }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl p-5 bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">

            {/* Left info */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-amber-500 dark:text-amber-400" style={{ fontSize: '20px' }}>
                        favorite
                    </span>
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{solicitud.especialidad}</p>
                        <span className="shrink-0 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Pendiente
                        </span>
                    </div>
                    <p className="text-xs text-sky-500 dark:text-sky-400 font-medium mt-0.5">{solicitud.doctorName}</p>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                        Fecha solicitada: {solicitud.fechaSolicitud}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={onCancel}
                    className="cursor-pointer text-xs font-semibold text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-600 hover:border-red-300 hover:text-red-500 dark:hover:border-red-600 dark:hover:text-red-400 rounded-xl px-3 py-2 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onViewDetails}
                    className="cursor-pointer text-xs font-semibold text-primary dark:text-sky-400 border border-primary/30 dark:border-sky-500/30 hover:bg-primary/5 dark:hover:bg-sky-900/20 rounded-xl px-3 py-2 transition-colors"
                >
                    Ver detalles
                </button>
            </div>
        </div>
    );
}
