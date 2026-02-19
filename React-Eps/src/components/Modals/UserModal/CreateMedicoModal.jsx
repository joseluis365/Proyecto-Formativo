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
  const [errors, setErrors] = useState({});




  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    api.get('/especialidades').then(res => {
      setSpecialties(res.data);
    });
  }, []);

  const handleCreate = async (data) => {
    try {
      setSaving(true);
      setErrors({});
      const payload = {
        id_rol: 4,
        documento: data.documento,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        fecha_nacimiento: data.fecha_nacimiento,
        registro_profesional: data.registro_profesional,
        id_especialidad: data.id_especialidad,
        id_estado: data.id_estado,
        contrasena: data.contrasena,
        id_rol: data.id_rol,
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
            values={initialUser}
            fields={getCreateUserFormConfig(4, { id_especialidad: specialties })}
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
