import { z } from "zod";
import { planSchema } from "./planSchema";

// El update de la licencia/plan tiene las mismas validaciones excepto que la duracion mínima es 3 meses en el request
export const updatePlanSchema = planSchema.extend({
    duracion_meses: z.union([z.number(), z.string()])
        .transform(val => Number(val))
        .refine(val => !isNaN(val), "La duracion debe ser un número valido")
        .refine(val => val >= 3, "La duracion en meses debe ser mínimo 3")
        .refine(val => val <= 99, "La duracion en meses debe ser menor a 100"),
});
