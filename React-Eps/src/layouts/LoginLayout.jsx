/*
 * Layout de autenticacion.
 * Envuelve pantallas de login, recuperacion y verificacion.
 */
import { Outlet } from "react-router-dom";
import LeftSection from "../components/Login/LeftSection";

export default function LoginLayout() {
    return (
        <div className="flex flex-1 flex-col lg:flex-row lg:h-screen lg:overflow-hidden min-h-screen overflow-y-auto bg-white dark:bg-gray-800">
            <LeftSection/>
            <Outlet/>
        </div>
    )
}
