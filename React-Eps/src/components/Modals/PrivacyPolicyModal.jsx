import BaseModal from "./BaseModal";
import ModalHeader from "./ModalHeader";
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <BaseModal onClose={onClose}>
            <ModalHeader 
                title="Política de Privacidad" 
                subtitle="Protección de Datos Personales"
                icon={<VerifiedUserRoundedIcon />}
                onClose={onClose}
            />
            <div className="p-6 overflow-y-auto max-h-[60vh] flex flex-col gap-6 custom-scrollbar text-sm">
                <section className="flex flex-col gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <InfoRoundedIcon sx={{ fontSize: '1rem' }} className="text-primary" />
                        Tratamiento de Datos Médicos
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                        En cumplimiento de la <strong>Ley 1581 de 2012</strong>, Sanitec informa que sus datos personales y de salud serán tratados con la más estricta confidencialidad. Estos datos son utilizados exclusivamente para la gestión de su historial clínico, agendamiento de citas y servicios administrativos de salud.
                    </p>
                </section>

                <section className="flex flex-col gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">Sus Derechos como Usuario</h3>
                    <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400 space-y-2">
                        <li>Conocer, actualizar y rectificar sus datos personales.</li>
                        <li>Solicitar prueba de la autorización otorgada.</li>
                        <li>Ser informado sobre el uso que se le ha dado a sus datos.</li>
                        <li>Revocar la autorización o solicitar la supresión del dato cuando no se respeten los principios constitucionales.</li>
                    </ul>
                </section>

                <section className="flex flex-col gap-2 pb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">Seguridad de la Información</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                        Implementamos medidas técnicas y administrativas de seguridad para evitar el acceso no autorizado, alteración o pérdida de su información sensible. El acceso a los registros médicos está restringido únicamente a personal de salud autorizado.
                    </p>
                </section>
            </div>
        </BaseModal>
    );
}
