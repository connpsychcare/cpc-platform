"use client";

import { FileText, UserRound } from "lucide-react";
import type {
  SessionNoteQueryType,
  SessionNoteResponse,
} from "@workspace/contracts/session-note";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { useSessionNotes } from "@/hooks/session-note";

const columns: ColumnConfig<SessionNoteResponse, SessionNoteQueryType>[] = [
  {
    header: "Session Date",
    accessor: (note) => formatDate(note.sessionDate, { mode: "date" }),
    sortKey: "sessionDate",
  },
  {
    header: "Patient",
    accessor: (note) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">{note.patient?.user.displayName}</p>
        <p className="truncate text-sm text-muted-foreground">
          {note.patient?.user.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Therapist",
    accessor: (note) => (
      <div className="min-w-0 max-w-[14rem] space-y-1">
        <p className="truncate">{note.therapist?.displayName ?? "Unknown therapist"}</p>
        <Badge variant="outline">{note.therapist?.role ?? "n/a"}</Badge>
      </div>
    ),
    className: "w-[15rem]",
    wrapperCn: "max-w-[15rem]",
  },
  {
    header: "Summary",
    accessor: (note) => (
      <p className="truncate text-sm text-muted-foreground">
        {note.summary ?? "No session summary provided."}
      </p>
    ),
    className: "w-[24rem]",
    wrapperCn: "max-w-[24rem]",
  },
];

const getMoreActions = (note: SessionNoteResponse) => [
  {
    label: "Open patient",
    href: `/patients/${note.patientId}`,
    icon: <UserRound className="size-4" />,
  },
  {
    label: "Open note",
    href: `/patients/${note.patientId}/session-notes/${note.id}`,
    icon: <FileText className="size-4" />,
  },
];

const SessionNotesClinicalPage = () => {
  return (
    <ListPage
      dataKey="sessionNotes"
      entityType="Session Notes"
      columns={columns}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultSortBy="sessionDate"
      defaultSearchBy="summary"
      searchByOptions={[{ label: "Summary", value: "summary" }]}
      useListHook={useSessionNotes}
    />
  );
};

export default SessionNotesClinicalPage;
