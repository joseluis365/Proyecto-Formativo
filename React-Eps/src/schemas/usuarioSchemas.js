import { z } from "zod";

const passwordRegex = /^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/;
const emailBaseRegex = /^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^3\d{9}$/;
const documentRegex = /^[1-9][0-9]*$/;
const singleNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/;
const lastNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
const addressRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/;
const registroProfesionalRegex = /^[0-9]{5,15}$/;

export const baseUserSchema = z.object({
    documento: z.coerce.string()
        .min(1, "El documento es obligatorio")
        .min(7, "El documento debe tener entre 7 y 10 digitos")
        .max(10, "El documento debe tener entre 7 y 10 digitos")
        .regex(documentRegex, "El documento debe tener solo numeros sin espacios ni puntos"),

    primer_nombre: z.string()
        .min(1, "El primer nombre es obligatorio")
        .min(3, "El primer nombre debe tener al menos 3 caracteres")
        .max(40, "El primer nombre debe tener como maximo 40 caracteres")
        .regex(singleNameRegex, "El primer nombre debe tener solo letras sin espacios"),

    segundo_nombre: z.string()
        .max(40, "El segundo nombre debe tener como maximo 40 caracteres")
        .regex(new RegExp(`^$|${singleNameRegex.source}`), "El segundo nombre debe tener solo letras sin espacios")
        .optional()
        .transform(val => val === "" ? undefined : val),

    primer_apellido: z.string()
        .min(1, "El primer apellido es obligatorio")
        .min(3, "El primer apellido debe tener al menos 3 caracteres")
        .max(40, "El primer apellido debe tener como maximo 40 caracteres")
        .regex(lastNameRegex, "El primer apellido debe tener solo letras sin espacios dobles"),

    segundo_apellido: z.string()
        .max(40, "El segundo apellido debe tener como maximo 40 caracteres")
        .regex(new RegExp(`^$|${lastNameRegex.source}`), "El segundo apellido debe tener solo letras sin espacios dobles")
        .optional()
        .transform(val => val === "" ? undefined : val),

    email: z.string()
        .min(1, "El correo es obligatorio")
        .min(12, "El correo debe tener al menos 12 caracteres")
        .max(150, "El correo debe tener como maximo 150 caracteres")
        .regex(emailBaseRegex, "El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido.")
        .email("El correo debe ser un correo valido"),

    telefono: z.coerce.string()
        .min(1, "El telefono es obligatorio")
        .length(10, "El telefono debe tener exactamente 10 digitos")
        .regex(phoneRegex, "El telefono debe empezar con 3 y tener 10 numeros sin espacios ni puntos"),

    direccion: z.string()
        .min(1, "La direccion es obligatoria")
        .min(8, "La direccion debe tener al menos 8 caracteres")
        .max(150, "La direccion debe tener como maximo 150 caracteres")
        .regex(addressRegex, "La dirección debe contener letras y números, y puede incluir #, -, . o ,."),

    fecha_nacimiento: z.string()
        .min(1, "La fecha de nacimiento es obligatoria")
        .refine(date => new Date(date) <= new Date(), {
            message: "La fecha de nacimiento no puede ser una fecha futura"
        }),

    id_estado: z.coerce.number().min(1, "El estado es obligatorio"),
    id_rol: z.coerce.number().min(1, "El rol es obligatorio"),
});

// ======================
// MEDICO SCHEMAS
// ======================
export const createMedicoSchema = baseUserSchema.extend({
    contrasena: z.string()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(25, "La contraseña debe tener como maximo 25 caracteres")
        .regex(passwordRegex, "La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial"),
    registro_profesional: z.coerce.string()
        .min(1, "El registro profesional es obligatorio")
        .min(5, "El registro profesional debe tener entre 5 y 15 digitos")
        .max(15, "El registro profesional debe tener entre 5 y 15 digitos")
        .regex(registroProfesionalRegex, "El registro profesional debe ser maximo de 15 digitos numericos sin espacios ni puntos"),
    id_especialidad: z.coerce.number().min(1, "La especialidad es obligatoria")
});

export const updateMedicoSchema = baseUserSchema.extend({
    registro_profesional: z.coerce.string()
        .min(1, "El registro profesional es obligatorio")
        .min(1, "El registro profesional debe tener maximo 10 digitos")
        .max(10, "El registro profesional debe tener maximo 10 digitos")
        .regex(/^\d{1,10}$/, "El registro profesional debe ser maximo de 10 digitos"),
    id_especialidad: z.coerce.number().min(1, "La especialidad es obligatoria")
});

// ======================
// PACIENTE SCHEMAS
// ======================
export const createPacienteSchema = baseUserSchema.extend({
    contrasena: z.string()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(25, "La contraseña debe tener como maximo 25 caracteres")
        .regex(passwordRegex, "La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial"),
    sexo: z.string()
        .min(1, "El sexo del paciente es obligatorio")
        .refine(val => ["Masculino", "Femenino"].includes(val), "El sexo debe ser Masculino o Femenino"),
    grupo_sanguineo: z.string()
        .min(1, "El grupo sanguineo es obligatorio")
        .refine(val => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val), "El grupo sanguineo debe ser A+, A-, B+, B-, AB+, AB-, O+, O-")
});

export const updatePacienteSchema = baseUserSchema.extend({
    sexo: z.string()
        .min(1, "El sexo del paciente es obligatorio")
        .refine(val => ["Masculino", "Femenino"].includes(val), "El sexo debe ser Masculino o Femenino"),
    grupo_sanguineo: z.string()
        .min(1, "El grupo sanguineo es obligatorio")
        .refine(val => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val), "El grupo sanguineo debe ser A+, A-, B+, B-, AB+, AB-, O+, O-")
});

// ======================
// PERSONAL SCHEMAS
// ======================
export const createPersonalSchema = baseUserSchema.extend({
    contrasena: z.string()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(25, "La contraseña debe tener como maximo 25 caracteres")
        .regex(passwordRegex, "La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial"),
});

export const updatePersonalSchema = baseUserSchema;
