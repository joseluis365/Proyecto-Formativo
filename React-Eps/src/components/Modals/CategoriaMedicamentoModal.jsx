import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formCategoriaMedicamento } from "@/data/BaseTablesForms";
import { categoriaMedicamentoSchema } from "@/schemas/categoriaMedicamentoSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function CategoriaMedicamentoModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(categoriaMedicamentoSchema),
        mode: "onChange",
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
        defaultValues: {
            categoria: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    categoria: editData.categoria || ""
                });
            } else {
                reset({
                    categoria: ""
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await api.put(`/categorias-medicamento/${editData.id_categoria}`, data);
                Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
            } else {
                await api.post("/categorias-medicamento", data);
                Swal.fire("Éxito", "Categoría creada correctamente", "success");
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
                title={isEdit ? "Editar Categoría de Medicamento" : "Nueva Categoría de Medicamento"}
                icon="medication"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formCategoriaMedicamento}
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
