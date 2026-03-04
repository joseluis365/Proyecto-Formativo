import { z } from "zod";

export const ciudadSchema = z.object({
    codigo_postal: z.coerce.number({
        required_error: "El código postal es requerido",
        invalid_type_error: "Debe ser un valor numérico"
    }).int("Debe ser un número entero"),
    nombre: z.string()
        .min(1, "El nombre de la ciudad es indispensable")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
    id_departamento: z.coerce.number({
        required_error: "Por favor, seleccione un departamento",
        invalid_type_error: "Selección inválida"
    }).min(1, "Seleccione un departamento de la lista"),
    id_estado: z.coerce.number().default(1)
});
