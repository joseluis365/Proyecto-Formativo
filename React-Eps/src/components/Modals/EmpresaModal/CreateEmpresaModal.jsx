import { useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import UserForm from "../../Users/UserForm";
import { createEmpresaFormConfig } from "../../../EmpresaFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../ToastContext";


export default function CreateEmpresaModal({
    onClose,
    onSuccess,
}) {
    const toast = useToast();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const initialEmpresa = {
        nit: "",
        nombre: "",
        email_contacto: "",
        telefono: "",
        direccion: "",
        documento_representante: "",
        nombre_representante: "",
        telefono_representante: "",
        email_representante: "",
        id_estado: 3,
        admin_nombre: "",
        admin_documento: "",
        admin_email: "",
        admin_password: "",
    };


    const handleCreate = async (data) => {
        try {
            setSaving(true);
            setErrors({});
            const payload = {
                ...data,
            };
            await api.post(`/empresa`, payload);
            import("sweetalert2").then((Swal) => {
                Swal.default.fire({
                    icon: 'success',
                    title: 'Empresa Creada',
                    text: 'La empresa y su administrador han sido registrados correctamente.',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    setSuccess(true);
                    onSuccess?.();
                    onClose();
                });
            });

        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.response.data.errors).map(
                            ([key, value]) => [key, value[0]]
                        )
                    )
                );
            } else {
                import("sweetalert2").then((Swal) => {
                    Swal.default.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error inesperado al crear la empresa.',
                    });
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
                className="bg-white rounded-xl p-6 w-full max-w-lg"
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
            >
                <BaseModal>
                    <ModalHeader icon="business" title="CREAR EMPRESA" onClose={onClose} />
                    <div className="p-6">
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
                                    <span className="font-medium">Empresa creada correctamente</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!success && (
                            loading ? (
                                <p>Cargando...</p>
                            ) : (
                                <UserForm
                                    initialValues={initialEmpresa}
                                    fields={createEmpresaFormConfig[1]}
                                    onSubmit={handleCreate}
                                    disabled={saving}
                                    loading={saving}
                                    errors={errors}
                                />
                            )
                        )}
                    </div>

                    <ModalFooter>

                    </ModalFooter>
                </BaseModal>
            </motion.div>
        </motion.div>
    );
}
