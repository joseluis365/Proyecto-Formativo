/**
 * MedicationCard
 * Props:
 *   name: string
 *   dosage: string
 *   frequency: string
 *   status: string  (e.g. "active")
 */
export default function MedicationCard({ name, dosage, frequency, status }) {
    const isActive = status?.toLowerCase() === 'active' || status?.toLowerCase() === 'activo';

    const frequencyIcons = {
        morning: 'wb_sunny',
        night: 'nights_stay',
        daily: 'replay',
        default: 'medication',
    };

    const getFrequencyIcon = (freq = '') => {
        const f = freq.toLowerCase();
        if (f.includes('mañana') || f.includes('morning')) return frequencyIcons.morning;
        if (f.includes('noche') || f.includes('night')) return frequencyIcons.night;
        return frequencyIcons.daily;
    };

    return (
        <div className="flex flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>
                        medication
                    </span>
                </div>
                {isActive && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Activo
                    </span>
                )}
            </div>

            {/* Name & dosage */}
            <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{name}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">{dosage}</p>
            </div>

            {/* Frequency */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {getFrequencyIcon(frequency)}
                </span>
                <span className="text-xs font-medium">{frequency}</span>
            </div>
        </div>
    );
}
