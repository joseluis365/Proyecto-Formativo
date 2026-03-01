import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import InfoPanel from "../../components/PacienteInfo/InfoPanel";

export default function InfoPaciente() {

    const { setTitle } = useLayout();
        useEffect(() => {
            setTitle("Información del Paciente");
        }, []);
    return (
        <InfoPanel nombre="Laura Martínez López" />
    )
}
