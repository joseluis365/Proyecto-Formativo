import Button from "../../UI/Button";
import GeneralInfo from "../GeneralInfo";
import InfoSection from "../InfoSection";
import List from "../List";
import BaseModal from "../BaseModal";
import ModalBody from "../ModalBody";
import ModalFooter from "../ModalFooter";
import ModalHeader from "../ModalHeader";

export default function CitaModal({ onClose }) {
    return (
        <BaseModal>
            <ModalHeader icon="clinical_notes" title="CITA MÉDICA" id="3245671" onClose={onClose} />
            <ModalBody>
                <GeneralInfo item={[
                    {label: "Médico Tratante", value: "Dr. Alejandro Vargas"},
                    {label: "Paciente", value: "Ana García Pérez"},
                    {label: "Hora de Atención", value: "10:30 AM"}
                ]} />
                <hr className="border-gray-200 dark:border-gray-700" />
                <InfoSection icon="help_center" title="MOTIVO DE CONSULTA" text="Paciente refiere dolor abdominal agudo en la zona epigástrica desde hace 48 horas, acompañado de náuseas y pérdida de apetito. No presenta fiebre." />
                <InfoSection icon="stethoscope" title="EXAMEN FÍSICO" text="Abdomen blando, depresible, doloroso a la palpación profunda en epigastrio, sin signos de irritación peritoneal. Ruidos hidroaéreos normales. Signos vitales estables." />
                <InfoSection icon="diagnosis" title="DIAGNÓSTICO" text="Gastritis aguda (K29.0)" />
                <List icon="pill" title="TRATAMIENTO" items={["Omeprazol 20 mg cada 24 horas en ayunas por 14 días.", "Hidróxido de aluminio/magnesio 10 ml después de comidas y al acostarse.", "Dieta blanda, evitar irritantes, grasas y condimentos."]} />
                <InfoSection icon="receipt_long" title="ORDEN MÉDICA" text="Orden de medicamentos generada. No se generan remisiones en esta consulta." />
                <List icon="list_alt" title="RECOMENDACIONES" items={[
                    "Aumentar ingesta de líquidos.",
                    "Evitar el consumo de alcohol y tabaco.",
                    "Reconsultar si los síntomas persisten o empeoran después de 72 horas.",
                ]} />
                <InfoSection icon="edit_note" title="OBSERVACIONES ADICIONALES" text="Se educa al paciente sobre la importancia de adherirse al tratamiento y las medidas dietéticas para prevenir recurrencias." />

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
