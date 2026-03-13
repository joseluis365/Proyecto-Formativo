import { useState, useEffect } from "react";
import superAdminApi from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import FormWithIcons from "../../UI/FormWithIcons";
import { createEmpresaFormConfig } from "../../../EmpresaFormConfig";
import { updateEmpresaSchema } from "../../../schemas/updateEmpresaSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditEmpresaModal({
    empresaData,
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateEmpresaSchema),
        defaultValues: empresaData || {},
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
    });

    useEffect(() => {
        if (empresaData) reset(empresaData);
    }, [empresaData, reset]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log("Validation errors in EditEmpresaModal:", errors);
        }
    }, [errors]);

    const handleUpdate = async (data) => {
        try {
            setSaving(true);
            // Aseguramos que id_estado esté presente ya que el backend lo requiere como obligatorio
            const payload = {
                ...data,
                id_estado: data.id_estado ?? empresaData.id_estado
            };

            if (!payload.admin_password || payload.admin_password.trim() === "") {
                delete payload.admin_password;
                delete payload.admin_password_confirmation;
            }

            console.log("Enviando actualización para NIT:", empresaData.nit, "Payload:", payload);

            await superAdminApi.put(`/superadmin/empresa/${empresaData.nit}`, payload);

            const Swal = (await import("sweetalert2")).default;
            await Swal.fire({
                icon: 'success',
                title: 'Empresa Actualizada',
                text: 'Los datos se han guardado correctamente.',
                showConfirmButton: false,
                timer: 1500,
            });

            if (typeof onSuccess === 'function') {
                onSuccess();
            }
            onClose();

        } catch (error) {
            console.error("Update Error:", error);
            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((key) => {
                    setError(key, {
                        type: "server",
                        message: backendErrors[key][0],
                    });
                });
            } else {
                const Swal = (await import("sweetalert2")).default;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al actualizar.',
                });
            }
        } finally {
            setSaving(false);
        }
    };

    const fields = createEmpresaFormConfig[2];
    const camposEmpresa = fields.filter(f => !f.name.startsWith('admin_'));
    const camposAdmin = fields.filter(f => f.name.startsWith('admin_'));

    const formSections = [
        { title: "Información de la Empresa", fields: camposEmpresa },
        { title: "Información del Admin del Sistema", fields: camposAdmin }
    ];

    return (
        <BaseModal>
            <ModalHeader icon="edit" title="EDITAR EMPRESA" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto">
                <FormWithIcons
                    sections={formSections}
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    onSubmit={handleUpdate}
                >
                    <div className="flex mt-10 justify-end gap-10">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">published_with_changes</span>
                            {saving ? "Actualizando..." : "Actualizar Cambios"}
                        </button>
                    </div>
                </FormWithIcons>
            </div>
            <ModalFooter />
        </BaseModal>
    );
}
