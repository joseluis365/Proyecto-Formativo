import { z } from "zod";

export const categoriaExamenSchema = z.object({
    categoria: z.string()
        .min(1, "La categoría es indispensable")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
});
