import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import FormWithIcons from "@/components/UI/FormWithIcons";
import { citaSchema } from "@/schemas/citaSchema";
import useEspecialidades from "@/hooks/useEspecialidades";
import useTiposCita from "@/hooks/useTiposCita";
import useUsuariosPorRol from "@/hooks/useUsuariosPorRol";
import useCitas from "@/hooks/useCitas";
import useMedicosDisponibles from "@/hooks/useMedicosDisponibles";

export default function CreateCitaModal({ isOpen, onClose, onSuccess, preselectedData = null }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue
    } = useForm({
        resolver: zodResolver(citaSchema),
        defaultValues: {
            doc_paciente: "",
            doc_medico: "",
            id_tipo_cita: "",
            fecha: new Date().toISOString().split('T')[0],
            hora_inicio: "",
            motivo: ""
        }
    });

    const watchedDate = watch("fecha");
    const watchedTime = watch("hora_inicio");

    // Hooks de datos para los selects
    const { tiposCita } = useTiposCita();
    const { usuarios: pacientes } = useUsuariosPorRol(4); // Rol Paciente según RolSeeder (ID 4)
    const { medicos: medicosDisponibles, loading: loadingMedicos } = useMedicosDisponibles(watchedDate, watchedTime);
    const { createCita } = useCitas(watchedDate);

    // Limpiar o pre-cargar formulario al cerrar/abrir
    useEffect(() => {
        if (isOpen) {
            if (preselectedData) {
                reset({
                    doc_paciente: "",
                    doc_medico: preselectedData.doctor?.documento || "",
                    id_tipo_cita: "",
                    fecha: preselectedData.fecha || new Date().toISOString().split('T')[0],
                    hora_inicio: preselectedData.time || "",
                    motivo: ""
                });
            } else {
                reset({
                    doc_paciente: "",
                    doc_medico: "",
                    id_tipo_cita: "",
                    fecha: new Date().toISOString().split('T')[0],
                    hora_inicio: "",
                    motivo: ""
                });
            }
        }
    }, [isOpen, preselectedData, reset]);

    // Si cambia fecha o hora y el médico seleccionado ya no está disponible, lo limpiamos
    useEffect(() => {
        if (watchedDate && watchedTime && medicosDisponibles.length > 0) {
            const currentDoctor = watch("doc_medico");
            if (currentDoctor && !medicosDisponibles.find(m => m.value === currentDoctor)) {
                setValue("doc_medico", "");
            }
        }
    }, [watchedDate, watchedTime, medicosDisponibles, setValue, watch]);

    // Generación dinámica de opciones de horario (Bloqueo de horas pasadas)
    const timeOptions = useMemo(() => {
        const options = [];
        const now = dayjs();
        const isToday = dayjs(watchedDate).isSame(dayjs(), 'day');

        for (let hour = 8; hour <= 17; hour++) {
            [0, 30].forEach(min => {
                // Si es el último slot (17:30), lo saltamos porque la última cita debe ser 17:00-17:30
                if (hour === 17 && min === 30) return;

                const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                const option = { value: timeStr, label: timeStr, disabled: false };

                if (isToday) {
                    const slotTime = dayjs(`${watchedDate} ${timeStr}`, "YYYY-MM-DD HH:mm");
                    if (slotTime.isBefore(now.add(5, 'minute'))) {
                        option.disabled = true;
                    }
                }
                options.push(option);
            });
        }
        return options;
    }, [watchedDate]);

    // Restricción de fecha mínima y máxima (Hoy y 2 meses adelante)
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const maxDate = useMemo(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 2);
        return d.toISOString().split('T')[0];
    }, []);

    const formConfig = useMemo(() => ({
        fields: [
            {
                name: "fecha",
                label: "1. Seleccione Fecha",
                icon: "calendar_today",
                type: "date",
                required: true,
                min: today,
                max: maxDate, // Restricción de 2 meses
            },
            {
                name: "hora_inicio",
                label: "2. Seleccione Hora",
                icon: "schedule",
                type: "select",
                options: timeOptions,
                placeholder: "Seleccione un horario",
                required: true,
            },
            {
                name: "doc_medico",
                label: "3. Médico Disponible",
                icon: "stethoscope",
                type: "select",
                options: medicosDisponibles,
                placeholder: !watchedDate || !watchedTime
                    ? "Primero seleccione fecha y hora"
                    : (loadingMedicos ? "Cargando médicos..." : "Seleccione un médico"),
                disabled: !watchedDate || !watchedTime || loadingMedicos,
            },
            {
                name: "doc_paciente",
                label: "4. Paciente",
                icon: "person",
                type: "select",
                options: pacientes,
                placeholder: "Seleccione un paciente",
            },
            {
                name: "id_tipo_cita",
                label: "5. Tipo de Cita",
                icon: "event",
                type: "select",
                options: tiposCita,
                placeholder: "Seleccione tipo de cita",
            },
            {
                name: "motivo",
                label: "6. Observaciones / Motivo",
                icon: "description",
                type: "textarea",
                placeholder: "Escriba el motivo de la cita...",
                rows: 4,
                maxLength: 500,
            },
        ]
    }), [pacientes, medicosDisponibles, tiposCita, timeOptions, watchedDate, watchedTime, loadingMedicos, today, maxDate]);

    const handleFormSubmit = async (data) => {
        const success = await createCita(data);
        if (success) {
            onSuccess?.();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal>
            <div className="flex flex-col max-h-[90vh]">
                <ModalHeader
                    title="Agendar Nueva Cita"
                    icon="add_task"
                    onClose={onClose}
                />
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <FormWithIcons
                        config={formConfig}
                        register={register}
                        handleSubmit={handleSubmit}
                        onSubmit={handleFormSubmit}
                        errors={errors}
                    >
                        <div className="flex justify-end pt-4 sticky bottom-0 bg-white dark:bg-gray-900 py-2">
                            <BlueButton
                                text="Agendar Cita"
                                icon="save"
                                type="submit"
                                loading={isSubmitting}
                            />
                        </div>
                    </FormWithIcons>
                </div>
            </div>
        </BaseModal>
    );
}
