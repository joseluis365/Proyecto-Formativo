import DataTable from "../UI/DataTable";
import { Link } from "react-router-dom";

export default function UsersTable({ users }) {
  const columns = [
    {
      key: "name",
      header: "Nombre Completo",
      render: (u) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {u.name}
        </span>
      ),
    },
    {
      key: "id",
      header: "ID Profesional",
      render: (u) => u.id,
    },
    {
      key: "specialty",
      header: "Especialidad",
      render: (u) => u.specialty,
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
      key: "Schedule",
      header: "Agenda",
      align: "center",
      render: (u) => (
        <div className="flex justify-center gap-2">
          <Link
            to={`/usuarios/medicos/agenda-medico`}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-green font-semibold"
          >
          Ver Agenda +
      </Link>
    </div>),
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