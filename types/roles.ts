export type Role =
    | "admin"
    | "participant"
    | "service_provider"
    | "fitness_partner"
    | "support_worker"
    | "coordinator";

export const ROLE_ROUTES: Record<Role, string> = {
    admin: "/dashboard/admin",
    participant: "/dashboard/participant",
    service_provider: "/dashboard/service-provider",
    fitness_partner: "/dashboard/fitness-partner",
    support_worker: "/dashboard/support-worker",
    coordinator: "/dashboard/coordinator",
};
