import { Card, CardContent, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { CustomerDetail } from "@/types/customer";

interface Props {
  data: CustomerDetail;
  onSubmit: (content: string) => void;
}

export default function FollowUpPanel({ data, onSubmit }: Props) {
  const [content, setContent] = useState("");

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="subtitle1">Next Follow-up</Typography>

        <Typography color={data.is_overdue ? "error" : "text.primary"}>
          {data.next_follow_up_at || "Not scheduled"}
        </Typography>

        {data.is_overdue && (
          <Typography color="error">⚠ Overdue</Typography>
        )}

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
            onSubmit(content);
            setContent("");
          }}
        >
          Add Note
        </Button>
      </CardContent>
    </Card>
  );
}
