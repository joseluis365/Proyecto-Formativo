import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formEstado } from "@/data/BaseTablesForms";
import { estadoSchema } from "@/schemas/estadoSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function EstadoModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(estadoSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
        defaultValues: {
            nombre_estado: ""
        }
    });

    // Patrón para edición: reset() al cargar datos o al abrir modal
    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    nombre_estado: editData.nombre_estado || ""
                });
            } else {
                reset({
                    nombre_estado: ""
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await api.put(`/estados/${editData.id_estado}`, data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Estado actualizado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await api.post("/estados", data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Estado creado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            // Manejo específico del backend 403 (IDs protegidos)
            if (error.response?.status === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Acceso Denegado",
                    text: error.response.data.message || "No tienes permiso para modificar este estado protegidos.",
                });
                return;
            }

            // Mapeo automático de errores 422
            if (!handleApiErrors(error, setError)) {
                Swal.fire({
                    icon: "error",
                    title: "Error Inesperado",
                    text: "Ocurrió un error al procesar la solicitud."
                });
            }
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal>
            <ModalHeader
                title={isEdit ? "EDITAR ESTADO" : "NUEVO ESTADO"}
                icon="settings"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formEstado}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={handleFormSubmit}
                    errors={errors}
                    isEditing={isEdit}
                >
                    <div className="flex justify-end pt-4">
                        <BlueButton
                            text={isEdit ? "Actualizar Cambios" : "Guardar"}
                            icon={isEdit ? "published_with_changes" : "save"}
                            type="submit"
                            loading={isSubmitting}
                        />
                    </div>
                </FormWithIcons>
            </div>
        </BaseModal>
    );
}
