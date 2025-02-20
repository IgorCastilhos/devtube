import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import prisma from "@/lib/db";
import Link from "next/link";
import {ArrowLeft, Eye, LayoutDashboard, Video} from "lucide-react";
import {IconBadge} from "@/components/icon-badge";
import {
    ChapterTitleForm
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-title-form";
import {
    ChapterDescriptionForm
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";
import {
    ChapterAccessForm
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-access-form";
import {
    ChapterVideoForm
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-video-form";
import {Banner} from "@/components/banner";
import {
    ChapterActions
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-actions";

const ChapterIdPage = async ({
                                 params
                             }: {
    params: { courseId: string; chapterId: string };
}) => {
    const {userId} = auth();
    if (!userId) return redirect("/");

    const chapter = await prisma.chapter.findUnique({
        where: {id: params.chapterId, courseId: params.courseId},
        include: {muxData: true}
    });

    if (!chapter) return redirect("/");

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant={"warning"}
                    label={"Este capítulo ainda não foi publicado e não está disponível para os alunos."}
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            Voltar para a configuração do curso
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Criação do Capítulo</h1>
                            </div>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 ">
                            Complete todos os campos {completionText}
                        </span>
                    </div>
                    <ChapterActions
                        disabled={!isComplete}
                        courseId={params.courseId}
                        chapterId={params.chapterId}
                        isPublished={chapter.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-ceenter gap-x-2">
                                <IconBadge icon={LayoutDashboard}/>
                                <h2 className="text-xl font-medium">Personalize o capítulo</h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Eye}/>
                            <h2 className="text-xl font-medium">Acessar configurações</h2>
                        </div>
                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video}/>
                            <h2 className="text-xl font-medium">Adicionar video</h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChapterIdPage;
