import useTableData from "./useTableData";

const useTiposDocumento = (extraParams = {}) => {
    return useTableData("/tipos-documento", { ...extraParams, paginate: true });
};

export default useTiposDocumento;
