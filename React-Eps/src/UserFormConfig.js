// ======================
// CAMPOS INDIVIDUALES
// ======================
const personalFields = [
  { name: "id_tipo_documento", label: "Tipo de Documento", type: "select", icon: "badge" },
  { name: "documento", label: "Documento", type: "number", icon: "badge" },
  { name: "primer_nombre", label: "Primer Nombre", type: "text", icon: "person" },
  { name: "segundo_nombre", label: "Segundo Nombre", type: "text", icon: "person" },
  { name: "primer_apellido", label: "Primer Apellido", type: "text", icon: "person" },
  { name: "segundo_apellido", label: "Segundo Apellido", type: "text", icon: "person" },
  { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", icon: "calendar_today" },
  { name: "sexo", label: "Sexo", type: "select", options: [{ value: "Masculino", label: "Masculino" }, { value: "Femenino", label: "Femenino" }], icon: "wc" },
];

const contactFields = [
  { name: "email", label: "Correo", type: "email", icon: "email" },
  { name: "telefono", label: "Teléfono", type: "number", icon: "call" },
  { name: "direccion", label: "Dirección", type: "text", icon: "location_on" },
];

const patientSpecificFields = [
  { name: "grupo_sanguineo", label: "Tipo de sangre", type: "select", options: [{ value: "A+", label: "A+" }, { value: "A-", label: "A-" }, { value: "B+", label: "B+" }, { value: "B-", label: "B-" }, { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" }, { value: "O+", label: "O+" }, { value: "O-", label: "O-" }], icon: "bloodtype" },
];

const doctorSpecificFields = [
  { name: "registro_profesional", label: "Registro Profesional", type: "number", icon: "badge" },
  { name: "id_especialidad", label: "Especialidad", type: "select", icon: "medical_services" },
  { name: "id_consultorio", label: "Consultorio", type: "select", icon: "meeting_room" },
];

const pharmacistSpecificFields = [
  { name: "id_farmacia", label: "Farmacia", type: "select", icon: "local_pharmacy" },
];

/**
 * Genera las secciones para CREACIÓN
 */
export function getCreateUserSections(id_rol, dynamicOptions = {}) {
  const sections = [];

  // 1. Información Personal
  const personalSectionFields = [...personalFields];

  sections.push({
    title: "Información Personal",
    fields: personalSectionFields.map(f => {
        let opts = dynamicOptions[f.name] || f.options;
        if (f.name === "id_tipo_documento" && id_rol !== 5 && opts) {
            opts = opts.filter(o => Number(o.value) !== 2);
        }
        return { ...f, readOnly: false, options: opts };
    })
  });

  // 2. Información de Contacto
  sections.push({
    title: "Información de Contacto",
    fields: contactFields.map(f => ({ ...f, readOnly: false }))
  });

  // 3. Secciones Específicas
  if (id_rol === 4) {
    sections.push({
      title: "Información Profesional",
      fields: doctorSpecificFields.map(f => ({ ...f, readOnly: false, options: dynamicOptions[f.name] || f.options }))
    });
  } else if (id_rol === 6) {
    sections.push({
      title: "Información Laboral",
      fields: pharmacistSpecificFields.map(f => ({ ...f, readOnly: false, options: dynamicOptions[f.name] || f.options }))
    });
  } else if (id_rol === 5) {
    sections.push({
      title: "Información Médica",
      fields: patientSpecificFields.map(f => ({ ...f, readOnly: false, options: dynamicOptions[f.name] || f.options }))
    });
  }

  // 4. Credenciales
  sections.push({
    title: "Credenciales",
    fields: [
      { 
        name: "examenes", 
        label: "Área de Exámenes", 
        placeholder: "Trabaja en el área de exámenes",
        type: "checkbox", 
        readOnly: false,
        hidden: id_rol !== 3
      },
      { name: "contrasena", label: "Contraseña", type: "password", icon: "lock", readOnly: false },
      { name: "confirm_contrasena", label: "Confirmar Contraseña", type: "password", icon: "lock_reset", readOnly: false },
      { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], icon: "toggle_on", readOnly: false },
    ]
  });

  return sections;
}

/**
 * Genera las secciones para EDICIÓN
 */
export function getEditUserSections(id_rol, dynamicOptions = {}) {
  const sections = [];

  // 1. Información Personal
  const personalSectionFields = [...personalFields];

  sections.push({
    title: "Información Personal",
    fields: personalSectionFields.map(f => {
      let opts = dynamicOptions[f.name] || f.options;
      if (f.name === "id_tipo_documento" && id_rol !== 5 && opts) {
          opts = opts.filter(o => Number(o.value) !== 2);
      }
      const isRestrictedField = ["id_tipo_documento", "fecha_nacimiento", "sexo"].includes(f.name);
      const isAdmin = [1, 2, 3].includes(id_rol);
      
      return {
        ...f,
        readOnly: f.name === "documento" || (isRestrictedField && !isAdmin),
        options: opts
      };
    })
  });

  // 2. Información de Contacto
  sections.push({
    title: "Información de Contacto",
    fields: contactFields.map(f => ({ ...f, readOnly: false }))
  });

  // 3. Secciones Específicas
  if (id_rol === 4) {
    sections.push({
      title: "Información Profesional",
      fields: doctorSpecificFields.map(f => ({
        ...f,
        readOnly: f.name === "registro_profesional",
        options: dynamicOptions[f.name] || f.options
      }))
    });
  } else if (id_rol === 6) {
    sections.push({
      title: "Información Laboral",
      fields: pharmacistSpecificFields.map(f => ({
        ...f,
        readOnly: false,
        options: dynamicOptions[f.name] || f.options
      }))
    });
  } else if (id_rol === 5) {
    sections.push({
      title: "Información Médica",
      fields: patientSpecificFields.map(f => ({
        ...f,
        readOnly: false,
        options: dynamicOptions[f.name] || f.options
      }))
    });
  }

  // 4. Estado del usuario (sin contraseña en edición)
  sections.push({
    title: "Credenciales",
    fields: [
      { 
        name: "examenes", 
        label: "Área de Exámenes", 
        placeholder: "Trabaja en el área de exámenes",
        type: "checkbox", 
        readOnly: false,
        hidden: id_rol !== 3
      },
      { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], icon: "toggle_on", readOnly: false },
    ]
  });

  return sections;
}

/**
 * COMPATIBILIDAD: Formulario plano (sin secciones)
 */
export function getCreateUserFormConfig(id_rol, dynamicOptions = {}) {
  const sections = getCreateUserSections(id_rol, dynamicOptions);
  return sections.flatMap(s => s.fields);
}

export function getEditUserFormConfig(id_rol, dynamicOptions = {}) {
  const sections = getEditUserSections(id_rol, dynamicOptions);
  return sections.flatMap(s => s.fields);
}

