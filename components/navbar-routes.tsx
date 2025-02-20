"use client";

import {useAuth, UserButton} from "@clerk/nextjs";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import Link from "next/link";
import {SearchInput} from "@/components/search-input";
import {isTeacher} from "@/lib/teacher";

export const NavbarRoutes = () => {
    // Adiciona proteção para criação de cursos
    const {userId} = useAuth();
    const pathname = usePathname();
    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {isSearchPage && (
                <div className={"hidden md:block"}>
                    <SearchInput/>
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Link href={"/"}>
                        <Button size={"sm"} variant={"secondary"} className={"logout_button hover:bg-red-800 mr-6"}>
                            <LogOut className="h-4 w-4 mr-2"/>
                            Sair
                        </Button>
                    </Link>
                ) : isTeacher(userId) ? (
                    <Link href={"/teacher/courses"}>
                        <Button size={"sm"} variant={"secondary"} className={"teacher_button hover:bg-sky-700 mr-6"}>
                            Modo Professor
                        </Button>
                    </Link>
                ) : null}
                <UserButton/>
            </div>
        </>
    )
}
