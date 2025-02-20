import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', "/api(.*)", "/teacher/courses", "/api/uploadthing(.*)", "/api/webhook", "/api/uploadthing"]);

export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        auth().protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
