import FormInput from "../UI/FormInput";
import FormSelect from "../UI/FormSelect";
import FormTextArea from "../UI/FormTextArea";
import BlueButton from "../UI/BlueButton";

export default function ContactForm({config}) {
    const { content, fields, options } = config;
    const { title, icon, submitButton } = content;
    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{icon}</span>
                {title}
            </h2>
            <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.slice(0, 2).map((field) => (
                        <FormInput key={field.id} {...field} />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput {...fields[2]} />
                    <FormSelect 
                        label="Asunto" 
                        options={options} 
                        id="subject" 
                        name="subject"
                    />
                </div>
                <FormTextArea label="Mensaje" placeholder="Escribe tu mensaje aquí..." id="message" name="message"/>
                <BlueButton 
                    text={submitButton.text} 
                    icon={submitButton.icon} 
                />
            </form>
        </div>
    )
}