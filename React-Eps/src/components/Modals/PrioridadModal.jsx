import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formPrioridad } from "@/data/BaseTablesForms";
import { prioridadSchema } from "@/schemas/prioridadSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function PrioridadModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(prioridadSchema),
        mode: "onChange",
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
        defaultValues: {
            prioridad: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    prioridad: editData.prioridad || ""
                });
            } else {
                reset({
                    prioridad: ""
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await api.put(`/prioridades/${editData.id_prioridad}`, data);
                Swal.fire("Éxito", "Prioridad actualizada correctamente", "success");
            } else {
                await api.post("/prioridades", data);
                Swal.fire("Éxito", "Prioridad creada correctamente", "success");
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (!handleApiErrors(error, setError)) {
                Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal>
            <ModalHeader
                title={isEdit ? "Editar Prioridad" : "Nueva Prioridad"}
                icon="priority_high"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formPrioridad}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={handleFormSubmit}
                    errors={errors}
                >
                    <div className="flex justify-end pt-4">
                        <BlueButton
                            text={isEdit ? "Actualizar" : "Crear"}
                            icon="save"
                            type="submit"
                            loading={isSubmitting}
                        />
                    </div>
                </FormWithIcons>
            </div>
        </BaseModal>
    );
}
