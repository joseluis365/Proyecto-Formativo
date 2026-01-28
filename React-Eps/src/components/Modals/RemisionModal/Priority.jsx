export default function Priority({ priority }) {
  const isUrgent = priority === "urgente"

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
          priority_high
        </span>
        <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">
          Prioridad
        </h3>
      </div>

      <div className="flex gap-4">
        {/* URGENTE */}
        <div
          className={`flex-1 text-center px-4 py-2.5 rounded-lg border-2 cursor-pointer
            ${
              isUrgent
                ? "border-red-500 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                : "border-gray-300 bg-gray-50 dark:bg-gray-700/50 text-gray-500"
            }
          `}
        >
          <span className="font-semibold">Urgente</span>
        </div>

        {/* NORMAL */}
        <div
          className={`flex-1 text-center px-4 py-2.5 rounded-lg border-2 cursor-pointer
            ${
              !isUrgent
                ? "border-blue-500 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                : "border-gray-300 bg-gray-50 dark:bg-gray-700/50 text-gray-500"
            }
          `}
        >
          <span className="font-semibold">Normal</span>
        </div>
      </div>
    </div>
  )
}
