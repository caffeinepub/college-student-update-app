import {
  type DocumentData,
  type QueryDocumentSnapshot,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { firebaseConfig } from "../lib/firebase";

export interface FirebaseSubject {
  id: string;
  subject_name: string;
  exam_date: string;
  assignment_pdf: string;
}

function docToSubject(
  doc: QueryDocumentSnapshot<DocumentData>,
): FirebaseSubject {
  const d = doc.data();
  return {
    id: doc.id,
    // support both underscore and camelCase field names
    subject_name:
      d.subject_name ?? d.subjectName ?? d.name ?? "Unknown Subject",
    exam_date: d.exam_date ?? d.examDate ?? "",
    assignment_pdf: d.assignment_pdf ?? d.assignmentPdf ?? d.pdfUrl ?? "",
  };
}

export function useFirebaseSubjects() {
  const [subjects, setSubjects] = useState<FirebaseSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't subscribe if Firebase hasn't been configured yet
    if (
      !firebaseConfig.projectId ||
      firebaseConfig.projectId === "YOUR_PROJECT_ID"
    ) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "subjects"),
      (snapshot) => {
        setSubjects(snapshot.docs.map(docToSubject));
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { subjects, loading, error };
}
