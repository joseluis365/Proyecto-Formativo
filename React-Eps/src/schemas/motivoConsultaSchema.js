import { z } from "zod";

export const motivoConsultaSchema = z.object({
    motivo: z.string()
        .min(1, "El motivo de consulta es obligatorio.")
        .max(100, "Máximo 100 caracteres.")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo debe contener letras y espacios."),
});
