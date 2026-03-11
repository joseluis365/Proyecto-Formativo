import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import api from "../../Api/axios";
import { contactSchema } from "../../utils/validations/contactSchema";

import FormInput from "../UI/FormInput";
import FormSelect from "../UI/FormSelect";
import FormTextArea from "../UI/FormTextArea";
import BlueButton from "../UI/BlueButton";

export default function ContactForm({config}) {
    const { content, fields, options } = config;
    const { title, icon, submitButton } = content;
    
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(contactSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
        }
    });

    const messageValue = watch("message") || "";
    const messageLength = messageValue.length;
    const isOverLimit = messageLength > 500;
    const isNearLimit = messageLength >= 450 && messageLength <= 500;

    let counterColorClass = "text-slate-500 dark:text-slate-400";
    if (isOverLimit) {
        counterColorClass = "text-red-500 font-bold";
    } else if (isNearLimit) {
        counterColorClass = "text-yellow-500 font-bold";
    }

    const onSubmit = async (data) => {
        if (isOverLimit) return;
        
        setSubmitting(true);
        try {
            await api.post("/contacto", data);
            Swal.fire({
                icon: "success",
                title: "¡Mensaje Enviado!",
                text: "Nos pondremos en contacto contigo muy pronto.",
                confirmButtonColor: "#0ea5e9"
            });
            reset();
        } catch (error) {
            console.error("Error enviando mensaje de contacto:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrió un error al enviar el mensaje. Inténtalo de nuevo más tarde."
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{icon}</span>
                {title}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        {...fields[0]} 
                        {...register("name")}
                        error={errors.name?.message}
                    />
                    <FormInput 
                        {...fields[1]} 
                        {...register("email")}
                        error={errors.email?.message}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput 
                        {...fields[2]} 
                        {...register("phone")}
                        error={errors.phone?.message}
                    />
                    <FormSelect 
                        label="Asunto" 
                        options={options} 
                        id="subject" 
                        {...register("subject")}
                        error={errors.subject?.message}
                    />
                </div>
                
                <div>
                    <FormTextArea 
                        label="Mensaje" 
                        placeholder="Escribe tu mensaje aquí..." 
                        id="message" 
                        {...register("message")}
                        error={errors.message?.message || (isOverLimit ? "El mensaje no puede superar los 500 caracteres" : undefined)}
                    />
                    <div className="flex justify-between items-center mt-1 px-1">
                        <span className={`text-xs ml-auto transition-colors ${counterColorClass}`}>
                            {messageLength} / 500 caracteres
                        </span>
                    </div>
                </div>

                <BlueButton 
                    text={submitting ? "Enviando..." : submitButton.text} 
                    icon={submitting ? "hourglass_empty" : submitButton.icon} 
                    type="submit"
                    disabled={submitting || isOverLimit}
                />
            </form>
        </div>
    )
}
