import DataTable from "../UI/DataTable";
import { Link } from "react-router-dom";
import { useState } from "react";
import OrdenModal from "../Modals/OrdenModal/OrdenModal";

export default function OrdenesTable({ ordenes }) {
  const [open, setOpen] = useState(false);
  const columns = [
    {
      key: "date",
      header: "Fecha",
      render: (o) => o.date,
    },
    {
      key: "medicine",
      header: "Medicamento",
      render: (o) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {o.medicine}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (o) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            o.status === "Despachada"
              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {o.status}
        </span>
      ),
    },
    {
      key: "details",
      header: "Ver Orden",
      align: "center",
      render: (o) => (
        <div className="flex justify-center gap-2">
          <Link
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-green font-semibold"
          >
          Ver
      </Link>
      {open && <OrdenModal id="123" onClose={() => setOpen(false)} />}
    </div>),
    },
    {
      key: "actions",
      header: "Acciones",
      align: "center",
      render: (o) => (
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">download</span>
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={ordenes} />;
}
