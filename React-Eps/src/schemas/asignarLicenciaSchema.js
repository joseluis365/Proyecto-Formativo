import { z } from "zod";

export const asignarLicenciaSchema = z.object({
    licencia_id: z.union([z.string(), z.number()])
        .refine(val => {
            if (val === "" || val === null || val === undefined) return false;
            return /^[0-9]+$/.test(val.toString());
        }, "Debe seleccionar un plan."),

    precio: z.union([z.string(), z.number()])
        .refine(val => {
            if (val === "" || val === null || val === undefined) return false;
            const strVal = String(val);
            // Permitir números y caracteres del formato de moneda ($, coma, punto, espacios)
            if (!/^[\$\s\.\,\d\xA0\u202F]+$/.test(strVal)) return false;
            const num = parseFloat(strVal.replace(/[^\d]/g, ''));
            return !isNaN(num) && num >= 0 && num <= 99999999;
        }, "Debe tener formato de moneda y no superar los $ 99.999.999.")
        .transform(val => parseFloat(String(val).replace(/[^\d]/g, ''))),

    fecha_inicio: z.string()
        .min(1, "Debe ingresar la fecha de inicio.")
        .refine(val => !isNaN(Date.parse(val)), "La fecha de inicio no es válida."),

    fecha_fin: z.string()
        .min(1, "Debe ingresar la fecha de fin.")
        .refine(val => !isNaN(Date.parse(val)), "La fecha de fin no es válida.")
});
