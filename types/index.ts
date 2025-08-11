export interface User {
    uid: string;
    email: string;
    displayName?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    id: string;
    programId: string;
    name: string;
    date: Date;
    instructorId: string;
    facilityId: string;
    participants: string[]; // participant uids
    objectives: string[];
    completed: boolean;
    createdAt: Date;
}

export interface Participant {
    uid: string;
    email: string;
    displayName: string;
    assignedPrograms: string[]; // program ids
    supportWorkerId?: string;
    serviceProviderId?: string;
    goals: string[];
    progress: {
        strength: number;
        coordination: number;
        confidence: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Facility {
    id: string;
    name: string;
    address: string;
    partnerId: string; // fitness partner uid
    amenities: string[];
    capacity: number;
    available: boolean;
    createdAt: Date;
}

export interface Instructor {
    uid: string;
    email: string;
    displayName: string;
    specialties: string[];
    facilityIds: string[];
    assignedPrograms: string[];
    certifications: string[];
    createdAt: Date;
}

export interface ProgressRecord {
    id: string;
    participantId: string;
    sessionId: string;
    instructorId: string;
    date: Date;
    metrics: {
        attendance: boolean;
        effort: number; // 1-10
        improvement: number; // 1-10
        notes: string;
    };
    goals: {
        strength: number;
        coordination: number;
        confidence: number;
    };
    createdAt: Date;
}

export type UserRole =
    | "ADMIN"
    | "PARTICIPANT"
    | "SUPPORT_WORKER"
    | "FITNESS_PARTNER"
    | "SERVICE_PROVIDER"
    | "COS";

export type UserStatus = "active" | "inactive" | "pending";
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: any;
    updatedAt: any;
    status: UserStatus;
    metadata?: {
        lastLogin?: any;
        preferences?: Record<string, any>;
        settings?: Record<string, any>;
    };
}

export interface Program {
    id: string;
    title: string;
    description?: string;
    videoKey?: string; // optional intro
}

export interface ProgramAssignment {
    id: string;
    participantUid: string;
    programId: string;
    startDate: string; // ISO
    endDate: string;   // ISO
    assignedBy: string; // admin uid
}