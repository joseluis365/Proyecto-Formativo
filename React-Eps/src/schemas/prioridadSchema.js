import { z } from "zod";

export const prioridadSchema = z.object({
    prioridad: z.string()
        .min(1, "El nombre de la prioridad es necesario")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
});
