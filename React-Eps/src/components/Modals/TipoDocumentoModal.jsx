import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formTipoDocumento } from "@/data/BaseTablesForms";
import { tipoDocumentoSchema } from "@/schemas/tipoDocumentoSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function TipoDocumentoModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(tipoDocumentoSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
        defaultValues: {
            tipo_documento: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    tipo_documento: editData.tipo_documento || ""
                });
            } else {
                reset({
                    tipo_documento: ""
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await api.put(`/tipos-documento/${editData.id_tipo_documento}`, data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Tipo de documento actualizado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await api.post("/tipos-documento", data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Tipo de documento creado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
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
                title={isEdit ? "EDITAR TIPO DOCUMENTO" : "NUEVO TIPO DOCUMENTO"}
                icon="badge"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formTipoDocumento}
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
