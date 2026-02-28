export default function Title({title, description}) {
    return (
        <section className="bg-blue-50 dark:bg-gray-700 py-6 px-6 md:px-10 lg:px-40 border-b border-blue-100 dark:border-gray-600">
            <div className="max-w-[1280px] mx-auto">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none">{title}</h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{description}</p>
            </div>
        </section>
    );
}