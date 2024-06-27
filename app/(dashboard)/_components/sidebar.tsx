import {Logo} from "@/app/(dashboard)/_components/logo";
import {SidebarRoutes} from "@/app/(dashboard)/_components/sidebarRoutes";

export const Sidebar = () => {
  return (
    <div className="h-full flex flex-col border-r border-black overflow-y-auto bg-slate-200 dark:bg-modern-gray dark:text-white">
      <div className="flex flex-col items-center justify-center p-6">
          <Logo/>
      </div>
        <div className="flex flex-col w-full">
            <SidebarRoutes/>
        </div>
    </div>
  )
}
