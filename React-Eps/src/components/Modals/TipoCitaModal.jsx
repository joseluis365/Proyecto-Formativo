import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formTipoCita } from "@/data/BaseTablesForms";
import { tipoCitaSchema } from "@/schemas/tipoCitaSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function TipoCitaModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(tipoCitaSchema),
        mode: "onChange",
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
        defaultValues: {
            tipo: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    tipo: editData.tipo || ""
                });
            } else {
                reset({
                    tipo: ""
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await api.put(`/tipos-cita/${editData.id_tipo_cita}`, data);
                Swal.fire("Éxito", "Tipo de cita actualizado correctamente", "success");
            } else {
                await api.post("/tipos-cita", data);
                Swal.fire("Éxito", "Tipo de cita creado correctamente", "success");
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
                title={isEdit ? "Editar Tipo de Cita" : "Nuevo Tipo de Cita"}
                icon="calendar_today"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formTipoCita}
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
