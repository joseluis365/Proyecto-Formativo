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
import Swal from "sweetalert2";

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
        watch,
        trigger,
        formState: { errors, touchedFields },
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

    const adminPassword = watch("admin_password");
    const adminPasswordConfirmation = watch("admin_password_confirmation");

    // Forzar validación cruzada solo si alguno de los campos ya fue tocado
    useEffect(() => {
        if (touchedFields.admin_password || touchedFields.admin_password_confirmation) {
            trigger(["admin_password", "admin_password_confirmation"]);
        }
    }, [adminPassword, adminPasswordConfirmation, touchedFields, trigger]);

    const handleInvalid = (validationErrors) => {
        console.error("Form is INVALID, cannot submit. Errors:", validationErrors);
        const firstError = Object.values(validationErrors)[0];
        Swal.fire({
            icon: 'warning',
            title: 'Formulario incompleto',
            text: firstError?.message || 'Verifica los campos marcados en rojo.',
            confirmButtonColor: '#3085d6',
            toast: true,
            position: 'top-end',
            timer: 4000,
            showConfirmButton: false,
        });
    };

    const handleUpdate = async (data) => {
        try {
            setSaving(true);
            const payload = {
                ...data,
                id_estado: data.id_estado ?? empresaData.id_estado
            };

            if (!payload.admin_password || payload.admin_password.trim() === "") {
                delete payload.admin_password;
                delete payload.admin_password_confirmation;
            } else {
                // Si hay contraseña, nos aseguramos de enviar también la confirmación
                payload.admin_password_confirmation = data.admin_password_confirmation;
            }

            console.log("Enviando actualización para NIT:", empresaData.nit, "Payload:", payload);

            await superAdminApi.put(`/superadmin/empresa/${empresaData.nit}`, payload);

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
                Swal.fire({
                    icon: 'warning',
                    title: 'Revisa los campos',
                    text: 'Hay errores de validación en el formulario.',
                    confirmButtonColor: '#3085d6',
                });
            } else {
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
                    onInvalid={handleInvalid}
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


