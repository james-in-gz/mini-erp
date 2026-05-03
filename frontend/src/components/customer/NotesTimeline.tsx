import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
  TimelineConnector,
} from "@mui/lab";
import { Typography, Paper } from "@mui/material";
import { CustomerNote } from "@/types/customer";
import dayjs from "dayjs";

interface Props {
  notes: CustomerNote[];
}

export default function NotesTimeline({ notes }: Props) {
  return (
    <Timeline
  sx={{
    [`& .MuiTimelineItem-root:before`]: {
      flex: 0,
      padding: 0,
    },
  }}
>
  {notes.map((note) => (
    <TimelineItem key={note.id} sx={{ minHeight: "auto" }}>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent sx={{ py: 1 }}>
        <Paper sx={{ p: 1.5, borderRadius: 2 }}>
          <Typography>{note.content}</Typography>
          <Typography variant="caption" color="text.secondary">
            {dayjs(note.createdAt).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  ))}
</Timeline>
  );
}
