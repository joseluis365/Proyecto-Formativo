import { z } from "zod";
import dayjs from "dayjs";

export const citaSchema = z.object({
    doc_paciente: z.string().min(1, "El paciente es requerido"),
    doc_medico: z.string().min(1, "El médico es requerido"),
    tipo_cita_id: z.string().min(1, "El tipo de cita es requerido").or(z.number()),
    fecha: z.string()
        .min(1, "La fecha es requerida")
        .refine((val) => {
            const date = dayjs(val);
            const today = dayjs().startOf('day');
            return date.isSame(today) || date.isAfter(today);
        }, "No se pueden agendar citas en fechas pasadas"),
    hora_inicio: z.string().min(1, "La hora es requerida"),
    motivo: z.string().min(5, "El motivo debe tener al menos 5 caracteres").max(255, "Máximo 255 caracteres"),
});
