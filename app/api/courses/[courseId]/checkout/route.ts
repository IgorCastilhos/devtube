import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import {NextResponse} from "next/server";
import {currentUser} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(
    req: Request,
    {params}: { params: { courseId: string; } }
) {
    try {
        const user = await currentUser();

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            }
        });

        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if (purchase) {
            return new NextResponse("Esse curso já foi comprado", {status: 400});
        }

        if (!course) {
            return new NextResponse("Curso não encontrado", {status: 404});
        }


        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100),
                },
            }
        ];

        let stripeCustomer = await prisma.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            });

            stripeCustomer = await prisma.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        });

        return NextResponse.json({url: session.url});

    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT_ROUTE_ERROR]", error)
        return new NextResponse("Internal Server Error", {status: 500});
    }
}
