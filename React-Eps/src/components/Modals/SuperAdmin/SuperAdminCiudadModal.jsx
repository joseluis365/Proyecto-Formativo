import { useState, useEffect, useMemo } from "react";
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
import MuiIcon from "../../UI/MuiIcon";
import SearchableSelect from "../../UI/SearchableSelect";

export default function SuperAdminCiudadModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;
    const [departamentos, setDepartamentos] = useState([]);
    const [loadingDeps, setLoadingDeps] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        setValue,
        watch,
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

    const selectedDeptoId = watch("id_departamento");

    useEffect(() => {
        if (isOpen) {
            fetchDepartamentos();
        }
    }, [isOpen]);

    // Transformar departamentos para SearchableSelect
    const deptoOptions = useMemo(() => {
        return departamentos.map(dep => ({
            value: String(dep.codigo_DANE),
            label: dep.nombre
        }));
    }, [departamentos]);

    // Sincronizar el valor del select cuando los departamentos terminan de cargar
    useEffect(() => {
        if (isEdit && departamentos.length > 0 && editData) {
            setValue("id_departamento", String(editData.id_departamento));
        }
    }, [departamentos, isEdit, editData, setValue]);

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                reset({
                    codigo_postal: editData.codigo_postal || "",
                    nombre: editData.nombre || "",
                    id_departamento: String(editData.id_departamento) || "",
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
            const data = response.data || response || [];
            setDepartamentos(data);
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
                    <SearchableSelect
                        options={deptoOptions}
                        value={selectedDeptoId}
                        onChange={(val) => setValue(field.name, val, { shouldValidate: true })}
                        placeholder="Seleccione un departamento"
                        loading={loadingDeps}
                        error={!!error}
                        required={field.required}
                    />
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
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
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
