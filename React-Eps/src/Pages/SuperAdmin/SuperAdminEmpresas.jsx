import PrincipalText from "../../components/Users/PrincipalText"
import Input from "../../components/UI/Input"
import Filter from "../../components/UI/Filter"
import { useState } from "react"
import CompaniesSection from "../../components/SuperAdmin/CompaniesSection"
import { superAdminCompanies } from "../../data/SuperAdminForms";

export default function SuperAdminEmpresas() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [statusOptions, setStatusOptions] = useState([
        { value: "", label: "Todos" },
        { value: "ACTIVO", label: "Activos" },
        { value: "INACTIVO", label: "Inactivos" },
    ]);
    return (
        <>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText
                  icon="badge"
                  text="Empresas Registradas"
                  number={3}
                />
                <button onClick={() => setCreating(true)} className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
                      Agregar Empresa
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">add</span>
                    </button>
              </div>
        
              {/* FILTROS */}
              <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <Input
                  placeholder="Buscar usuario"
                  icon="search"
                  value={"Hol"}
                  onChange={(e) => setSearch(e.target.value)}
                />
        
                <Filter
                  value={"status"}
                  onChange={setStatus}
                  options={statusOptions}
                  placeholder="Filtrar por estado"
                />
              </div>
              <CompaniesSection companies={superAdminCompanies.fields} />
        </>
    )
}