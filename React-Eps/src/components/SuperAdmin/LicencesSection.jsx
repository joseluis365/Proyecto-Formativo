import LicenseCard from "./LicenseCard";

export default function LicencesSection({ licenses, onUpdate }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {licenses.map((license) => (
          <LicenseCard
            key={license.id}
            id={license.id}
            tipo={license.tipo}
            duration={license.duracion_meses}
            description={license.descripcion}
            price={license.precio}
            companies={license.companies}
            status={license.id_estado}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </>
  )
}