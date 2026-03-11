import { z } from "zod";

/**
 * Esquema para ACTUALIZACIÓN de empresa.
 * Solo valida los campos que son editables en el formulario.
 * Los campos readonly (nit, nombre, documento_representante, admin_documento)
 * se aceptan como cualquier valor para no bloquear la edición.
 */
export const updateEmpresaSchema = z.object({
    // Campos de solo lectura — no validamos
    nit: z.any().optional(),

    // Campos Empresa (ahora editables)
    nombre: z.string()
        .min(3, "El nombre de la empresa debe tener al menos 3 caracteres")
        .max(50, "El nombre de la empresa no puede ser mayor a 50 caracteres")
        .regex(/^(?!.*\s{2,})(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-\.,&\/]+$/, "El nombre de la empresa debe tener al menos una letra, números y algunos caracteres (- . & /)"),

    documento_representante: z.coerce.string()
        .min(7, "El documento debe tener entre 7 y 10 dígitos")
        .max(10, "El documento debe tener entre 7 y 10 dígitos")
        .regex(/^[1-9][0-9]*$/, "El documento debe tener solo números y no empezar por 0"),

    admin_documento: z.coerce.string()
        .min(7, "El documento debe tener entre 7 y 10 dígitos")
        .max(10, "El documento debe tener entre 7 y 10 dígitos")
        .regex(/^[1-9][0-9]*$/, "El documento debe tener solo números y no empezar por 0"),

    id_departamento: z.any().optional(),
    id_ciudad: z.any().optional(),
    id_estado: z.any().optional(),

    // Campos editables de la empresa
    email_contacto: z.string()
        .min(1, "El correo de contacto es obligatorio")
        .email("Ingresa un correo válido"),

    telefono: z.coerce.string()
        .length(10, "El teléfono debe tener exactamente 10 dígitos")
        .regex(/^(3\d{9}|60[1-8]\d{7})$/, "El teléfono debe iniciar con 3 o 60"),

    direccion: z.string()
        .min(8, "La dirección debe tener al menos 8 caracteres")
        .max(150, "La dirección no puede superar 150 caracteres"),

    // Representante
    nombre_representante: z.string()
        .min(3, "El nombre del representante debe tener al menos 3 caracteres")
        .max(50, "El nombre del representante no puede superar 50 caracteres")
        .regex(/^(?!.*\s{2,})(?!^\s)(?!.*\s$)[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre del representante debe tener solo letras y no debe contener dobles espacios ni espacios al inicio o final"),

    telefono_representante: z.coerce.string()
        .length(10, "El teléfono debe tener exactamente 10 dígitos")
        .regex(/^3\d{9}$/, "El teléfono debe empezar con 3"),

    email_representante: z.string()
        .min(1, "El correo del representante es obligatorio")
        .email("Ingresa un correo válido"),

    // Admin
    admin_primer_nombre: z.string()
        .min(1, "El primer nombre del administrador es obligatorio")
        .min(3, "El primer nombre debe tener al menos 3 caracteres")
        .max(40, "El primer nombre no puede superar 40 caracteres"),

    admin_segundo_nombre: z.string()
        .max(40, "El segundo nombre no puede superar 40 caracteres")
        .optional()
        .or(z.literal("")),

    admin_primer_apellido: z.string()
        .min(1, "El primer apellido del administrador es obligatorio")
        .min(3, "El primer apellido debe tener al menos 3 caracteres")
        .max(40, "El primer apellido no puede superar 40 caracteres"),

    admin_segundo_apellido: z.string()
        .max(40, "El segundo apellido no puede superar 40 caracteres")
        .optional()
        .or(z.literal("")),

    admin_email: z.string()
        .min(1, "El correo del administrador es obligatorio")
        .email("Ingresa un correo válido"),

    admin_telefono: z.coerce.string()
        .length(10, "El teléfono debe tener exactamente 10 dígitos")
        .regex(/^3\d{9}$/, "El teléfono debe empezar con 3"),

    admin_direccion: z.string()
        .min(8, "La dirección debe tener al menos 8 caracteres")
        .max(150, "La dirección no puede superar 150 caracteres"),

    // Contraseña — opcional en edición, pero si se escribe debe ser válida
    admin_password: z.string().optional().or(z.literal("")),
    admin_password_confirmation: z.string().optional().or(z.literal(""))
}).superRefine((val, ctx) => {
    // Solo si el usuario escribió algo en la nueva contraseña, validamos
    if (val.admin_password && val.admin_password.length > 0) {
        // Validar formato de contraseña fuerte
        const passwordRegex = /^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/;
        if (!passwordRegex.test(val.admin_password)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
                path: ["admin_password"],
            });
        }

        if (val.admin_password.length > 25) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La contraseña no puede superar 25 caracteres",
                path: ["admin_password"],
            });
        }

        // Revisar si coinciden
        if (val.admin_password !== val.admin_password_confirmation) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Las contraseñas no coinciden",
                path: ["admin_password_confirmation"],
            });
        }
    }
});
