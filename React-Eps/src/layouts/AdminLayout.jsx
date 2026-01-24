import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LayoutProvider, useLayout } from "../LayoutContext";
import Header from "./Layout-Components/Header";
import Sidebar from "./Layout-Components/sidebar";

function AdminLayoutContent() {
    const {title, subtitle} = useLayout();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);
    return (
        <div className="flex h-screen">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header onMenuClick={() => setSidebarOpen(true)} 
                title={title} 
                subtitle={subtitle} />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default function AdminLayout() {
    return (
        <LayoutProvider>
            <AdminLayoutContent />
        </LayoutProvider>
    )
}

