export const editUserFormConfig = [
  { name: "documento", label: "Documento", type: "number", readOnly: true },
  { name: "primer_nombre", label: "Primer Nombre", type: "text", readOnly: false },
  { name: "segundo_nombre", label: "Segundo Nombre", type: "text", readOnly: false },
  { name: "primer_apellido", label: "Primer Apellido", type: "text", readOnly: false },
  { name: "segundo_apellido", label: "Segundo Apellido", type: "text", readOnly: false },
  { name: "email", label: "Correo", type: "email", readOnly: false },
  { name: "telefono", label: "Telefono", type: "number", readOnly: false },
  { name: "direccion", label: "Direccion", type: "text", readOnly: false },
  { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", readOnly: false },
  { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false },
]

export const roleSpecificEditConfig = {
  4: [ // Medico
    { name: "registro_profesional", label: "Registro Profesional", type: "number", readOnly: true },
    { name: "id_especialidad", label: "Especialidad", type: "select", readOnly: false },
  ],
  5: [ // Paciente
    { name: "sexo", label: "Sexo", type: "select", options: [{ value: 1, label: "Masculino" }, { value: 2, label: "Femenino" }], readOnly: false },
    { name: "grupo_sanguineo", label: "Tipo de sangre", type: "select", options: [{ value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" }], readOnly: false },
  ],
};



export const createUserFormConfig = [
  { name: "documento", label: "Documento", type: "number", readOnly: false },
  { name: "primer_nombre", label: "Primer Nombre", type: "text", readOnly: false },
  { name: "segundo_nombre", label: "Segundo Nombre", type: "text", readOnly: false },
  { name: "primer_apellido", label: "Primer Apellido", type: "text", readOnly: false },
  { name: "segundo_apellido", label: "Segundo Apellido", type: "text", readOnly: false },
  { name: "email", label: "Correo", type: "email", readOnly: false },
  { name: "telefono", label: "Telefono", type: "number", readOnly: false },
  { name: "direccion", label: "Direccion", type: "text", readOnly: false },
  { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", readOnly: false },
  { name: "contrasena", label: "Contraseña", type: "password", readOnly: false },
  { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false },
];

export const roleSpecificConfig = {
  4: [ // Medico
    { name: "registro_profesional", label: "Registro Profesional", type: "number", readOnly: false },
    { name: "id_especialidad", label: "Especialidad", type: "select" },
  ],
  5: [ // Paciente
    { name: "sexo", label: "Sexo", type: "select", options: [{ value: "Masculino", label: "Masculino" }, { value: "Femenino", label: "Femenino" }], readOnly: false },
    { name: "grupo_sanguineo", label: "Tipo de sangre", type: "select", options: [{ value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" }], readOnly: false },
  ],
};

export function getCreateUserFormConfig(id_rol, dynamicOptions = {}) {
  const config = [
    ...createUserFormConfig,
    ...(roleSpecificConfig[id_rol] || [])
  ];

  return config.map(field => {
    if (dynamicOptions[field.name]) {
      return { ...field, options: dynamicOptions[field.name] };
    }
    return field;
  });
}

export function getEditUserFormConfig(id_rol, dynamicOptions = {}) {
  const config = [...editUserFormConfig, ...(roleSpecificEditConfig[id_rol] || [])];
  return config.map(field => {
    if (dynamicOptions[field.name]) {
      return { ...field, options: dynamicOptions[field.name] };
    }
    return field;
  });
}



