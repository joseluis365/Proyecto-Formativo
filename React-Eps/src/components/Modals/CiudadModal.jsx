import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import IconInput from "@/components/UI/IconInput";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function CiudadModal({ isOpen, onClose, onSuccess, editData = null }) {
    const [formData, setFormData] = useState({
        codigo_postal: "",
        nombre: "",
        id_departamento: "",
        id_estado: 1
    });
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDeps, setLoadingDeps] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchDepartamentos();
        }
    }, [isOpen]);

    useEffect(() => {
        if (editData) {
            setFormData({
                codigo_postal: editData.codigo_postal || "",
                nombre: editData.nombre || "",
                id_departamento: editData.id_departamento || "",
                id_estado: editData.id_estado || 1
            });
        } else {
            setFormData({
                codigo_postal: "",
                nombre: "",
                id_departamento: "",
                id_estado: 1
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const fetchDepartamentos = async () => {
        setLoadingDeps(true);
        try {
            const response = await api.get("/departamentos");
            setDepartamentos(response.data);
        } catch (error) {
            console.error("Error al cargar departamentos:", error);
        } finally {
            setLoadingDeps(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                await api.put(`/ciudades/${editData.codigo_postal}`, formData);
                Swal.fire("Éxito", "Ciudad actualizada correctamente", "success");
            } else {
                await api.post("/ciudades", formData);
                Swal.fire("Éxito", "Ciudad creada correctamente", "success");
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
                title={editData ? "Editar Ciudad" : "Nueva Ciudad"}
                icon="location_city"
                onClose={onClose}
            />
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <IconInput
                    label="Código Postal"
                    name="codigo_postal"
                    icon="pin"
                    placeholder="Ej: 050001"
                    value={formData.codigo_postal}
                    onChange={handleChange}
                    error={errors.codigo_postal}
                    required
                    disabled={!!editData}
                />

                <IconInput
                    label="Nombre de la Ciudad"
                    name="nombre"
                    icon="description"
                    placeholder="Ej: Medellín"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={errors.nombre}
                    required
                />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">map</span>
                        Departamento
                    </label>
                    <div className="relative">
                        <select
                            name="id_departamento"
                            value={formData.id_departamento}
                            onChange={handleChange}
                            required
                            disabled={loadingDeps}
                            className={`w-full p-2.5 bg-gray-50 dark:bg-gray-800 border ${errors.id_departamento ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                                } rounded-lg text-sm focus:ring-primary focus:border-primary outline-none transition-all appearance-none`}
                        >
                            <option value="">Seleccione un departamento</option>
                            {departamentos.map(dep => (
                                <option key={dep.codigo_DANE} value={dep.codigo_DANE}>
                                    {dep.nombre}
                                </option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            expand_more
                        </span>
                    </div>
                    {errors.id_departamento && <p className="text-xs text-red-500 mt-1">{errors.id_departamento}</p>}
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
