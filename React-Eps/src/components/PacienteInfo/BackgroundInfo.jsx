

import BackgroundItem from "./BackgroundItem";

export default function BackgroundInfo({icon, title, data}) {
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary-green text-2xl">{icon}</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}
                </h3>
            </div>
            <ul className="space-y-2 text-sm list-disc marker:text-gray-500 list-inside">
                {data.map((item) => (
                    <BackgroundItem key={item.label} label={item.label} items={item.items} />
                ))}
            </ul>
        </section>
    )
}