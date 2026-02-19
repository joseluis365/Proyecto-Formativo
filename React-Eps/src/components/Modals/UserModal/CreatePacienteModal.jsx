import { useState, useEffect } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import Form from "../../UI/Form";
import { getCreateUserFormConfig } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";

const initialUser = {
  documento: "",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  direccion: "",
  fecha_nacimiento: "",
  sexo: "",
  grupo_sanguineo: "",
  id_estado: 1,
  contrasena: "",
  id_rol: 5,
};

export default function CreatePacienteModal({
  onClose,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCreate = async (data) => {
    try {
      setSaving(true);
      setErrors({});
      const payload = {
        id_rol: 5,
        documento: data.documento,
        nombre: data.nombre,
        apellido: data.apellido,
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
        setErrors(
          Object.fromEntries(
            Object.entries(error.response.data.errors).map(
              ([key, value]) => [key, value[0]]
            )
          )
        );
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
            values={initialUser}
            fields={getCreateUserFormConfig(5)}
            onSubmit={handleCreate}
            disabled={saving}
            loading={saving}
            errors={errors}
          />
        )}
      </div>

    </BaseModal>
  );
}