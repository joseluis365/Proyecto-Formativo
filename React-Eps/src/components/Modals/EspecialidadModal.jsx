import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formEspecialidad } from "@/data/BaseTablesForms";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function EspecialidadModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({ especialidad: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({ especialidad: editData.especialidad || "" });
        } else {
            setFormData({ especialidad: "" });
        }
        setErrors({});
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/configuracion/especialidades/${editData.id_especialidad}`, formData);
                Swal.fire("Éxito", "Especialidad actualizada correctamente", "success");
            } else {
                await api.post("/configuracion/especialidades", formData);
                Swal.fire("Éxito", "Especialidad creada correctamente", "success");
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                const apiErrors = error.response.data.errors;
                const formattedErrors = {};
                Object.keys(apiErrors).forEach(key => {
                    formattedErrors[key] = apiErrors[key][0];
                });
                setErrors(formattedErrors);
            } else {
                Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal>
            <ModalHeader
                title={editData ? "Editar Especialidad" : "Nueva Especialidad"}
                icon="clinical_notes"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formEspecialidad}
                    values={formData}
                    onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
                    onSubmit={handleSubmit}
                    errors={errors}
                >
                    <div className="flex justify-end pt-4">
                        <BlueButton
                            text={editData ? "Actualizar" : "Crear"}
                            icon="save"
                            type="submit"
                            loading={loading}
                        />
                    </div>
                </FormWithIcons>
            </div>
        </BaseModal>
    );
}
