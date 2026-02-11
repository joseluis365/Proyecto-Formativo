import BlueButton from "../UI/BlueButton";

export default function LicensePlanCard({
  id,
  duration,
  description,
  price,
  companies,
  status,
  onUpdate
}) {
  const STATUS_MAP = {
    1: {
      text: "Activa",
      classes: "bg-green-100 text-green-700",
    },
    2: {
      text: "Inactiva",
      classes: "bg-red-100 text-red-700",
    },
  };

  const statusData = STATUS_MAP[status] || { text: "Desconocido", classes: "bg-gray-100 text-gray-500" };

  const handleEdit = () => {
    import("sweetalert2").then((Swal) => {
      Swal.default.fire({
        title: "Editar duración",
        input: "number",
        inputLabel: "Nueva duración en meses",
        inputValue: duration,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) {
            return "Debes ingresar una duración";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const api = (await import("../../Api/axios")).default;
            await api.put(`/licencia/${id}`, {
              duracion_meses: result.value
            });

            Swal.default.fire("Actualizado", "La duración ha sido actualizada.", "success");
            if (onUpdate) onUpdate();

          } catch (error) {
            console.error(error);
            Swal.default.fire("Error", "No se pudo actualizar la duración.", "error");
          }
        }
      });
    });
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
      <div className="mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center
                     border-2 border-primary text-primary"
        >
          <span className="material-symbols-outlined text-2xl">
            calendar_month
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-1 mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          {duration}
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
        text="Editar duración"
        icon="edit"
        onClick={handleEdit}
      />

      {/* Footer */}
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Utilizada por {companies} empresas
      </p>
    </div>
  );
}
