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
import { useTranslation } from "react-i18next";
import { CustomerDetail } from "@/types/customer";

interface Props {
  data: CustomerDetail;
  onSubmit: (content: string, nextFollowUpAt: string | null) => void;
}

export default function FollowUpPanel({ data, onSubmit }: Props) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState<Dayjs | null>(null);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="subtitle1">{t("followup.nextFollowupTime")}</Typography>

        <Typography color={data.isOverdue ? "error" : "text.primary"}>
          {data.nextFollowUpAt ? dayjs(data.nextFollowUpAt).format("YYYY-MM-DD HH:mm") : t("followup.notScheduled")}
        </Typography>

        {data.isOverdue && (
          <Typography color="error">{t("followup.overdue")}</Typography>
        )}

        {/* ⭐ 新增：时间选择 */}
        <Box sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label={t("followup.nextFollowupTime")}
              value={nextFollowUpAt}
              onChange={(v) => setNextFollowUpAt(v)}
            />
          </LocalizationProvider>
        </Box>

        {/* 快捷按钮（很实用） */}
        <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
          <Button size="small" onClick={() => setNextFollowUpAt(dayjs())}>
            {t("status.today")}
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
          placeholder={t("followup.addNote")}
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
          {t("followup.addNote")}
        </Button>
      </CardContent>
    </Card>
  );
}