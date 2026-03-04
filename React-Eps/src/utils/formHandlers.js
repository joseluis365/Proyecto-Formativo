/**
 * Mapea errores de validación de Laravel (422) a campos de React Hook Form
 * @param {Object} error - El error capturado por Axios
 * @param {Function} setError - La función setError de react-hook-form
 * @returns {boolean} - true si el error fue manejado como 422, false de lo contrario
 */
export const handleApiErrors = (error, setError) => {
    if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((key) => {
            setError(key, {
                type: "server",
                message: backendErrors[key][0],
            });
        });
        return true;
    }
    return false;
};
