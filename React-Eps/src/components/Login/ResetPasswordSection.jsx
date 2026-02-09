import { Link } from "react-router-dom";
import Layout from "./Layout";
import { resetPasswordForm } from "../../data/InicioForms";
import FormBuilder from "../UI/Formbuilder";
import BlueButton from "../UI/BlueButton";

export default function ResetPasswordSection() {
    return (
        <Layout title="Restablecer Contraseña" description="Ingrese su nueva contraseña para restablecerla">
                <FormBuilder config={resetPasswordForm} onSubmit={(e) => {e.preventDefault(); console.log("Formulario enviado")}}/>
                <Link to="/login">
                    <BlueButton text={resetPasswordForm.buttonText} icon={resetPasswordForm.buttonIcon}/>
                </Link>
        </Layout>
    )
}