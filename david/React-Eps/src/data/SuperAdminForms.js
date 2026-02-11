export const superAdminLogin = {
    buttonText: "Ingresar al portal",
    buttonIcon: "arrow_forward",
    fields: [
        {
            name: "email",
            label: "Correo electrónico",
            icon: "",
            type: "email",
            placeholder: "correo@ejemplo.com",
            autoComplete: "username",
            required: true,
        },
        {
            name: "password",
            label: "Contraseña",
            icon: "",
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