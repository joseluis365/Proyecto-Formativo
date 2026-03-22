import { z } from "zod";

export const empresaSchema = z.object({
    nit: z.string()
        .min(1, "El NIT es obligatorio")
        .regex(/^[1-9][0-9]{8}-[0-9]$/, "El NIT debe tener 9 números (sin empezar por 0), un guion y 1 dígito de verificación en el formato correcto (ejemplo: 900123456-7)"),

    nombre: z.string()
        .min(3, "El nombre de la empresa debe tener al menos 3 caracteres")
        .max(50, "El nombre de la empresa no puede ser mayor a 50 caracteres")
        .regex(/^(?!.*\s{2,})(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\-\.,&\/]+$/, "El nombre de la empresa debe tener al menos una letra, numeros y algunos caracteres (-, ., &, /)"),

    email_contacto: z.string()
        .min(12, "El correo debe tener al menos 12 caracteres")
        .max(150, "El correo debe tener como maximo 150 caracteres")
        .regex(/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido."),

    telefono: z.coerce.string()
        .length(10, "El telefono debe tener exactamente 10 caracteres")
        .regex(/^(3\d{9}|60[1-8]\d{7})$/, "El telefono debe iniciar con 3 o 60 y tener 10 digitos numericos sin espacios"),

    direccion: z.string()
        .min(8, "La direccion debe tener al menos 8 caracteres")
        .max(150, "La direccion debe tener como maximo 150 caracteres")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/, "La dirección debe contener letras y números, y puede incluir #, -, . o ,."),

    id_departamento: z.string().min(1, "El departamento es obligatorio"),
    id_ciudad: z.string().min(1, "La ciudad es obligatoria"),

    documento_representante: z.coerce.string()
        .min(7, "El documento debe tener entre 7 y 10 dígitos")
        .max(10, "El documento debe tener entre 7 y 10 dígitos")
        .regex(/^[1-9][0-9]*$/, "El documento debe tener solo números y no empezar por 0"),

    nombre_representante: z.string()
        .min(3, "El nombre del representante debe tener al menos 3 caracteres")
        .max(50, "El nombre del representante debe tener como maximo 50 caracteres")
        .regex(/^(?!.*\s{2,})(?!^\s)(?!.*\s$)[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre del representante debe tener solo letras y no debe contener dobles espacios ni espacios al inicio o final"),

    telefono_representante: z.coerce.string()
        .length(10, "El telefono debe tener exactamente 10 digitos")
        .regex(/^3\d{9}$/, "El telefono debe empezar con 3 y tener 10 numeros sin espacios ni puntos"),

    email_representante: z.string()
        .min(12, "El correo debe tener al menos 12 caracteres")
        .max(150, "El correo debe tener como maximo 150 caracteres")
        .regex(/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido."),

    admin_primer_nombre: z.string()
        .min(1, "El primer nombre del administrador es obligatorio")
        .min(3, "El primer nombre del administrador debe tener al menos 3 caracteres")
        .max(40, "El primer nombre del administrador debe tener como maximo 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/, "El primer nombre del administrador debe tener solo letras sin esapcios"),

    admin_segundo_nombre: z.string()
        .max(40, "El segundo nombre del administrador no puede ser mayor a 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/, "El segundo nombre del administrador debe tener solo letras")
        .optional()
        .transform(val => val === "" ? undefined : val),

    admin_primer_apellido: z.string()
        .min(1, "El primer apellido del administrador es obligatorio")
        .min(3, "El primer apellido del administrador debe tener al menos 3 caracteres")
        .max(40, "El primer apellido del administrador debe tener como maximo 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:[ -][A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/, "El primer apellido del administrador debe tener solo letras sin esapcios dobles"),

    admin_segundo_apellido: z.string()
        .max(40, "El segundo apellido del administrador no puede ser mayor a 40 caracteres")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]*$/, "El segundo apellido del administrador debe tener solo letras")
        .optional()
        .transform(val => val === "" ? undefined : val),

    admin_id_tipo_documento: z.coerce.string()
        .min(1, "El tipo de documento es obligatorio")
        .refine(val => ["1", "3"].includes(val.toString()), "El tipo de documento debe ser Cédula de Ciudadanía o Extranjería"),

    admin_documento: z.coerce.string()
        .min(1, "El documento del administrador es obligatorio")
        .min(7, "El documento debe tener entre 7 y 10 dígitos")
        .max(10, "El documento debe tener entre 7 y 10 dígitos")
        .regex(/^[1-9][0-9]*$/, "El documento debe tener solo números y no empezar por 0"),

    admin_fecha_nacimiento: z.string()
        .min(1, "La fecha de nacimiento es obligatoria")
        .refine(date => {
            const bd = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - bd.getFullYear();
            const m = today.getMonth() - bd.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) {
                age--;
            }
            return age >= 18;
        }, { message: "El administrador debe ser mayor de edad" }),

    admin_sexo: z.string()
        .min(1, "El sexo es obligatorio")
        .refine(val => ["Masculino", "Femenino"].includes(val), "Sexo no válido"),

    admin_email: z.string()
        .min(1, "El correo del administrador es obligatorio")
        .min(12, "El correo debe tener al menos 12 caracteres")
        .max(150, "El correo debe tener como maximo 150 caracteres")
        .regex(/^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "El correo debe tener máximo 64 caracteres antes del @, un solo @, al menos un punto en el dominio, sin espacios y con un dominio válido."),

    admin_telefono: z.coerce.string()
        .length(10, "El telefono debe tener exactamente 10 digitos")
        .regex(/^3\d{9}$/, "El telefono debe empezar con 3 y tener 10 numeros sin espacios ni puntos"),

    admin_direccion: z.string()
        .min(1, "La direccion del administrador es obligatoria")
        .min(8, "La direccion debe tener al menos 8 caracteres")
        .max(150, "La direccion debe tener como maximo 150 caracteres")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s#\-\.,\/]+$/, "La dirección debe contener letras y números, y puede incluir #, -, . o ,."),

    admin_password: z.string()
        .min(8, "La contraseña del administrador debe tener al menos 8 caracteres")
        .max(25, "La contraseña del administrador debe tener como maximo 25 caracteres")
        .regex(/^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/, "La contraseña del administrador debe tener al menos una mayúscula, una minúscula, un número y un carácter especial"),

    admin_password_confirmation: z.string()
        .min(1, "Reescribe la contraseña para confirmarla")
}).superRefine((val, ctx) => {
    if (val.admin_password !== val.admin_password_confirmation) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Las contraseñas no coinciden",
            path: ["admin_password_confirmation"]
        });
    }
});