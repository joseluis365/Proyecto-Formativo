import { useState } from "react";
import superAdminApi from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalBody from "../ModalBody";
import Form from "../../UI/Form";
import { createLicenciaFormConfig } from "../../../LicenciaFormConfig";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../ToastContext";
import Swal from 'sweetalert2';
import { planSchema } from "../../../schemas/planSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const initialLicencia = {
    tipo: "",
    descripcion: "",
    duracion_meses: "",
    precio: "",
    id_estado: 1,
};

export default function CreateLicenciaModal({
    onClose,
    onSuccess,
}) {
    const toast = useToast();
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(planSchema),
        defaultValues: initialLicencia,
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
    });

    const handleCreate = async (data) => {
        try {
            setSaving(true);
            const payload = {
                ...data,
                id_estado: 1 // Asegurado que llegue
            };

            await superAdminApi.post(`/superadmin/licencia`, payload);

            // 2. Disparas la alerta de SweetAlert2
            await Swal.fire({
                icon: 'success',
                title: 'Plan Creado',
                text: 'El plan ha sido creado correctamente.',
                showConfirmButton: false,
                timer: 1500
            });
            setSuccess(true);
            onSuccess?.();
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((key) => {
                    setError(key, {
                        type: "server",
                        message: backendErrors[key][0],
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error inesperado al crear la licencia.',
                    showConfirmButton: false,
                    timer: 1100
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
                    <ModalHeader icon="verified" title="CREAR PLAN" onClose={onClose} />
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
                                    <span className="font-medium">Plan creado correctamente</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!success && (
                            loading ? (
                                <p>Cargando...</p>
                            ) : (
                                <Form
                                    register={register}
                                    handleSubmit={handleSubmit}
                                    fields={createLicenciaFormConfig[1]}
                                    onSubmit={handleCreate}
                                    disabled={saving}
                                    loading={saving}
                                    errors={errors}
                                />
                            )
                        )}
                    </ModalBody>
                </BaseModal>
            </motion.div>
        </motion.div>
    );
}
