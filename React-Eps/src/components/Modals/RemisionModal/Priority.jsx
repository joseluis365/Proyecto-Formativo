import usePrioridades from "@/hooks/usePrioridades";

export default function Priority({ priority, onChange }) {
  const { prioridades, loading } = usePrioridades();

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
        {loading ? (
          <div className="text-gray-500 text-sm">Cargando prioridades...</div>
        ) : (
          <select
            name="id_prioridad"
            value={priority || ""}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
          >
            <option value="">Seleccione una prioridad</option>
            {prioridades.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}
