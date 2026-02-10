export const editUserFormConfig = {
  2: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "email", label: "Correo", type: "email" },
    { name: "status", label: "Estado", type: "select" },
    { name: "role", label: "Rol", type: "select" },
  ],

  3: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "especialidad", label: "Especialidad", type: "text" },
    { name: "registro_medico", label: "Registro médico", type: "text" },
    { name: "status", label: "Estado", type: "select" },
  ],

  1: [
    { name: "name", label: "Nombre", type: "text" },
    { name: "id", label: "Documento", type: "number" },
    { name: "email", label: "Correo", type: "email" },
    { name: "status", label: "Estado", type: "select", options: [{ value: "ACTIVO", label: "Activo" }, { value: "INACTIVO", label: "Inactivo" }] },
  ],
};

export const createUserFormConfig = {
  1: [
    { name: "id", label: "Documento", type: "number" },
    { name: "name", label: "Nombre", type: "text" },
    { name: "email", label: "Correo", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
    { name: "status", label: "Estado", type: "select", options: [{ value: "ACTIVO", label: "Activo" }, { value: "INACTIVO", label: "Inactivo" }] },
  ],
};
