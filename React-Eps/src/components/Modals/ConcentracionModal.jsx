import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/Api/axios";
import Swal from "sweetalert2";
import MuiIcon from "@/components/UI/MuiIcon";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';

export default function ConcentracionModal({ isOpen, onClose, onSuccess, editData }) {
    const [formData, setFormData] = useState({
        concentracion: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                concentracion: editData.concentracion,
            });
        }
    }, [editData]);

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
                await api.put(`/configuracion/concentraciones/${editData.id_concentracion}`, formData);
                Swal.fire("Éxito", "Concentración actualizada correctamente", "success");
            } else {
                await api.post("/configuracion/concentraciones", formData);
                Swal.fire("Éxito", "Concentración registrada correctamente", "success");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary dark:bg-primary/50 dark:text-blue-400">
                        <MuiIcon name="medication" sx={{ fontSize: '1.875rem' }} />
                    </div>
                    <h2 className="text-xl font-bold dark:text-white">
                        {editData ? "Editar Concentración" : "Nueva Concentración"}
                    </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                        <CloseRoundedIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Valor de la concentración <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="concentracion"
                                value={formData.concentracion}
                                onChange={handleChange}
                                placeholder="Ej: 500mg, 1g, 0.5%"
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.concentracion ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            />
                            {errors.concentracion && (
                                <p className="text-red-500 text-xs mt-1">{errors.concentracion[0]}</p>
                            )}
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
                            disabled={loading || !formData.concentracion.trim()}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                        >
                            {loading ? (
                                <AutorenewRoundedIcon className="animate-spin" />
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
