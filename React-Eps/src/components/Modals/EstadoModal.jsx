import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formEstado } from "@/data/BaseTablesForms";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function EstadoModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({
        nombre_estado: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                nombre_estado: editData.nombre_estado || ""
            });
        } else {
            setFormData({
                nombre_estado: ""
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/estados/${editData.id_estado}`, formData);
                Swal.fire("Éxito", "Estado actualizado correctamente", "success");
            } else {
                await api.post("/estados", formData);
                Swal.fire("Éxito", "Estado creado correctamente", "success");
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (error.response?.status === 403) {
                Swal.fire("Error", "No tienes permiso para modificar este estado (IDs protegidos < 7).", "error");
            } else if (error.response?.status === 422) {
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
                title={editData ? "Editar Estado" : "Nuevo Estado"}
                icon="settings"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formEstado}
                    values={formData}
                    onChange={handleChange}
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
