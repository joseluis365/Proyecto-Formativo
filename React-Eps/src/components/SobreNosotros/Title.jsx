export default function Title({title, description, image}) {
    return (
        <section className="relative w-full h-[280px] md:h-[320px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/40 z-10"></div>
            <div className="absolute inset-0 bg-center bg-cover" style={{backgroundImage: `url(${image})`}}></div>
            <div className="relative z-20 text-center px-6">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">{title}</h1>
                <p className="text-white/90 text-base md:text-lg max-w-xl mx-auto font-medium">{description}</p>
            </div>
        </section>
    );
}