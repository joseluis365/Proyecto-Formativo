import { useEffect, useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalBody from "../ModalBody";
import ModalFooter from "../ModalFooter";
import UserForm from "../../Users/UserForm";
import { editUserFormConfig } from "../../../UserFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../ToastContext";


export default function EditUserModal({
  onClose,
  userId,
  onSuccess,
}) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);


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
    toast.success("Usuario actualizado correctamente");
    setSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1200);
  } catch (error) {
  console.error("Error 422:", error.response?.data);
  toast.error("No se pudo guardar");
  } finally {
    setSaving(false);
  }
};
  return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl p-6 w-full max-w-lg"
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
    <BaseModal>
        <ModalHeader icon="person" title="EDITAR USUARIO" onClose={onClose} />
        <ModalBody>
  <AnimatePresence>
    {success && (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mb-4 flex items-center gap-2 rounded-lg bg-green-100 text-green-800 px-4 py-3"
        onClick={!saving ? onClose : undefined}
      >
        <span className="material-symbols-outlined">check_circle</span>
        <span className="font-medium">Usuario actualizado correctamente</span>
      </motion.div>
    )}
  </AnimatePresence>

  {!success && (
    loading ? (
      <p>Cargando...</p>
    ) : (
      <UserForm
        initialValues={user}
        fields={editUserFormConfig[user.id_rol]}
        onSubmit={handleUpdate}
        disabled={saving}
        loading={saving}
      />
    )
  )}
</ModalBody>

        <ModalFooter>
            
        </ModalFooter>
    </BaseModal>
        </motion.div>
      </motion.div>
  );
}
