import { useState, useEffect } from "react";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formCiudad } from "@/data/BaseTablesForms";
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

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const customRenderers = {
        id_departamento: (field, value, error) => (
            <div className="flex flex-col gap-1.5 pb-3 w-full">
                <label className="text-[#0d121b] dark:text-white text-sm font-semibold leading-normal">
                    {field.label}
                </label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] text-xl">
                        {field.icon}
                    </span>
                    <select
                        name={field.name}
                        value={value ?? ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                        disabled={loadingDeps}
                        className={`form-input flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border ${error ? "border-red-500" : "border-[#cfd7e7] dark:border-white/30"
                            } bg-white dark:bg-gray-800/50 h-12 pl-12 pr-10 appearance-none text-base font-normal`}
                    >
                        <option value="">Seleccione un departamento</option>
                        {departamentos.map(dep => (
                            <option key={dep.codigo_DANE} value={dep.codigo_DANE}>
                                {dep.nombre}
                            </option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4c669a]">
                        expand_more
                    </span>
                </div>
                {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
        )
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
            <div className="p-6">
                <FormWithIcons
                    config={formCiudad}
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
