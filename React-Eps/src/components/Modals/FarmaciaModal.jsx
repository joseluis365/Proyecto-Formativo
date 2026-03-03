import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { formFarmacia } from "@/data/BaseTablesForms";
import { farmaciaSchema } from "@/schemas/farmaciaSchema";
import { handleApiErrors } from "@/utils/formHandlers";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function FarmaciaModal({ isOpen, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(farmaciaSchema),
        mode: "onChange",
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
        defaultValues: {
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
        }
    });

    // Patrón de edición: reset() al cargar datos o abrir el modal
    useEffect(() => {
        if (isOpen) {
            if (editData) {
                // Sanitizar formatos de hora HH:mm:ss a HH:mm
                const sanitizeTime = (time) => time ? time.substring(0, 5) : "";

                reset({
                    nit: editData.nit || "",
                    nombre: editData.nombre || "",
                    direccion: editData.direccion || "",
                    telefono: editData.telefono || "",
                    email: editData.email || "",
                    nombre_contacto: editData.nombre_contacto || "",
                    horario_apertura: sanitizeTime(editData.horario_apertura),
                    horario_cierre: sanitizeTime(editData.horario_cierre),
                    abierto_24h: !!editData.abierto_24h,
                    id_estado: editData.id_estado || 1
                });
            } else {
                reset({
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
        }
    }, [editData, isOpen, reset]);

    const handleFormSubmit = async (data) => {
        // Recuperar NIT de la empresa del usuario autenticado
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        // Payload final con transformaciones requeridas
        const payload = {
            ...data,
            nit_empresa: user.nit, // Inyección dinámica exigida
            abierto_24h: data.abierto_24h ? 1 : 0 // Transformación boolean -> 1/0
        };

        try {
            if (isEdit) {
                // El endpoint utiliza el NIT de la farmacia como identificador
                await api.put(`/farmacias/${editData.nit}`, payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Farmacia actualizada correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                await api.post("/farmacias", payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Farmacia creada correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            // Mapeo automático de errores 422
            if (!handleApiErrors(error, setError)) {
                Swal.fire({
                    icon: "error",
                    title: "Error Inesperado",
                    text: "Ocurrió un error al procesar la solicitud."
                });
            }
        }
    };

    if (!isOpen) return null;

    // Configuración dinámica para proteger el NIT en modo edición
    const config = {
        ...formFarmacia,
        fields: formFarmacia.fields.map(field =>
            field.name === "nit" ? { ...field, readOnly: isEdit } : field
        )
    };

    // Renderizador personalizado para Checkbox integrado con RHF
    const customRenderers = {
        abierto_24h: (field, error) => (
            <div key={field.name} className="flex items-center gap-3 py-2 pt-6">
                <input
                    {...register(field.name)}
                    type="checkbox"
                    id={field.name}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary transition-all cursor-pointer"
                />
                <label htmlFor={field.name} className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                    {field.label}
                </label>
                {error && <span className="text-red-500 text-xs ml-2">{error.message}</span>}
            </div>
        )
    };

    return (
        <BaseModal>
            <ModalHeader
                title={isEdit ? "EDITAR FARMACIA" : "NUEVA FARMACIA"}
                icon="local_pharmacy"
                onClose={onClose}
            />
            <div className="p-6 overflow-y-auto max-h-[70vh]">
                <FormWithIcons
                    config={config}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={handleFormSubmit}
                    errors={errors}
                    customRenderers={customRenderers}
                >
                    <div className="flex justify-end pt-4">
                        <BlueButton
                            text={isEdit ? "Actualizar" : "Guardar"}
                            icon="save"
                            type="submit"
                            loading={isSubmitting}
                        />
                    </div>
                </FormWithIcons>
            </div>
        </BaseModal>
    );
}
