import BaseModal from "../BaseModal";
import ModalHeader from "../ModalHeader";
import ModalBody from "../ModalBody";
import GeneralInfo from "../GeneralInfo";
import ModalFooter from "../ModalFooter";
import Button from "../../UI/Button";
import InfoSection from "../InfoSection";
import Priority from "./Priority";
import State from "../State";
import Specialty from "./Specialty";


export default function RemisionModal({ onClose }) {

    return (
        <BaseModal>
            <ModalHeader icon="medical_information" title="Remisión" id="1827618" onClose={onClose}/>
            <ModalBody>
                <GeneralInfo item={[
                    {label: "Médico Tratante", value: "Dr. Alejandro Vargas"},
                    {label: "Hora de Atención", value: "10:30 AM"},
                    {label: "Paciente", value: "Ana García Pérez"},
                    {label: "Documento", value: "12345678"}
                ]} />
                <hr className="border-gray-200 dark:border-gray-700" />
                <Specialty specialty="Gastroenterología"/>
                <InfoSection icon="help_outline" title="Motivo de Remisión" text="Episodios recurrentes de gastritis sin mejoría con tratamiento oral."/>
                <Priority priority="urgente"/>
                <State state="Sin cita Asignada"/>
                <InfoSection icon="edit_note" title="OBSERVACIONES" text="Solicitar Agenda para la proxima semana."/>
            </ModalBody>
            <ModalFooter>
                <button onClick={onClose} className="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Cerrar
                </button>
                <Button icon="download" text="Descargar Nota Médica" />
            </ModalFooter>
        </BaseModal>
    )
}