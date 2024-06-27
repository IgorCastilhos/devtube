import {Chapter, Course, UserProgress} from "@prisma/client";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/db";
import {CourseSidebarItem} from "@/app/(course)/courses/[courseId]/_components/course-sidebar-item";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const CourseSidebar = async ({course, progressCount}: CourseSidebarProps) => {

    const {userId} = auth();

    if (!userId) return redirect("/");

    const purchase = await prisma.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id,
            },
        },
    })

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-black">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {/* Check purchase and add progress*/}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={Boolean(chapter.userProgress?.[0]?.isCompleted)}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    )
}
