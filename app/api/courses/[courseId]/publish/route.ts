import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function PATCH(req: Request,
                            {params}: { params: { courseId: string } }) {
    try {
        const {userId} = auth();

        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        const course = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });

        if (!course) return new NextResponse("Not Found", {status: 404});

        const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

        // TODO: Add !course.categoryId
        if (!course.title || !course.description || !course.imageUrl || !hasPublishedChapters) {
            return new NextResponse("Missing required fields", {status: 401});
        }

        const publishedCourse = await prisma.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: true
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
