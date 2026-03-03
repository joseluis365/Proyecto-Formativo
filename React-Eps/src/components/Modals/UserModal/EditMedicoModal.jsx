import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getEditUserFormConfig } from "../../../UserFormConfig";
import { editMedicoSchema } from "../../../schemas/userSchema";
import { handleApiErrors } from "../../../utils/formHandlers";
import Swal from 'sweetalert2';
import BlueButton from "../../UI/BlueButton";
import MotionSpinner from "../../UI/Spinner";
import useEspecialidades from "../../../hooks/useEspecialidades";

export default function EditMedicoModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { specialties } = useEspecialidades();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editMedicoSchema),
    mode: "onChange",
    reValidateMode: "onBlur"
  });

  // Nota: Para la edición de médicos necesitamos un esquema que permita contrasena opcional.
  // Pero userSchema.js ya tiene una estructura. Vamos a usar un ajuste inline o importar uno específico.
  // Por ahora lo ajusto para que la contraseña no sea obligatoria en edición.

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        // El interceptor ya devuelve res.data.data
        const userData = await api.get(`/usuario/${userId}`);

        reset({
          ...userData,
          segundo_nombre: userData.segundo_nombre || "",
          segundo_apellido: userData.segundo_apellido || "",
          contrasena: ""
        });
      } catch (error) {
        console.error("Error al cargar médico:", error);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, reset, onClose]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = { ...data };

      // No enviamos contraseña si está vacía
      if (!payload.contrasena) {
        delete payload.contrasena;
      }

      await api.put(`/usuario/${userId}`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Médico Actualizado',
        text: 'La información del médico ha sido actualizada correctamente.',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      }).then(() => {
        onSuccess?.();
        onClose();
      });

    } catch (error) {
      handleApiErrors(error, setError);
    } finally {
      setSaving(false);
    }
  };

  const formConfig = {
    fields: getEditUserFormConfig(4, { id_especialidad: specialties })
  };

  return (
    <BaseModal>
      <ModalHeader icon="medical_information" title="EDITAR MÉDICO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <MotionSpinner />
            <p className="text-gray-500 text-sm animate-pulse">Obteniendo perfil del médico...</p>
          </div>
        ) : (
          <FormWithIcons
            config={formConfig}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          >
            <div className="flex mt-8 justify-end">
              <div className="w-full md:w-56">
                <BlueButton
                  text="Actualizar Médico"
                  icon="how_to_reg"
                  type="submit"
                  loading={saving}
                />
              </div>
            </div>
          </FormWithIcons>
        )}
      </div>
    </BaseModal>
  );
}
