import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import UserForm from "../../Users/UserForm";
import { editUserFormConfig } from "../../../UserFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import Swal from 'sweetalert2';


export default function EditUserModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (!userId) return;

    api.get(`/personal/${userId}`).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, [userId]);

  const handleUpdate = async (data) => {
    try {
      setSaving(true);
      await api.put(`/personal/${userId}`, data);

      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        text: 'La información del usuario ha sido actualizada correctamente.',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        onSuccess?.();
        onClose();
      });

    } catch (error) {
      console.error("Error 422:", error.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el usuario.',
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <BaseModal>
      <ModalHeader icon="person" title="EDITAR USUARIO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <UserForm
            initialValues={user}
            fields={editUserFormConfig[user.id_rol]}
            onSubmit={handleUpdate}
            disabled={saving}
            loading={saving}
          />
        )}
      </div>
      <ModalFooter />
    </BaseModal>
  );
}
