import useTableData from "./useTableData";

/**
 * Hook personalizado para la gestión de farmacias.
 * Sigue el patrón estructural del proyecto utilizando useTableData.
 */
const useFarmacias = (extraParams = {}) => {
    return useTableData("/farmacias", extraParams);
};

export default useFarmacias;
