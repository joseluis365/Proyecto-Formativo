import { useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import Form from "../../UI/Form";
import { createEmpresaFormConfig } from "../../../EmpresaFormConfig";


export default function CreateEmpresaModal({
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const initialEmpresa = {
        nit: "",
        nombre: "",
        email_contacto: "",
        telefono: "",
        direccion: "",
        documento_representante: "",
        nombre_representante: "",
        telefono_representante: "",
        email_representante: "",
        id_estado: 3,
        admin_nombre: "",
        admin_documento: "",
        admin_email: "",
        admin_password: "",
    };


    const handleCreate = async (data) => {
        try {
            setSaving(true);
            setErrors({});
            const payload = {
                ...data,
            };
            await api.post(`/empresa`, payload);
            import("sweetalert2").then((Swal) => {
                Swal.default.fire({
                    icon: 'success',
                    title: 'Empresa Creada',
                    text: 'La empresa y su administrador han sido registrados correctamente.',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    onSuccess?.();
                    onClose();
                });
            });

        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.response.data.errors).map(
                            ([key, value]) => [key, value[0]]
                        )
                    )
                );
            } else {
                import("sweetalert2").then((Swal) => {
                    Swal.default.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error inesperado al crear la empresa.',
                    });
                });
            }
        }
        finally {
            setSaving(false);
        }
    };


    return (
        <BaseModal>
            <ModalHeader icon="business" title="CREAR EMPRESA" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <Form
                        values={initialEmpresa}
                        fields={createEmpresaFormConfig[1]}
                        onSubmit={handleCreate}
                        disabled={saving}
                        loading={saving}
                        errors={errors}
                    />
                )}
            </div>
            <ModalFooter />
        </BaseModal>
    );
}
