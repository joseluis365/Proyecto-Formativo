import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import IconInput from "@/components/UI/IconInput";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function CategoriaMedicamentoModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [categoria, setCategoria] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setCategoria(editData.categoria);
        } else {
            setCategoria("");
        }
        setErrors({});
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/categorias-medicamento/${editData.id_categoria}`, { categoria });
                Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
            } else {
                await api.post("/categorias-medicamento", { categoria });
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
                title={editData ? "Editar Categoría de Medicamento" : "Nueva Categoría de Medicamento"}
                icon="medication"
                onClose={onClose}
            />
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <IconInput
                    label="Nombre de la Categoría"
                    icon="text_fields"
                    placeholder="Ej: Analgésicos, Antibióticos..."
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    error={errors.categoria}
                    required
                />
                <div className="flex justify-end pt-4">
                    <BlueButton
                        text={editData ? "Actualizar" : "Crear"}
                        icon="save"
                        type="submit"
                        loading={loading}
                    />
                </div>
            </form>
        </BaseModal>
    );
}
