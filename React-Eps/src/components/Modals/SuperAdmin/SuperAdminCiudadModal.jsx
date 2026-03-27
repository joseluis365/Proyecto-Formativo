import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formCiudad } from "@/data/BaseTablesForms";
import { ciudadSchema } from "@/schemas/ciudadSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import superAdminApi from "@/Api/superadminAxios"; // USAR superAdminApi
import Swal from "sweetalert2";

export default function SuperAdminCiudadModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;
    const [departamentos, setDepartamentos] = useState([]);
    const [loadingDeps, setLoadingDeps] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(ciudadSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "firstError",
        defaultValues: {
            codigo_postal: "",
            nombre: "",
            id_departamento: "",
            id_estado: 1
        }
    });

    useEffect(() => {
        if (isOpen) {
            fetchDepartamentos();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    codigo_postal: editData.codigo_postal || "",
                    nombre: editData.nombre || "",
                    id_departamento: editData.id_departamento || "",
                    id_estado: editData.id_estado || 1
                });
            } else {
                reset({
                    codigo_postal: "",
                    nombre: "",
                    id_departamento: "",
                    id_estado: 1
                });
            }
        }
    }, [editData, isOpen, reset]);

    const fetchDepartamentos = async () => {
        setLoadingDeps(true);
        try {
            const response = await superAdminApi.get("/configuracion/departamentos"); // USAR superAdminApi
            setDepartamentos(response.data || response || []);
        } catch (error) {
            console.error("Error al cargar departamentos (SuperAdmin):", error);
        } finally {
            setLoadingDeps(false);
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (isEdit) {
                await superAdminApi.put(`/ciudades/${editData.codigo_postal}`, data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Ciudad actualizada correctamente (SuperAdmin)',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await superAdminApi.post("/ciudades", data);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Ciudad creada correctamente (SuperAdmin)',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (!handleApiErrors(error, setError)) {
                Swal.fire({
                    icon: "error",
                    title: "Error Inesperado",
                    text: "Ocurrió un error al procesar la solicitud (SuperAdmin)."
                });
            }
        }
    };

    if (!isOpen) return null;

    const config = {
        ...formCiudad,
        fields: formCiudad.fields.map(field =>
            field.name === "codigo_postal" ? { ...field, readOnly: isEdit } : field
        )
    };

    const customRenderers = {
        id_departamento: (field, error) => (
            <div key={field.name} className="flex flex-col gap-1.5 pb-3 w-full">
                <label className="text-[#0d121b] dark:text-white text-sm font-semibold leading-normal" htmlFor={field.name}>
                    {field.label}
                </label>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] text-xl">
                        {field.icon}
                    </span>
                    <select
                        {...register(field.name)}
                        id={field.name}
                        disabled={loadingDeps}
                        className={`form-input flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border ${error ? "border-red-500 bg-red-50/50" : "border-[#cfd7e7] dark:border-white/30"
                            } bg-white dark:bg-gray-800/50 h-12 pl-12 pr-10 appearance-none text-base font-normal transition-all`}
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
                {error && <span className="text-red-500 text-xs mt-1">{error.message}</span>}
            </div>
        )
    };

    return (
        <BaseModal>
            <ModalHeader
                title={isEdit ? "EDITAR CIUDAD (SUPERADMIN)" : "NUEVA CIUDAD (SUPERADMIN)"}
                icon="location_city"
                onClose={onClose}
            />
            <div className="p-6">
                <FormWithIcons
                    config={config}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={handleFormSubmit}
                    errors={errors}
                    customRenderers={customRenderers}
                    isEditing={isEdit}
                >
                    <div className="flex justify-end pt-4">
                        <BlueButton
                            text={isEdit ? "Actualizar Cambios" : "Guardar"}
                            icon={isEdit ? "published_with_changes" : "save"}
                            type="submit"
                            loading={isSubmitting}
                        />
                    </div>
                </FormWithIcons>
            </div>
        </BaseModal>
    );
}
