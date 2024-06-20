"use client";

import {SidebarItem} from "@/app/(dashboard)/_components/sidebarItem";
import {BarChart, Compass, Layout, List} from "lucide-react";
import {usePathname} from "next/navigation";

const GUEST_ROUTES = [
    {
        icon: Layout,
        label: "Painel de Controle",
        href: "/",
    },
    {
        icon: Compass,
        label: "Pesquisar",
        href: "/search",
    }
]

const TEACHER_ROUTES = [
    {
        icon: List,
        label: "Cursos",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Análise",
        href: "/teacher/analytics",
    }
]

export const SidebarRoutes = () => {
    const PATHNAME = usePathname();
    const IS_TEACHER_PAGE = PATHNAME?.includes("/teacher");
    const ROUTES = IS_TEACHER_PAGE ? TEACHER_ROUTES : GUEST_ROUTES;

    return (
        <div
            className="flex flex-col w-full text-white">
            {ROUTES.map((route) => (
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
