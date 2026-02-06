import SuperAdminHeader from "./Layout-Components/SuperAdminHeader";
import { Outlet } from "react-router-dom";

export default function SuperAdminLayout() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <SuperAdminHeader/>
            <Outlet/>
        </div>
    )
}