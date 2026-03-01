import DataTable from "../UI/DataTable";
import { Link } from "react-router-dom";
import { useState } from "react";
import RemisionModal from "../Modals/RemisionModal/RemisionModal";

export default function RemisionesTable({ remisiones }) {
  const [open, setOpen] = useState(false);
  const columns = [
    {
      key: "date",
      header: "Fecha",
      render: (r) => r.date,
    },
    {
      key: "type",
      header: "Tipo",
      render: (r) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {r.type}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (r) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            r.status === "ATENDIDA"
              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "details",
      header: "Ver Orden",
      align: "center",
      render: (r) => (
        <div className="flex justify-center gap-2">
          <Link
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-green font-semibold"
          >
          Ver
      </Link>
      {open && <RemisionModal id="123" onClose={() => setOpen(false)} />}
    </div>),
    },
    {
      key: "actions",
      header: "Acciones",
      align: "center",
      render: (r) => (
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">download</span>
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={remisiones} />;
}
