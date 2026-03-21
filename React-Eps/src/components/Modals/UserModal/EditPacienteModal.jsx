import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getEditUserSections } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";
import BlueButton from "../../UI/BlueButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePacienteSchema } from "@/schemas/usuarioSchemas";
import useTipoDocumentos from "@/hooks/useTipoDocumentos";


export default function EditPacienteModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const { tipoDocumentos, loading: loadingTipoDocumentos } = useTipoDocumentos();

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

    api.get(`/usuario/${userId}`).then((res) => {
      setUser(res);
      reset(res);
      setLoading(false);
    });
  }, [userId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await api.put(`/usuario/${userId}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Paciente Actualizado',
        text: 'La información del paciente ha sido actualizada correctamente.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        onSuccess?.();
        onClose();
      });

    } catch (error) {
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: backendErrors[key][0],
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el paciente.',
        });
      }
    } finally {
      setSaving(false);
    }
  };
  console.log(user);
  return (
    <BaseModal>
      <ModalHeader icon="person" title="EDITAR PACIENTE" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading || loadingTipoDocumentos ? (
          <div className="flex items-center justify-center h-full">
            <MotionSpinner />
          </div>
        ) : (
          <FormWithIcons
            sections={getEditUserSections(user.id_rol, { id_tipo_documento: tipoDocumentos })}
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
