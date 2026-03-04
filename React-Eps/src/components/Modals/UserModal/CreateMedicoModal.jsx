import { useState } from "react";
import api from "@/Api/axios";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import Form from "@/components/UI/Form";
import { getCreateUserFormConfig } from "@/UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "@/components/UI/Spinner";
import useEspecialidades from "@/hooks/useEspecialidades";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMedicoSchema } from "@/schemas/usuarioSchemas";

const initialUser = {
  documento: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  email: "",
  telefono: "",
  direccion: "",
  fecha_nacimiento: "",
  registro_profesional: "",
  id_especialidad: "",
  id_estado: 1,
  contrasena: "",
  id_rol: 4,
};

export default function CreateMedicoModal({
  onClose,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const { specialties } = useEspecialidades();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createMedicoSchema),
    defaultValues: initialUser,
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = {
        id_rol: 4,
        documento: data.documento,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        fecha_nacimiento: data.fecha_nacimiento,
        registro_profesional: data.registro_profesional,
        id_especialidad: data.id_especialidad,
        id_estado: data.id_estado,
        contrasena: data.contrasena,
      };
      await api.post(`/usuario`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Usuario Creado',
        text: 'El medico ha sido creado correctamente.',
        showConfirmButton: false,
        timer: 1100,
        timerProgressBar: true,
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
          text: 'No se pudo crear el medico.',
        });
      }
    }
    finally {
      setSaving(false);
    }
  };


  return (
    <BaseModal>
      <ModalHeader icon="person" title="CREAR MEDICO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <MotionSpinner />
          </div>
        ) : (
          <Form
            fields={getCreateUserFormConfig(4, { id_especialidad: specialties })}
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
