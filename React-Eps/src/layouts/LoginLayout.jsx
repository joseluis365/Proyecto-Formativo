import { Outlet } from "react-router-dom";
import LeftSection from "../components/Login/LeftSection";

export default function LoginLayout() {
    return (
        <div className="flex flex-1 flex-col lg:flex-row h-screen overflow-hidden">
            <LeftSection/>
            <Outlet/>
        </div>
    )
}