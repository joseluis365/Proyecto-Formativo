import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/Api/axios";
import Swal from "sweetalert2";

export default function MedicamentoModal({ isOpen, onClose, onSuccess, editData }) {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        id_categoria: ""
    });
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategorias();
        if (editData) {
            setFormData({
                nombre: editData.nombre,
                descripcion: editData.descripcion || "",
                id_categoria: editData.id_categoria
            });
        }
    }, [editData]);

    const fetchCategorias = async () => {
        try {
            const res = await api.get("/farmacia/categorias");
            setCategorias(res.data || []);
        } catch (error) {
            console.error("Error cargando categorías:", error);
            Swal.fire("Error", "No se pudieron cargar las categorías", "error");
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
                await api.put(`/configuracion/medicamentos/${editData.id_medicamento}`, formData);
                Swal.fire("Éxito", "Medicamento actualizado correctamente", "success");
            } else {
                await api.post("/configuracion/medicamentos", formData);
                Swal.fire("Éxito", "Medicamento registrado correctamente", "success");
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
                    <h2 className="text-xl font-bold dark:text-white">
                        {editData ? "Editar Medicamento Base" : "Nuevo Medicamento Base"}
                    </h2>
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
                                Nombre Médico <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Amoxicilina, Paracetamol"
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.nombre ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="id_categoria"
                                value={formData.id_categoria}
                                onChange={handleChange}
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white outline-none transition-all ${
                                    errors.id_categoria ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                }`}
                            >
                                <option value="">Seleccione una categoría</option>
                                {categorias.map(cat => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.categoria}
                                    </option>
                                ))}
                            </select>
                            {errors.id_categoria && <p className="text-red-500 text-xs mt-1">{errors.id_categoria[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descripción (Opcional)
                            </label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Notas adicionales sobre el medicamento base..."
                                className={`w-full p-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                                    errors.descripcion ? "border-red-500" : "border-gray-300 dark:border-gray-600"
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
                            disabled={loading || !formData.nombre.trim() || !formData.id_categoria}
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
