import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getEditUserFormConfig } from "../../../UserFormConfig";
import { updatePersonalSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "../../../utils/formHandlers";
import Swal from 'sweetalert2';
import BlueButton from "../../UI/BlueButton";
import MotionSpinner from "../../UI/Spinner";

export default function EditPersonalModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatePersonalSchema),
    mode: "onChange",
    reValidateMode: "onChange"
  });

  // Carga de datos iniciales
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        // El interceptor ya devuelve res.data.data
        const userData = await api.get(`/usuario/${userId}`);

        // Saneamiento de datos para el formulario
        // Si el backend envía null en los campos opcionales, los pasamos a string vacío
        reset({
          ...userData,
          segundo_nombre: userData.segundo_nombre || "",
          segundo_apellido: userData.segundo_apellido || "",
          contrasena: "" // No cargamos la contraseña por seguridad
        });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
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

      // Limpieza de datos: si la contraseña está vacía, no la enviamos para no sobreescribirla
      const payload = { ...data };
      if (!payload.contrasena) {
        delete payload.contrasena;
      }

      await api.put(`/usuario/${userId}`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        text: 'La información del personal ha sido actualizada correctamente.',
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
    fields: getEditUserFormConfig(3) // Rol 3: Personal
  };

  return (
    <BaseModal>
      <ModalHeader icon="edit_note" title="EDITAR PERSONAL ADMINISTRATIVO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <MotionSpinner />
            <p className="text-gray-500 text-sm animate-pulse">Cargando datos del usuario...</p>
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
                  text="Actualizar Cambios"
                  icon="published_with_changes"
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
