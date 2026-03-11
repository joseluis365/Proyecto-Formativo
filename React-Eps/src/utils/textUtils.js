/**
 * Utilidades para manipulación de textos en formularios
 */

/**
 * Normaliza un texto eliminando caracteres especiales innecesarios pero
 * manteniendo letras, números, espacios y acentos válidos (áéíóúÁÉÍÓÚñÑ).
 */
export const normalizeText = (text) => {
    if (!text) return "";
    // Reemplaza múltiples espacios por uno solo
    let cleaned = text.replace(/\s{2,}/g, ' ');
    // Elimina caracteres no alfanuméricos sospechosos, excepto puntuación básica y acentos latinos
    cleaned = cleaned.replace(/[^\w\s.,;:()áéíóúÁÉÍÓÚñÑüÜ-]/g, '');
    return cleaned;
};

/**
 * Formateador de tiempo real para onChange.
 * Evita el ingreso de doble espacio y el espacio inicial.
 */
export const preventDoubleSpaces = (value) => {
    if (!value) return "";
    let str = value;
    // Evitar espacio al inicio
    if (str.startsWith(' ')) str = str.substring(1);
    // Reemplazar dobles espacios por uno solo
    str = str.replace(/\s{2,}/g, ' ');
    return str;
};
