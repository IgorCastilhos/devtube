// import {Category, Course} from "@prisma/client";
// import prisma from "@/lib/db";
//
// type CourseWithProgressWithCategory = Course & {
//     category: Category | null;
//     chapters: { id: string }[];
//     progress: number;
// }
//
//
// type GetCourses = {
//     userId: string;
//     title?: string;
//     categoryId?: string;
// }
//
// export const getCourses = async ({
//                                      userId,
//                                      title,
//                                      categoryId
//                                  }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
//     try {
//         const courses = await prisma.course.findMany({
//             where: {
//                 isPublished: true,
//                 title: {
//                     contains: title,
//                 },
//                 categoryId
//             },
//             include: {
//                 category: true,
//                 chapters: {
//                     where: {
//                         isPublished: true,
//                     },
//                     select: {
//                         id: true
//                     }
//                 },
//                 purchases: {
//                     where: {
//                         userId
//                     }
//                 }
//             },
//             orderBy: {
//                 createdAt: "desc"
//             }
//         })
//
//     } catch (error) {
//         console.log("[GET_COURSES]", error);
//         return [];
//     }
// }
