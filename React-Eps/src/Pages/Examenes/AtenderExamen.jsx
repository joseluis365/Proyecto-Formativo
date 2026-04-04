import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import BlueButton from "../../components/UI/BlueButton";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import TableSkeleton from "../../components/UI/TableSkeleton";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';

export default function AtenderExamen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle, setSubtitle, setHelpContent } = useLayout();

    const [cita, setCita] = useState(null);
    const [loadingCita, setLoadingCita] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        setTitle("Resultados de Laboratorio");
        setSubtitle("Adjuntar resultados del paciente");

        setHelpContent({
            title: "Resultados",
            description: "Adjunta el archivo PDF con los resultados.",
            sections: [
                {
                    title: "Formato",
                    type: "text",
                    content: "Solo se admiten documentos en formato PDF de máximo 10MB."
                }
            ]
        });

        const fetchCita = async () => {
            try {
                const res = await api.get(`/examenes/${id}`);
                if (!res.data?.data) {
                    Swal.fire("Error", "No se encontró el examen solicitado.", "error");
                    navigate("/examenes/agenda");
                    return;
                }
                setCita(res.data.data);
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "No se pudo cargar la información del examen.", "error");
                navigate("/examenes/agenda");
            } finally {
                setLoadingCita(false);
            }
        };

        fetchCita();
        return () => setHelpContent(null);
    }, [id, navigate, setTitle, setSubtitle, setHelpContent]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile) => {
        if (selectedFile.type !== "application/pdf") {
            Swal.fire("Formato Inválido", "Por favor sube un archivo PDF.", "error");
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            Swal.fire("Archivo muy grande", "El archivo no debe superar los 10MB.", "error");
            return;
        }
        setFile(selectedFile);
    };

    const removeFile = () => setFile(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            Swal.fire("Archivo requerido", "Por favor adjunta el reporte en PDF primero.", "warning");
            return;
        }

        setLoadingSubmit(true);
        const formData = new FormData();
        formData.append("resultado_pdf", file);

        try {
            await api.post(`/examenes/${id}/atender`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            await Swal.fire("¡Éxito!", "Resultados guardados y enviados al paciente por correo.", "success");
            navigate("/examenes/agenda");
        } catch (error) {
            const msg = error.response?.data?.message || "Ocurrió un error al procesar el examen.";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingCita) {
        return <div className="max-w-3xl mx-auto p-6"><TableSkeleton rows={4} columns={2} /></div>;
    }

    if (!cita) return null;

    const requiresFasting = cita.requiere_ayuno;
    const isCompleted = ['Atendida', 'Finalizada'].includes(cita.estado?.nombre_estado);

    return (
        <div className="max-w-3xl mx-auto flex flex-col min-h-full">
            <button
                onClick={() => navigate('/examenes/agenda')}
                className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-4 cursor-pointer w-fit"
            >
                <ArrowBackRoundedIcon sx={{ fontSize: '1rem' }} />
                Volver a la agenda
            </button>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex-1">
                {/* Header Info */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <ScienceRoundedIcon className="text-indigo-500" />
                                {cita.categoria_examen?.categoria || 'Laboratorio Clínico'}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                Paciente: <span className="font-bold text-gray-700 dark:text-gray-300">{cita.paciente?.primer_nombre} {cita.paciente?.primer_apellido}</span> 
                                <span className="mx-2">•</span> 
                                Documento: <span className="font-bold text-gray-700 dark:text-gray-300">{cita.paciente?.documento}</span>
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 font-bold px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                                <EventRoundedIcon sx={{ fontSize: '0.875rem' }} />
                                {cita.fecha} {cita.hora_inicio?.slice(0, 5)}
                            </span>
                        </div>
                    </div>
                    {requiresFasting && (
                        <div className="mt-4 inline-flex items-center gap-2 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 font-bold px-3 py-1.5 rounded-lg border border-orange-200 dark:border-orange-800/30 text-sm">
                            <RestaurantRoundedIcon sx={{ fontSize: '1rem' }} />
                            Este examen requería ayuno previO del paciente.
                        </div>
                    )}
                </div>

                {isCompleted ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <CheckCircleRoundedIcon sx={{ fontSize: '3rem' }} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Examen Completado</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                            Los resultados han sido procesados y enviados al paciente por correo electrónico.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Cargar Resultados</h3>
                            <p className="text-sm text-gray-500">Arrastra el archivo PDF con los resultados de laboratorio listos para entregar.</p>
                        </div>

                        <div 
                            className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors text-center
                                ${dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-gray-300 dark:border-gray-700'} 
                                ${file ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                accept=".pdf,application/pdf"
                                onChange={handleChange}
                                className="hidden"
                            />

                            {file ? (
                                <div className="flex flex-col items-center justify-center animate-fade-in">
                                    <div className="size-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-red-200">
                                        <PictureAsPdfRoundedIcon sx={{ fontSize: '1.875rem' }} />
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white mb-1 truncate max-w-[250px]">{file.name}</p>
                                    <p className="text-sm text-gray-500 mb-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                    <button 
                                        type="button" 
                                        onClick={removeFile}
                                        className="text-red-500 text-sm font-bold hover:bg-red-50 py-1.5 px-4 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Quitar archivo
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center h-full">
                                    <UploadFileRoundedIcon sx={{ fontSize: '3rem' }} className="text-gray-400 mb-4" />
                                    <span className="text-gray-600 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 px-6 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer inline-flex items-center gap-2">
                                        Explorar archivos
                                    </span>
                                    <span className="text-xs text-gray-400 mt-4 block">Máximo 10MB • Solo formato PDF</span>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="w-48">
                                <BlueButton text="Guardar" icon="check_circle" type="submit" loading={loadingSubmit} />
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
