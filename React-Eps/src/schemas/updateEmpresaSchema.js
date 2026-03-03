import { empresaSchema } from "./empresaSchema";

// El update de la empresa tiene las mismas validaciones excepto que no requiere la contraseña del admin
export const updateEmpresaSchema = empresaSchema.omit({
    admin_password: true,
});
