import BlueButton from "../UI/BlueButton";
import { useState } from "react";
import EditLicenciaModal from "../Modals/LicenciaModal/EditLicenciaModal";

export default function LicensePlanCard({
  id,
  tipo,
  duration,
  description,
  price,
  companies,
  status,
  onUpdate
}) {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const STATUS_MAP = {
    1: {
      text: "Activa",
      classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    2: {
      text: "Inactiva",
      classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const statusData = STATUS_MAP[status] || { text: "Desconocido", classes: "bg-gray-100 text-gray-500" };

  const handleEdit = () => {
    const parseCurrencyToNumber = (currencyString) => {
      if (!currencyString) return 0;

      // 1. Eliminar "COP" y cualquier espacio
      // 2. Eliminar los puntos de miles (separadores de miles en ES-CO)
      const cleanNumber = currencyString
        .replace(/COP/g, "")
        .replace(/\./g, "")
        .replace(/\s/g, "")
        .trim();

      return Number(cleanNumber);
    };

    const mappedData = {
      id: id,
      tipo: tipo,
      duracion_meses: duration, // Mapea según lo que espere tu formulario
      descripcion: description,
      precio: parseCurrencyToNumber(price),
      id_estado: status
    };
    setSelectedPlan(mappedData);
    setIsEditModalOpen(true);
  };
  console.log(selectedPlan);

  // 3. Función para cerrar el modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedPlan(null);
  };




  return (
    <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">

      {/* Estado */}
      <span
        className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${statusData.classes}`}
      >
        {statusData.text}
      </span>

      {/* Icono */}
      <div className="mb-4 flex items-center gap-2">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center
                     border-2 border-primary text-primary"
        >
          <span className="material-symbols-outlined text-2xl">
            calendar_month
          </span>

        </div>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{tipo}</p>
      </div>

      {/* Contenido */}
      <div className="space-y-1 mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          {duration} Meses
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Precio */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Precio
        </p>
        <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
          {price}
        </p>
      </div>

      {/* Botón */}
      <BlueButton
        text="Editar"
        icon="edit"
        onClick={handleEdit}
      />

      {/* Footer */}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        {companies === 0 || companies === undefined || companies === null
          ? "Sin empresas asignadas"
          : companies === 1
            ? "Utilizada por 1 empresa"
            : `Utilizada por ${companies} empresas`}
      </p>

      {isEditModalOpen && (
        <EditLicenciaModal
          licenciaData={selectedPlan}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            onUpdate?.(); // Refresca la lista de planes en el componente padre
          }}
        />
      )}
    </div>
  );
}
