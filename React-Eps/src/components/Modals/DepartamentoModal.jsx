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
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function DepartamentoModal({ isOpen, onClose, onSuccess, editData = null }) {
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
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
        defaultValues: {
            codigo_DANE: "",
            nombre: "",
            id_estado: 1
        }
    });

    // Patrón de edición: reset() al cargar datos o al abrir el modal
    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    codigo_DANE: editData.codigo_DANE || "",
                    nombre: editData.nombre || "",
                    id_estado: editData.id_estado || 1
                });
            } else {
                reset({
                    codigo_DANE: "",
                    nombre: "",
                    id_estado: 1
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                // El endpoint usa codigo_DANE como identificador para departamentos
                await api.put(`/departamentos/${editData.codigo_DANE}`, data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Departamento actualizado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await api.post("/departamentos", data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Departamento creado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
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

    // Configuración dinámica para marcar el Código DANE como solo lectura en edición
    const config = {
        ...formDepartamento,
        fields: formDepartamento.fields.map(field =>
            field.name === "codigo_DANE" ? { ...field, readOnly: isEdit } : field
        )
    };

    return (
        <BaseModal>
            <ModalHeader
                title={isEdit ? "EDITAR DEPARTAMENTO" : "NUEVO DEPARTAMENTO"}
                icon="map"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={config}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={handleFormSubmit}
                    errors={errors}
                >
                    <div className="flex justify-end pt-4">
                        <BlueButton
                            text={isEdit ? "Actualizar" : "Guardar"}
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
