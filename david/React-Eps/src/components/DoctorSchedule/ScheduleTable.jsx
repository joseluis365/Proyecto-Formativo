import DataTable from "../UI/DataTable";


export default function ScheduleTable({ dates }) {
  const columns = [
    {
      key: "time",
      header: "HORA",
      render: (d) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {d.time}
        </span>
      ),
    },
    {
      key: "patient",
      header: "PACIENTE",
      render: (d) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {d.patient}
        </span>
      ),
    },
    {
      key: "reason",
      header: "MOTIVO CONSULTA",
      render: (d) => d.reason,
    },
    {
      key: "status",
      header: "ESTADO",
      render: (d) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold leading-none rounded-full ${
            d.status === "Atendida"
              ? "bg-green-100 text-green-800"
              : d.status === "Cancelada"
                ? "bg-soft-red/20 text-soft-red"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {d.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Opciones",
      align: "center",
      render: (d) => (
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={dates} />;
}