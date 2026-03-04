import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formCategoriaExamen } from "@/data/BaseTablesForms";
import { categoriaExamenSchema } from "@/schemas/categoriaExamenSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function CategoriaExamenModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(categoriaExamenSchema),
        mode: "onChange",
        reValidateMode: "onChange",
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
                await api.put(`/categorias-examen/${editData.id_categoria_examen}`, data);
                Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
            } else {
                await api.post("/categorias-examen", data);
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
                title={isEdit ? "Editar Categoría de Examen" : "Nueva Categoría de Examen"}
                icon="biotech"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formCategoriaExamen}
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
