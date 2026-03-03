/**
 * Configuración de campos para formularios de usuarios.
 * Alineado con userSchema.js y con el contrato del backend.
 */

// Configuración Base para Edición
export const editUserFormConfig = [
  { name: "documento", label: "Documento", type: "number", readOnly: true, icon: "badge" },
  { name: "primer_nombre", label: "Primer Nombre", type: "text", readOnly: false, icon: "person" },
  { name: "segundo_nombre", label: "Segundo Nombre", type: "text", readOnly: false, icon: "person" },
  { name: "primer_apellido", label: "Primer Apellido", type: "text", readOnly: false, icon: "person" },
  { name: "segundo_apellido", label: "Segundo Apellido", type: "text", readOnly: false, icon: "person" },
  { name: "email", label: "Correo", type: "email", readOnly: false, icon: "email" },
  { name: "telefono", label: "Telefono", type: "number", readOnly: false, icon: "call" },
  { name: "direccion", label: "Direccion", type: "text", readOnly: false, icon: "location_on" },
  { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", readOnly: false, icon: "calendar_today" },
  { name: "contrasena", label: "Contraseña", type: "password", readOnly: true, icon: "lock" },
  { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false, icon: "toggle_on" },
];

// Configuración Específica por Rol para Edición
export const roleSpecificEditConfig = {
  4: [ // Medico
    { name: "registro_profesional", label: "Registro Profesional", type: "number", readOnly: true, icon: "verified" },
    { name: "id_especialidad", label: "Especialidad", type: "select", readOnly: false, icon: "medical_services" },
  ],
  5: [ // Paciente
    { name: "sexo", label: "Sexo", type: "select", options: [{ value: "Masculino", label: "Masculino" }, { value: "Femenino", label: "Femenino" }], readOnly: false, icon: "wc" },
    { name: "grupo_sanguineo", label: "Tipo de sangre", type: "select", options: [{ value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" }], readOnly: false, icon: "bloodtype" },
  ],
};

// Configuración Base para Creación
export const createUserFormConfig = [
  { name: "documento", label: "Documento", type: "number", readOnly: false, icon: "badge" },
  { name: "primer_nombre", label: "Primer Nombre", type: "text", readOnly: false, icon: "person" },
  { name: "segundo_nombre", label: "Segundo Nombre", type: "text", readOnly: false, icon: "person" },
  { name: "primer_apellido", label: "Primer Apellido", type: "text", readOnly: false, icon: "person" },
  { name: "segundo_apellido", label: "Segundo Apellido", type: "text", readOnly: false, icon: "person" },
  { name: "email", label: "Correo", type: "email", readOnly: false, icon: "email" },
  { name: "telefono", label: "Telefono", type: "number", readOnly: false, icon: "call" },
  { name: "direccion", label: "Direccion", type: "text", readOnly: false, icon: "location_on" },
  { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", readOnly: false, icon: "calendar_today" },
  { name: "contrasena", label: "Contraseña", type: "password", readOnly: false, icon: "lock" },
  { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false, icon: "toggle_on" },
];

// Configuración Específica por Rol para Creación
export const roleSpecificConfig = {
  4: [ // Medico
    { name: "registro_profesional", label: "Registro Profesional", type: "number", readOnly: false, icon: "verified" },
    { name: "id_especialidad", label: "Especialidad", type: "select", icon: "medical_services" },
  ],
  5: [ // Paciente
    { name: "sexo", label: "Sexo", type: "select", options: [{ value: "Masculino", label: "Masculino" }, { value: "Femenino", label: "Femenino" }], readOnly: false, icon: "wc" },
    { name: "grupo_sanguineo", label: "Tipo de sangre", type: "select", options: [{ value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" }], readOnly: false, icon: "bloodtype" },
  ],
};

/**
 * Genera la configuración completa para creación basada en el rol.
 */
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

/**
 * Genera la configuración completa para edición basada en el rol.
 */
export function getEditUserFormConfig(id_rol, dynamicOptions = {}) {
  const config = [
    ...editUserFormConfig,
    ...(roleSpecificEditConfig[id_rol] || [])
  ];

  return config.map(field => {
    if (dynamicOptions[field.name]) {
      return { ...field, options: dynamicOptions[field.name] };
    }
    return field;
  });
}
