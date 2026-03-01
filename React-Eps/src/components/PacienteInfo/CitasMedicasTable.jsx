import { useState } from "react";
import DataTable from "../UI/DataTable";
import { Link } from "react-router-dom";
import CitaModal from "../Modals/CitaModal/CitaModal";

export default function CitasMedicasTable({ citas }) {
  const [open, setOpen] = useState(false);
  const columns = [
    {
      key: "date",
      header: "Fecha",
      render: (c) => c.date,
    },
    {
      key: "doctor",
      header: "Médico",
      render: (c) => c.doctor,
    },
    {
      key: "result",
      header: "Diagnostico",
      render: (c) => c.result,
    },
    {
      key: "details",
      header: "Ver Detalles",
      align: "center",
      render: (c) => (
        <div className="flex justify-center gap-2">
          <Link
            onClick={() => setOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-green font-semibold"
          >
          Ver Detalles
      </Link>
      {open && <CitaModal id="123" onClose={() => setOpen(false)} />}
    </div>),
    },
  ];

  return <DataTable columns={columns} data={citas} />;
}
