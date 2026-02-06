import emergency from "../../assets/ambulancia.png";
import pharmacy from "../../assets/medicamento.png";
import Title from "../../components/SobreNosotros/Title";
import History from "../../components/SobreNosotros/History";
import Values from "../../components/SobreNosotros/Values";
import Compromise from "../../components/SobreNosotros/Compromise";
import Slogan from "../../components/SobreNosotros/Slogan";

export default function SobreNosotros() {
    return (
        <>
            <Title title="Sobre Salud Total" description="Más de 20 años cuidando lo más valioso: tu bienestar y el de tu familia." image="https://lh3.googleusercontent.com/aida-public/AB6AXuBLgc2rf6SRi30-D9aCqqypPZhE9357nioLkwZbs9LacERKF3STF0cP0iuQjc9gDUFwvHPMkmn6eguUBuss7FPcRMHrpKIOvwKnUNhKeIaCkPVta3q6mVbaugePwZjMQB-tgpwvdcWrghNQzEE9baQc5PfdAYVt_EKw0X4nmnjQyT4t2ErO4ZigDcg8W2Fs_s6ZzeIQ5S_LMZPW7yup9CwF3HPiA_rAHrBHvgTW0FI6pDyOEt1KDmBVfUbaO6AbtxT6vC43z9I02pHm"/>
            <History title="Nuestra Historia" description="Desde nuestra fundación, en Salud Total hemos trabajado incansablemente para transformar la prestación de servicios médicos en Colombia, priorizando siempre la calidad humana y la excelencia clínica. Lo que comenzó como un sueño de brindar cobertura integral, hoy es una realidad que impacta positivamente a millones de afiliados a través de una red nacional robusta y tecnología de vanguardia." image="https://lh3.googleusercontent.com/aida-public/AB6AXuBLgc2rf6SRi30-D9aCqqypPZhE9357nioLkwZbs9LacERKF3STF0cP0iuQjc9gDUFwvHPMkmn6eguUBuss7FPcRMHrpKIOvwKnUNhKeIaCkPVta3q6mVbaugePwZjMQB-tgpwvdcWrghNQzEE9baQc5PfdAYVt_EKw0X4nmnjQyT4t2ErO4ZigDcg8W2Fs_s6ZzeIQ5S_LMZPW7yup9CwF3HPiA_rAHrBHvgTW0FI6pDyOEt1KDmBVfUbaO6AbtxT6vC43z9I02pHm"/>
            <Values />
            <Compromise image={pharmacy} image2={emergency} />
            <Slogan text="Cuidamos tu salud con el alma, porque entendemos que lo más importante es verte bien a ti y a los tuyos." slogan="Salud Total: Tu bienestar, nuestra prioridad" />
        </>
    );
}