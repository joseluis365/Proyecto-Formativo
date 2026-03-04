import { z } from "zod";

export const farmaciaSchema = z.object({
    nit: z.string()
        .min(1, "El NIT es obligatorio")
        .max(20, "El NIT no puede exceder los 20 caracteres")
        .regex(/^[0-9.-]+$/, "Formato de NIT inválido"),
    nombre: z.string()
        .min(1, "El nombre de la farmacia es obligatorio")
        .max(100, "El nombre no puede exceder los 100 caracteres"),
    direccion: z.string()
        .min(1, "La dirección es obligatoria")
        .max(255, "La dirección es demasiado larga"),
    telefono: z.string()
        .min(1, "El teléfono es obligatorio")
        .max(20, "El teléfono no puede exceder los 20 caracteres"),
    email: z.string()
        .email("Formato de correo electrónico inválido")
        .max(100, "El correo electrónico es demasiado largo"),
    nombre_contacto: z.string()
        .min(1, "El nombre de contacto es obligatorio")
        .max(100, "El nombre de contacto es demasiado largo"),
    horario_apertura: z.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Formato de hora HH:mm inválido"),
    horario_cierre: z.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Formato de hora HH:mm inválido"),
    abierto_24h: z.boolean().default(false),
    id_estado: z.coerce.number().default(1)
});
