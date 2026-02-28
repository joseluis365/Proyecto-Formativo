import useTableData from "./useTableData";

/**
 * Hook personalizado para la gestión de estados.
 * Sigue el patrón estructural del proyecto utilizando useTableData.
 */
const useEstados = (extraParams = {}) => {
    return useTableData("/configuracion/estados", extraParams);
};

export default useEstados;
