export default function Layout({title, description, children}) {
    return (
        <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-gray-800 px-6 py-12">
            <div className="w-full max-w-md flex flex-col gap-8">
                <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                    <img src="/icono.png" alt="Saluvanta EPS" className="size-10 rounded-full object-cover block dark:hidden" />
                    <img src="/icono_dark.png" alt="Saluvanta EPS" className="size-10 rounded-full object-cover hidden dark:block" />
                    <span className="text-xl font-bold text-[#0d121b] dark:text-white">Saluvanta EPS</span>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d121b] dark:text-white text-3xl font-bold tracking-tight">{title}</h2>
                    <p className="text-[#4c669a] text-sm">{description}</p>
                </div>
                {children}
            </div>
        </div>
    )
}
