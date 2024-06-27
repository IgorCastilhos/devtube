import {MobileSidebar} from "@/app/(dashboard)/_components/mobileSidebar";
import {NavbarRoutes} from "@/components/navbar-routes";

export const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-slate-200 dark:bg-modern-gray shadow-sm">
            <MobileSidebar/>
            <NavbarRoutes/>
        </div>
    )
}
