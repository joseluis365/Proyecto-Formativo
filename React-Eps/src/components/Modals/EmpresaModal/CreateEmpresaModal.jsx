import React, { useState, useEffect } from "react";
import superAdminApi from "../../../Api/superadminAxios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import FormWithIcons from "../../UI/FormWithIcons";
import { createEmpresaFormConfig } from "../../../EmpresaFormConfig";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { empresaSchema } from "../../../schemas/empresaSchema";


export default function CreateEmpresaModal({
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(empresaSchema),
        defaultValues: initialEmpresa,
        mode: "onChange",
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
    });

    const selectedDepto = watch("id_departamento");

    useEffect(() => {
        superAdminApi.get('/departamentos')
            .then(res => setDepartamentos(res.data))
            .catch(err => console.error("Error fetching departamentos", err));
    }, []);

    // Efecto para cargar ciudades de la misma manera que Pago.jsx
    useEffect(() => {
        if (selectedDepto) {
            setCiudades([]);
            setValue("id_ciudad", "");
            superAdminApi.get(`/ciudades/${selectedDepto}`)
                .then(res => setCiudades(res.data))
                .catch(console.error);
        } else {
            setCiudades([]);
            setValue("id_ciudad", "");
        }
    }, [selectedDepto, setValue]);

    const handleCreate = async (data) => {
        try {
            setSaving(true);
            const payload = { ...data, id_estado: 3 }; // asegurar id_estado
            await superAdminApi.post(`/superadmin/empresa`, payload);

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
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((key) => {
                    setError(key, {
                        type: "server",
                        message: backendErrors[key][0],
                    });
                });
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
        id_departamento: (field, error) => (
            <div key="location-group-depto" className="space-y-1 pb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="id_departamento">{field.label}</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">{field.icon}</span>
                    <select
                        {...register("id_departamento")}
                        className={`border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        id="id_departamento"
                    >
                        <option value="">Seleccionar Departamento</option>
                        {departamentos.map(d => (
                            <option key={d.codigo_DANE} value={d.codigo_DANE}>{d.nombre}</option>
                        ))}
                    </select>
                </div>
                {error && <span className="text-red-500 text-xs">{error.message}</span>}
            </div>
        ),
        id_ciudad: (field, error) => (
            <div key="location-group-ciudad" className="space-y-1 pb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="id_ciudad">{field.label}</label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">{field.icon}</span>
                    <select
                        {...register("id_ciudad")}
                        id="id_ciudad"
                        className={`border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-gray-700"} bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                        disabled={!selectedDepto}
                    >
                        <option value="">Seleccionar Ciudad</option>
                        {ciudades.map(c => (
                            <option key={c.codigo_postal} value={c.codigo_postal}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
                {error && <span className="text-red-500 text-xs">{error.message}</span>}
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
                        customRenderers={customRenderers}
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
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
