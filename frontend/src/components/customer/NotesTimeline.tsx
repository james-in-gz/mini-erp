import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { Typography, Paper } from "@mui/material";
import { CustomerNote } from "@/types/customer";

interface Props {
  notes: CustomerNote[];
}

export default function NotesTimeline({ notes }: Props) {
  return (
    <Timeline>
      {notes.map((note) => (
        <TimelineItem key={note.id}>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>

          <TimelineContent>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography>{note.content}</Typography>
              <Typography variant="caption" color="text.secondary">
                {note.created_at}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
