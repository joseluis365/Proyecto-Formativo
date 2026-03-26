import React, { useState } from 'react';
import BaseModal from '../BaseModal';
import ModalHeader from '../ModalHeader';
import BlueButton from '../../UI/BlueButton';
import api from '../../../Api/axios';
import Swal from 'sweetalert2';
import Badge from '../../UI/Badge';

export default function PqrModal({ isOpen, onClose, pqr, onSuccess }) {
    const isAtendido = pqr.id_estado === 10;
    const [respuesta, setRespuesta] = useState(pqr.respuesta || "");
    const [loading, setLoading] = useState(false);

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
            await api.post(`/pqrs/${pqr.id_pqr}/responder`, { respuesta });
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
                text: 'Ocurrió un error al intentar enviar la respuesta.'
            });
        } finally {
            setLoading(false);
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

                {/* Área de respuesta */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">reply</span>
                        Escribir Respuesta
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
                    
                    {!isAtendido && (
                        <div className="flex justify-between mt-1 px-1">
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${respuesta.length < 10 && respuesta.length > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                {respuesta.length < 10 && respuesta.length > 0 ? 'Mínimo 10 caracteres' : 'Longitud suficiente'}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {respuesta.length} caracteres
                            </p>
                        </div>
                    )}
                    
                    {isAtendido && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Esta petición ya fue respondida y cerrada.
                        </p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 mt-4">
                    <button 
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cerrar
                    </button>
                    {!isAtendido && (
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
