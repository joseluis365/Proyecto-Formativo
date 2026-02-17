export const editUserFormConfig = {
  2: [
    { name: "documento", label: "Documento", type: "number", readOnly: false },
    { name: "nombre", label: "Nombre", type: "text", readOnly: false },
    { name: "email", label: "Correo", type: "email", readOnly: false },
    { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false },
    { name: "id_rol", label: "Rol", type: "select", readOnly: false },
  ],

  3: [
    { name: "documento", label: "Documento", type: "number", readOnly: true },
    { name: "nombre", label: "Nombre", type: "text", readOnly: false },
    { name: "apellido", label: "Apellido", type: "text", readOnly: false },
    { name: "email", label: "Correo", type: "email", readOnly: false },
    { name: "telefono", label: "Telefono", type: "number", readOnly: false },
    { name: "direccion", label: "Direccion", type: "text", readOnly: false },
    { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", readOnly: false },
    { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false },
  ],

  1: [
    { name: "nombre", label: "Nombre", type: "text", readOnly: false },
    { name: "documento", label: "Documento", type: "number", readOnly: false },
    { name: "email", label: "Correo", type: "email", readOnly: false },
    { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false },
  ],
};

export const createUserFormConfig = {
  3: [
    { name: "documento", label: "Documento", type: "number", readOnly: false },
    { name: "nombre", label: "Nombre", type: "text", readOnly: false },
    { name: "apellido", label: "Apellido", type: "text", readOnly: false },
    { name: "email", label: "Correo", type: "email", readOnly: false },
    { name: "telefono", label: "Telefono", type: "number", readOnly: false },
    { name: "direccion", label: "Direccion", type: "text", readOnly: false },
    { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", readOnly: false },
    { name: "contrasena", label: "Contraseña", type: "password", readOnly: false  },
    { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false },
  ],
};


