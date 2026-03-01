import CompanyCard from "./CompanyCard";

export default function CompaniesSection({ companies, onAssignLicense, onRenew, onView, onActive }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company, index) => (
          <CompanyCard
            key={company.nit || index}
            company={company.nombre}
            email={company.email}
            licenseType={company.licenseType}
            status={company.id_estado}
            onAssignLicense={() => onAssignLicense(company)}
            onView={() => onView(company)}
            onRenew={() => onRenew(company)}
            onActive={() => onActive(company)}
          />
        ))}
      </div>
    </>
  )
}
