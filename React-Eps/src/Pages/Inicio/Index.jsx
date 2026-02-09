import clinica from "../../assets/clinica.jpg";
import Section from "../../components/Index/Section";
import SecondSection from "../../components/Index/SecondSection";
import ThirdSection from "../../components/Index/ThirdSection";
import FourthSection from "../../components/Index/FourthSection";
import { reasons, services, data, SectionData } from "../../data/IndexData";

export default function Index() {
    
    return (
        <>
            <Section image={clinica} title={SectionData.title} subtitle={SectionData.subtitle} description={SectionData.description}/>
            <SecondSection reasons={reasons}/> 
            <ThirdSection services={services}/>
            <FourthSection data={data}/>
        </>
    );
}