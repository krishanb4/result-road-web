// =============================================
// 1) app/middleware.ts (role redirect + admin gate)
// =============================================
import { NextResponse } from "next/server";

export function middleware(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;

    // We rely on a cookie set by AuthContext after login storing {role}
    // e.g., document.cookie = `role=${role}; path=/;` (add this in AuthContext after userProfile set)
    const role = req.headers.get("cookie")?.match(/(?:^|; )role=([^;]+)/)?.[1];

    if (path.startsWith("/dashboard")) {
        if (!role) {
            url.pathname = "/signin";
            return NextResponse.redirect(url);
        }

        // admin hard-gate
        if (path.startsWith("/dashboard/admin") && role !== "admin") {
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }

        // smart redirect when landing on /dashboard directly
        if (path === "/dashboard") {
            const landing: Record<string, string> = {
                participant: "/dashboard/participant",
                support_worker: "/dashboard/support-worker",
                fitness_partner: "/dashboard/fitness-partner",
                service_provider: "/dashboard/service-provider",
                instructor: "/dashboard/instructor",
                admin: "/dashboard/admin",
            };
            url.pathname = landing[role] ?? "/dashboard/participant";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };