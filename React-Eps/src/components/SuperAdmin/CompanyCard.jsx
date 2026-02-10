export default function CompanyCard({
  company,
  email,
  expiresAt,
  status,
}) {
  const LICENSE_STATUS = {
  1: {
    text: "Licencia activa",
    classes: "bg-green-100 text-green-700",
  },
  2: {
    text: "Por vencer",
    classes: "bg-yellow-100 text-yellow-700",
  },
  0: {
    text: "Licencia expirada",
    classes: "bg-red-100 text-red-700",
  },
};


  const statusData = LICENSE_STATUS[status];

  return (
    <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
      
      {/* Estado */}
      <span
        className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${statusData.classes}`}
      >
        {statusData.text}
      </span>

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-3xl">
            enterprise
          </span>
        </div>

        <h2 className="text-gray-800 dark:text-gray-200 font-semibold text-xl">
          {company}
        </h2>
      </div>

      {/* Datos */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Email Admin
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {email}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Licencia expira
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {expiresAt}
          </p>
        </div>
      </div>

      {/* Botón */}
      <div className="flex gap-2">
      <button
        className="w-full py-2 text-sm font-semibold rounded-lg
                   bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
      >
        Ver
      </button>
      <button
        className="w-full py-2 text-sm font-semibold rounded-lg
                   bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
      >
        Asignar licencia
      </button>
      </div>
    </div>
  );
}
