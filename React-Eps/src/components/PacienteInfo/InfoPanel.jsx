import PersonalInfo from "./PersonalInfo";
import BackgroundInfo from "./BackgroundInfo";
import { Info, citas, ordenes, remisiones } from "../../data/PacienteInfo";
import { Background, FamilyBackground, SocialBackground } from "../../data/PacienteInfo";
import CitasMedicasTable from "./CitasMedicasTable";
import OrdenesTable from "./OrdenesTable";
import RemisionesTable from "./RemisionesTable";
import MedicalInfo from "./MedicalInfo";
import Button from "../UI/Button";
import WhiteButton from "../UI/WhiteButton";

export default function InfoPanel({nombre}) {
    return (
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900/50 rounded-xl shadow-lg border border-neutral-gray-border/20 dark:border-gray-800">
            {/* Header */}
            <div className="bg-primary-green/90 dark:bg-primary-green/50 backdrop-blur-sm text-white p-6 rounded-t-xl flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                <h2 className="text-xl sm:text-2xl font-bold">HISTORIAL CLÍNICO – {nombre}</h2>
            </div>
            {/* Body */}
            <div className="p-6 sm:p-8 space-y-8">
                <PersonalInfo Info={Info} />
                <hr className="border-gray-300" />
                <BackgroundInfo icon="assignment" title="Antecedentes Personales" data={Background}/>
                <hr className="border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BackgroundInfo icon="family_history" title="Antecedentes Familiares" data={FamilyBackground}/>
                    <BackgroundInfo icon="spa" title="Hábitos y Estilos de Vida" data={SocialBackground}/>
                </div>
                <hr className="border-gray-300" />
                <MedicalInfo title="Historial de Citas Médicas" tableData={<CitasMedicasTable citas={citas}/>} />
                <MedicalInfo title="Ordenes de Medicamentos" tableData={<OrdenesTable ordenes={ordenes}/>} />
                <MedicalInfo title="Remisiones Médicas" tableData={<RemisionesTable remisiones={remisiones}/>} />
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
                    <WhiteButton icon="download" text="Exportar Historial Completo" />
                    <Button icon="edit" text="Editar Información" />
                </div>
            </div>
            
        </div>
    )
}
