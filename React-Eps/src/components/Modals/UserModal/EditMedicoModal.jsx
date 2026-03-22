import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getEditUserSections } from "../../../UserFormConfig";
import { updateMedicoSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "../../../utils/formHandlers";
import Swal from 'sweetalert2';
import BlueButton from "../../UI/BlueButton";
import MotionSpinner from "../../UI/Spinner";
import useEspecialidades from "../../../hooks/useEspecialidades";
import useTipoDocumentos from "@/hooks/useTipoDocumentos";
import useConsultorios from "@/hooks/useConsultorios";

export default function EditMedicoModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { specialties } = useEspecialidades();
  const { tipoDocumentos, loading: loadingTipoDocumentos } = useTipoDocumentos();
  const { consultorios } = useConsultorios(user?.id_consultorio);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateMedicoSchema),
    mode: "onChange",
    reValidateMode: "onChange"
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
        setUser(userData);

        reset({
          ...userData,
          fecha_nacimiento: userData.fecha_nacimiento ? userData.fecha_nacimiento.substring(0, 10) : "",
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

  const sections = getEditUserSections(4, { 
    id_especialidad: specialties, 
    id_tipo_documento: tipoDocumentos,
    id_consultorio: consultorios
  });

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
                  loading={saving || loadingTipoDocumentos}
                />
              </div>
            </div>
          </FormWithIcons>
        )}
      </div>
    </BaseModal>
  );
}
