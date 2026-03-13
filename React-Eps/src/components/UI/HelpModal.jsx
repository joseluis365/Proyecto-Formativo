import { useEffect, useRef } from "react";
import { useLayout } from "../../LayoutContext";

// ── Renderizadores por tipo de sección ───────────────────────────────────────

function TextSection({ content }) {
    return <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{content}</p>;
}

function ListSection({ items }) {
    return (
        <ul className="space-y-1.5">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">
                        chevron_right
                    </span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

function StepsSection({ items }) {
    return (
        <ol className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="shrink-0 flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {i + 1}
                    </span>
                    <span className="mt-0.5">{item}</span>
                </li>
            ))}
        </ol>
    );
}

function ImageSection({ src, alt, caption }) {
    return (
        <figure className="space-y-2">
            <img
                src={src}
                alt={alt}
                className="w-full max-h-64 object-contain rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
            />
            {caption && (
                <figcaption className="text-xs text-center text-gray-400 dark:text-gray-500 italic">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

function WarningSection({ content }) {
    return (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
            <span className="material-symbols-outlined text-amber-500 dark:text-amber-400 text-[20px] shrink-0 mt-0.5">
                warning
            </span>
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{content}</p>
        </div>
    );
}

function TipSection({ content }) {
    return (
        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4">
            <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 text-[20px] shrink-0 mt-0.5">
                lightbulb
            </span>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{content}</p>
        </div>
    );
}

// ── Componente de sección individual ─────────────────────────────────────────

function HelpSection({ section }) {
    const renderContent = () => {
        switch (section.type) {
            case "text":    return <TextSection    content={section.content} />;
            case "list":    return <ListSection    items={section.items} />;
            case "steps":   return <StepsSection   items={section.items} />;
            case "image":   return <ImageSection   src={section.src} alt={section.alt} caption={section.caption} />;
            case "warning": return <WarningSection content={section.content} />;
            case "tip":     return <TipSection     content={section.content} />;
            default:        return null;
        }
    };

    return (
        <div className="space-y-3">
            {section.title && (
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                    <span className="w-1.5 h-4 rounded-full bg-primary inline-block shrink-0" />
                    {section.title}
                </h3>
            )}
            {renderContent()}
        </div>
    );
}

// ── Modal principal ───────────────────────────────────────────────────────────

export default function HelpModal() {
    const { helpContent, isHelpOpen, setIsHelpOpen } = useLayout();
    const overlayRef = useRef(null);

    // Cerrar con Escape
    useEffect(() => {
        if (!isHelpOpen) return;
        const handler = (e) => { if (e.key === "Escape") setIsHelpOpen(false); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isHelpOpen, setIsHelpOpen]);

    // Bloquear scroll del body mientras está abierto
    useEffect(() => {
        document.body.style.overflow = isHelpOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isHelpOpen]);

    if (!isHelpOpen || !helpContent) return null;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) setIsHelpOpen(false);
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-9999 flex items-center justify-end bg-black/40 backdrop-blur-sm p-4"
        >
            {/* Panel */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md h-full max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-slide-in-right">

                {/* Header del modal */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-primary/5 to-transparent dark:from-primary/10 shrink-0">
                    <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[22px]">help</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">Guía de ayuda</p>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight truncate">
                            {helpContent.title}
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsHelpOpen(false)}
                        className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        title="Cerrar"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Cuerpo scrolleable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">

                    {/* Descripción general */}
                    {helpContent.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                            {helpContent.description}
                        </p>
                    )}

                    {/* Secciones */}
                    {helpContent.sections?.map((section, index) => (
                        <div key={index}>
                            <HelpSection section={section} />
                            {index < helpContent.sections.length - 1 && (
                                <hr className="mt-6 border-gray-100 dark:border-gray-800" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 shrink-0">
                    <button
                        onClick={() => setIsHelpOpen(false)}
                        className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
