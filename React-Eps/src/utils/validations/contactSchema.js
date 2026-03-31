import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  phone: z.string().regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos numéricos"),
  subject: z.string().min(1, "Debe seleccionar un asunto"),
  message: z.string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(500, "El mensaje no puede superar los 500 caracteres")
});
