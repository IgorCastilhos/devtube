"use client";

import {UserButton} from "@clerk/nextjs";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import Link from "next/link";

export const NavbarRoutes = () => {
    const PATHNAME = usePathname();
    const IS_TEACHER_PAGE = PATHNAME?.startsWith("/teacher");
    const IS_VIDEO_PLAYER_PAGE = PATHNAME?.includes("/chapter");

    return (
        <div className="flex gap-x-2 ml-auto">
            {IS_TEACHER_PAGE || IS_VIDEO_PLAYER_PAGE ? (
                <Link href={"/"}>
                    <Button size={"sm"} variant={"secondary"} className={"logout_button hover:bg-red-800 mr-6"}>
                        <LogOut className="h-4 w-4 mr-2"/>
                        Sair
                    </Button>
                </Link>
            ) : (
                <Link href={"/teacher/courses"}>
                    <Button size={"sm"} variant={"secondary"} className={"teacher_button hover:bg-sky-700 mr-6"}>
                        Modo Professor
                    </Button>
                </Link>
            )}
            <UserButton/>
        </div>
    )
}
