import dayjs from "dayjs";
import { useState } from "react";
import superAdminApi from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import Form from "../../UI/Form";
import { assignLicenciaFormConfig } from "../../../AssignLicenciaFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import Swal from 'sweetalert2';
import { useMemo, useEffect } from "react";
import { asignarLicenciaSchema } from "../../../schemas/asignarLicenciaSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AssignLicenciaModal({
  onClose,
  empresaNit,
  licencias,
  onSuccess,
}) {

  const [saving, setSaving] = useState(false);

  const formatMoney = (value) => {
    if (!value) return "";
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(asignarLicenciaSchema),
    defaultValues: {
      licencia_id: "",
      precio: "",
      fecha_inicio: "",
      fecha_fin: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const selectedLicenciaId = watch("licencia_id");
  const selectedFechaInicio = watch("fecha_inicio");

  const licenciaOptions = useMemo(() => {
    // Filtramos para que solo pasen licencias con IDs que no hayamos visto antes
    const seenIds = new Set();

    return licencias
      .filter(l => l.id && !seenIds.has(l.id)) // Evita duplicados
      .map((l) => ({
        value: l.id, // El ID que viene de Laravel
        label: `${l.tipo} - ${l.duracion}`,
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

  // Effect para manejar los cambios depedientes
  useEffect(() => {
    const licenciaSeleccionada = licenciaOptions.find(
      (l) => String(l.value) === String(selectedLicenciaId)
    );

    if (licenciaSeleccionada) {
      setValue("precio", formatMoney(licenciaSeleccionada.precio), { shouldValidate: true });

      if (selectedFechaInicio) {
        const start = dayjs(selectedFechaInicio);
        if (start.isValid()) {
          const endDate = start
            .add(licenciaSeleccionada.duracion_meses, "month")
            .format("YYYY-MM-DD");
          setValue("fecha_fin", endDate, { shouldValidate: true });
        }
      }
    } else {
      setValue("precio", "");
      setValue("fecha_fin", "");
    }
  }, [selectedLicenciaId, selectedFechaInicio, licenciaOptions, setValue]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const licenciaSeleccionada = licenciaOptions.find(
        (l) => String(l.value) === String(data.licencia_id)
      );

      const payload = {
        nit: empresaNit,
        id_tipo_licencia: data.licencia_id,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin,
        precio: licenciaSeleccionada ? licenciaSeleccionada.precio : null,
        duracion_meses: licenciaSeleccionada ? licenciaSeleccionada.duracion_meses : null
      };

      await superAdminApi.post('/superadmin/empresa-licencia', payload);

      Swal.fire({
        icon: 'success',
        title: 'Plan Asignado',
        text: 'El plan ha sido asignado correctamente.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        onSuccess?.();
        onClose();
      });

    } catch (error) {
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((k) => {
          const field = k === 'id_tipo_licencia' ? 'licencia_id' : k;
          setError(field, {
            type: "server",
            message: backendErrors[k][0],
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo asignar el plan.',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <BaseModal>
      <ModalHeader title="Asignar Plan" icon="verified" onClose={onClose} />
      <div className="p-6">
        <Form
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          fields={fields}
          errors={errors}
          loading={saving}
        />
      </div>
      <ModalFooter />
    </BaseModal>
  );
}
