import { useState, useEffect } from "react";
import superAdminApi from "../../../Api/superAdminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import Form from "../../UI/Form";
import { createLicenciaFormConfig } from "../../../LicenciaFormConfig";
import Swal from "sweetalert2";


export default function EditLicenciaModal({
    licenciaData,
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState(licenciaData || {});

    useEffect(() => {
        if (licenciaData) setValues(licenciaData);
    }, [licenciaData]);

    const handleUpdate = async (data) => {
        try {
            setSaving(true);
            setErrors({});

            // 1. Limpieza estricta de datos
            const payload = { ...data };

            console.log("Enviando actualización para NIT:", licenciaData.id);

            // 2. Petición API
            const response = await superAdminApi.put(`/licencia/${licenciaData.id}`, payload);

            // 3. Notificación y cierre
            const Swal = (await import("sweetalert2")).default;
            await Swal.fire({
                icon: 'success',
                title: 'Licencia Actualizada',
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

    const handleDelete = async () => {

        // Confirmación visual
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer y podría afectar las empresaas asociadas.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                setSaving(true);
                // Petición DELETE a tu API de Laravel
                await superAdminApi.delete(`/licencia/${licenciaData.id}`);

                await Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'La licencia ha sido eliminada correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                });

                onSuccess?.(); // Refrescar lista
                onClose();     // Cerrar modal
            } catch (error) {
                console.error("Delete Error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'No se pudo eliminar la licencia.',
                });
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <BaseModal>
            <ModalHeader icon="edit" title="EDITAR PLAN" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto">
                <Form
                    values={values}
                    fields={createLicenciaFormConfig[2]}
                    onSubmit={handleUpdate}
                    disabled={saving}
                    loading={saving}
                    errors={errors}
                    showDeleteButton={true}
                    onDelete={handleDelete}
                />
            </div>
        </BaseModal>
    );
}