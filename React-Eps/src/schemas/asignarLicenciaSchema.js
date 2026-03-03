import { z } from "zod";

export const asignarLicenciaSchema = z.object({
    nit: z.string()
        .min(1, "Debe ingresar el NIT de la empresa."),

    id_tipo_licencia: z.union([z.string(), z.number()])
        .refine(val => /^[1-9]+$/.test(val.toString()), "El tipo de licencia debe ser un número valido."),

    precio: z.union([z.string(), z.number()])
        .refine(val => !isNaN(parseFloat(val)) && isFinite(val), "El precio debe ser numérico.")
        .transform(val => parseFloat(val)),

    duracion_meses: z.union([z.string(), z.number()])
        .refine(val => Number.isInteger(Number(val)), "La duración debe ser un número entero.")
        .transform(val => parseInt(val, 10)),

    fecha_inicio: z.string()
        .min(1, "Debe ingresar la fecha de inicio.")
        .refine(val => !isNaN(Date.parse(val)), "La fecha de inicio no es válida."),

    fecha_fin: z.string()
        .min(1, "Debe ingresar la fecha de fin.")
        .refine(val => !isNaN(Date.parse(val)), "La fecha de fin no es válida.")
});
