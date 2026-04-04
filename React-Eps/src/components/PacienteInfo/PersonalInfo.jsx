import PersonalInfoItem from "./PersonalInfoItem";

export default function PersonalInfo({Info}) {
    return (
        <section>
            <div className="flex items-center gap-3 mb-6">
                <BadgeRoundedIcon className="text-primary" sx={{ fontSize: "1.5rem" }} />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Datos Personales</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {Info.map((item) => (
                    <PersonalInfoItem key={item.label} label={item.label} value={item.value} />
                ))}
            </div>
        </section>
    )
}
