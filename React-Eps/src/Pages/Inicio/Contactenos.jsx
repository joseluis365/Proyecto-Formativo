import Title from "../../components/Contactenos/Title";
import FormSection from "../../components/Contactenos/FormSection";
import { TitleData, canales, emails, horarios } from "../../data/ContactenosData";
import FormContactData from "../../data/FormContactData";

export default function Contactenos() {
    return (
        <>
            <Title title={TitleData.title} description={TitleData.description} />
            <FormSection canales={canales} emails={emails} horarios={horarios} config={FormContactData} />
        </>
    );
}
