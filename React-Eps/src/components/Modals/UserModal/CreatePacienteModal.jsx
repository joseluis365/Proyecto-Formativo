import { useState, useEffect } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import Form from "../../UI/Form";
import { getCreateUserFormConfig } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPacienteSchema } from "@/schemas/usuarioSchemas";
import { ROLES } from "@/constants/roles";

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
  sexo: "",
  grupo_sanguineo: "",
  id_estado: 1,
  contrasena: "",
  id_rol: ROLES.PACIENTE,
};

export default function CreatePacienteModal({
  onClose,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createPacienteSchema),
    defaultValues: initialUser,
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const payload = {
        id_rol: ROLES.PACIENTE,
        documento: data.documento,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        fecha_nacimiento: data.fecha_nacimiento,
        sexo: data.sexo,
        grupo_sanguineo: data.grupo_sanguineo,
        id_estado: data.id_estado,
        contrasena: data.contrasena,
      };
      await api.post(`/usuario`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Paciente Creado',
        text: 'El paciente ha sido creado correctamente.',
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
          text: 'No se pudo crear el paciente.',
        });
      }
    }
    finally {
      setSaving(false);
    }
  };


  return (
    <BaseModal>
      <ModalHeader icon="person" title="CREAR PACIENTE" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <MotionSpinner />
          </div>
        ) : (
          <Form
            fields={getCreateUserFormConfig(ROLES.PACIENTE)}
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
