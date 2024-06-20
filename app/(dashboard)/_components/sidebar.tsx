import {Logo} from "@/app/(dashboard)/_components/logo";
import {SidebarRoutes} from "@/app/(dashboard)/_components/sidebarRoutes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-modern-gray">
      <div className="flex flex-col items-center justify-center p-6">
          <Logo/>
      </div>
        <div className="flex flex-col w-full">
            <SidebarRoutes/>
        </div>
    </div>
  )
}
