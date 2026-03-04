import { z } from "zod";

export const departamentoSchema = z.object({
    codigo_DANE: z.coerce.number({
        required_error: "El código DANE es requerido",
        invalid_type_error: "Debe ser un valor numérico"
    }).int("Debe ser un número entero"),
    nombre: z.string()
        .min(1, "El nombre del departamento es indispensable")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
    id_estado: z.coerce.number().default(1)
});
