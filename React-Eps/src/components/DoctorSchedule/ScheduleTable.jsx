import DataTable from "../UI/DataTable";


export default function ScheduleTable({ appointments, onView, onAtender, onNoAsistio }) {
  const columns = [
    {
      key: "hora_inicio",
      header: "HORA",
      render: (d) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {d.hora_inicio?.slice(0, 5) || "--:--"}
        </span>
      ),
    },
    {
      key: "paciente",
      header: "PACIENTE",
      render: (d) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {d.paciente ? `${d.paciente.primer_nombre} ${d.paciente.primer_apellido}` : "Paciente no encontrado"}
        </span>
      ),
    },
    {
      key: "motivo",
      header: "MOTIVO CONSULTA",
      render: (d) => d.motivo || "No especificado",
    },
    {
      key: "id_estado",
      header: "ESTADO",
      render: (d) => {
        const statusName = d.estado?.nombre_estado || "Pendiente";
        return (
          <span
            className={`px-2.5 py-1 text-xs font-semibold leading-none rounded-full ${statusName === "Atendida"
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
              : statusName === "Cancelada" || statusName === "Inasistencia"
                ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
              }`}
          >
            {statusName}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Acciones",
      align: "center",
      render: (d) => {
        const isPending = d.estado?.nombre_estado === "Agendada";
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onView(d)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors cursor-pointer"
              title="Ver detalles"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
            </button>

            {isPending && (
              <>
                <button
                  onClick={() => onAtender(d)}
                  className="p-2 rounded-full hover:bg-primary/10 text-primary hover:text-primary-dark transition-all flex items-center justify-center cursor-pointer"
                  title="Atender Paciente"
                >
                  <span className="material-symbols-outlined text-base font-bold">medical_information</span>
                </button>
                <button
                  onClick={() => onNoAsistio(d)}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 transition-all flex items-center justify-center cursor-pointer"
                  title="Marcar Inasistencia"
                >
                  <span className="material-symbols-outlined text-base">person_off</span>
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={appointments} />;
}
