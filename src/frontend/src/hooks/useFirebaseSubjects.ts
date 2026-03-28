import { useEffect, useState } from "react";
import { firebaseConfig } from "../lib/firebase";

export interface FirebaseSubject {
  id: string;
  subjectName: string;
  examDate: string;
  assignmentPdf: string;
}

// Fetches subjects from Firestore REST API (no Firebase SDK required).
// Falls back to an empty array if the project ID is still a placeholder.
export function useFirebaseSubjects() {
  const [subjects, setSubjects] = useState<FirebaseSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const projectId = firebaseConfig.projectId;
    if (!projectId || projectId === "YOUR_PROJECT_ID") {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchSubjects = async () => {
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/subjects?key=${firebaseConfig.apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Firestore error: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        const docs: FirebaseSubject[] = (json.documents ?? []).map(
          (doc: Record<string, unknown>) => {
            const fields = (doc.fields ?? {}) as Record<
              string,
              { stringValue?: string }
            >;
            const idParts = (doc.name as string).split("/");
            return {
              id: idParts[idParts.length - 1],
              subjectName:
                fields.subjectName?.stringValue ??
                fields.name?.stringValue ??
                "Unknown",
              examDate: fields.examDate?.stringValue ?? "",
              assignmentPdf:
                fields.assignmentPdf?.stringValue ??
                fields.pdfUrl?.stringValue ??
                "",
            };
          },
        );
        setSubjects(docs);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSubjects();
    // Poll every 30 s for near-real-time updates (REST API has no streaming)
    const interval = setInterval(fetchSubjects, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { subjects, loading, error };
}
