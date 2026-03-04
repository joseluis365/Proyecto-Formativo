import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import Form from "../../UI/Form";
import { editUserFormConfig } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePersonalSchema } from "@/schemas/usuarioSchemas";


export default function EditPersonalModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updatePersonalSchema),
    mode: "onChange"
  });


  useEffect(() => {
    if (!userId) return;

    api.get(`/usuario/${userId}`).then((res) => {
      setUser(res.data);
      reset(res.data);
      setLoading(false);
    });
  }, [userId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await api.put(`/usuario/${userId}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        text: 'La información del usuario ha sido actualizada correctamente.',
        showConfirmButton: false,
        timer: 1100,
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
          text: 'No se pudo actualizar el usuario.',
        });
      }
    } finally {
      setSaving(false);
    }
  };
  console.log(user);
  return (
    <BaseModal>
      <ModalHeader icon="person" title="EDITAR USUARIO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <MotionSpinner />
          </div>
        ) : (
          <Form
            fields={editUserFormConfig[user.id_rol]}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            disabled={saving}
            loading={saving}
            errors={errors}
          />
        )}
      </div>
    </BaseModal>
  );
}
