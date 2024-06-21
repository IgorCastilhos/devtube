import prisma from "@/lib/db";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {IconBadge} from "@/components/icon-badge";
import {LayoutDashboard} from "lucide-react";

const CourseIdPage = async ({params}: { params: { courseId: string } }) => {
    const {userId} = auth();
    if (!userId) return redirect("/");

    const course = await prisma.course.findUnique({where: {id: params.courseId}});
    if (!course) return redirect("/");

    const requiredFiels = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ];
    // Gets the number of all the required fields
    const totalFields = requiredFiels.length;
    // Gets the number of all the completed fields (which don't equal to false)
    const completedFields = requiredFiels.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    return (
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard}/>
                        <h2 className="text-xl">
                            Customize o seu curso
                        </h2>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default CourseIdPage;
