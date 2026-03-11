import UserHeader from "./Layout-Components/UserHeader";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <UserHeader/>
            <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900/70">
                <Outlet/>
            </main>
        </div>
        
    )
}
