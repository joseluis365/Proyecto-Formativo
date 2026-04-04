import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../Api/axios';
import Swal from 'sweetalert2';

export default function AtenderExamenModal({ isOpen, onClose, examen, onSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen || !examen) return null;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Formato incorrecto',
                text: 'Por favor, selecciona un archivo PDF válido.',
            });
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            Swal.fire('Atención', 'Debes adjuntar el archivo PDF con los resultados.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('resultado_pdf', file);

            await api.post(`/examenes/${examen.id_examen}/atender`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                icon: 'success',
                title: '¡Resultados Subidos!',
                text: 'El examen ha sido marcado como Atendido y se han guardado los resultados.',
                timer: 2000,
                showConfirmButton: false
            });

            setFile(null);
            onSuccess();
        } catch (error) {
            console.error("Error subiendo resultados:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Hubo un problema al subir los resultados.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <UploadFileRoundedIcon className="text-indigo-600 dark:text-indigo-400" />
                            Atender Examen
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <CloseRoundedIcon />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6 border border-indigo-100 dark:border-indigo-800/30">
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-4 border-b border-indigo-200 dark:border-indigo-800/50 pb-2">Datos del Paciente</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Nombre</p>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {examen.paciente?.primer_nombre} {examen.paciente?.primer_apellido}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Documento</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                                        {examen.paciente?.tipo_documento?.abreviatura} {examen.paciente?.documento}
                                    </p>
                                </div>
                                <div className="col-span-2 mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-800/30">
                                    <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Detalles del Examen</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Categoría</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {examen.categoria_examen?.categoria}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Fecha y Hora</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {examen.fecha} a las {examen.hora_inicio?.slice(0, 5)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Resultados del Examen (PDF)
                                </label>
                                <div 
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                                        ${file ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/10' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                                    `}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <PictureAsPdfRoundedIcon sx={{ fontSize: "2.25rem" }} className="text-indigo-500" />
                                            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{file.name}</p>
                                            <p className="text-xs text-indigo-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <UploadFileRoundedIcon sx={{ fontSize: "2.25rem" }} className="text-gray-400" />
                                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Haz clic para buscar un PDF</p>
                                            <p className="text-xs text-gray-500">Solo archivos .pdf format</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-5 py-2.5 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !file}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <SyncRoundedIcon className="animate-spin" sx={{ fontSize: "0.875rem" }} />
                                            Subiendo...
                                        </>
                                    ) : (
                                        <>
                                            <CloudUploadRoundedIcon sx={{ fontSize: "0.875rem" }} />
                                            Subir Resultados
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
