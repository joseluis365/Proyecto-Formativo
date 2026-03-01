import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formCategoriaExamen } from "@/data/BaseTablesForms";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function CategoriaExamenModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({ categoria: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({ categoria: editData.categoria || "" });
        } else {
            setFormData({ categoria: "" });
        }
        setErrors({});
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/categorias-examen/${editData.id_categoria_examen}`, formData);
                Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
            } else {
                await api.post("/categorias-examen", formData);
                Swal.fire("Éxito", "Categoría creada correctamente", "success");
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
                title={editData ? "Editar Categoría de Examen" : "Nueva Categoría de Examen"}
                icon="biotech"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formCategoriaExamen}
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
