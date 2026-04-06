import { useState, useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import BlueButton from "../../components/UI/BlueButton";
import PrincipalText from "../../components/Users/PrincipalText";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import DataTable from "../../components/UI/DataTable";
import { motion } from "framer-motion";
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import NoFoodRoundedIcon from '@mui/icons-material/NoFoodRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function GestorCategorias() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [catName, setCatName] = useState("");
    const [requiereAyuno, setRequiereAyuno] = useState(false);

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const res = await api.get("/categorias-examen");
            const data = Array.isArray(res) ? res : res.data?.data || [];
            // Filter out Inactivo if we don't want to show them, or show all
            setCategorias(data);
        } catch (error) {
            console.error("Error fetching categorias:", error);
            Swal.fire("Error", "No se pudo cargar la lista de categorías.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTitle("Gestión de Categorías");
        setSubtitle("Administra los tipos de exámenes de laboratorio");

        setHelpContent({
            title: "Tipos de Exámenes",
            description: "Añade o modifica qué categorías de exámenes de laboratorio realiza la clínica.",
            sections: [
                {
                    title: "Desactivar",
                    type: "tip",
                    content: "Si un examen ya no se practica, usa el botón de desactivar. Esto previene que se agende en el futuro sin borrar información histórica."
                }
            ]
        });

        fetchCategorias();
        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingCat(cat);
            setCatName(cat.categoria);
            setRequiereAyuno(cat.requiere_ayuno || false);
        } else {
            setEditingCat(null);
            setCatName("");
            setRequiereAyuno(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCat(null);
        setCatName("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!catName.trim()) {
            Swal.fire("Campo requerido", "Debe ingresar el nombre de la categoría.", "warning");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingCat) {
                await api.put(`/categorias-examen/${editingCat.id_categoria_examen}`, { 
                    categoria: catName.trim(),
                    requiere_ayuno: requiereAyuno
                });
                Swal.fire("Actualizado", "La categoría fue actualizada correctamente.", "success");
            } else {
                await api.post("/categorias-examen", { 
                    categoria: catName.trim(),
                    requiere_ayuno: requiereAyuno
                });
                Swal.fire("Creado", "La nueva categoría fue registrada.", "success");
            }
            handleCloseModal();
            fetchCategorias();
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Ocurrió un error al guardar.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: "¿Desactivar categoría?",
            text: `La categoría "${name}" pasará a estado inactivo.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/categorias-examen/${id}`);
                Swal.fire("Desactivada", "La categoría ha sido desactivada.", "success");
                fetchCategorias();
            } catch (error) {
                Swal.fire("Error", "No se pudo desactivar.", "error");
            }
        }
    };

    const columns = [
        {
            name: "ID",
            selector: row => row.id_categoria_examen,
            sortable: true,
            width: "80px",
            center: true
        },
        {
            name: "Categoría",
            selector: row => row.categoria,
            sortable: true,
            cell: row => <span className="font-bold text-gray-800 dark:text-gray-200">{row.categoria}</span>
        },
        {
            name: "Ayuno",
            selector: row => row.requiere_ayuno,
            sortable: true,
            cell: row => row.requiere_ayuno ? (
                <span className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><RestaurantRoundedIcon sx={{ fontSize: '0.875rem' }} /> Sí</span>
            ) : (
                <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><NoFoodRoundedIcon sx={{ fontSize: '0.875rem' }} /> No</span>
            )
        },
        {
            name: "Estado",
            selector: row => row.estado?.nombre_estado,
            sortable: true,
            cell: row => {
                const isActivo = row.estado?.nombre_estado === "Activo";
                return (
                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${isActivo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isActivo ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                );
            }
        },
        {
            name: "Acciones",
            cell: row => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleOpenModal(row)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                    >
                        <EditRoundedIcon sx={{ fontSize: '1.25rem' }} />
                    </button>
                    {row.estado?.nombre_estado === "Activo" && (
                        <button 
                            onClick={() => handleDelete(row.id_categoria_examen, row.categoria)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                            title="Desactivar"
                        >
                            <CancelRoundedIcon sx={{ fontSize: '1.25rem' }} />
                        </button>
                    )}
                </div>
            ),
            width: "120px",
            center: true
        }
    ];

    const customStyles = {
        table: { style: { backgroundColor: 'transparent' } },
        headRow: { style: { backgroundColor: '#F9FAFB', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' } },
        cells: { style: { fontSize: '14px', paddingTop: '12px', paddingBottom: '12px' } }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <PrincipalText icon="biotech" text="Tipos de Exámenes" number={categorias.length} />
                <button 
                    onClick={() => handleOpenModal()} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/20"
                >
                    <AddCircleRoundedIcon />
                    Nueva Categoría
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <DataTable
                    columns={columns}
                    data={categorias}
                    progressPending={loading}
                    pagination
                    paginationPerPage={10}
                    customStyles={customStyles}
                    noDataComponent={<div className="p-8 text-gray-500 dark:text-gray-400">No hay categorías registradas.</div>}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="text-xl font-bold dark:text-white">
                                {editingCat ? "Editar Categoría" : "Nueva Categoría"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <CloseRoundedIcon />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre de la Categoría</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                    placeholder="Ej: Cuadro Hemático"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">¿Requiere Ayuno?</label>
                                    <p className="text-xs text-gray-500">Actívalo si el paciente debe venir en ayunas para este examen.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={requiereAyuno}
                                        onChange={(e) => setRequiereAyuno(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer">Cancelar</button>
                                <div className="w-32">
                                    <BlueButton text="Guardar" type="submit" loading={isSubmitting} />
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
