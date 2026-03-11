import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getEditUserSections } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePacienteSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "../../../utils/formHandlers";
import BlueButton from "../../UI/BlueButton";

export default function EditPacienteModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [idRol, setIdRol] = useState(5);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatePacienteSchema),
    mode: "onChange"
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await api.get(`/usuario/${userId}`);
        setIdRol(userData.id_rol);
        reset({
          ...userData,
          segundo_nombre: userData.segundo_nombre || "",
          segundo_apellido: userData.segundo_apellido || "",
        });
      } catch (error) {
        console.error("Error al cargar paciente:", error);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, reset, onClose]);

  const onSubmit = async (data) => {
    try {
      await api.put(`/usuario/${userId}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Paciente Actualizado',
        text: 'La información del paciente ha sido actualizada correctamente.',
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

  const sections = getEditUserSections(idRol);

  return (
    <BaseModal>
      <ModalHeader icon="person" title="EDITAR PACIENTE" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <MotionSpinner />
            <p className="text-gray-500 text-sm animate-pulse">Obteniendo datos del paciente...</p>
          </div>
        ) : (
          <FormWithIcons
            sections={sections}
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

