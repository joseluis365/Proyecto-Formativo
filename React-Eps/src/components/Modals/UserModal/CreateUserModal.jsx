import { useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import Form from "../../UI/Form";
import { createUserFormConfig } from "../../../UserFormConfig";
import Swal from 'sweetalert2';

const initialUser = {
  documento: "",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  direccion: "",
  fecha_nacimiento: "",
  id_estado: 1,
  contrasena: "",
  id_rol: 3,
};

export default function CreateUserModal({
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
        id_rol: 3,
        documento: data.documento,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        fecha_nacimiento: data.fecha_nacimiento,
        contrasena: data.contrasena,
        id_estado: data.id_estado,
      };
      await api.post(`/personal`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Usuario Creado',
        text: 'El usuario ha sido creado correctamente.',
        confirmButtonColor: '#3085d6',
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
          text: 'No se pudo crear el usuario.',
        });
      }
    }
    finally {
      setSaving(false);
    }
  };


  return (
    <BaseModal>
      <ModalHeader icon="person" title="CREAR USUARIO ADMINISTRATIVO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Form
            values={initialUser}
            fields={createUserFormConfig[3]}
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
