import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formDepartamento } from "@/data/BaseTablesForms";
import { departamentoSchema } from "@/schemas/departamentoSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import superAdminApi from "@/Api/superadminAxios";
import Swal from "sweetalert2";

export default function SuperAdminDepartamentoModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(departamentoSchema),
        mode: "onChange",
        defaultValues: {
            codigo_DANE: "",
            nombre: ""
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    codigo_DANE: editData.codigo_DANE || "",
                    nombre: editData.nombre || ""
                });
            } else {
                reset({
                    codigo_DANE: "",
                    nombre: ""
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await superAdminApi.put(`/departamentos/${editData.codigo_DANE}`, data);
                Swal.fire("Éxito", "Departamento actualizado (SuperAdmin)", "success");
            } else {
                await superAdminApi.post("/departamentos", data);
                Swal.fire("Éxito", "Departamento creado (SuperAdmin)", "success");
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (!handleApiErrors(error, setError)) {
                Swal.fire("Error", "Error al procesar la solicitud (SuperAdmin)", "error");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal>
            <ModalHeader
                title={isEdit ? "Editar Departamento" : "Nuevo Departamento"}
                icon="map"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formDepartamento}
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
