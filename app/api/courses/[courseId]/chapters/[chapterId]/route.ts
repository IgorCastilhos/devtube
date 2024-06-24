import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function PATCH(
    req: Request,
    {params}: { params: { courseId: string; chapterId: string } }
) {
    try {
        const {userId} = auth();
        const {isPublished, ...values} = await req.json();

        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        const ownCourse = await prisma.course.findUnique({
            where: {
                id: params.courseId, userId
            }
        });

        if (!ownCourse) return new NextResponse("Unauthorized", {status: 401});

        const chapter = await prisma.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {...values}
        });

        // TODO: Manipular o upload de videos

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
