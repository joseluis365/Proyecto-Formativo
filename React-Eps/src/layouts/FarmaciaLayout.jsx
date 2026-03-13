import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LayoutProvider, useLayout } from "../LayoutContext";
import Header from "./Layout-Components/Header";
import SidebarFarmacia from "./Layout-Components/SidebarFarmacia";

function FarmaciaLayoutContent() {
    const { title, subtitle } = useLayout();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen">
            <SidebarFarmacia isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    title={title}
                    subtitle={subtitle}
                />
                <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default function FarmaciaLayout() {
    return (
        <LayoutProvider>
            <FarmaciaLayoutContent />
        </LayoutProvider>
    )
}
