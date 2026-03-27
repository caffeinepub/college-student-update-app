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
    marks: string;
    practicalDate?: string;
    teacherEmail: string;
    attendanceTotal: bigint;
    teacherName: string;
    attendancePresent: bigint;
    progress: bigint;
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
    addAdminNote(subjectName: string, note: string, targetUser: Principal): Promise<void>;
    addNote(subjectName: string, note: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllNotes(subjectName: string, targetUser: Principal): Promise<Array<string>>;
    getAllSubjectData(): Promise<Array<[string, Subject]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedAssignments(): Promise<Array<string>>;
    getNotes(subjectName: string): Promise<Array<string>>;
    getNotifications(): Promise<Array<string>>;
    getRegisteredStudents(): Promise<Array<string>>;
    getScholarNumber(username: string): Promise<string | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    login(username: string, password: string): Promise<Role>;
    loginByScholarNumber(scholarNumber: string, password: string): Promise<Role>;
    markAssignmentComplete(subjectName: string): Promise<void>;
    register(username: string, password: string, fullName: string, scholarNumber: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resetAllCourseData(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateChemistry(examDate: string, practicalDate: string, assignmentDetails: string, teacherName: string, teacherEmail: string, progress: bigint, attendancePresent: bigint, attendanceTotal: bigint, marks: string): Promise<void>;
    updateMath(examDate: string, assignmentDetails: string, teacherName: string, teacherEmail: string, progress: bigint, attendancePresent: bigint, attendanceTotal: bigint, marks: string): Promise<void>;
    updateNotifications(notifications: Array<string>): Promise<void>;
    updatePhysics(examDate: string, practicalDate: string, assignmentDetails: string, teacherName: string, teacherEmail: string, progress: bigint, attendancePresent: bigint, attendanceTotal: bigint, marks: string): Promise<void>;
    updateSubjectExtended(subjectName: string, teacherName: string, teacherEmail: string, progress: bigint, attendanceTotal: bigint, marks: string): Promise<void>;
}
