import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getCreateUserFormConfig } from "../../../UserFormConfig";
import { createPersonalSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "../../../utils/formHandlers";
import Swal from 'sweetalert2';
import BlueButton from "../../UI/BlueButton";
export default function CreatePersonalModal({
  onClose,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);

  // Configuración del formulario con RHF y Zod
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createPersonalSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      id_estado: 1,
      id_rol: 3,
      segundo_nombre: "",
      segundo_apellido: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      // Inyección de rol administrativo (3)
      const payload = {
        ...data,
        id_rol: 3
      };

      await api.post(`/usuario`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Usuario Creado',
        text: 'El personal administrativo ha sido registrado correctamente.',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      }).then(() => {
        onSuccess?.();
        onClose();
      });

    } catch (error) {
      // Los errores 401/403/500 son manejados por el interceptor global.
      // Aquí manejamos errores de validación 422.
      handleApiErrors(error, setError);
    } finally {
      setSaving(false);
    }
  };

  // Obtenemos la configuración de campos para el rol 3 (Personal)
  const formConfig = {
    fields: getCreateUserFormConfig(3)
  };

  return (
    <BaseModal>
      <ModalHeader icon="person_add" title="CREAR USUARIO ADMINISTRATIVO" onClose={onClose} />
      <div className="p-6 flex-1 overflow-y-auto">
        <FormWithIcons
          config={formConfig}
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
                loading={saving}
              />
            </div>
          </div>
        </FormWithIcons>
      </div>
    </BaseModal>
  );
}
