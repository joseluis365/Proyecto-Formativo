export default function DoctorInfo({name, specialty, office, status}) {
    const isActive = status === "ACTIVO"

    const statusClasses = isActive
        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-neutral-gray-border/20 dark:border-gray-800 p-6 flex items-start gap-6">
            <div className="shrink-0 size-16 rounded-full bg-center bg-cover"
                style={{ backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg")' }}>
            </div>
            <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                <div>
                    <p className="text-sm text-neutral-gray-text dark:text-gray-400">Nombre</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">Dr. {name}</p>
                </div>
                <div>
                    <p className="text-sm text-neutral-gray-text dark:text-gray-400">Especialidad</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{specialty}</p>
                </div>
                <div>
                    <p className="text-sm text-neutral-gray-text dark:text-gray-400">Consultorio</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{office}</p>
                </div>
                <div>
                    <p className="text-sm text-neutral-gray-text dark:text-gray-400">Estado</p>
                    <span
                        className={`px-2.5 py-1 text-xs font-semibold leading-none rounded-full inline-block ${statusClasses}`}>{status}</span>
                </div>
            </div>
        </div>
    )
}