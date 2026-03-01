import React, { useState, useEffect } from "react";
import superAdminApi from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import FormWithIcons from "../../UI/FormWithIcons";
import { createEmpresaFormConfig } from "../../../EmpresaFormConfig";
import Swal from "sweetalert2";


export default function CreateEmpresaModal({
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);

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
        admin_primer_nombre: "",
        admin_segundo_nombre: "",
        admin_primer_apellido: "",
        admin_segundo_apellido: "",
        admin_documento: "",
        admin_email: "",
        admin_telefono: "",
        admin_direccion: "",
        admin_password: "",
        id_departamento: "",
        id_ciudad: "",
    };

    const [formData, setFormData] = useState(initialEmpresa);

    useEffect(() => {
        superAdminApi.get('/departamentos').then(res => {
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
        handleChange('id_departamento', deptoId);
        setCiudades([]);
        setFormData(prev => ({ ...prev, id_ciudad: "" }));

        if (deptoId) {
            try {
                const res = await superAdminApi.get(`/ciudades/${deptoId}`);
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
            const payload = { ...formData };
            await superAdminApi.post(`/empresa`, payload);

            Swal.fire({
                icon: 'success',
                title: 'Empresa Creada',
                text: 'La empresa y su administrador han sido registrados correctamente.',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                onSuccess?.();
                onClose();
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error inesperado al crear la empresa.',
                });
            }
        }
        finally {
            setSaving(false);
        }
    };

    const fields = createEmpresaFormConfig[1];
    const camposEmpresa = fields.filter(f => !f.name.startsWith('admin_'));
    const camposAdmin = fields.filter(f => f.name.startsWith('admin_'));

    const formSections = [
        { title: "Información de la Empresa", fields: camposEmpresa },
        { title: "Información del Admin del Sistema", fields: camposAdmin }
    ];

    const customRenderers = {
        id_departamento: (field, value, error) => (
            <div key="location-group-depto" className="space-y-1 pb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="id_departamento">{field.label}</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">{field.icon}</span>
                    <select
                        className={`border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        name="id_departamento"
                        id="id_departamento"
                        value={value || ""}
                        onChange={handleDepartamentoChange}
                    >
                        <option value="">Seleccionar Departamento</option>
                        {departamentos.map(d => (
                            <option key={d.codigo_DANE} value={d.codigo_DANE}>{d.nombre}</option>
                        ))}
                    </select>
                </div>
                {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
        ),
        id_ciudad: (field, value, error) => (
            <div key="location-group-ciudad" className="space-y-1 pb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="id_ciudad">{field.label}</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">{field.icon}</span>
                    <select
                        id="id_ciudad"
                        name="id_ciudad"
                        className={`border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        value={value || ""}
                        onChange={(e) => handleChange("id_ciudad", e.target.value)}
                        disabled={!formData.id_departamento}
                    >
                        <option value="">Seleccionar Ciudad</option>
                        {ciudades.map(c => (
                            <option key={c.codigo_postal} value={c.codigo_postal}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
                {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
        )
    };

    return (
        <BaseModal>
            <ModalHeader icon="business" title="CREAR EMPRESA" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto dark:scheme-dark">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <FormWithIcons
                        sections={formSections}
                        values={formData}
                        onChange={handleChange}
                        customRenderers={customRenderers}
                        errors={errors}
                        onSubmit={handleCreate}
                    >
                        <div className="flex mt-10 justify-end gap-10">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">save</span>
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </FormWithIcons>
                )}
            </div>
            <ModalFooter />
        </BaseModal>
    );
}
