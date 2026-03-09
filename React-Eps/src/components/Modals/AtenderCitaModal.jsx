import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import BaseModal from "@/components/Modals/BaseModal";
import ModalHeader from "@/components/Modals/ModalHeader";
import BlueButton from "@/components/UI/BlueButton";
import api from "@/Api/axios";
import Swal from "sweetalert2";
import useEspecialidades from "@/hooks/useEspecialidades";
import usePrioridades from "@/hooks/usePrioridades";
import { AnimatePresence, motion } from "framer-motion";

export default function AtenderCitaModal({ isOpen, onClose, cita, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const { specialties } = useEspecialidades();
    const { prioridades } = usePrioridades();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            diagnostico: "",
            tratamiento: "",
            observaciones: "",
            remisiones: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "remisiones",
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post(`/cita/${cita.id_cita}/atender`, data);
            Swal.fire({
                title: "¡Éxito!",
                text: "La atención médica ha sido registrada correctamente.",
                icon: "success",
                confirmButtonColor: "#3B82F6",
            });
            reset();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Error atendiendo cita:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "No se pudo registrar la atención.",
                icon: "error",
                confirmButtonColor: "#EF4444",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal>
            <div className="flex flex-col max-h-[90vh]">
                <ModalHeader
                    title={`Atender Paciente: ${cita.paciente?.primer_nombre} ${cita.paciente?.primer_apellido}`}
                    icon="medical_information"
                    onClose={onClose}
                />

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Sección de Evolución Clínica */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">clinical_notes</span>
                                Evolución Clínica
                            </h3>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnóstico</label>
                                <textarea
                                    {...register("diagnostico", { required: "El diagnóstico es obligatorio" })}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary h-24"
                                    placeholder="Escriba el diagnóstico médico..."
                                />
                                {errors.diagnostico && <p className="text-red-500 text-xs">{errors.diagnostico.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tratamiento</label>
                                <textarea
                                    {...register("tratamiento", { required: "El tratamiento es obligatorio" })}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary h-24"
                                    placeholder="Instrucciones médicas y medicación..."
                                />
                                {errors.tratamiento && <p className="text-red-500 text-xs">{errors.tratamiento.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones (Opcional)</label>
                                <textarea
                                    {...register("observaciones")}
                                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary h-20"
                                    placeholder="Notas adicionales..."
                                />
                            </div>
                        </div>

                        {/* Sección de Remisiones */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">outpatient</span>
                                    Remisiones y Órdenes
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => append({ tipo_remision: "cita", id_especialidad: "", id_prioridad: "", notas: "" })}
                                    className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark p-2 rounded-lg hover:bg-primary/5 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">add_circle</span>
                                    Agregar Remisión
                                </button>
                            </div>

                            <AnimatePresence>
                                {fields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 space-y-4 relative"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Tipo</label>
                                                <select
                                                    {...register(`remisiones.${index}.tipo_remision`, { required: true })}
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                                >
                                                    <option value="cita">Cita Especialista</option>
                                                    <option value="examen">Examen Clínico</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Prioridad</label>
                                                <select
                                                    {...register(`remisiones.${index}.id_prioridad`, { required: true })}
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                                >
                                                    <option value="">Seleccionar Prioridad</option>
                                                    {prioridades.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                                </select>
                                            </div>

                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Especialidad Destino</label>
                                                <select
                                                    {...register(`remisiones.${index}.id_especialidad`)}
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                                >
                                                    <option value="">No aplica (General)</option>
                                                    {specialties.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </select>
                                            </div>

                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Notas de Remisión</label>
                                                <textarea
                                                    {...register(`remisiones.${index}.notas`, { required: "Las notas son obligatorias" })}
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 h-20"
                                                    placeholder="Justificación de la remisión..."
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {fields.length === 0 && (
                                <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                                    <p className="text-gray-400 text-sm">No se han agregado remisiones o exámenes para este paciente.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-6 sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-6">
                            <div className="w-full md:w-64">
                                <BlueButton
                                    text="Finalizar Atención"
                                    icon="task_alt"
                                    type="submit"
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </BaseModal>
    );
}
