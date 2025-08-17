"use client";
import { useAuth } from "@/contexts/AuthContext";

export function useRole() {
    const { userProfile, loading } = useAuth();
    return { role: userProfile?.role ?? null, loading };
}
