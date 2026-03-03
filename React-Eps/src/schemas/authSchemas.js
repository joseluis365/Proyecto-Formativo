import { z } from "zod";

const passwordRegex = /^(?=.*[a-záéíóúñ])(?=.*[A-ZÁÉÍÓÚÑ])(?=.*\d)(?=.*[^A-Za-zÁÉÍÓÚáéíóúÑñ\d]).{8,}$/;
const emailBaseRegex = /^[A-Za-z0-9._-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// =======================
// SCHEMAS USUARIO NORMAL
// =======================

export const userLoginSchema = z.object({
    email: z.string()
        .min(1, "El correo electrónico es obligatorio.")
        .email("El formato del correo electrónico no es válido."),
    password: z.string()
        .min(1, "La contraseña es obligatoria.")
});

export const userRecoveryEmailSchema = z.object({
    email: z.string()
        .min(1, "El correo electrónico es obligatorio.")
        .email("El formato del correo electrónico no es válido.")
});

export const verifyCodeSchema = z.object({
    email: z.string()
        .min(1, "El correo electrónico es obligatorio.")
        .email("El formato del correo electrónico no es válido."),
    code: z.string()
        .min(1, "El código es obligatorio.")
        .length(6, "El código debe tener 6 dígitos.")
        .regex(/^[0-9]{6}$/, "El código debe tener 6 numeros sin espacios.")
});

export const userResetPasswordSchema = z.object({
    email: z.string()
        .min(1, "El correo electrónico es obligatorio.")
        .email("El formato del correo electrónico no es válido."),
    code: z.string()
        .min(1, "El código es obligatorio.")
        .regex(/^[0-9]+$/, "El código debe ser numérico."),
    password: z.string()
        .min(1, "La contraseña es obligatoria.")
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(25, "La contraseña debe tener como maximo 25 caracteres.")
        .regex(passwordRegex, "La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial"),
    confirmPassword: z.string()
        .min(1, "Debe confirmar la contraseña")
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});


// =======================
// SCHEMAS SUPERADMIN
// =======================

export const superAdminLoginSchema = z.object({
    email: z.string()
        .min(1, "El correo es obligatorio")
        .min(12, "El correo debe tener mínimo 12 caracteres")
        .max(150, "El correo debe tener máximo 150 caracteres")
        .regex(emailBaseRegex, "El formato del correo no es válido")
        .email("El correo debe ser válido"),
    password: z.string()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(25, "La contraseña debe tener máximo 25 caracteres")
});

export const superAdmin2FASchema = z.object({
    email: z.string()
        .min(1, "El correo es obligatorio")
        .email("El correo debe ser válido"),
    code: z.string()
        .min(1, "El código es obligatorio")
        .regex(/^[0-9]+$/, "El código debe ser numérico")
});

export const superAdminRecoveryEmailSchema = z.object({
    email: z.string()
        .min(1, "El correo es obligatorio")
        .min(12, "El correo debe tener mínimo 12 caracteres")
        .max(150, "El correo debe tener máximo 150 caracteres")
        .regex(emailBaseRegex, "El formato del correo no es válido")
        .email("El correo debe ser válido")
});

export const superAdminVerifyCodeSchema = z.object({
    email: z.string()
        .min(1, "El correo es obligatorio")
        .min(12, "El correo debe tener mínimo 12 caracteres")
        .max(150, "El correo debe tener máximo 150 caracteres")
        .regex(emailBaseRegex, "El formato del correo no es válido")
        .email("El correo debe ser válido"),
    code: z.string()
        .min(1, "El código es obligatorio")
        .length(6, "El código debe tener 6 dígitos")
        .regex(/^[0-9]{6}$/, "El código debe tener 6 numeros sin espacios.")
});

export const superAdminResetPasswordSchema = z.object({
    email: z.string()
        .min(1, "El correo es obligatorio")
        .min(12, "El correo debe tener mínimo 12 caracteres")
        .max(150, "El correo debe tener máximo 150 caracteres")
        .regex(emailBaseRegex, "El formato del correo no es válido")
        .email("El correo debe ser válido"),
    code: z.string()
        .min(1, "El código es obligatorio")
        .length(6, "El código debe tener 6 dígitos")
        .regex(/^[0-9]{6}$/, "El código debe tener 6 numeros sin espacios."),
    password: z.string()
        .min(1, "La contraseña es obligatoria")
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(25, "La contraseña debe tener máximo 25 caracteres")
        .regex(passwordRegex, "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial"),
    password_confirmation: z.string()
        .min(1, "Debe confirmar la contraseña")
}).refine(data => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"]
});
