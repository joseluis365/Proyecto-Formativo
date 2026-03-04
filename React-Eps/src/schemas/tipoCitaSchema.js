import { z } from "zod";

export const tipoCitaSchema = z.object({
    tipo: z.string()
        .min(1, "El tipo de cita es indispensable")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
});
