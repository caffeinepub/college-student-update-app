import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subject {
    practicalDate?: string;
    examDate: string;
    assignmentDetails: string;
}
export interface UserProfile {
    name: string;
}
export enum Role {
    admin = "admin",
    invalid = "invalid",
    student = "student"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllSubjectData(): Promise<Array<[string, Subject]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNotifications(): Promise<Array<string>>;
    getRegisteredStudents(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    login(username: string, password: string): Promise<Role>;
    register(username: string, password: string, fullName: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateChemistry(examDate: string, practicalDate: string, assignmentDetails: string): Promise<void>;
    updateMath(examDate: string, assignmentDetails: string): Promise<void>;
    updateNotifications(notifications: Array<string>): Promise<void>;
    updatePhysics(examDate: string, practicalDate: string, assignmentDetails: string): Promise<void>;
}
