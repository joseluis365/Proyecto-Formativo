import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/Api/axios";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { getCreateUserSections } from "@/UserFormConfig";
import { createMedicoSchema } from "@/schemas/usuarioSchemas";
import { handleApiErrors } from "@/utils/formHandlers";
import Swal from 'sweetalert2';
import BlueButton from "@/components/UI/BlueButton";
import useEspecialidades from "@/hooks/useEspecialidades";
import useTipoDocumentos from "@/hooks/useTipoDocumentos";
import useConsultorios from "@/hooks/useConsultorios";
import { ROLES } from "@/constants/roles";

export default function CreateMedicoModal({
  onClose,
  onSuccess,
}) {
  const [saving, setSaving] = useState(false);
  const { specialties, loading: loadingSpecialties } = useEspecialidades();
  const { tipoDocumentos, loading: loadingTipoDocumentos } = useTipoDocumentos();
  const { consultorios, loading: loadingConsultorios } = useConsultorios();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createMedicoSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      id_estado: 1,
      id_rol: ROLES.MEDICO,
      segundo_nombre: "",
      segundo_apellido: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Inyección de rol Médico (4)
      const payload = {
        ...data,
        id_rol: ROLES.MEDICO
      };

      await api.post(`/usuario`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Médico Creado',
        text: 'El médico ha sido registrado correctamente.',
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

  const sections = getCreateUserSections(ROLES.MEDICO, { 
    id_especialidad: specialties, 
    id_tipo_documento: tipoDocumentos,
    id_consultorio: consultorios
  });

  return (
    <BaseModal>
      <ModalHeader icon="medical_services" title="CREAR MÉDICO" onClose={onClose} />
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
                loading={saving || loadingSpecialties || loadingTipoDocumentos}
              />
            </div>
          </div>
        </FormWithIcons>
      </div>
    </BaseModal>
  );
}
