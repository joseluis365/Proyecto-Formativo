import { z } from "zod";

export const estadoSchema = z.object({
    nombre_estado: z.string()
        .min(1, "El nombre del estado es indispensable")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
});
