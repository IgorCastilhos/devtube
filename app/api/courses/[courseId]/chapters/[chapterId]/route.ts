import Mux from "@mux/mux-node";
import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

const {video} = new Mux({
    tokenId: process.env['MUX_TOKEN_ID'],
    tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

export async function DELETE(req: Request,
                             {params}: { params: { courseId: string; chapterId: string } }) {
    try {
        const {userId} = auth();
        if (!userId) return new NextResponse("Unauthorized", {status: 401});

        const ownCourse = await prisma.course.findUnique({
            where: {
                id: params.courseId, userId
            }
        });

        if (!ownCourse) return new NextResponse("Unauthorized", {status: 401});

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        if (!chapter) return new NextResponse("Not Found", {status: 404});

        if (chapter.videoUrl) {
            const existingMuxData = await prisma.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
        }

        const deletedChapter = await prisma.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        // There need to be at least one chapter in a course
        // If there isn't, the course should be all unpublished
        const publishedChapterInCourse = await prisma.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (publishedChapterInCourse.length === 0) {
            await prisma.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.log("[CHAPTER_ID_DELETE", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

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

        if (values.videoUrl) {
            const existingMuxData = await prisma.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }

            const asset = await video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"],
                test: false,
            });

            await prisma.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
