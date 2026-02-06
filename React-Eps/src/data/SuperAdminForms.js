export const superAdminLogin = {
    buttonText: "Ingresar al portal",
    buttonIcon: "arrow_forward",
    fields: [
        {
            name: "email",
            label: "Correo electrónico",
            icon: "email",
            type: "email",
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