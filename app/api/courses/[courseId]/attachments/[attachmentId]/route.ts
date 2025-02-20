import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {isTeacher} from "@/lib/teacher";

export async function DELETE(
    req: Request,
    {params}: { params: { courseId: string; attachmentId: string } }
) {
    try {
        const {userId} = auth();

        if (!userId || !isTeacher(userId)) return new NextResponse("Unauthorized", {status: 401});

        const courseOwner = await prisma.course.findFirst({
            where: {
                id: params.courseId,
                userId: userId,
            }
        })
        if (!courseOwner) return new NextResponse("Unauthorized", {status: 401});

        const attachment = await prisma.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId,
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
