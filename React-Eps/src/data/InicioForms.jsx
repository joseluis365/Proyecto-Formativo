import React from 'react';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

// forms/login.form.js
export const loginForm = {
  buttonText: "Ingresar al portal",
  buttonIcon: <ArrowForwardRoundedIcon />,
  fields: [
    {
      name: "email",
      label: "Correo electrónico",
      icon: <EmailRoundedIcon />,
      type: "email",
      placeholder: "correo@ejemplo.com",
      autoComplete: "username",
      required: true,
    },
    {
      name: "password",
      label: "Contraseña",
      icon: <LockRoundedIcon />,
      type: "password",
      placeholder: "••••••••",
      autoComplete: "current-password",
      required: true,
    },
  ],
};

export const emailForm = {
    buttonText: "Continuar",
    buttonIcon: <ArrowForwardRoundedIcon />,
    fields: [
        {
            name: "email",
            label: "Correo electrónico",
            icon: <EmailRoundedIcon />,
            type: "email",
            placeholder: "correo@ejemplo.com",
            autoComplete: "username",
            required: true,
        },
    ],
};

export const codeForm = {
    buttonText: "Verificar",
    buttonIcon: <ArrowForwardRoundedIcon />,
    fields: [
        {
            name: "code",
            label: "Código de verificación",
            icon: <LockRoundedIcon />,
            type: "text",
            placeholder: "XXX - XXX",
            autoComplete: "one-time-code",
            required: true,
        },
    ],
};

export const resetPasswordForm = {
    buttonText: "Restablecer contraseña",
    buttonIcon: <ArrowForwardRoundedIcon />,
    fields: [
        {
            name: "password",
            label: "Contraseña",
            icon: <LockRoundedIcon />,
            type: "password",
            placeholder: "••••••••",
            autoComplete: "current-password",
            required: true,
        },
        {
            name: "confirmPassword",
            label: "Confirmar contraseña",
            icon: <LockRoundedIcon />,
            type: "password",
            placeholder: "••••••••",
            autoComplete: "current-password",
            required: true,
        },
    ],
};

