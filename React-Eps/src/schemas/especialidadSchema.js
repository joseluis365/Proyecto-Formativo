import { z } from "zod";

export const especialidadSchema = z.object({
    especialidad: z.string()
        .min(1, "La especialidad es requerida")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
});
