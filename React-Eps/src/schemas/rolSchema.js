import { z } from "zod";

export const rolSchema = z.object({
    tipo_usu: z.string()
        .min(1, "El nombre del rol es indispensable")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras y espacios"),
    id_estado: z.coerce.number().optional()
}).refine(data => data.tipo_usu.toUpperCase() !== "SUPERADMIN", {
    message: 'El nombre "SUPERADMIN" está reservado.',
    path: ["tipo_usu"]
});
