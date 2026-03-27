import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Subject } from "../backend";
import { useActor } from "./useActor";

export function useSubjectData() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, Subject]>>({
    queryKey: ["subjectData"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubjectData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCompletedAssignments() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["completedAssignments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCompletedAssignments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkAssignmentComplete() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subjectName: string) => {
      if (!actor) throw new Error("No actor");
      return actor.markAssignmentComplete(subjectName);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["completedAssignments"] }),
  });
}

export function useNotes(subject: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["notes", subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useAddNote(subject: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addNote(subject, note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes", subject] }),
  });
}

export function useUpdatePhysics() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      examDate: string;
      practicalDate: string;
      assignmentDetails: string;
      teacherName: string;
      teacherEmail: string;
      progress: bigint;
      attendancePresent: bigint;
      attendanceTotal: bigint;
      marks: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePhysics(
        data.examDate,
        data.practicalDate,
        data.assignmentDetails,
        data.teacherName,
        data.teacherEmail,
        data.progress,
        data.attendancePresent,
        data.attendanceTotal,
        data.marks,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjectData"] }),
  });
}

export function useUpdateChemistry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      examDate: string;
      practicalDate: string;
      assignmentDetails: string;
      teacherName: string;
      teacherEmail: string;
      progress: bigint;
      attendancePresent: bigint;
      attendanceTotal: bigint;
      marks: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateChemistry(
        data.examDate,
        data.practicalDate,
        data.assignmentDetails,
        data.teacherName,
        data.teacherEmail,
        data.progress,
        data.attendancePresent,
        data.attendanceTotal,
        data.marks,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjectData"] }),
  });
}

export function useUpdateMath() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      examDate: string;
      assignmentDetails: string;
      teacherName: string;
      teacherEmail: string;
      progress: bigint;
      attendancePresent: bigint;
      attendanceTotal: bigint;
      marks: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateMath(
        data.examDate,
        data.assignmentDetails,
        data.teacherName,
        data.teacherEmail,
        data.progress,
        data.attendancePresent,
        data.attendanceTotal,
        data.marks,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjectData"] }),
  });
}

export function useUpdateNotifications() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notifications: string[]) => {
      if (!actor) throw new Error("No actor");
      return actor.updateNotifications(notifications);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
