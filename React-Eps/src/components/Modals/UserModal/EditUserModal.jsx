import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalBody from "../ModalBody";
import ModalFooter from "../ModalFooter";
import UserForm from "../../Users/UserForm";
import { userFormConfig } from "../../../UserFormConfig";

export default function EditUserModal({
  onClose,
  userId,
  onSuccess,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!userId) return;

  api.get(`/personal/${userId}`).then((res) => {
    setUser(res.data);
    setLoading(false);
  });
}, [userId]);

  const handleUpdate = async (data) => {
  try {
    await api.put(`/personal/${userId}`, data);

    onSuccess?.();   // recargar tabla
    onClose();       // cerrar modal
  } catch (error) {
  console.error("Error 422:", error.response?.data);
}
};


  return (
    <BaseModal>
        <ModalHeader icon="person" title="USUARIO" id="xxxx" onClose={onClose} />
        <ModalBody>
            {loading ? (
        <p>Cargando...</p>
      ) : (
        <UserForm
          initialValues={user}
          fields={userFormConfig[user.id_rol]}
          onSubmit={handleUpdate}
        />
      )}
            
        </ModalBody>
        <ModalFooter>
            
        </ModalFooter>
    </BaseModal>
  );
}
