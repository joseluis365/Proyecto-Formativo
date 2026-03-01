import React, { useState, useEffect } from "react";
import api from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import Form from "../../UI/Form";
import { createEmpresaFormConfig } from "../../../EmpresaFormConfig";


export default function CreateEmpresaModal({
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false); // Used for initial data if needed
    const [errors, setErrors] = useState({});

    // Location State
    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState("");

    const initialEmpresa = {
        nit: "",
        nombre: "",
        email_contacto: "",
        telefono: "",
        direccion: "",
        documento_representante: "",
        nombre_representante: "",
        telefono_representante: "",
        email_representante: "",
        id_estado: 3,
        admin_nombre: "",
        admin_apellido: "",
        admin_documento: "",
        admin_email: "",
        admin_telefono: "",
        admin_direccion: "",
        admin_password: "",
        id_ciudad: "", // Init empty
    };

    const [formData, setFormData] = useState(initialEmpresa);

    // Fetch Departments on Mount
    useEffect(() => {
        api.get('/departamentos').then(res => {
            setDepartamentos(res.data);
        }).catch(err => console.error("Error fetching departamentos", err));
    }, []);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErr = { ...prev };
                delete newErr[name];
                return newErr;
            });
        }
    };

    const handleDepartamentoChange = async (e) => {
        const deptoId = e.target.value;
        setSelectedDepartamento(deptoId);
        setCiudades([]);
        setFormData(prev => ({ ...prev, id_ciudad: "" })); // Reset city

        if (deptoId) {
            try {
                const res = await api.get(`/ciudades/${deptoId}`);
                setCiudades(res.data);
            } catch (error) {
                console.error("Error fetching cities", error);
            }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setErrors({});
            const payload = {
                ...formData,
            };
            await api.post(`/empresa`, payload);
            import("sweetalert2").then((Swal) => {
                Swal.default.fire({
                    icon: 'success',
                    title: 'Empresa Creada',
                    text: 'La empresa y su administrador han sido registrados correctamente.',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    onSuccess?.();
                    onClose();
                });
            });

        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.response.data.errors).map(
                            ([key, value]) => [key, value[0]]
                        )
                    )
                );
            } else {
                import("sweetalert2").then((Swal) => {
                    Swal.default.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error inesperado al crear la empresa.',
                    });
                });
            }
        }
        finally {
            setSaving(false);
        }
    };

    // Prepare fields
    const fields = createEmpresaFormConfig[1];

    return (
        <BaseModal>
            <ModalHeader icon="business" title="CREAR EMPRESA" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field) => {
                                // Special handling for 'ciudad' field -> Render Depto + Ciudad
                                if (field.name === 'ciudad') {
                                    return (
                                        <React.Fragment key="location-group">
                                            {/* Departamento Select */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Departamento</label>
                                                <select
                                                    className="border rounded px-3 py-2 w-full border-gray-300"
                                                    value={selectedDepartamento}
                                                    onChange={handleDepartamentoChange}
                                                >
                                                    <option value="">Seleccionar Departamento</option>
                                                    {departamentos.map(d => (
                                                        <option key={d.codigo_DANE} value={d.codigo_DANE}>{d.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Ciudad Select */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700">Ciudad</label>
                                                <select
                                                    name="id_ciudad"
                                                    className={`border rounded px-3 py-2 w-full ${errors.id_ciudad ? "border-red-500" : "border-gray-300"}`}
                                                    value={formData.id_ciudad}
                                                    onChange={(e) => handleChange('id_ciudad', e.target.value)}
                                                    disabled={!selectedDepartamento}
                                                >
                                                    <option value="">Seleccionar Ciudad</option>
                                                    {ciudades.map(c => (
                                                        <option key={c.codigo_postal} value={c.codigo_postal}>{c.nombre}</option>
                                                    ))}
                                                </select>
                                                {errors.id_ciudad && (
                                                    <p className="text-red-500 text-sm transition-all">{errors.id_ciudad}</p>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    );
                                }

                                const value = formData[field.name] ?? "";

                                return (
                                    <div key={field.name} className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700" htmlFor={field.name}>
                                            {field.label}
                                        </label>
                                        <input
                                            id={field.name}
                                            name={field.name}
                                            type={field.type}
                                            value={value}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            placeholder={field.label}
                                            className={`border border-gray-300 rounded px-3 py-2 w-full ${errors[field.name] ? "border-red-500" : ""}`}
                                        />
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-sm transition-all">{errors[field.name]}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex mt-10 justify-end gap-10">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">save</span>
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <ModalFooter />
        </BaseModal>
    );
}
