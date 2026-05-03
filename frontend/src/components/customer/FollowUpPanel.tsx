import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { CustomerDetail } from "@/types/customer";

interface Props {
  data: CustomerDetail;
  onSubmit: (content: string, nextFollowUpAt: string | null) => void;
}

export default function FollowUpPanel({ data, onSubmit }: Props) {
  const [content, setContent] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState<Dayjs | null>(null);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="subtitle1">Next Follow-up</Typography>

        <Typography color={data.isOverdue ? "error" : "text.primary"}>
          {data.nextFollowUpAt ? dayjs(data.nextFollowUpAt).format("YYYY-MM-DD HH:mm") : "Not scheduled"}
        </Typography>

        {data.isOverdue && (
          <Typography color="error">⚠ Overdue</Typography>
        )}

        {/* ⭐ 新增：时间选择 */}
        <Box sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Next Follow-up Time"
              value={nextFollowUpAt}
              onChange={(v) => setNextFollowUpAt(v)}
            />
          </LocalizationProvider>
        </Box>

        {/* 快捷按钮（很实用） */}
        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <Button size="small" onClick={() => setNextFollowUpAt(dayjs())}>
            Today
          </Button>
          <Button size="small" onClick={() => setNextFollowUpAt(dayjs().add(1, "day"))}>
            Tomorrow
          </Button>
          <Button size="small" onClick={() => setNextFollowUpAt(dayjs().add(3, "day"))}>
            +3 Days
          </Button>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write follow-up note..."
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            onSubmit(
              content,
              nextFollowUpAt ? nextFollowUpAt.toISOString() : null
            );
            setContent("");
            setNextFollowUpAt(null);
          }}
        >
          Add Note
        </Button>
      </CardContent>
    </Card>
  );
}