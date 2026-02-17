import { useState, useEffect } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import Form from "../../UI/Form";
import { createEmpresaFormConfig } from "../../../EmpresaFormConfig";


export default function EditEmpresaModal({
    empresaData,
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState(empresaData || {});

    useEffect(() => {
        if (empresaData) setValues(empresaData);
    }, [empresaData]);

    const handleUpdate = async (data) => {
        try {
            setSaving(true);
            setErrors({});

            // 1. Limpieza estricta de datos
            const payload = { ...data };

            // Si el password está vacío, no lo enviamos para no sobrescribir con vacío
            if (!payload.admin_password || payload.admin_password.trim() === "") {
                delete payload.admin_password;
                delete payload.admin_password_confirmation;
            }

            console.log("Enviando actualización para NIT:", empresaData.nit);

            // 2. Petición API
            const response = await api.put(`/ empresa / ${ empresaData.nit } `, payload);

            // 3. Notificación y cierre
            const Swal = (await import("sweetalert2")).default;
            await Swal.fire({
                icon: 'success',
                title: 'Empresa Actualizada',
                text: 'Los datos se han guardado correctamente.',
                showConfirmButton: false,
                timer: 1500,
            });

            // IMPORTANTE: Aquí llamamos a la prop que recibimos
            if (typeof onSuccess === 'function') {
                onSuccess();
            }
            onClose();

        } catch (error) {
            console.error("Update Error:", error);
            if (error.response?.status === 422) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.response.data.errors).map(
                            ([key, val]) => [key, val[0]]
                        )
                    )
                );
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

    return (
        <BaseModal>
            <ModalHeader icon="edit" title="EDITAR EMPRESA" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto">
                <Form
                    values={values}
                    fields={createEmpresaFormConfig[2]}
                    onSubmit={handleUpdate}
                    disabled={saving}
                    loading={saving}
                    errors={errors}
                />
            </div>
            <ModalFooter />
        </BaseModal>
    );
}
