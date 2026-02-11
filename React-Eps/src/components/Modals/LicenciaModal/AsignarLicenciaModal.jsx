import dayjs from "dayjs";
import { useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import UserForm from "../../Users/UserForm";
import { assignLicenciaFormConfig } from "../../../AssignLicenciaFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import Swal from 'sweetalert2';

export default function AssignLicenciaModal({
  onClose,
  empresaNit,
  licencias,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const initialForm = {
    licencia_id: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [duracionMeses, setDuracionMeses] = useState(null);

  const licenciaOptions = licencias.map((l) => ({
    value: l.id,
    label: `${l.tipo} (${l.duracion})`,
    precio: l.precio,
    duracion_meses: l.duracion,
  }));

  const fields = assignLicenciaFormConfig[1].map((f) => {
    if (f.name === "licencia_id") {
      return { ...f, options: licenciaOptions };
    }
    return f;
  });

  // Detectar cambios del formulario
  const handleFormChange = (data) => {
    let newFormData = { ...data };
    let currentDuration = duracionMeses;

    // Si cambió el tipo de licencia, buscar la nueva duración y precio
    if (data.licencia_id && String(data.licencia_id) !== String(formData.licencia_id)) {
      const licencia = licenciaOptions.find(
        (l) => String(l.value) === String(data.licencia_id)
      );

      if (licencia) {
        currentDuration = licencia.duracion_meses;
        setDuracionMeses(currentDuration);
        newFormData.precio = licencia.precio;

        // Si hay una fecha de inicio ya puesta, recalcular fecha fin con la nueva duración
        if (newFormData.fecha_inicio) {
          newFormData.fecha_fin = dayjs(newFormData.fecha_inicio)
            .add(currentDuration, "month")
            .format("YYYY-MM-DD");
        }
      }
    }

    // Si cambió la fecha de inicio
    if (newFormData.fecha_inicio && currentDuration) {
      const startDate = dayjs(newFormData.fecha_inicio);
      if (startDate.isValid()) {
        const end = startDate.add(parseInt(currentDuration), "month").format("YYYY-MM-DD");
        newFormData.fecha_fin = end;
      } else {
        newFormData.fecha_fin = "";
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        nit: empresaNit,
        id_tipo_licencia: formData.licencia_id,
        fecha_inicio: formData.fecha_inicio
      };

      await api.post('/empresa-licencia', payload);

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
      <ModalHeader title="Asignar licencia" onClose={onClose} />
      <div className="p-6">
        <UserForm
          initialValues={formData}
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
