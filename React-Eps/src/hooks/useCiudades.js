import useTableData from "./useTableData";

/**
 * Hook personalizado para la gestión de ciudades.
 * Sigue el patrón estructural del proyecto utilizando useTableData.
 */
const useCiudades = (extraParams = {}) => {
    return useTableData("/configuracion/ciudades", extraParams);
};

export default useCiudades;
