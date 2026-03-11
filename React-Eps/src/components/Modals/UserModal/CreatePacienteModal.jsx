import { useState } from "react";
import api from "../../../Api/axios";
import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import FormWithIcons from "../../UI/FormWithIcons";
import { getCreateUserSections } from "../../../UserFormConfig";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPacienteSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "../../../utils/formHandlers";
import BlueButton from "../../UI/BlueButton";

export default function CreatePacienteModal({
  onClose,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createPacienteSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      id_estado: 1,
      id_rol: 5,
      segundo_nombre: "",
      segundo_apellido: "",
      sexo: "",
      grupo_sanguineo: "",
      contrasena: "",
      confirm_contrasena: ""
    },
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const { confirm_contrasena, ...payload } = data;
      payload.id_rol = 5;

      await api.post(`/usuario`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Paciente Creado',
        text: 'El paciente ha sido creado correctamente.',
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

  const sections = getCreateUserSections(5);

  return (
    <BaseModal>
      <ModalHeader icon="person_add" title="CREAR PACIENTE" onClose={onClose} />
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
                loading={saving}
              />
            </div>
          </div>
        </FormWithIcons>
      </div>
    </BaseModal>
  );
}

