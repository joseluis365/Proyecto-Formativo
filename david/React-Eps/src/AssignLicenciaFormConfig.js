export const assignLicenciaFormConfig = {
  1: [
    {
      name: "licencia_id",
      label: "Tipo de licencia",
      type: "select",
      options: [], // se llena dinámicamente
    },
    {
      name: "precio",
      label: "Precio",
      type: "text",
      disabled: true,
    },
    {
      name: "fecha_inicio",
      label: "Fecha inicio",
      type: "date",
    },
    {
      name: "fecha_fin",
      label: "Fecha fin",
      type: "date",
      disabled: true,
    },
  ],
};
