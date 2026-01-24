import DataTable from "../UI/DataTable";

export default function UsersTable({ users }) {
  const columns = [
    {
      key: "name",
      header: "Nombre",
      render: (u) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {u.name}
        </span>
      ),
    },
    {
      key: "document",
      header: "Documento",
      render: (u) => u.document,
    },
    {
      key: "email",
      header: "Correo",
      render: (u) => u.email,
    },
    {
      key: "status",
      header: "Estado",
      render: (u) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            u.status === "ACTIVO"
              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              : "bg-red-100 text-red-800"
          }`}
        >
          {u.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Opciones",
      align: "center",
      render: (u) => (
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={users} />;
}
