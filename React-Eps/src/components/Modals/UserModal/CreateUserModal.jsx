import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import UserForm from "../../Users/UserForm";
import { createUserFormConfig } from "../../../UserFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import Swal from 'sweetalert2';

export default function CreateUserModal({
  onClose,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const initialUser = {
    name: "",
    email: "",
    id: "",
    status: "ACTIVO",
    id_rol: 1,
  };


  const handleCreate = async (data) => {
    try {
      setSaving(true);
      setErrors({});
      const payload = {
        id_rol: 1,
        ...data,
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
      <ModalHeader icon="person" title="CREAR USUARIO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <UserForm
            initialValues={initialUser}
            fields={createUserFormConfig[1]}
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
