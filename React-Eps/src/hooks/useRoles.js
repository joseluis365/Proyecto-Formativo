import useTableData from "./useTableData";

/**
 * Hook personalizado para la gestión de roles.
 * Sigue el patrón estructural del proyecto utilizando useTableData.
 */
const useRoles = (extraParams = {}) => {
    return useTableData("/configuracion/roles", extraParams);
};

export default useRoles;
