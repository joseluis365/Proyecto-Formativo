import BaseModal from "../BaseModal";
import ModalBody from "../ModalBody";
import ModalFooter from "../ModalFooter";
import ModalHeader from "../ModalHeader";
import GeneralInfo from "../GeneralInfo";
import InfoSection from "../InfoSection";
import List from "../List";
import Pharmacy from "./Pharmacy";  
import State from "../State";
import Button from "../../UI/Button";
import WhiteButton from "../../UI/WhiteButton";

export default function OrdenModal({onClose}) {
    return (
        <BaseModal>
            <ModalHeader icon="receipt_long" title="ORDEN DE MEDICAMENTOS" id="3245671" onClose={onClose} />
            <ModalBody>
                <GeneralInfo item={[
                    {label: "Médico Tratante", value: "Dr. Alejandro Vargas"},
                    {label: "Hora de Atención", value: "10:30 AM"},
                    {label: "Paciente", value: "Ana García Pérez"},
                    {label: "Documento", value: "12345678"}
                ]} />
                <hr className="border-gray-200 dark:border-gray-700" />
                <List icon="pill" title="MEDICAMENTOS ORDENADOS" items={[
                    "Omeprazol 20 mg - cada 24 horas en ayunas por 14 días.",
                    "Ibuprofeno 200 mg - cada 6 horas por 5 días.",
                ]} />
                <Pharmacy data={[
                    {name: "Omeprazol", stock: "Disponible"},
                    {name: "Ibuprofeno", stock: "No disponible"},
                ]} />
                <State state="Orden Parcial Generada (1 medicamento Pendiente)"/>
                <InfoSection icon="edit_note" title="OBSERVACIONES" text="Se educa al paciente sobre la importancia de adherirse al tratamiento y las medidas dietéticas para prevenir recurrencias."/>
            </ModalBody>
            <ModalFooter>
                <Button icon="download" text="Descargar Orden" />
                <WhiteButton icon="print" text="Imprimir Orden" />
            </ModalFooter>
        </BaseModal>
    )
}
