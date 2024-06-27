"use client";

import {LucideIcon} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const SidebarItem = ({icon: Icon, label, href,}: SidebarItemProps) => {
    const PATHNAME = usePathname();
    const ROUTER = useRouter();
    const IS_ACTIVE =
        (PATHNAME === "/" && href === "/") ||
        PATHNAME === href ||
        PATHNAME?.startsWith(`${href}/`);

    const ON_CLICK = () => {
        ROUTER.push(href);
    }

    return (
        <button
            onClick={ON_CLICK}
            type={"button"}
            className={cn(
                "flex items-center gap-x-2 text-black text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                IS_ACTIVE && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700",
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-slate-500",
                        IS_ACTIVE && "text-sky-700"
                    )}
                />
                {label}
            </div>
            <div
                className={cn(
                    "ml-auto opacity-0 border-[3px] border-sky-700 h-full transition-all",
                    IS_ACTIVE && "opacity-100"
                )}
            />
        </button>
    )
}
