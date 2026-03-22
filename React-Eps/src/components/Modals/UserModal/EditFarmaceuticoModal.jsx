import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getEditUserSections } from "../../../UserFormConfig";
import { updateFarmaceuticoSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "../../../utils/formHandlers";
import Swal from 'sweetalert2';
import BlueButton from "../../UI/BlueButton";
import MotionSpinner from "../../UI/Spinner";
import useFarmaciasSelect from "../../../hooks/useFarmaciasSelect";
import useTipoDocumentos from "@/hooks/useTipoDocumentos";

export default function EditFarmaceuticoModal({
    onClose,
    userId,
    onSuccess,
}) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { farmacias, loading: loadingFarmacias } = useFarmaciasSelect();
    const { tipoDocumentos, loading: loadingTipoDocumentos } = useTipoDocumentos();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(updateFarmaceuticoSchema),
        mode: "onChange",
        reValidateMode: "onChange"
    });

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await api.get(`/usuario/${userId}`);

                reset({
                    ...userData,
                    fecha_nacimiento: userData.fecha_nacimiento ? userData.fecha_nacimiento.substring(0, 10) : "",
                    segundo_nombre: userData.segundo_nombre || "",
                    segundo_apellido: userData.segundo_apellido || "",
                });
            } catch (error) {
                console.error("Error al cargar farmacéutico:", error);
                onClose();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, reset, onClose]);

    const onSubmit = async (data) => {
        try {
            await api.put(`/usuario/${userId}`, data);

            Swal.fire({
                icon: 'success',
                title: 'Farmacéutico Actualizado',
                text: 'La información del profesional ha sido actualizada correctamente.',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            }).then(() => {
                onSuccess?.();
                onClose();
            });

        } catch (error) {
            handleApiErrors(error, setError);
        } finally {
            setSaving(false);
        }
    };

    const sections = getEditUserSections(6, { id_farmacia: farmacias, id_tipo_documento: tipoDocumentos });

    return (
        <BaseModal>
            <ModalHeader icon="edit_note" title="EDITAR FARMACÉUTICO" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <MotionSpinner />
                        <p className="text-gray-500 text-sm animate-pulse">Obteniendo perfil del profesional...</p>
                    </div>
                ) : (
                    <FormWithIcons
                        sections={sections}
                        register={register}
                        errors={errors}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                    >
                        <div className="flex mt-8 justify-end">
                            <div className="w-full md:w-56">
                                <BlueButton
                                    text="Actualizar Cambios"
                                    icon="published_with_changes"
                                    type="submit"
                                    loading={saving || loadingFarmacias || loadingTipoDocumentos}
                                />
                            </div>
                        </div>
                    </FormWithIcons>
                )}
            </div>
        </BaseModal>
    );
}
