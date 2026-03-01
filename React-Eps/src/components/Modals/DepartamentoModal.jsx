import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formDepartamento } from "@/data/BaseTablesForms";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function DepartamentoModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({
        codigo_DANE: "",
        nombre: "",
        id_estado: 1
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                codigo_DANE: editData.codigo_DANE || "",
                nombre: editData.nombre || "",
                id_estado: editData.id_estado || 1
            });
        } else {
            setFormData({
                codigo_DANE: "",
                nombre: "",
                id_estado: 1
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
                await api.put(`/departamentos/${editData.codigo_DANE}`, formData);
                Swal.fire("Éxito", "Departamento actualizado correctamente", "success");
            } else {
                await api.post("/departamentos", formData);
                Swal.fire("Éxito", "Departamento creado correctamente", "success");
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
                title={editData ? "Editar Departamento" : "Nuevo Departamento"}
                icon="map"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formDepartamento}
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
