import { z } from "zod";

/**
 * Esquema base para cualquier usuario en el sistema.
 * Alineado con StoreUserRequest.php del backend.
 */
export const baseUserSchema = z.object({
    documento: z.string()
        .min(1, "El documento es obligatorio")
        .regex(/^[1-9][0-9]*$/, "El documento debe tener solo números y no empezar por 0")
        .min(7, "El documento debe tener al menos 7 dígitos")
        .max(10, "El documento debe tener máximo 10 dígitos"),
    primer_nombre: z.string()
        .min(3, "Mínimo 3 caracteres")
        .max(40, "Máximo 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/, "Solo letras sin espacios"),
    segundo_nombre: z.string()
        .max(40, "Máximo 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/, "Solo letras sin espacios")
        .optional()
        .nullable()
        .or(z.literal("")),
    primer_apellido: z.string()
        .min(3, "Mínimo 3 caracteres")
        .max(40, "Máximo 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/, "Solo letras, permite un espacio o guion"),
    segundo_apellido: z.string()
        .max(40, "Máximo 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/, "Solo letras, permite un espacio o guion")
        .optional()
        .nullable()
        .or(z.literal("")),
    email: z.string()
        .min(1, "El correo es obligatorio")
        .email("Formato de correo inválido")
        .min(12, "El correo debe tener al menos 12 caracteres")
        .max(150, "El correo debe tener máximo 150 caracteres"),
    telefono: z.string()
        .regex(/^3\d{9}$/, "Debe empezar por 3 y tener 10 dígitos numericos"),
    direccion: z.string()
        .min(8, "La dirección debe tener al menos 8 caracteres")
        .max(150, "Máximo 150 caracteres")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/, "Debe contener letras, números y carácteres válidos (#, -, ., ,)"),
    fecha_nacimiento: z.string()
        .min(1, "La fecha de nacimiento es obligatoria")
        .refine((date) => new Date(date) <= new Date(), {
            message: "La fecha de nacimiento no puede ser futura",
        }),
    id_estado: z.coerce.number().default(1),
});

/**
 * Esquema estricto para contraseñas.
 */
export const passwordSchema = z.string()
    .min(8, "Mínimo 8 caracteres")
    .max(25, "Máximo 25 caracteres")
    .regex(/^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/,
        "Debe tener al menos: una mayúscula, una minúscula, un número y un carácter especial");

/**
 * Esquemas específicos por Rol
 */

// Personal Administrativo (Rol 3) - Creación
export const createPersonalSchema = baseUserSchema.extend({
    contrasena: passwordSchema,
});

// Personal Administrativo (Rol 3) - Edición (Contraseña opcional)
export const editPersonalSchema = baseUserSchema.extend({
    contrasena: passwordSchema.optional().or(z.literal("")),
}).omit({ documento: true }); // El documento suele ser readOnly en el backend para edición


// Médico (Rol 4) - Creación
export const medicoSchema = baseUserSchema.extend({
    contrasena: passwordSchema,
    registro_profesional: z.string()
        .regex(/^[0-9]{5,15}$/, "Debe tener entre 5 y 15 dígitos numéricos"),
    id_especialidad: z.coerce.number().min(1, "La especialidad es obligatoria"),
});

// Médico (Rol 4) - Edición
export const editMedicoSchema = baseUserSchema.extend({
    contrasena: passwordSchema.optional().or(z.literal("")),
    registro_profesional: z.string()
        .regex(/^[0-9]{5,15}$/, "Debe tener entre 5 y 15 dígitos numéricos"),
    id_especialidad: z.coerce.number().min(1, "La especialidad es obligatoria"),
}).omit({ documento: true });

// Paciente (Rol 5) - Creación
export const pacienteSchema = baseUserSchema.extend({
    contrasena: passwordSchema,
    sexo: z.enum(["Masculino", "Femenino"], {
        errorMap: () => ({ message: "Seleccione un sexo válido" }),
    }),
    grupo_sanguineo: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        errorMap: () => ({ message: "Seleccione un grupo sanguíneo válido" }),
    }),
});

// Paciente (Rol 5) - Edición
export const editPacienteSchema = baseUserSchema.extend({
    contrasena: passwordSchema.optional().or(z.literal("")),
    sexo: z.enum(["Masculino", "Femenino"], {
        errorMap: () => ({ message: "Seleccione un sexo válido" }),
    }),
    grupo_sanguineo: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        errorMap: () => ({ message: "Seleccione un grupo sanguíneo válido" }),
    }),
}).omit({ documento: true });

