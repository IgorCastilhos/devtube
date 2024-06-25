import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {IconBadge} from "@/components/icon-badge";
import {CircleDollarSign, File, LayoutDashboard, ListChecks} from "lucide-react";
import {TitleForm} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/title-form";
import {DescriptionForm} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/description-form";
import {ImageForm} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/image-form";
import {PriceForm} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/price-form";
import {AttachmentForm} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/attachment-form";
import {ChaptersForm} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chapters-form";
import {Banner} from "@/components/banner";
import {Actions} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/actions";

const CourseIdPage = async ({params}: { params: { courseId: string } }) => {
    const {userId} = auth();
    if (!userId) return redirect("/");

    const course = await prisma.course.findUnique({
        where: {id: params.courseId, userId},
        include: {chapters: {orderBy: {position: "asc"}}, attachments: {orderBy: {createdAt: "desc"}}}
    });
    if (!course) return redirect("/");

    // const categories = await prisma.category.findMany({
    //     orderBy: {name: "asc"},
    // })

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.chapters.some(chapter => chapter.isPublished)
    ];
    // Gets the number of all the required fields
    const totalFields = requiredFields.length;
    // Gets the number of all the completed fields (which don't equal to false)
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isCompleted = requiredFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner
                    label={"Esse curso ainda não está publicado. Ele não será visível para os alunos."}
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Setup do Curso
                        </h1>
                        <span className="text-sm text-slate-700">
                        Complete todas as informações {completionText}
                    </span>
                    </div>
                    <Actions disabled={!isCompleted} courseId={params.courseId} isPublished={course.isPublished}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard}/>
                            <h2 className="text-xl">
                                Customize o seu curso
                            </h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id}/>
                        <DescriptionForm initialData={course} courseId={course.id}/>
                        <ImageForm initialData={course} courseId={course.id}/>
                        {/*<CategoryForm*/}
                        {/*    initialData={course}*/}
                        {/*    courseId={course.id}*/}
                        {/*    options={categories.map((category) => ({*/}
                        {/*        label: category.name,*/}
                        {/*        value: category.id,*/}
                        {/*    }))}*/}
                        {/*/>*/}
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks}/>
                                <h2 className="text-xl">
                                    Informações do Curso
                                </h2>
                            </div>
                            <ChaptersForm initialData={course} courseId={course.id}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign}/>
                                <h2 className="text-xl">
                                    Venda seu curso
                                </h2>
                            </div>
                            <PriceForm initialData={course} courseId={course.id}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File}/>
                                <h2 className="text-xl">
                                    Recursos & Anexos
                                </h2>
                            </div>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseIdPage;
