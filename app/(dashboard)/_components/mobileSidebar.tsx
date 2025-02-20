import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Sidebar} from "@/app/(dashboard)/_components/sidebar";
import {Menu} from "lucide-react";

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu className="text-white"/>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}
