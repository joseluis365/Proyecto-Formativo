export const createLicenciaFormConfig = {
  1: [
    { name: "tipo", label: "Tipo", type: "text", readOnly: false },
    { name: "descripcion", label: "Descripcion", type: "text", readOnly: false },
    { name: "duracion_meses", label: "Duracion Meses", type: "number", readOnly: false },
    { name: "precio", label: "Precio", type: "number", readOnly: false },
    { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }], readOnly: false },
  ],
  2: [
    { name: "tipo", label: "Tipo", type: "text" },
    { name: "descripcion", label: "Descripcion", type: "text" },
    { name: "duracion_meses", label: "Duracion Meses", type: "number" },
    { name: "precio", label: "Precio", type: "number"  },
    { name: "id_estado", label: "Estado", type: "select", options: [{ value: 1, label: "Activo" }, { value: 2, label: "Inactivo" }] },
  ],
};