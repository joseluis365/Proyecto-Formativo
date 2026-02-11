import { useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalBody from "../ModalBody";
import ModalFooter from "../ModalFooter";
import UserForm from "../../Users/UserForm";
import { createLicenciaFormConfig } from "../../../LicenciaFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../ToastContext";


export default function CreateLicenciaModal({
    onClose,
    onSuccess,
}) {
    const toast = useToast();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const initialLicencia = {
        tipo: "",
        descripcion: "",
        duracion_meses: "",
        precio: "",
        id_estado: 1,
    };


    const handleCreate = async (data) => {
        try {
            setSaving(true);
            setErrors({});
            // Ensure numeric values are numbers if needed, but API might handle strings
            const payload = {
                ...data,
            };
            await api.post(`/licencia`, payload);
            toast.success("Licencia creada correctamente");
            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                onClose();
            }, 1200);
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
                toast.error("Error al crear la licencia");
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
                className="bg-white rounded-xl p-6 w-full max-w-lg"
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
            >
                <BaseModal>
                    <ModalHeader icon="verified" title="CREAR LICENCIA" onClose={onClose} />
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
                                    <span className="font-medium">Licencia creada correctamente</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!success && (
                            loading ? (
                                <p>Cargando...</p>
                            ) : (
                                <UserForm
                                    initialValues={initialLicencia}
                                    fields={createLicenciaFormConfig[1]}
                                    onSubmit={handleCreate}
                                    disabled={saving}
                                    loading={saving}
                                    errors={errors}
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
