import React from 'react';
import Badge from '../UI/Badge';
import MuiIcon from '../UI/MuiIcon';

export default function PqrCard({ pqr, onViewDetails }) {
    const isAtendido = pqr.id_estado === 10;
    const date = pqr.created_at ? new Date(pqr.created_at).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute:'2-digit'
    }) : 'Fecha no disponible';

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-5 flex flex-col justify-between transition-all hover:shadow-md ${isAtendido ? 'border-gray-200 dark:border-gray-700' : 'border-l-4 border-l-amber-500 border-gray-200 dark:border-gray-700'}`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white font-bold text-lg truncate w-48" title={pqr.nombre_usuario}>
                            {pqr.nombre_usuario}
                        </span>
                        <span className="text-neutral-gray-text dark:text-gray-400 text-xs">
                            {date}
                        </span>
                    </div>
                    <Badge color={isAtendido ? 'green' : 'amber'} text={pqr.estado?.nombre || (isAtendido ? 'Atendido' : 'Pendiente')} />
                </div>
                
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate w-full" title={pqr.asunto}>
                    {pqr.asunto}
                </h4>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {pqr.mensaje}
                </p>
            </div>

            <button 
                onClick={onViewDetails}
                className="w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-primary dark:text-blue-400 font-medium text-sm transition-colors border border-gray-200 dark:border-gray-600 flex justify-center items-center gap-2"
            >
                <MuiIcon name="visibility" sx={{ fontSize: '1.25rem' }} />
                Ver Detalles
            </button>
        </div>
    );
}
