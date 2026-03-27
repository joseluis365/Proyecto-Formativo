import { z } from "zod";

export const tipoDocumentoSchema = z.object({
    tipo_documento: z.string()
        .min(1, "El tipo de documento es obligatorio.")
        .max(100, "Máximo 100 caracteres.")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo debe contener letras y espacios."),
});
