import { z } from "zod";

export const farmaciaSchema = z.object({
    nit: z.string()
        .min(1, "El NIT es obligatorio")
        .regex(/^[1-9][0-9]{8}-[0-9]$/, "El NIT debe tener 9 números, un guion y 1 número de verificación (ej: 900123456-7)"),

    nombre: z.string()
        .min(3, "El nombre de la farmacia debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres")
        .regex(/^(?!.*\s{2,})(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-\.,&\/]+$/, "Debe contener al menos una letra y caracteres selectos (-, ., &, /)"),

    direccion: z.string()
        .min(8, "La dirección debe tener al menos 8 caracteres")
        .max(255, "La dirección es demasiado larga")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/, "La dirección debe contener letras y números, y puede incluir #, -, . o ,."),

    telefono: z.coerce.string()
        .length(10, "El teléfono debe tener exactamente 10 caracteres")
        .regex(/^(3\d{9}|60[1-8]\d{7})$/, "El teléfono debe iniciar con 3 o 60 y tener 10 dígitos numéricos sin espacios"),

    email: z.string()
        .min(12, "El correo debe tener al menos 12 caracteres")
        .max(100, "El correo electrónico es demasiado largo")
        .regex(/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Formato de correo inválido o el dominio no es válido."),

    nombre_contacto: z.string()
        .min(3, "El nombre de contacto debe tener al menos 3 caracteres")
        .max(100, "El nombre de contacto es demasiado largo")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/, "El nombre de contacto debe tener solo letras sin espacios dobles"),

    horario_apertura: z.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Formato de hora HH:mm inválido"),

    horario_cierre: z.string()
        .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Formato de hora HH:mm inválido"),
    abierto_24h: z.boolean().default(false),
    id_estado: z.coerce.number().default(1)
});
