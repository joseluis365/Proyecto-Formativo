import DataTable from "../UI/DataTable";
import { Link } from "react-router-dom";
import EditMedicoModal from "../Modals/UserModal/EditMedicoModal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../../Api/axios";

export default function DoctorsTable({ users, fetchUsers }) {
  const [editingUserId, setEditingUserId] = useState(null);


  // Cambiar estado (activo/inactivo)
  const handleToggleStatus = async (user) => {
    const nuevoEstado = user.id_estado === 1 ? 2 : 1;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El médico pasará a estar ${nuevoEstado === 1 ? "Activo" : "Inactivo"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await api.put(`/usuario/${user.documento}/estado`, {
          id_estado: nuevoEstado,
        });
        Swal.fire({
          title: "Actualizado",
          text: "El estado del médico ha cambiado.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado.", "error");
      }
    }
  };

  const closeEdit = () => {
    setEditingUserId(null);
  };
  const columns = [
    {
      key: "name",
      header: "Nombre Completo",
      render: (u) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {`${u.primer_nombre} ${u.segundo_nombre || ''} ${u.primer_apellido} ${u.segundo_apellido || ''}`.trim().replace(/\s+/g, ' ')}
        </span>
      ),
    },
    {
      key: "id",
      header: "ID Profesional",
      render: (u) => u.registro_profesional,
    },
    {
      key: "specialty",
      header: "Especialidad",
      render: (u) => (
        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
          {u.especialidad?.especialidad || "Sin Asignar"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (u) => (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${u.id_estado === 1
            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
            : "bg-red-100 text-red-800"
            }`}
        >
          {u.id_estado === 1 ? "Activo" : "Inactivo"}
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
            to={`/usuarios/medicos/agenda-medico/${u.documento}`}
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
          <button onClick={() => setEditingUserId(u.documento)} className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">

            <span className="material-symbols-outlined text-base">edit</span>
          </button>

          <button onClick={() => handleToggleStatus(u)}
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={users} />
      <AnimatePresence>
        {editingUserId && (
          <EditMedicoModal
            userId={editingUserId}
            onClose={closeEdit}
            onSuccess={fetchUsers}
          />
        )}
      </AnimatePresence>
    </>
  );
}