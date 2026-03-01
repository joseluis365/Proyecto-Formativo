import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formTipoCita } from "@/data/BaseTablesForms";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function TipoCitaModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({ tipo: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({ tipo: editData.tipo || "" });
        } else {
            setFormData({ tipo: "" });
        }
        setErrors({});
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/tipos-cita/${editData.id_tipo_cita}`, formData);
                Swal.fire("Éxito", "Tipo de cita actualizado correctamente", "success");
            } else {
                await api.post("/tipos-cita", formData);
                Swal.fire("Éxito", "Tipo de cita creado correctamente", "success");
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
                title={editData ? "Editar Tipo de Cita" : "Nuevo Tipo de Cita"}
                icon="calendar_today"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formTipoCita}
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
