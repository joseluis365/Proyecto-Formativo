import { z } from "zod";
import { empresaSchema } from "./empresaSchema";

/**
 * Esquema para actualización de empresas.
 * Mantiene las validaciones estrictas para los campos editables,
 * pero es flexible con los campos de solo lectura o internos para evitar bloqueos.
 */
export const updateEmpresaSchema = empresaSchema.omit({
    admin_password: true,
}).extend({
    // Estos campos son de solo lectura en el formulario o no están presentes.
    // Los definimos como z.any().optional() para que el valor existente en DB 
    // (que puede no cumplir las nuevas reglas estrictas de creación) no bloquee la edición.
    nit: z.any().optional(),
    nombre: z.any().optional(),
    documento_representante: z.any().optional(),
    admin_documento: z.any().optional(),
    id_departamento: z.any().optional(),
    id_ciudad: z.any().optional(),
    id_estado: z.any().optional(),

    // El resto de campos (email_contacto, telefono, direccion, nombres admin, etc.)
    // HEREDAN las validaciones estrictas de empresaSchema automáticamente.
});
