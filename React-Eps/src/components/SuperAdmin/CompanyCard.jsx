export default function CompanyCard({
  company,
  email,
  licenseType,
  status,
  onView,
  onAssignLicense,
  onRenew,
  onActive
}) {
  const LICENSE_STATUS = {
    1: { text: "Licencia activa", classes: "bg-green-100 text-green-700" },
    4: { text: "Expira Pronto", classes: "bg-yellow-100 text-yellow-700" },
    5: { text: "Licencia expirada", classes: "bg-red-100 text-red-700" },
    3: { text: "Sin Plan", classes: "bg-gray-100 text-gray-700" },
    6: { text: "Licencia Bloqueada", classes: "bg-gray-100 text-gray-700" },
  };

  // Aseguramos que sea un número y que si no existe use el 3
  const statusKey = Number(status);
  const statusData = LICENSE_STATUS[statusKey] || LICENSE_STATUS[3];

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
            Tipo de Licencia
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {licenseType || "Sin Licencia"}
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        {/* Ver siempre */}
        <button
          onClick={onView}
          className="w-full py-2 text-sm font-semibold rounded-lg
                     bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
        >
          Ver
        </button>

        {/* Asignar licencia si no tiene ninguna */}
        {(status === 3 || status === undefined) && (
          <button
            onClick={onAssignLicense}
            className="w-full py-2 text-sm font-semibold rounded-lg
                       bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
          >
            Asignar Plan
          </button>
        )}

        {/* Renovar si vencida */}
        {status === 5 && (
          <button
            onClick={onRenew}
            className="w-full py-2 text-sm font-semibold rounded-lg
                       bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
          >
            Renovar licencia
          </button>
        )}

        {/* Opcional: por vencer solo ver o ver + renovar */}
        {status === 4 && (
          <button
            onClick={onRenew}
            className="w-full py-2 text-sm font-semibold rounded-lg
                       bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
          >
            Renovar licencia
          </button>
        )}
        {status === 6 && (
          <button
            onClick={onActive}
            className="w-full py-2 text-sm font-semibold rounded-lg
                       bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
          >
            Activar licencia
          </button>
        )}
      </div>
    </div>
  );
}
