import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import useHistorial from "../../hooks/useHistorial";
import PersonalInfo from "../../components/PacienteInfo/PersonalInfo";
import BackgroundInfo from "../../components/PacienteInfo/BackgroundInfo";
import MedicalInfo from "../../components/PacienteInfo/MedicalInfo";
import Button from "../../components/UI/Button";
import WhiteButton from "../../components/UI/WhiteButton";
import Swal from "sweetalert2";
import DataTable from "../../components/UI/DataTable";

export default function HistorialPacienteMedico() {
    const { doc } = useParams();
    const navigate = useNavigate();
    const { setTitle, setSubtitle } = useLayout();
    const { 
        historial, 
        detalles, 
        loading, 
        updateAntecedentes 
    } = useHistorial(doc);

    const [isEditing, setIsEditing] = useState(false);
    const [bgData, setBgData] = useState({
        antecedentes_personales: "",
        antecedentes_familiares: "",
    });

    useEffect(() => {
        setTitle("Historial Clínico");
        setSubtitle(`Detalle de atenciones y antecedentes del paciente.`);
    }, [setTitle, setSubtitle]);

    useEffect(() => {
        if (historial) {
            setBgData({
                antecedentes_personales: historial.antecedentes_personales || "",
                antecedentes_familiares: historial.antecedentes_familiares || "",
            });
        }
    }, [historial]);

    const handleSaveBg = async () => {
        try {
            await updateAntecedentes(bgData);
            Swal.fire("Guardado", "Antecedentes actualizados.", "success");
            setIsEditing(false);
        } catch (err) {
            Swal.fire("Error", "No se pudieron actualizar los antecedentes.", "error");
        }
    };

    if (loading && !historial) {
        return <div className="p-8 text-center text-gray-500">Cargando información clínica...</div>;
    }

    const paciente = historial?.paciente || {};
    const nombre = `${paciente.primer_nombre || ''} ${paciente.primer_apellido || ''}`.trim();

    const infoArray = [
        { label: "Documento", value: paciente.documento || "N/A" },
        { label: "Edad/Cumpleaños", value: paciente.fecha_nacimiento || "N/A" },
        { label: "Sexo", value: paciente.genero || "N/A" },
        { label: "Teléfono", value: paciente.telefono || "N/A" },
        { label: "Dirección", value: paciente.direccion || "N/A" },
        { label: "Correo", value: paciente.email || "N/A" },
    ];

    const personalBackground = [
        { label: "Enfermedades Previas & Alergias", items: (historial?.antecedentes_personales || "Sin registrar").split("\n").filter(Boolean) }
    ];

    const familyBackground = [
        { label: "Antecedentes", items: (historial?.antecedentes_familiares || "Sin registrar").split("\n").filter(Boolean) }
    ];

    const citasMedicas = detalles.map(d => ({
        date: new Date(d.created_at).toLocaleDateString('es-ES'),
        doctor: `Dr. ${d.cita?.medico?.primer_nombre || ''} ${d.cita?.medico?.primer_apellido || ''}`,
        result: d.diagnostico
    }));

    const citasColumns = [
        { key: "date", header: "Fecha", render: (c) => c.date },
        { key: "doctor", header: "Médico", render: (c) => c.doctor },
        { key: "result", header: "Diagnóstico", render: (c) => <span className="font-semibold text-gray-800 dark:text-gray-200">{c.result}</span> },
    ];

    const remisionesLista = detalles.flatMap(d => 
        (d.remisiones || []).map(r => ({
            date: new Date(r.created_at).toLocaleDateString('es-ES'),
            type: r.tipo_remision === 'cita' ? r.especialidad?.especialidad : 'Examen Clínico',
            status: r.estado?.nombre_estado || 'Activa'
        }))
    );

    const remisionesColumns = [
        { key: "date", header: "Fecha", render: (r) => r.date },
        { key: "type", header: "Tipo de Remisión", render: (r) => r.type },
        { key: "status", header: "Estado", render: (r) => <span className="font-bold text-primary">{r.status}</span> },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-4">
             <button 
                onClick={() => navigate('/medico/pacientes')}
                className="flex items-center gap-2 text-primary font-bold hover:underline mb-2 cursor-pointer"
            >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Atrás a pacientes
            </button>

            <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-lg border border-neutral-gray-border/20 dark:border-gray-800 pb-4">
                <div className="bg-primary-green/90 dark:bg-primary-green/50 backdrop-blur-sm text-white p-6 rounded-t-xl flex items-center gap-4">
                    <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                    <h2 className="text-xl sm:text-2xl font-bold">HISTORIAL CLÍNICO – {nombre}</h2>
                </div>
                <div className="p-6 sm:p-8 space-y-8">
                    <PersonalInfo Info={infoArray} />
                    <hr className="border-gray-300 dark:border-gray-700" />
                    
                    {isEditing ? (
                        <div className="space-y-4">
                             <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Modo Edición: Antecedentes</h3>
                            </div>
                            <div>
                                <label className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">Personales</label>
                                <textarea 
                                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 resize-none h-32 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={bgData.antecedentes_personales}
                                    onChange={(e) => setBgData({...bgData, antecedentes_personales: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black text-primary uppercase tracking-widest mb-2 block">Familiares</label>
                                <textarea 
                                    className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 resize-none h-32 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={bgData.antecedentes_familiares}
                                    onChange={(e) => setBgData({...bgData, antecedentes_familiares: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg font-bold transition-colors cursor-pointer">Cancelar</button>
                                <button onClick={handleSaveBg} className="px-5 py-2.5 text-white bg-primary hover:bg-primary/90 rounded-lg font-bold shadow-sm transition-colors cursor-pointer">Guardar Cambios</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <BackgroundInfo icon="assignment" title="Antecedentes Personales" data={personalBackground}/>
                            <hr className="border-gray-300 dark:border-gray-700" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <BackgroundInfo icon="family_history" title="Antecedentes Familiares" data={familyBackground}/>
                                <BackgroundInfo icon="spa" title="Hábitos y Estilos de Vida" data={[{label: "Estilo de vida", items: ["Sin registrar"]}]}/>
                            </div>
                        </>
                    )}
                    
                    <hr className="border-gray-300 dark:border-gray-700" />
                    <MedicalInfo title="Historial de Consultas Previas" tableData={<DataTable columns={citasColumns} data={citasMedicas} />} />
                    
                    {remisionesLista.length > 0 && (
                        <MedicalInfo title="Remisiones Generadas" tableData={<DataTable columns={remisionesColumns} data={remisionesLista} />} />
                    )}
                    
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 mt-8">
                        <WhiteButton icon="download" text="Exportar Historial Completo" />
                        {!isEditing && (
                            <div onClick={() => setIsEditing(true)}>
                                <Button icon="edit" text="Editar Antecedentes" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
