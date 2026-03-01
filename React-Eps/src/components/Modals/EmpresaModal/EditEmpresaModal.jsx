import { useState, useEffect } from "react";
import axios from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import FormWithIcons from "../../UI/FormWithIcons";
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

    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErr = { ...prev };
                delete newErr[name];
                return newErr;
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setErrors({});

            const payload = { ...values };

            if (!payload.admin_password || payload.admin_password.trim() === "") {
                delete payload.admin_password;
                delete payload.admin_password_confirmation;
            }

            console.log("Enviando actualización para NIT:", empresaData.nit);

            await axios.put(`/superadmin/empresa/${empresaData.nit}`, payload);

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
                    values={values}
                    onChange={handleChange}
                    errors={errors}
                    onSubmit={handleUpdate}
                >
                    <div className="flex mt-10 justify-end gap-10">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">save</span>
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </FormWithIcons>
            </div>
            <ModalFooter />
        </BaseModal>
    );
}
