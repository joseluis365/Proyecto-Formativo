import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import IconInput from "@/components/UI/IconInput";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function TipoCitaModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [tipo, setTipo] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setTipo(editData.tipo);
        } else {
            setTipo("");
        }
        setErrors({});
    }, [editData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/tipos-cita/${editData.id_tipo_cita}`, { tipo });
                Swal.fire("Éxito", "Tipo de cita actualizado correctamente", "success");
            } else {
                await api.post("/tipos-cita", { tipo });
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <IconInput
                    label="Nombre del Tipo"
                    icon="text_fields"
                    placeholder="Ej: General, Especialista..."
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    error={errors.tipo}
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
