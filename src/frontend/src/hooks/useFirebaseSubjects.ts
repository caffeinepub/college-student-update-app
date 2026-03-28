import { useState } from "react";

export interface FirebaseSubject {
  id: string;
  subject_name: string;
  exam_date: string;
  assignment_pdf: string;
}

// Firebase integration is disabled until the 'firebase' package is installed
// and the config in src/lib/firebase.ts is filled in with real credentials.
export function useFirebaseSubjects() {
  const [subjects] = useState<FirebaseSubject[]>([]);
  const loading = false;
  const error: string | null = null;
  return { subjects, loading, error };
}
