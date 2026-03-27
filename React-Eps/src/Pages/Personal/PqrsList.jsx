import { useState, useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import PqrCard from "../../components/Cards/PqrCard";
import PqrModal from "../../components/Modals/PqrModal/PqrModal";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import MotionSpinner from "../../components/UI/Spinner";

export default function PqrsList({ readonly = false }) {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Gestión de PQRS",
        description: "Buzón centralizado para la recepción, seguimiento y respuesta de Peticiones, Quejas, Reclamos y Sugerencias.",
        sections: [
            {
                title: "Control de Estados",
                type: "text",
                content: "Cada solicitud tiene un estado que indica su progreso. El sistema diferencia visualmente entre las peticiones que requieren atención inmediata y las que ya han sido resueltas."
            },
            {
                title: "Identificación de Estados",
                type: "list",
                items: [
                    "Pendiente (Borde Ámbar): Solicitudes nuevas que esperan una respuesta del personal.",
                    "Atendido (Borde Gris): Solicitudes que ya han sido procesadas y respondidas oficialmente."
                ]
            },
            {
                title: "Procedimiento de Respuesta",
                type: "steps",
                items: [
                    "Identifica la PQRS pendiente y haz clic en 'Ver Detalles'.",
                    "Analiza el mensaje y el asunto enviado por el usuario.",
                    "Escribe una respuesta clara y profesional en el campo de texto.",
                    "Haz clic en 'Enviar Respuesta'. Se enviará un correo automático al usuario con tu mensaje."
                ]
            },
            {
                title: "Recomendaciones de Servicio",
                type: "tip",
                content: "Procura mantener un lenguaje empático y resolutivo. Una respuesta rápida y clara es fundamental para mantener la confianza del afiliado."
            }
        ]
    });

    const [pqrs, setPqrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPqr, setSelectedPqr] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(readonly ? "10" : "");

    useEffect(() => {
        setTitle("Gestión de PQRS");
        setSubtitle("Buzón de Peticiones, Quejas, Reclamos y Sugerencias.");
        fetchPqrs();
    }, []);

    const fetchPqrs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/pqrs');
            setPqrs(res.data.data || res.data || []);
        } catch (error) {
            console.error("Error fetching PQRS:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las PQRS. Intente más tarde.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (pqr) => {
        setSelectedPqr(pqr);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPqr(null);
    };

    const handlePqrUpdated = () => {
        fetchPqrs();
        setIsModalOpen(false);
    };

    const filteredPqrs = pqrs.filter(pqr => {
        const matchesSearch = pqr.nombre_usuario?.toLowerCase().includes(search.toLowerCase()) || 
                              pqr.asunto?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? String(pqr.id_estado) === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const statusOptions = [
        { label: 'Todos', value: '' },
        { label: 'Pendiente', value: '13' },
        { label: 'Atendido', value: '10' }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PrincipalText
                    icon="forum"
                    text="Listado de PQRS"
                    number={filteredPqrs.length}
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <Input
                            icon="search"
                            placeholder="Buscar por usuario o asunto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <Filter
                            options={statusOptions}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            placeholder="Estado"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <MotionSpinner />
                </div>
            ) : filteredPqrs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800 shadow-inner">
                    <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4">
                        {pqrs.length === 0 ? 'inbox' : 'manage_search'}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {pqrs.length === 0 ? 'No hay PQRS registradas' : 'No se encontraron resultados'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                        {pqrs.length === 0 
                            ? 'Aún no se ha recibido ninguna petición, queja o reclamo en el sistema.' 
                            : 'Prueba ajustando los filtros o el término de búsqueda para encontrar lo que necesitas.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPqrs.map(pqr => (
                        <PqrCard 
                            key={pqr.id_pqr} 
                            pqr={pqr} 
                            onViewDetails={() => handleViewDetails(pqr)}
                        />
                    ))}
                </div>
            )}
            {isModalOpen && selectedPqr && (
                <PqrModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    pqr={selectedPqr}
                    onSuccess={handlePqrUpdated}
                    readonly={readonly}
                />
            )}
        </div>
    );
}
