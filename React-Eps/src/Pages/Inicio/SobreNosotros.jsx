import Title from "../../components/SobreNosotros/Title";
import History from "../../components/SobreNosotros/History";
import Values from "../../components/SobreNosotros/Values";
import Compromise from "../../components/SobreNosotros/Compromise";
import Slogan from "../../components/SobreNosotros/Slogan";
import { images, TitleData, HistoryData, SloganData } from "../../data/SobreNosotrosData";

export default function SobreNosotros() {
    return (
        <>
            <Title title={TitleData.title} description={TitleData.description} image={images.clinica}/>
            <History title={HistoryData.title} description={HistoryData.description} image={images.clinica}/>
            <Values />
            <Compromise image={images.pharmacy} image2={images.emergency} />
            <Slogan text={SloganData.text} slogan={SloganData.slogan} />
        </>
    );
}
