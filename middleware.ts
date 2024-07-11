import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/api/webhook", "/api/uploadthing", "https://devtube.live", "https://devtube.live/sign-in", "https://devtube.live/sign-up"]);

export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        auth().protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
