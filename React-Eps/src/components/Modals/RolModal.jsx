import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formRol } from "@/data/BaseTablesForms";
import { rolSchema } from "@/schemas/rolSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function RolModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(rolSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
        defaultValues: {
            tipo_usu: "",
            id_estado: 1
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    tipo_usu: editData.tipo_usu || "",
                    id_estado: editData.id_estado || 1
                });
            } else {
                reset({
                    tipo_usu: "",
                    id_estado: 1
                });
            }
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await api.put(`/roles/${editData.id_rol}`, data);
                Swal.fire("Éxito", "Rol actualizado correctamente", "success");
            } else {
                await api.post("/roles", data);
                Swal.fire("Éxito", "Rol creado correctamente", "success");
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
                title={isEdit ? "Editar Rol" : "Nuevo Rol"}
                icon="group"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formRol}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={handleFormSubmit}
                    errors={errors}
                    isEditing={isEdit}
                >
                    {isEdit && (
                        <div className="flex flex-col gap-1.5 pb-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Estado
                            </label>
                            <select
                                {...register("id_estado")}
                                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.id_estado ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                                    } rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none`}
                            >
                                <option value={1}>Activo</option>
                                <option value={2}>Inactivo</option>
                            </select>
                            {errors.id_estado && (
                                <span className="text-xs text-red-500">{errors.id_estado.message}</span>
                            )}
                        </div>
                    )}

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
