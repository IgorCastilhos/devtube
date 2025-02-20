import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function PUT(
    req: Request,
    {params}: { params: { courseId: string; chapterId: string } },
) {
    try {
        const {userId} = auth();
        const {isCompleted} = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const userProgress = await prisma.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                },
            },
            update: {
                isCompleted,
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted,
            },
        });

        return NextResponse.json(userProgress);

    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS] Error: ", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
