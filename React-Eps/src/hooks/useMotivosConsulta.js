import useTableData from "./useTableData";

const useMotivosConsulta = (extraParams = {}) => {
    // Agregamos paginate=true para solicitar el formato CRUD al API en vez de select list
    return useTableData("/motivos-consulta", { ...extraParams, paginate: true });
};

export default useMotivosConsulta;
