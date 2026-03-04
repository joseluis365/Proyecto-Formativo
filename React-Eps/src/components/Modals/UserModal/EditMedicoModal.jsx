import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import Form from "../../UI/Form";
import { getEditUserFormConfig } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMedicoSchema } from "@/schemas/usuarioSchemas";


export default function EditPersonalModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [specialties, setSpecialties] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(updateMedicoSchema),
    mode: "onChange"
  });


  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes, specialtiesRes] = await Promise.all([
          api.get(`/usuario/${userId}`),
          api.get('/especialidades')
        ]);
        setUser(userRes.data);
        reset(userRes.data);
        setSpecialties(specialtiesRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await api.put(`/usuario/${userId}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Medico Actualizado',
        text: 'La información del medico ha sido actualizada correctamente.',
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
          text: 'No se pudo actualizar el medico.',
        });
      }
    } finally {
      setSaving(false);
    }
  };
  console.log(user);
  return (
    <BaseModal>
      <ModalHeader icon="person" title="EDITAR MEDICO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <MotionSpinner />
          </div>
        ) : (
          <Form
            fields={getEditUserFormConfig(user.id_rol, { id_especialidad: specialties })}
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
