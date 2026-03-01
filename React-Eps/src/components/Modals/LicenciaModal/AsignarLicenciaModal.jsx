import dayjs from "dayjs";
import { useState } from "react";
import api from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import Form from "../../UI/Form";
import { assignLicenciaFormConfig } from "../../../AssignLicenciaFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import Swal from 'sweetalert2';
import { useMemo } from "react";

export default function AssignLicenciaModal({
  onClose,
  empresaNit,
  licencias,
  onSuccess,
}) {

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});



  const [formData, setFormData] = useState({
    licencia_id: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const formatMoney = (value) => {
    if (!value) return "";
    // Convertimos a número y formateamos con puntos
    const number = parseFloat(value);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const licenciaOptions = useMemo(() => {
    // Filtramos para que solo pasen licencias con IDs que no hayamos visto antes
    const seenIds = new Set();

    return licencias
      .filter(l => l.id && !seenIds.has(l.id)) // Evita duplicados
      .map((l) => ({
        value: l.id, // El ID que viene de Laravel
        label: `${l.tipo} (${l.duracion})`,
        precio: l.precio_raw,
        duracion_meses: l.duracion_meses,
      }));
  }, [licencias]);

  const fields = assignLicenciaFormConfig[1].map((f) => {
    if (f.name === "licencia_id") {
      return { ...f, options: licenciaOptions };
    }
    return f;
  });

  // Detectar cambios del formulario
  const handleFormChange = (updatedData) => {
    // 1. Copiamos los datos que vienen del formulario
    let nextData = { ...updatedData };

    // 2. Buscamos la licencia en nuestro array de opciones usando el ID actual
    const licenciaSeleccionada = licenciaOptions.find(
      (l) => String(l.value) === String(nextData.licencia_id)
    );

    // 3. Si se seleccionó una licencia, actualizamos el precio
    if (licenciaSeleccionada) {
      nextData.precio = formatMoney(licenciaSeleccionada.precio);

      // 4. Si además ya hay una fecha de inicio, calculamos la fecha fin de una vez
      if (nextData.fecha_inicio) {
        const start = dayjs(nextData.fecha_inicio);
        if (start.isValid()) {
          nextData.fecha_fin = start
            .add(licenciaSeleccionada.duracion_meses, "month")
            .format("YYYY-MM-DD");
        }
      }
    } else {
      // Si no hay licencia (se limpió el select), limpiamos precio y fecha fin
      nextData.precio = "";
      nextData.fecha_fin = "";
    }

    // 5. Actualizamos el estado principal
    setFormData(nextData);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        nit: empresaNit,
        id_tipo_licencia: formData.licencia_id,
        fecha_inicio: formData.fecha_inicio
      };

      await api.post('/superadmin/empresa-licencia', payload);

      Swal.fire({
        icon: 'success',
        title: 'Licencia Asignada',
        text: 'La licencia ha sido asignada correctamente.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        onSuccess?.();
        onClose();
      });

    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(
          Object.fromEntries(
            Object.entries(error.response.data.errors).map(
              ([k, v]) => [k, v[0]]
            )
          )
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo asignar la licencia.',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseModal>
      <ModalHeader title="Asignar licencia" icon="verified" onClose={onClose} />
      <div className="p-6">
        <Form
          values={formData}
          fields={fields}
          errors={errors}
          loading={saving}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
        />
      </div>
      <ModalFooter />
    </BaseModal>
  );
}
