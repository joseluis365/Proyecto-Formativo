import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import React, { useState } from 'react';
import BaseModal from '../BaseModal';
import ModalHeader from '../ModalHeader';
import BlueButton from '../../UI/BlueButton';
import api from '../../../Api/axios';
import Swal from 'sweetalert2';
import Badge from '../../UI/Badge';

export default function PqrModal({ isOpen, onClose, pqr, onSuccess, readonly = false }) {
    const isAtendido = pqr.id_estado === 10;
    const [respuesta, setRespuesta] = useState(pqr.respuesta || "");
    const [loading, setLoading] = useState(false);
    const [archivo, setArchivo] = useState(null);
    const [errorArchivo, setErrorArchivo] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrorArchivo("El archivo no debe superar los 5MB");
                setArchivo(null);
                e.target.value = "";
            } else {
                setErrorArchivo("");
                setArchivo(file);
            }
        }
    };

    const handleResponder = async () => {
        if (!respuesta || respuesta.trim().length < 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Respuesta muy corta',
                text: 'La respuesta debe tener al menos 10 caracteres.'
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('respuesta', respuesta);
            if (archivo) {
                formData.append('archivo_adjunto', archivo);
            }

            await api.post(`/pqrs/${pqr.id_pqr}/responder`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: '¡Respondido!',
                text: 'Se ha enviado el correo electrónico de respuesta.',
                timer: 2000,
                showConfirmButton: false
            });
            onSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Ocurrió un error al intentar enviar la respuesta.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVisualizar = () => {
        if (pqr.archivo_adjunto) {
            const url = `${import.meta.env.VITE_API_BASE_URL}/storage/${pqr.archivo_adjunto}`;
            window.open(url, '_blank');
        }
    };

    return (
        <BaseModal maxWidth="max-w-3xl">
            <ModalHeader 
                icon="mark_email_read" 
                title={`Detalles de PQRS #${pqr.id_pqr}`} 
                onClose={onClose} 
            />
            <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
                {/* Info del usuario que envía */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Remitente</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{pqr.nombre_usuario}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Correo</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{pqr.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Teléfono</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{pqr.telefono}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Estado</p>
                        <div className="mt-1">
                            <Badge color={isAtendido ? 'green' : 'amber'} text={pqr.estado?.nombre || (isAtendido ? 'Atendido' : 'Pendiente')} />
                        </div>
                    </div>
                </div>

                {/* Mensaje */}
                <div>
                    <h3 className="text-md font-bold text-gray-900 dark:text-white mb-2">Asunto: {pqr.asunto}</h3>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto w-full">
                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{pqr.mensaje}</p>
                    </div>
                </div>

                    {/* Área de respuesta (Solo si no es readonly o ya está atendido) */}
                    {(isAtendido || !readonly) && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <ReplyRoundedIcon sx={{ fontSize: "1.125rem" }} className="text-primary" />
                                {isAtendido ? 'Respuesta Enviada' : 'Escribir Respuesta'}
                            </h3>
                            
                            <textarea 
                                disabled={isAtendido || loading}
                                value={respuesta}
                                onChange={(e) => setRespuesta(e.target.value)}
                                className={`w-full p-3 rounded-xl border text-sm focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-[120px] transition-all ${
                                    isAtendido 
                                        ? 'border-gray-200 dark:border-gray-700 opacity-70 cursor-not-allowed' 
                                        : (respuesta.length > 0 && respuesta.length < 10) 
                                            ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10' 
                                            : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder={isAtendido ? 'Esta solicitud ya fue atendida.' : 'Escribe aquí la respuesta que será enviada por correo al usuario...'}
                            />
                            
                            {/* Control de archivos */}
                            {!isAtendido && !readonly && (
                                <div className="mt-4">
                                    <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 cursor-pointer">
                                        <AttachFileRoundedIcon sx={{ fontSize: "1.125rem" }} className="text-primary" />
                                        Adjuntar archivo (Opcional, Máx. 5MB)
                                    </label>
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all border border-gray-200 dark:border-gray-700 rounded-xl p-1"
                                    />
                                    {errorArchivo && <p className="text-xs text-red-500 mt-1 font-medium">{errorArchivo}</p>}
                                </div>
                            )}
                            
                            {isAtendido && (
                                <div className="flex flex-col gap-2 mt-2">
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                        <CheckCircleRoundedIcon sx={{ fontSize: "0.875rem" }} />
                                        Esta petición ya fue respondida y cerrada.
                                    </p>
                                    {pqr.archivo_adjunto && (
                                        <button
                                            onClick={handleVisualizar}
                                            className="flex items-center gap-2 w-fit px-4 py-2 mt-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all border border-blue-100 dark:border-blue-800"
                                        >
                                            <VisibilityRoundedIcon sx={{ fontSize: "1.125rem" }} />
                                            Visualizar archivo enviado
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {readonly && !isAtendido && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                             <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl flex items-center gap-3">
                                <InfoRoundedIcon className="text-amber-600 dark:text-amber-400" />
                                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                    Esta solicitud se encuentra <b>pendiente</b> de respuesta por el personal administrativo.
                                </p>
                             </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button 
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cerrar
                        </button>
                        {!isAtendido && !readonly && (
                            <BlueButton 
                                text="Enviar Respuesta" 
                                icon="send" 
                                onClick={handleResponder} 
                                loading={loading}
                            />
                        )}
                    </div>
                </div>
            </BaseModal>
    );
}
