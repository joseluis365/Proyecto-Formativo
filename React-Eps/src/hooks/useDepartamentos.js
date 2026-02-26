import useTableData from "./useTableData";

/**
 * Hook personalizado para la gestión de departamentos.
 * Sigue el patrón estructural del proyecto utilizando useTableData.
 */
const useDepartamentos = (extraParams = {}) => {
    return useTableData("/configuracion/departamentos", extraParams);
};

export default useDepartamentos;
