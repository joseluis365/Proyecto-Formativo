import { z } from "zod";

export const planSchema = z.object({
    tipo: z.string()
        .min(1, "El tipo es obligatorio")
        .min(3, "El tipo debe tener al menos 3 caracteres")
        .max(40, "El tipo debe tener menos de 40 caracteres")
        .regex(/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+)*$/, "El tipo debe contener al menos una letra y no puede contener caracteres especiales"),

    descripcion: z.string()
        .min(1, "La descripcion es obligatoria")
        .min(10, "La descripcion debe tener al menos 10 caracteres")
        .max(250, "La descripcion debe tener menos de 250 caracteres")
        .regex(/^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñ])[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ0-9-]+)*$/, "La descripcion debe contener al menos una letra y no puede contener caracteres especiales"),

    precio: z.union([z.number(), z.string()])
        .transform(val => Number(val))
        .refine(val => !isNaN(val), "El precio debe ser un número valido")
        .refine(val => val >= 100000, "El precio mínimo permitido es de $100.000 COP")
        .refine(val => val <= 999999999, "El precio excede el máximo permitido"),

    duracion_meses: z.union([z.number(), z.string()])
        .transform(val => Number(val))
        .refine(val => !isNaN(val), "La duracion debe ser un número valido")
        .refine(val => val >= 1, "La duracion en meses debe ser mínimo 1")
        .refine(val => val <= 99, "La duracion en meses debe ser menor a 100"),

    id_estado: z.union([z.number(), z.string()])
        .transform(val => String(val))
        .refine(val => /^[1-9][0-9]*$/.test(val), "El estado debe ser un número valido")
        .refine(val => val.length >= 1 && val.length <= 2, "El estado debe tener entre 1 y 2 dígitos")
});
