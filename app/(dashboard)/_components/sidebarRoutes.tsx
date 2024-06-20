"use client";

import {SidebarItem} from "@/app/(dashboard)/_components/sidebarItem";
import {Compass, Layout} from "lucide-react";

const GUESTROUTES = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    }
]

export const SidebarRoutes = () => {
    return (
        <div
            className="flex flex-col w-full text-white">
            {GUESTROUTES.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}
