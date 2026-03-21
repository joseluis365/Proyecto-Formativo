import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function EnfermedadModal({ isOpen, onClose, onSuccess, editData }) {
    const [formData, setFormData] = useState({
        codigo_icd: "",
        nombre: "",
        descripcion: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                codigo_icd: editData.codigo_icd || "",
                nombre: editData.nombre || "",
                descripcion: editData.descripcion || ""
            });
        } else {
            setFormData({
                codigo_icd: "",
                nombre: "",
                descripcion: ""
            });
        }
    }, [editData, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editData) {
                await api.put(`/enfermedades/${editData.codigo_icd}`, formData);
                Swal.fire("Éxito", "Enfermedad actualizada correctamente", "success");
            } else {
                await api.post("/enfermedades", formData);
                Swal.fire("Éxito", "Enfermedad registrada correctamente", "success");
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                Swal.fire("Error", "Ocurrió un error al procesar la solicitud", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden my-8"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary dark:bg-primary/50 dark:text-blue-400">
                            <span className="material-symbols-outlined text-3xl">vaccines</span>
                        </div>
                        <h2 className="text-xl font-bold dark:text-white">
                            {editData ? "Editar Enfermedad" : "Nueva Enfermedad"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Código ICD-11 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="codigo_icd"
                                value={formData.codigo_icd}
                                onChange={handleChange}
                                disabled={!!editData}
                                placeholder="Ej: 1A00.0"
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.codigo_icd ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-primary"
                                } ${editData ? 'opacity-70 cursor-not-allowed' : ''}`}
                            />
                            {errors.codigo_icd && <p className="text-red-500 text-xs mt-1">{errors.codigo_icd[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre de la Enfermedad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Nombre completo"
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.nombre ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-primary"
                                }`}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descripción
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Detalles clínicos o descripción de la patología..."
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.descripcion ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-primary"
                                }`}
                            ></textarea>
                            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion[0]}</p>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.nombre.trim() || !formData.codigo_icd.trim()}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin shadow-sm">refresh</span>
                            ) : editData ? (
                                "Actualizar"
                            ) : (
                                "Guardar"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
