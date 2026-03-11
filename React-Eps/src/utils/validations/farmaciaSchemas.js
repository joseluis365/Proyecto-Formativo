import { z } from 'zod';

const REQUIRED_ID = "Debe seleccionar una opción válida";

// Genéricos
export const idSchema = z.union([
    z.string().min(1, REQUIRED_ID),
    z.number().int().positive(REQUIRED_ID)
]);

export const textSchema = (min = 3, max = 120, label = "Este campo") => z.string()
    .min(min, `${label} debe tener al menos ${min} caracteres`)
    .max(max, `${label} no puede exceder ${max} caracteres`)
    .regex(/^[a-zA-Z0-9\s.,;:\-()áéíóúÁÉÍÓÚñÑüÜ]+$/, `${label} contiene caracteres especiales no válidos`);

export const cantidadSchema = z.coerce.number()
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
    .max(1000000, "La cantidad ingresada es demasiado alta");

// Específicos para Farmacia
export const entradaInventarioSchema = z.object({
    id_presentacion: idSchema,
    cantidad: cantidadSchema,
    fecha_vencimiento: z.string().refine((val) => {
        if (!val) return false;
        const dateStr = val.split("T")[0];
        const today = new Date().toISOString().split("T")[0];
        return dateStr >= today;
    }, { message: "La fecha de vencimiento no puede ser anterior a hoy" }),
    motivo: textSchema(5, 500, "El motivo")
});

export const salidaInventarioSchema = z.object({
    id_lote: idSchema,
    cantidad: cantidadSchema,
    motivo: textSchema(5, 500, "El motivo")
});
