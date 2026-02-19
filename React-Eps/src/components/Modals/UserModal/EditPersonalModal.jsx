import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import Form from "../../UI/Form";
import { editUserFormConfig } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import MotionSpinner from "../../UI/Spinner";


export default function EditPersonalModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (!userId) return;

    api.get(`/usuario/${userId}`).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, [userId]);

  const handleUpdate = async (data) => {
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
            values={user}
            fields={editUserFormConfig[user.id_rol]}
            onSubmit={handleUpdate}
            disabled={saving}
            loading={saving}
          />
        )}
      </div>
    </BaseModal>
  );
}
