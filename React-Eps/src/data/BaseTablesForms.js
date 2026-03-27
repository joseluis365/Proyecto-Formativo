export const formEstado = {
    fields: [
        {
            name: "nombre_estado",
            label: "Nombre del Estado",
            icon: "description",
            type: "text",
            placeholder: "Ej: Pendiente",
            required: true,
            onlyLetters: true,
        },
    ],
};

export const formRol = {
    fields: [
        {
            name: "tipo_usu",
            label: "Nombre del Rol",
            icon: "badge",
            type: "text",
            placeholder: "Ej: Administrador",
            required: true,
            onlyLetters: true,
        },
    ],
};

export const formCiudad = {
    fields: [
        {
            name: "codigo_postal",
            label: "Código Postal",
            icon: "markunread_mailbox",
            type: "number",
            placeholder: "Ej: 11001",
            required: true,
            onlyNumbers: true,
        },
        {
            name: "nombre",
            label: "Nombre de la Ciudad",
            icon: "location_city",
            type: "text",
            placeholder: "Ej: Bogotá",
            required: true,
            onlyLetters: true,
        },
        {
            name: "id_departamento",
            label: "Departamento",
            icon: "map",
            type: "select",
            placeholder: "Seleccione un departamento",
            required: true,
        }
    ]
};

export const formDepartamento = {
    fields: [
        {
            name: "codigo_DANE",
            label: "Código DANE",
            icon: "pin",
            type: "number",
            placeholder: "Ej: 11",
            required: true,
            onlyNumbers: true,
        },
        {
            name: "nombre",
            label: "Nombre del Departamento",
            icon: "map",
            type: "text",
            placeholder: "Ej: Cundinamarca",
            required: true,
            onlyLetters: true,
        },
    ],
};

export const formFarmacia = {
    fields: [
        {
            name: "nit",
            label: "NIT",
            icon: "badge",
            type: "text",
            placeholder: "Ej: 900123456-7",
            required: true,
            onlyNumbers: true,
        },
        {
            name: "nombre",
            label: "Nombre de la Farmacia",
            icon: "store",
            type: "text",
            placeholder: "Nombre de la farmacia",
            required: true,
        },
        {
            name: "direccion",
            label: "Dirección",
            icon: "location_on",
            type: "text",
            placeholder: "Calle 123 # 45-67",
        },
        {
            name: "telefono",
            label: "Teléfono",
            icon: "phone",
            type: "text",
            placeholder: "300 123 4567",
            onlyNumbers: true,
        },
        {
            name: "email",
            label: "Email",
            icon: "mail",
            type: "email",
            placeholder: "email@ejemplo.com",
        },
        {
            name: "nombre_contacto",
            label: "Nombre de Contacto",
            icon: "person",
            type: "text",
            placeholder: "Responsable de la farmacia",
            onlyLetters: true,
        },
        {
            name: "horario_apertura",
            label: "Horario Apertura",
            icon: "schedule",
            type: "time",
        },
        {
            name: "horario_cierre",
            label: "Horario Cierre",
            icon: "schedule",
            type: "time",
        },
        {
            name: "abierto_24h",
            label: "Abierto las 24 horas",
            icon: "24mp",
            type: "checkbox",
        }
    ]
};

export const formCategoriaExamen = {
    fields: [
        {
            name: "categoria",
            label: "Nombre de la Categoría",
            icon: "category",
            type: "text",
            placeholder: "Ej: Sangre",
            required: true,
            onlyLetters: true,
        }
    ]
};

export const formCategoriaMedicamento = {
    fields: [
        {
            name: "categoria",
            label: "Nombre de la Categoría",
            icon: "category",
            type: "text",
            placeholder: "Ej: Analgésicos",
            required: true,
            onlyLetters: true,
        }
    ]
};

export const formEspecialidad = {
    fields: [
        {
            name: "especialidad",
            label: "Nombre de la Especialidad",
            icon: "medical_services",
            type: "text",
            placeholder: "Ej: Cardiología",
            required: true,
            onlyLetters: true,
        }
    ]
};

export const formPrioridad = {
    fields: [
        {
            name: "prioridad",
            label: "Nombre de la Prioridad",
            icon: "priority_high",
            type: "text",
            placeholder: "Ej: Alta",
            required: true,
            onlyLetters: true,
        }
    ]
};

export const formTipoCita = {
    fields: [
        {
            name: "tipo",
            label: "Nombre del Tipo de Cita",
            icon: "event",
            type: "text",
            placeholder: "Ej: General",
            required: true,
            onlyLetters: true,
        }
    ]
};

export const formMotivoConsulta = {
    fields: [
        {
            name: "motivo",
            label: "Motivo de Consulta",
            icon: "medical_services",
            type: "text",
            placeholder: "Ej: Dolor Abdominal",
            required: true,
            onlyLetters: true,
        }
    ]
};

export const formTipoDocumento = {
    fields: [
        {
            name: "tipo_documento",
            label: "Tipo de Documento",
            icon: "badge",
            type: "text",
            placeholder: "Ej: Cédula de Ciudadanía",
            required: true,
            onlyLetters: true,
        }
    ]
};
