export const superAdminLogin = {
    buttonText: "Ingresar al portal",
    buttonIcon: "arrow_forward",
    fields: [
        {
            name: "email",
            label: "Correo electrónico",
            icon: "email",
            type: "text",
            placeholder: "correo@ejemplo.com",
            autoComplete: "username",
            required: true,
        },
        {
            name: "password",
            label: "Contraseña",
            icon: "lock",
            type: "password",
            placeholder: "••••••••",
            autoComplete: "current-password",
            required: true,
        },
    ],
};

export const superAdminVerify = {
    buttonText: "Verificar código",
    buttonIcon: "arrow_forward",
    fields: [
        {
            name: "code",
            label: "Código de verificación",
            icon: "lock",
            type: "text",
            placeholder: "••••••••",
            autoComplete: "current-password",
            required: true,
        },
    ],
};


export const superAdminForgotPassword = {
    buttonText: "Enviar código",
    buttonIcon: "send",
    fields: [
        {
            name: "email",
            label: "Correo electrónico registrado",
            icon: "email",
            type: "email",
            placeholder: "correo@ejemplo.com",
            required: true,
        },
    ],
};

export const superAdminRecoveryCode = {
    buttonText: "Verificar código",
    buttonIcon: "check_circle",
    fields: [
        {
            name: "code",
            label: "Código de recuperación",
            icon: "lock",
            type: "number",
            placeholder: "123456",
            required: true,
        },
    ],
};

export const superAdminResetPassword = {
    buttonText: "Restablecer contraseña",
    buttonIcon: "save",
    fields: [
        {
            name: "password",
            label: "Nueva contraseña",
            icon: "lock",
            type: "text",
            placeholder: "Mínimo 8 caracteres",
            required: true,
        },
        {
            name: "password_confirmation",
            label: "Confirmar contraseña",
            icon: "lock_reset",
            type: "text",
            placeholder: "Repite la contraseña",
            required: true,
        },
    ],
};

export const superAdminCompanies = {
    fields: [
        {
            id: 1,
            nombre: "Colsubsidio",
            email: "juan@gmail.co",
            expiresAt: "2026-12-31",
            id_estado: 1,
        },
        {
            id: 2,
            nombre: "Sanitas",
            email: "juan@gmail.co",
            expiresAt: "2026-12-31",
            id_estado: 2,
        },
        {
            id: 3,
            nombre: "Sura",
            email: "juan@gmail.co",
            expiresAt: "2026-12-31",
            id_estado: 1,
        },
    ],
};