import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {isTeacher} from "@/lib/teacher";

export async function POST(
    req: Request,
) {
    try {
        const {userId} = auth();
        const {title} = await req.json();

        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const course = await prisma.course.create({
            data: {
                userId,
                title,
                description: "",
            }
        })
        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}
