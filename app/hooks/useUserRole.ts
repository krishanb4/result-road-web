// hooks/useUserRole.ts
"use client";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/contexts/AuthContext"; // or "@/types/roles" if you exported there

export function useUserAndRole() {
    const { user, userProfile, loading } = useAuth();
    const role = (userProfile?.role ?? null) as UserRole | null;
    return { user, role, loading } as const;
}
