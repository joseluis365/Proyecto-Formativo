import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import IconInput from "@/components/UI/IconInput";
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
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
            <form onSubmit={handleSubmit} className="p-6 space-y-2 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IconInput
                        label="NIT"
                        name="nit"
                        icon="badge"
                        placeholder="Ej: 900.123.456-1"
                        value={formData.nit}
                        onChange={handleChange}
                        error={errors.nit}
                        required
                        disabled={!!editData}
                    />
                    <IconInput
                        label="Nombre de la Farmacia"
                        name="nombre"
                        icon="store"
                        placeholder="Nombre de la farmacia"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={errors.nombre}
                        required
                    />
                </div>

                <IconInput
                    label="Dirección"
                    name="direccion"
                    icon="location_on"
                    placeholder="Calle 123 # 45-67"
                    value={formData.direccion}
                    onChange={handleChange}
                    error={errors.direccion}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IconInput
                        label="Teléfono"
                        name="telefono"
                        icon="phone"
                        placeholder="300 123 4567"
                        value={formData.telefono}
                        onChange={handleChange}
                        error={errors.telefono}
                    />
                    <IconInput
                        label="Email"
                        name="email"
                        type="email"
                        icon="mail"
                        placeholder="email@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                </div>

                <IconInput
                    label="Nombre de Contacto"
                    name="nombre_contacto"
                    icon="person"
                    placeholder="Responsable de la farmacia"
                    value={formData.nombre_contacto}
                    onChange={handleChange}
                    error={errors.nombre_contacto}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IconInput
                        label="Horario Apertura"
                        name="horario_apertura"
                        type="time"
                        icon="schedule"
                        value={formData.horario_apertura}
                        onChange={handleChange}
                        error={errors.horario_apertura}
                    />
                    <IconInput
                        label="Horario Cierre"
                        name="horario_cierre"
                        type="time"
                        icon="schedule"
                        value={formData.horario_cierre}
                        onChange={handleChange}
                        error={errors.horario_cierre}
                    />
                </div>

                <div className="flex items-center gap-3 py-2">
                    <input
                        type="checkbox"
                        id="abierto_24h"
                        name="abierto_24h"
                        checked={formData.abierto_24h}
                        onChange={handleChange}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <label htmlFor="abierto_24h" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        Abierto las 24 horas
                    </label>
                </div>

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
