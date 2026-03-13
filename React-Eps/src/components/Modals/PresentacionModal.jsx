import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function PresentacionModal({ isOpen, onClose, onSuccess, editData }) {
    const [formData, setFormData] = useState({
        id_medicamento: "",
        id_concentracion: "",
        id_forma_farmaceutica: ""
    });
    
    const [medicamentos, setMedicamentos] = useState([]);
    const [concentraciones, setConcentraciones] = useState([]);
    const [formas, setFormas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchSelects();
        if (editData) {
            setFormData({
                id_medicamento: editData.id_medicamento,
                id_concentracion: editData.id_concentracion,
                id_forma_farmaceutica: editData.id_forma_farmaceutica
            });
        }
    }, [editData]);

    const fetchSelects = async () => {
        try {
            const [resMed, resCon, resForm] = await Promise.all([
                api.get("/configuracion/medicamentos?nopaginate=true&id_estado=1"),
                api.get("/farmacia/concentraciones"),
                api.get("/farmacia/formas-farmaceuticas")
            ]);
            setMedicamentos(resMed.data.data || []);
            setConcentraciones(resCon.data.data || []);
            setFormas(resForm.data.data || []);
        } catch (error) {
            console.error("Error cargando opciones:", error);
            Swal.fire("Error", "No se pudieron cargar las listas de selección", "error");
        }
    };

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
                await api.put(`/configuracion/presentaciones/${editData.id_presentacion}`, formData);
                Swal.fire("Éxito", "Presentación modificada correctamente", "success");
            } else {
                await api.post("/configuracion/presentaciones", formData);
                Swal.fire("Éxito", "Presentación registrada correctamente", "success");
            }
            onSuccess();
            onClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                Swal.fire("Error", "Ocurrió un error al procesar la solicitud, es posible que la combinación ya exista.", "error");
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
                    <h2 className="text-xl font-bold dark:text-white">
                        {editData ? "Editar Presentación" : "Nueva Presentación"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                Una presentación es la combinación exacta de un medicamento, su concentración y su forma física (Ej: Paracetamol + 500mg + Tableta).
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Medicamento Base <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="id_medicamento"
                                value={formData.id_medicamento}
                                onChange={handleChange}
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white outline-none transition-all ${
                                    errors.id_medicamento ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            >
                                <option value="">Seleccione el medicamento</option>
                                {medicamentos.map(med => (
                                    <option key={med.id_medicamento} value={med.id_medicamento}>
                                        {med.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.id_medicamento && <p className="text-red-500 text-xs mt-1">{errors.id_medicamento[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Concentración <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="id_concentracion"
                                value={formData.id_concentracion}
                                onChange={handleChange}
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white outline-none transition-all ${
                                    errors.id_concentracion ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            >
                                <option value="">Seleccione la concentración</option>
                                {concentraciones.map(con => (
                                    <option key={con.id_concentracion} value={con.id_concentracion}>
                                        {con.concentracion}
                                    </option>
                                ))}
                            </select>
                            {errors.id_concentracion && <p className="text-red-500 text-xs mt-1">{errors.id_concentracion[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Forma Farmacéutica <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="id_forma_farmaceutica"
                                value={formData.id_forma_farmaceutica}
                                onChange={handleChange}
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white outline-none transition-all ${
                                    errors.id_forma_farmaceutica ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            >
                                <option value="">Seleccione la forma</option>
                                {formas.map(form => (
                                    <option key={form.id_forma} value={form.id_forma}>
                                        {form.forma_farmaceutica}
                                    </option>
                                ))}
                            </select>
                            {errors.id_forma_farmaceutica && <p className="text-red-500 text-xs mt-1">{errors.id_forma_farmaceutica[0]}</p>}
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
                            disabled={loading || !formData.id_medicamento || !formData.id_concentracion || !formData.id_forma_farmaceutica}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                            ) : editData ? (
                                "Actualizar"
                            ) : (
                                "Crear Presentación"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
