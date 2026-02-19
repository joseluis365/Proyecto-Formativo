import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import EditEmpresaModal from "./EditEmpresaModal";

export default function CompanyDetailsModal({ company, onClose }) {
    const modalRef = useRef(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);

    const handleEditClick = (company) => {
        console.log("Editing company:", company);
        const mappedData = {
            // Explicitly map properties to ensure they exist for the form
            nit: company.nit || "",
            nombre: company.nombre || "",
            email_contacto: company.email_contacto || "",
            telefono: company.telefono || "",
            ciudad: company.ciudad || "",
            direccion: company.direccion || "",
            id_estado: company.id_estado || 1, // Default or pass 1 if missing

            // Representante
            documento_representante: company.documento_representante || "",
            nombre_representante: company.nombre_representante || "",
            telefono_representante: company.telefono_representante || "",
            email_representante: company.email_representante || "",

            // Admin data
            admin_nombre: company?.admin_user?.nombre || "",
            admin_documento: company?.admin_user?.documento || "",
            admin_email: company?.admin_user?.email || "",

            admin_password: "",
            admin_password_confirmation: "",
        };
        console.log("Mapped data for form:", mappedData);
        setSelectedEmpresa(mappedData);
        setIsEditModalOpen(true);
    };

    // Función para cerrar y limpiar
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmpresa(null);
    };

    const handleDownloadPdf = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/empresa/${company.nit}/pdf`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Error al descargar el PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `detalle_empresa_${company.nit}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error downloading PDF:", error);
            // You might want to show a toast/alert here
        }
    };

    if (!company) return null;

    // Helpers para mostrar info segura
    const safeText = (text) => text || "N/A";
    const getStatusText = (status) => {
        switch (status) {
            case 1: return "Activa";
            case 2: return "Inactiva"; // O lo que sea id 2
            case 3: return "Sin Licencia";
            case 4: return "Por vencer";
            case 5: return "Vencida";
            case 6: return "Bloqueada";
            default: return "Desconocido";
        }
    };

    const licencia = company.licencia_actual;
    const admin = company.admin_user;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                ref={modalRef}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-3xl">domain</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {safeText(company.nombre)}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                NIT: {safeText(company.nit)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Columna Izquierda: Info Empresa */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">business</span>
                            Información de la Empresa
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3">
                            <div>
                                <span className="text-xs text-gray-500 block">Dirección</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.direccion)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Ciudad</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.ciudad?.nombre)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Teléfono Contacto</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.telefono)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Email Contacto</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.email_contacto)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Columna Derecha: Representante Legal */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">gavel</span>
                            Representante Legal
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3">
                            <div>
                                <span className="text-xs text-gray-500 block">Nombre Completo</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.nombre_representante)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Documento</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.documento_representante)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Email</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.email_representante)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block">Teléfono</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(company.telefono_representante)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Fila Inferior: Licencia y Admin */}

                    {/* Licencia */}
                    <section className="space-y-4 md:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">workspace_premium</span>
                            Licencia Actual
                        </h3>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl space-y-3 border border-blue-100 dark:border-blue-800">
                            {licencia ? (
                                <>
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="text-xs text-gray-500 block">Tipo</span>
                                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                                {licencia.tipo_licencia?.tipo || "N/A"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block">Estado</span>
                                            <span className="inline-block px-2 py-1 text-xs rounded bg-white dark:bg-gray-800 shadow-sm border font-medium">
                                                {getStatusText(licencia.id_estado)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-xs text-gray-500 block">Inicio</span>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {licencia.fecha_inicio ? new Date(licencia.fecha_inicio).toISOString().split('T')[0] : 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block">Fin</span>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {licencia.fecha_fin ? new Date(licencia.fecha_fin).toISOString().split('T')[0] : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block">ID Licencia / Referencia</span>
                                        <span className="text-xs font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border inline-block mt-1">
                                            {licencia.id_empresa_licencia}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No hay licencia activa asignada.</p>
                            )}
                        </div>
                    </section>

                    {/* Admin del Sistema */}
                    <section className="space-y-4 md:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                            Admin del Sistema
                        </h3>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl space-y-3 border border-purple-100 dark:border-purple-800">
                            {admin ? (
                                <>
                                    <div>
                                        <span className="text-xs text-gray-500 block">Nombre</span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(admin.nombre)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block">Email (Acceso)</span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(admin.email)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block">Documento</span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{safeText(admin.documento)}</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No se encontró información del administrador.</p>
                            )}
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={handleDownloadPdf}
                        className="mr-5 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Descargar PDF
                    </button>
                    <button
                        onClick={() => handleEditClick(company)}
                        className="mr-3 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium cursor-pointer"
                    >
                        Editar
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium cursor-pointer"
                    >
                        Cerrar
                    </button>
                </div>
            </motion.div>
            {isEditModalOpen && (
                <EditEmpresaModal
                    empresaData={selectedEmpresa}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        handleCloseModal();
                        onClose();
                    }}
                />
            )}
        </div>
    );
}
