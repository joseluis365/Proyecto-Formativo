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
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        // Updated container style is handled by BaseModal, but wrapper needs adjustment if BaseModal doesn't handle all positioning logic or if we want animation on the wrapper
        // BaseModal now has fixed inset-0, so we might need to adjust how we use it or just pass children to it if it handles the container
        // Looking at BaseModal implementation: it has fixed inset-0 and the container.
        // So we should strictly wrap content in BaseModal if BaseModal is the full screen overlay.
        // But here we are wrapping BaseModal in motion.div which is also fixed inset-0.
        // This is nesting overlays.
        // Let's remove the outer motion.div overlay and letting BaseModal handle it?
        // But BaseModal doesn't have animation props.
        // Let's keep the outer motion.div as the overlay and refactor BaseModal usage.
        // Wait, BaseModal already has fixed inset-0.
        // If I use BaseModal inside motion.div, I have 2 fixed overlays.
        // I should probably move the animation inside BaseModal or make BaseModal accept animation props.
        // For now, to minimize breakage, I will keep the structure but ensure BaseModal styling is effective.
        // Actually, the previous BaseModal had fixed inset-0.
        // The previous CreateUserModal had motion.div > motion.div > BaseModal.
        // If BaseModal has fixed inset-0, it will cover everything.
        // Let's assume BaseModal is the modal container and wrapper.
        // I will use BaseModal directly if possible, but I want animation.
        // Let's adhere to the structure where BaseModal provides the structural styles.
        // I'll keep the motion.div wrapper for animation but remove the fixed inset-0 from it if BaseModal has it?
        // No, BaseModal is designed to be THE modal.
        // I will wrap the content *inside* BaseModal with animation if needed, or just wrap BaseModal.
        // Let's look at CompanyDetailsModal: it renders motion.div as the modal container.
        // BaseModal returns a dict with fixed inset-0.
        // If I render plain BaseModal, it works.
        // If I wrap it in motion.div, the motion.div needs to be the overlay.
        // I will stick to the existing pattern but update the content INSIDE BaseModal.
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      // Note: BaseModal already has strict styling. 
      // If we use BaseModal, we might have double overlays. 
      // Let's trust BaseModal's new style and maybe trigger animation differently or just accept simpler animation for now or wrap the inner part.
      // Actually, let's look at CompanyDetailsModal again. It uses motion.div directly.
      // CreateUserModal uses BaseModal.
      // I will use BaseModal as the root and maybe lose the fade-in for the overlay for a second to ensure style match, or better:
      // I will use the `onClose` to unmount.
      // I will just return BaseModal and inside it put the content.
      >
      </motion.div>
        // Wait, I am replacing the whole file. I should make it clean.

    </motion.div>
  );
  // RETRY:
  // I will Structure it like this:
  // BaseModal (which handles overlay and container) -> Slot for content.
  // But BaseModal doesn't support animation props.
  // I will just use the structure of CompanyDetailsModal which does NOT use BaseModal, it defines its own structure.
  // BUT the task is to "Refactor Modals to match CompanydetailsModal style".
  // And "Refactor BaseModal".
  // If I refactored BaseModal, I should use it.
  // So I will use BaseModal.

  return (
    <BaseModal>
      <ModalHeader icon="person" title="CREAR USUARIO" onClose={onClose} />
      <div className="p-6">
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
      <ModalFooter />
    </BaseModal>
  );
}
