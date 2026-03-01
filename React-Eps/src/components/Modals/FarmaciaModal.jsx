import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formFarmacia } from "@/data/BaseTablesForms";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function FarmaciaModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({
        nit: "",
        nombre: "",
        direccion: "",
        telefono: "",
        email: "",
        nombre_contacto: "",
        horario_apertura: "",
        horario_cierre: "",
        abierto_24h: false,
        id_estado: 1
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                nit: editData.nit || "",
                nombre: editData.nombre || "",
                direccion: editData.direccion || "",
                telefono: editData.telefono || "",
                email: editData.email || "",
                nombre_contacto: editData.nombre_contacto || "",
                horario_apertura: editData.horario_apertura ? editData.horario_apertura.substring(0, 5) : "",
                horario_cierre: editData.horario_cierre ? editData.horario_cierre.substring(0, 5) : "",
                abierto_24h: !!editData.abierto_24h,
                id_estado: editData.id_estado || 1
            });
        } else {
            setFormData({
                nit: "",
                nombre: "",
                direccion: "",
                telefono: "",
                email: "",
                nombre_contacto: "",
                horario_apertura: "",
                horario_cierre: "",
                abierto_24h: false,
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

    const customRenderers = {
        abierto_24h: (field, value, error) => (
            <div className="flex items-center gap-3 py-2 pt-6">
                <input
                    type="checkbox"
                    id="abierto_24h"
                    name="abierto_24h"
                    checked={!!value}
                    onChange={(e) => handleChange("abierto_24h", e.target.checked)}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <label htmlFor="abierto_24h" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    {field.label}
                </label>
            </div>
        )
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const payload = {
            ...formData,
            nit_empresa: user.nit,
            abierto_24h: formData.abierto_24h ? 1 : 0
        };

        try {
            if (editData) {
                await api.put(`/farmacias/${editData.nit}`, payload);
                Swal.fire("Éxito", "Farmacia actualizada correctamente", "success");
            } else {
                await api.post("/farmacias", payload);
                Swal.fire("Éxito", "Farmacia creada correctamente", "success");
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
                title={editData ? "Editar Farmacia" : "Nueva Farmacia"}
                icon="local_pharmacy"
                onClose={onClose}
            />
            <div className="p-6 overflow-y-auto max-h-[70vh]">
                <FormWithIcons
                    config={formFarmacia}
                    values={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    errors={errors}
                    customRenderers={customRenderers}
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
