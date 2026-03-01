import { Outlet } from "react-router-dom";
import IndexHeader from "./Layout-Components/IndexHeader";
import IndexFooter from "./Layout-Components/IndexFooter";

export default function IndexLayout() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <IndexHeader/>
            <main className="flex-1 dark:bg-gray-900">
                <Outlet/>
            </main>
            <IndexFooter/>
        </div>
    );
}
