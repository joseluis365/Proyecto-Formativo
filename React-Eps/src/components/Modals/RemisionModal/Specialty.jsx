export default function Specialty({specialty}) {
    return (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">stethoscope</span>
            <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">Especialidad a la
              que remite</h3>
          </div>
          <div
            className="bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700 rounded-lg p-4 text-center">
            <p className="text-xl font-semibold text-teal-800 dark:text-teal-200">{specialty}</p>
          </div>
        </div>
    )
}
