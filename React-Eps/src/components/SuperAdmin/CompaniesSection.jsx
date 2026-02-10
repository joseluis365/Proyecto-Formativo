import CompanyCard from "./CompanyCard";

export default function CompaniesSection({ companies }) {
    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {companies.map((company) => (
                          <CompanyCard
                            key={company.id}
                            company={company.nombre}
                            email={company.email}
                            expiresAt={company.expiresAt}
                            status={company.id_estado}
                          />
                        ))}
                      </div>
        </>
    )
}