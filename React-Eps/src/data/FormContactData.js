export const CONTACT_CONTENT = {
  title: "Formulario de Contacto",
  icon: "edit_note",
  submitButton: {
    text: "Enviar Mensaje",
    icon: "send"
  }
};

export const CONTACT_FIELDS = [
  {
    id: "name",
    name: "name",
    label: "Nombre Completo",
    placeholder: "Ej. Juan Pérez",
    type: "text",
    gridCols: "md:grid-cols-2" // Para manejo opcional de diseño
  },
  {
    id: "email",
    name: "email",
    label: "Correo Electrónico",
    placeholder: "juan@ejemplo.com",
    type: "email"
  },
  {
    id: "phone",
    name: "phone",
    label: "Teléfono de Contacto",
    placeholder: "300 123 4567",
    type: "tel"
  }
];

export const SUBJECT_OPTIONS = [
  { value: "Información General", label: "Información General" },
  { value: "Citas Médicas", label: "Citas Médicas" },
  { value: "Trámites Administrativos", label: "Trámites Administrativos" },
  { value: "Sugerencias / PQRS", label: "Sugerencias / PQRS" }
];

const FormContactData = {
    content: CONTACT_CONTENT,
    fields: CONTACT_FIELDS,
    options: SUBJECT_OPTIONS
};

export default FormContactData;