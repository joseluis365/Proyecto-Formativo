import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formRol } from "@/data/BaseTablesForms";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function RolModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({
        tipo_usu: "",
        id_estado: 1
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                tipo_usu: editData.tipo_usu || "",
                id_estado: editData.id_estado || 1
            });
        } else {
            setFormData({
                tipo_usu: "",
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

        // Requisito: No permitir enviar tipo_usu = "SUPERADMIN"
        if (formData.tipo_usu.toUpperCase() === "SUPERADMIN") {
            setErrors({ tipo_usu: 'El valor "SUPERADMIN" no está permitido.' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/roles/${editData.id_rol}`, formData);
                Swal.fire("Éxito", "Rol actualizado correctamente", "success");
            } else {
                await api.post("/roles", formData);
                Swal.fire("Éxito", "Rol creado correctamente", "success");
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
                title={editData ? "Editar Rol" : "Nuevo Rol"}
                icon="group"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={formRol}
                    values={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    errors={errors}
                >
                    {editData && (
                        <div className="flex flex-col gap-1.5 pb-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Estado
                            </label>
                            <select
                                name="id_estado"
                                value={formData.id_estado}
                                onChange={(e) => handleChange("id_estado", e.target.value)}
                                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.id_estado ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                                    } rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none`}
                            >
                                <option value={1}>Activo</option>
                                <option value={2}>Inactivo</option>
                            </select>
                            {errors.id_estado && (
                                <span className="text-xs text-red-500">{errors.id_estado}</span>
                            )}
                        </div>
                    )}

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
