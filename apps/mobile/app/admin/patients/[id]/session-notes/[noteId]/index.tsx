import { useLocalSearchParams } from "expo-router";

import { InternalSessionNoteDetail } from "@/components/internal/session-note-detail";

export default function AdminSessionNoteDetailRoute() {
  const { id, noteId } = useLocalSearchParams<{ id?: string | string[]; noteId?: string | string[] }>();
  const patientId = Array.isArray(id) ? id[0] : id;
  const resolvedNoteId = Array.isArray(noteId) ? noteId[0] : noteId;

  return (
    <InternalSessionNoteDetail
      noteId={resolvedNoteId}
      backHref={`/admin/patients/${patientId}`}
    />
  );
}
