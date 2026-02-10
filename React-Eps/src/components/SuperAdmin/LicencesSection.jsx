import LicenseCard from "./LicenseCard";

export default function LicencesSection({ licenses }) {
    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {licenses.map((license) => (
                          <LicenseCard
                            key={license.id}
                            duration={license.duracion}
                            description={license.descripcion}
                            price={license.precio}
                            companies={license.empresas}
                            status={license.id_estado}
                          />
                        ))}
                      </div>
        </>
    )
}