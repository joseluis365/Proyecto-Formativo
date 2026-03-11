import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getCreateUserSections } from "../../../UserFormConfig";
import { createFarmaceuticoSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "../../../utils/formHandlers";
import Swal from 'sweetalert2';
import BlueButton from "../../UI/BlueButton";
import useFarmaciasSelect from "../../../hooks/useFarmaciasSelect";

export default function CreateFarmaceuticoModal({
    onClose,
    onSuccess,
}) {
    const [saving, setSaving] = useState(false);
    const { farmacias, loading: loadingFarmacias } = useFarmaciasSelect();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createFarmaceuticoSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            id_estado: 1,
            id_rol: 6,
            segundo_nombre: "",
            segundo_apellido: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            setSaving(true);

            // Limpieza del payload: no enviamos confirm_contrasena al backend
            const { confirm_contrasena, ...payload } = data;

            // Inyección de rol Farmacéutico (6)
            payload.id_rol = 6;

            await api.post(`/usuario`, payload);

            Swal.fire({
                icon: 'success',
                title: 'Farmacéutico Creado',
                text: 'El profesional farmacéutico ha sido registrado correctamente.',
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

    const sections = getCreateUserSections(6, { id_farmacia: farmacias });

    return (
        <BaseModal>
            <ModalHeader icon="local_pharmacy" title="CREAR FARMACÉUTICO" onClose={onClose} />
            <div className="p-6 flex-1 overflow-y-auto">
                <FormWithIcons
                    sections={sections}
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                >
                    <div className="flex mt-8 justify-end">
                        <div className="w-full md:w-48">
                            <BlueButton
                                text="Guardar"
                                icon="save"
                                type="submit"
                                loading={saving || loadingFarmacias}
                            />
                        </div>
                    </div>
                </FormWithIcons>
            </div>
        </BaseModal>
    );
}