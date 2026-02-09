import ContactForm from "./ContactForm";
import ContactItem from "./ContactItem";

export default function FormSection({canales, emails, horarios, config}) {
    
    return (
        <section className="px-6 md:px-10 lg:px-40 py-6 bg-white dark:bg-background-dark">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <ContactForm config={config} />
                </div>
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                        <h2 className="text-sm font-black text-primary uppercase tracking-wider mb-4">Canales de Atención</h2>
                        <div className="space-y-4">
                            <ContactItem icon="call" title="Líneas Telefónicas" description={canales}  />
                            <ContactItem icon="mail" title="Correo Electrónico" description={emails}  />
                            <ContactItem icon="schedule" title="Horario de Oficinas" description={horarios}  />
                        </div>
                    </div>
                    <div className="bg-primary rounded-xl p-4 text-white flex items-center gap-4">
                        <span className="material-symbols-outlined text-3xl opacity-80">support_agent</span>
                        <div>
                            <p className="text-xs font-bold">¿Necesitas ayuda urgente?</p>
                            <p className="text-[10px] opacity-90">Chatea con un asesor en tiempo real ahora mismo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}