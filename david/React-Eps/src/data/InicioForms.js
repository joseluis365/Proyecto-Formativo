// forms/login.form.js
export const loginForm = {
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

export const emailForm = {
    buttonText: "Continuar",
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
    ],
};

export const codeForm = {
    buttonText: "Verificar",
    buttonIcon: "arrow_forward",
    fields: [
        {
            name: "code",
            label: "Código de verificación",
            icon: "lock",
            type: "text",
            placeholder: "XXX - XXX",
            autoComplete: "one-time-code",
            required: true,
        },
    ],
};

export const resetPasswordForm = {
    buttonText: "Restablecer contraseña",
    buttonIcon: "arrow_forward",
    fields: [
        {
            name: "password",
            label: "Contraseña",
            icon: "lock",
            type: "password",
            placeholder: "••••••••",
            autoComplete: "current-password",
            required: true,
        },
        {
            name: "confirmPassword",
            label: "Confirmar contraseña",
            icon: "lock",
            type: "password",
            placeholder: "••••••••",
            autoComplete: "current-password",
            required: true,
        },
    ],
};

